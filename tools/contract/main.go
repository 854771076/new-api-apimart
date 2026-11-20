// SPDX-License-Identifier: AGPL-3.0-only
// Run inside a new-api checkout to verify the real host runtime.
package main

import (
	"context"
	"flag"
	"fmt"
	"net/http/httptest"
	"os"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/pkg/jsplugin"
	"github.com/QuantumNous/new-api/plugins"
	taskplugin "github.com/QuantumNous/new-api/relay/channel/task/jsplugin"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/gin-gonic/gin"
)

func main() {
	sourcePath := flag.String("plugin", "plugin.js", "Plugin source")
	fixturePath := flag.String("fixture", "test/contract-fixture.json", "Portable fixture")
	flag.Parse()
	if err := verify(*sourcePath, *fixturePath); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func verify(sourcePath, fixturePath string) error {
	gin.SetMode(gin.TestMode)
	source, err := os.ReadFile(sourcePath)
	if err != nil {
		return err
	}
	registry := jsplugin.NewRegistry()
	for _, builtin := range jsplugin.DefaultRegistry.Generation().Plugins() {
		code, err := plugins.Source(builtin.Meta.Key)
		if err != nil {
			return err
		}
		if _, err := registry.RegisterFactory(code, jsplugin.Options{}); err != nil {
			return err
		}
	}
	loaded, err := registry.Register(string(source), jsplugin.Options{})
	if err != nil {
		return fmt.Errorf("compile APIMart with built-ins: %w", err)
	}
	if loaded.Meta.Key != "apimart" || len(loaded.Meta.ChannelTypes) != 0 {
		return fmt.Errorf("APIMart must use a dedicated task-plugin channel")
	}
	for _, model := range loaded.Meta.Models {
		matched := false
		for _, binding := range registry.Generation().LookupEndpointCandidates("POST", "/v1/responses", model) {
			matched = matched || binding.Plugin.Meta.Key == "apimart"
		}
		if !matched {
			return fmt.Errorf("missing Responses binding for %s", model)
		}
	}
	for _, claim := range loaded.Meta.Protocols {
		var paths []string
		switch claim.Name {
		case "openai_image":
			paths = []string{"/v1/images/generations", "/v1/images/edits"}
		case "openai_video":
			paths = []string{"/v1/videos"}
		default:
			continue
		}
		for _, model := range claim.Models {
			for _, path := range paths {
				matched := false
				for _, binding := range registry.Generation().LookupEndpointCandidates("POST", path, model) {
					matched = matched || binding.Plugin.Meta.Key == "apimart"
				}
				if !matched {
					return fmt.Errorf("missing APIMart binding for %s on %s", model, path)
				}
			}
		}
	}
	for _, path := range []string{"/apimart/v1/images/generations", "/apimart/v1/videos/generations", "/apimart/v1/music/generations", "/apimart/v1/midjourney/generations"} {
		route, found := registry.Generation().LookupDeclaredRoute("POST", path)
		if !found || route.Plugin.Meta.Key != "apimart" {
			return fmt.Errorf("missing native route %s", path)
		}
	}
	for _, imageModel := range []string{"gpt-image-2", "gpt-image-2-ext", "gpt-image-2-official", "gpt-image-2.5-flare", "gpt-image-2.5-sunburst", "gpt-image-2.5-ext"} {
		for _, path := range []string{"/v1/images/generations", "/v1/images/edits", "/v1/responses"} {
			matched := false
			for _, candidate := range registry.Generation().LookupEndpointCandidates("POST", path, imageModel) {
				matched = matched || candidate.Plugin.Meta.Key == "apimart"
			}
			if !matched {
				return fmt.Errorf("missing APIMart image binding for %s on %s", imageModel, path)
			}
		}
		schema, _ := loaded.Meta.UsageForModel(imageModel)
		if _, found := schema["image_count"]; !found {
			return fmt.Errorf("missing image usage profile for %s", imageModel)
		}
		if _, found := schema["seconds"]; found {
			return fmt.Errorf("video usage leaked into image profile %s", imageModel)
		}
	}
	// The plugin claims explicit 1K/2K presets, never the automatic route or 4K presets.
	for _, imageModel := range []string{"gpt-image", "gpt-image-2-4k-high"} {
		if declared, found := registry.Generation().CanonicalModel(imageModel); found {
			if plugin, ok := registry.Generation().GetByModel(declared); ok && plugin.Meta.Key == "apimart" {
				return fmt.Errorf("APIMart must not own image identity %s", imageModel)
			}
		}
		for _, path := range []string{"/v1/images/generations", "/v1/images/edits", "/v1/responses"} {
			for _, candidate := range registry.Generation().LookupEndpointCandidates("POST", path, imageModel) {
				if candidate.Plugin.Meta.Key == "apimart" {
					return fmt.Errorf("APIMart intercepted image model %s on %s", imageModel, path)
				}
			}
		}
	}
	route, found := registry.Generation().LookupDeclaredRoute("POST", "/kling/v1/videos/text2video")
	if !found || route.Plugin.Meta.Key != "kling" {
		return fmt.Errorf("built-in Kling ownership changed")
	}
	fixture, err := os.ReadFile(fixturePath)
	if err != nil {
		return err
	}
	report, err := jsplugin.ReplayFixture(context.Background(), string(source), fixture)
	if err != nil {
		return fmt.Errorf("fixture %d/%d: %w", report.Passed, report.Total, err)
	}
	// Exercise the adaptor's validation and billing boundary, not just JS hooks.
	var decoded struct {
		Cases []struct {
			Name     string `json:"name"`
			Expected any    `json:"expected"`
		} `json:"cases"`
	}
	if err := common.Unmarshal(fixture, &decoded); err != nil {
		return err
	}
	validated := 0
	for _, entry := range decoded.Cases {
		expected, ok := entry.Expected.(map[string]any)
		if !ok {
			continue
		}
		if expected["kind"] != "submit" || expected["originTaskIds"] != nil {
			continue // Ownership is validated by the host's origin-task tests.
		}
		model, _ := expected["model"].(string)
		action, _ := expected["action"].(string)
		info := &relaycommon.RelayInfo{
			OriginModelName: model,
			ChannelMeta: &relaycommon.ChannelMeta{ChannelType: constant.ChannelTypeTaskPlugin,
				ChannelBaseUrl: "https://api.apimart.ai", ApiKey: "fixture-only", UpstreamModelName: model},
			TaskRelayInfo: &relaycommon.TaskRelayInfo{PublicTaskID: "task_fixture", Action: action},
		}
		c, _ := gin.CreateTestContext(httptest.NewRecorder())
		c.Request = httptest.NewRequest("POST", "/v1/responses", nil)
		c.Set("task_request", expected["requestBody"])
		adaptor := taskplugin.New(loaded)
		adaptor.Init(info)
		if taskErr := adaptor.ValidateRequestAndSetAction(c, info); taskErr != nil {
			return fmt.Errorf("host validation %s: %v", entry.Name, taskErr.Error)
		}
		if _, err := adaptor.ExtractUsageFactsValidated(c, info); err != nil {
			return fmt.Errorf("host billing %s: %w", entry.Name, err)
		}
		validated++
	}
	fmt.Printf("new-api runtime: %s@%s, %d models, %d/%d fixture cases and %d adaptor cases passed\n", loaded.Meta.Key, loaded.Meta.Version, len(loaded.Meta.Models), report.Passed, report.Total, validated)
	return nil
}
