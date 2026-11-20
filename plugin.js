// SPDX-License-Identifier: AGPL-3.0-only
// Standalone new-api Task Plugin API v1 module; no build step or dependencies.
// Protocol presentation follows the QuantumNous/new-api task-plugin contract.
// Vendor contracts: https://docs.apimart.ai/cn (checked 2026-11-21).

const IMAGE_MODELS = {
  "gpt-image-2": { kind: "image", count: 1, references: 15, inline: true },
  "gpt-image-2-ext": { kind: "image", count: 1, references: 15, inline: true },
  "gpt-image-2-official": { kind: "image", count: 4, references: 16, tokens: true },
  "gpt-image-2.5-flare": { kind: "image", count: 4, references: 16, tokens: true, extendedQuality: true },
  "gpt-image-2.5-sunburst": { kind: "image", count: 4, references: 16, tokens: true, extendedQuality: true },
  "gpt-image-2.5-ext": { kind: "image", count: 4, references: 16, inline: true, ext: true },
  "gpt-image-2.6-flare": { kind: "image", count: 4, references: 16, inline: true, tokens: true, extendedQuality: true, modern: true },
  "gpt-image-2.6-sunburst": { kind: "image", count: 4, references: 16, inline: true, tokens: true, extendedQuality: true, modern: true },
  "gpt-image-2.6-ext": { kind: "image", count: 1, references: 16, inline: true, ext: true, modern: true },
};
// Public presets retain the requested identity and fix its billing parameters.
// Only 1K/2K official models are published; raw vendor models remain compatible.
const IMAGE_PRESETS = {
  "gpt-image-2-1k-low": { upstream: "gpt-image-2-official", resolution: "1k", quality: "low" },
  "gpt-image-2-1k-medium": { upstream: "gpt-image-2-official", resolution: "1k", quality: "medium" },
  "gpt-image-2-1k-high": { upstream: "gpt-image-2-official", resolution: "1k", quality: "high" },
  "gpt-image-2-1k-auto": { upstream: "gpt-image-2-official", resolution: "1k", quality: "auto" },
  "gpt-image-2-2k-low": { upstream: "gpt-image-2-official", resolution: "2k", quality: "low" },
  "gpt-image-2-2k-medium": { upstream: "gpt-image-2-official", resolution: "2k", quality: "medium" },
  "gpt-image-2-2k-high": { upstream: "gpt-image-2-official", resolution: "2k", quality: "high" },
  "gpt-image-2-2k-auto": { upstream: "gpt-image-2-official", resolution: "2k", quality: "auto" },
  "gpt-image-2.5-flare-1k-low": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "low" },
  "gpt-image-2.5-flare-1k-medium": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "medium" },
  "gpt-image-2.5-flare-1k-high": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "high" },
  "gpt-image-2.5-flare-1k-xhigh": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "xhigh" },
  "gpt-image-2.5-flare-1k-max": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "max" },
  "gpt-image-2.5-flare-1k-auto": { upstream: "gpt-image-2.5-flare", resolution: "1k", quality: "auto" },
  "gpt-image-2.5-flare-2k-low": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "low" },
  "gpt-image-2.5-flare-2k-medium": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "medium" },
  "gpt-image-2.5-flare-2k-high": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "high" },
  "gpt-image-2.5-flare-2k-xhigh": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "xhigh" },
  "gpt-image-2.5-flare-2k-max": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "max" },
  "gpt-image-2.5-flare-2k-auto": { upstream: "gpt-image-2.5-flare", resolution: "2k", quality: "auto" },
  "gpt-image-2.5-sunburst-1k-low": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "low" },
  "gpt-image-2.5-sunburst-1k-medium": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "medium" },
  "gpt-image-2.5-sunburst-1k-high": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "high" },
  "gpt-image-2.5-sunburst-1k-xhigh": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "xhigh" },
  "gpt-image-2.5-sunburst-1k-max": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "max" },
  "gpt-image-2.5-sunburst-1k-auto": { upstream: "gpt-image-2.5-sunburst", resolution: "1k", quality: "auto" },
  "gpt-image-2.5-sunburst-2k-low": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "low" },
  "gpt-image-2.5-sunburst-2k-medium": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "medium" },
  "gpt-image-2.5-sunburst-2k-high": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "high" },
  "gpt-image-2.5-sunburst-2k-xhigh": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "xhigh" },
  "gpt-image-2.5-sunburst-2k-max": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "max" },
  "gpt-image-2.5-sunburst-2k-auto": { upstream: "gpt-image-2.5-sunburst", resolution: "2k", quality: "auto" },
};
const VIDEO_MODELS = {
  "seedance-2.0": { kind: "video", seedance: true, maxSeconds: 15, references: 9, mediaReferences: 3, fourK: true },
  "seedance-2.0-fast": { kind: "video", seedance: true, maxSeconds: 15, references: 9, mediaReferences: 3 },
  "seedance-2.0-mini": { kind: "video", seedance: true, maxSeconds: 15, references: 9, mediaReferences: 3 },
  "seedance-2.5": { kind: "video", seedance: true, maxSeconds: 30, references: 30, mediaReferences: 10, fourK: true },
  "seedance-2-5-flash": { kind: "video", seedance: true, maxSeconds: 30, references: 10, mediaReferences: 5 },
  "doubao-seedance-2-5-flash": { kind: "video", seedance: true, maxSeconds: 30, references: 10, mediaReferences: 5 },
  "kling-v2-6": { kind: "video", maxSeconds: 10, durations: [5, 10], references: 2, audio: true },
  "kling-v3": { kind: "video", maxSeconds: 15, references: 2, audio: true, fourK: true, shots: true },
  "kling-3.0-turbo": { kind: "video", maxSeconds: 15, references: 1, inline: true, turbo: true },
  "kling-v3-omni": { kind: "video", maxSeconds: 15, references: 7, audio: true, fourK: true, shots: true, omni: true },
  "kling-video-o1": { kind: "video", maxSeconds: 10, durations: [5, 10], references: 7, omni: true },
};
// Public catalogue and conservative reservation rates from /api/pricing/models/all, 2026-11-21.
// Rates are reservation estimates only; new models settle the upstream account charge.
const CATALOG_MODELS = {
  "midjourney": {"kind": "image", "catalog": true},
  "gemini-2.5-flash-image-preview": {"kind": "image", "catalog": true},
  "gemini-3.1-flash-image-preview": {"kind": "image", "catalog": true},
  "gemini-nano-banana-2.1": {"kind": "image", "catalog": true},
  "gemini-3-pro-image-preview": {"kind": "image", "catalog": true},
  "gemini-3.1-flash-lite-image": {"kind": "image", "catalog": true},
  "flux-2-flex": {"kind": "image", "catalog": true},
  "flux-2-max": {"kind": "image", "catalog": true},
  "flux-2-pro": {"kind": "image", "catalog": true},
  "flux-3-image": {"kind": "image", "catalog": true},
  "flux-3-image-klein": {"kind": "image", "catalog": true},
  "flux-kontext-max": {"kind": "image", "catalog": true},
  "flux-kontext-pro": {"kind": "image", "catalog": true},
  "gemini-2.5-flash-image-preview-official": {"kind": "image", "catalog": true},
  "gemini-3-pro-image-preview-official": {"kind": "image", "catalog": true},
  "gemini-3.1-flash-image-preview-official": {"kind": "image", "catalog": true},
  "gemini-3.1-flash-lite-image-ext": {"kind": "image", "catalog": true},
  "gemini-nano-banana-2.1-ext": {"kind": "image", "catalog": true},
  "gpt-image-1": {"kind": "image", "catalog": true},
  "gpt-image-1-official": {"kind": "image", "catalog": true},
  "gpt-image-1.5": {"kind": "image", "catalog": true},
  "gpt-image-1.5-official": {"kind": "image", "catalog": true},
  "grok-imagine-1.5-apimart": {"kind": "image", "catalog": true},
  "grok-imagine-1.5-edit-apimart": {"kind": "image", "catalog": true},
  "grok-imagine-2.0-ext": {"kind": "image", "catalog": true},
  "grok-imagine-image": {"kind": "image", "catalog": true},
  "grok-imagine-image-2.0": {"kind": "image", "catalog": true},
  "grok-imagine-image-quality": {"kind": "image", "catalog": true},
  "hy-image-v3.5-preview": {"kind": "image", "catalog": true},
  "imagen-4.0-apimart": {"kind": "image", "catalog": true},
  "kling-v4-image": {"kind": "image", "catalog": true},
  "kling-v4-long-image": {"kind": "image", "catalog": true},
  "mai-image-2.6": {"kind": "image", "catalog": true},
  "mai-image-2.6-flash": {"kind": "image", "catalog": true},
  "mai-image-2.7": {"kind": "image", "catalog": true},
  "mai-image-2.7-flash": {"kind": "image", "catalog": true},
  "minimax-h3-image": {"kind": "image", "catalog": true},
  "minimax-h3-image-highspeed": {"kind": "image", "catalog": true},
  "muse-image-ext": {"kind": "image", "catalog": true},
  "qwen-image-2.0": {"kind": "image", "catalog": true},
  "qwen-image-2.0-pro": {"kind": "image", "catalog": true},
  "qwen-image-3.0": {"kind": "image", "catalog": true},
  "qwen-image-3.0-pro": {"kind": "image", "catalog": true},
  "seedream-4-0": {"kind": "image", "catalog": true},
  "seedream-4-5": {"kind": "image", "catalog": true},
  "seedream-5-0-flash": {"kind": "image", "catalog": true},
  "seedream-5-0-lite": {"kind": "image", "catalog": true},
  "seedream-5-0-pro": {"kind": "image", "catalog": true},
  "seedream-5-5": {"kind": "image", "catalog": true},
  "wan2.7-image": {"kind": "image", "catalog": true},
  "wan2.7-image-pro": {"kind": "image", "catalog": true},
  "z-image-turbo": {"kind": "image", "catalog": true},
  "MiniMax-H3": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "MiniMax-H3-Context-IR": {"kind": "text", "catalog": true},
  "MiniMax-H3-Max": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "MiniMax-H3-Regeneration": {"kind": "video", "catalog": true},
  "MiniMax-Hailuo-02": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 10},
  "MiniMax-Hailuo-2.3": {"kind": "video", "catalog": true, "defaultSeconds": 6, "maxSeconds": 10},
  "MiniMax-Hailuo-2.3-Fast": {"kind": "video", "catalog": true, "defaultSeconds": 6, "maxSeconds": 10},
  "veo3.1-fast": {"kind": "video", "catalog": true},
  "veo3.1-quality": {"kind": "video", "catalog": true},
  "apimart-zoe": {"kind": "video", "catalog": true},
  "flux-3-video": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 20},
  "gemini-omni-1.1-flash": {"kind": "video", "catalog": true},
  "Omni-Flash-Ext": {"kind": "video", "catalog": true},
  "gemini-omni-1.2-flash": {"kind": "video", "catalog": true},
  "gemini-omni-1.2-flash-ext": {"kind": "video", "catalog": true},
  "gemini-omni-flash-preview": {"kind": "video", "catalog": true},
  "grok-imagine-1.5-video-apimart": {"kind": "video", "catalog": true},
  "grok-imagine-video": {"kind": "video", "catalog": true},
  "grok-imagine-video-1.5": {"kind": "video", "catalog": true},
  "happyhorse-1.0": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "happyhorse-1.1": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "kling-v2-6-motion-control": {"kind": "video", "catalog": true},
  "kling-v3-motion-control": {"kind": "video", "catalog": true},
  "kling-v4": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 30},
  "kling-v4-flash": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 20},
  "muse-video-ext": {"kind": "video", "catalog": true, "defaultSeconds": 10, "maxSeconds": 10},
  "pixverse-v6": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "pixverse-v6-max": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "seedance-1-0-pro-fast": {"kind": "video", "catalog": true},
  "seedance-1-0-pro-quality": {"kind": "video", "catalog": true},
  "seedance-2.0-face": {"kind": "video", "catalog": true},
  "seedance-2.0-fast-face": {"kind": "video", "catalog": true},
  "skyreels-v4-fast": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "skyreels-v4-std": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "veo3.1-fast-official": {"kind": "video", "catalog": true, "defaultSeconds": 8, "maxSeconds": 8},
  "veo3.1-lite": {"kind": "video", "catalog": true},
  "veo3.1-quality-official": {"kind": "video", "catalog": true, "defaultSeconds": 8, "maxSeconds": 8},
  "viduq3": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 16},
  "viduq3-mix": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 16},
  "viduq3-pro": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 16},
  "viduq3-turbo": {"kind": "video", "catalog": true},
  "viduq4-preview": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 16},
  "wan2.5-preview": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 10},
  "wan2.6": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "wan2.6-i2v": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "wan2.6-i2v-flash": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "wan2.7": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "wan2.7-r2v": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 15},
  "wan2.7-videoedit": {"kind": "video", "catalog": true},
  "wan3.0-video": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 30},
  "wan3.0-video-prime": {"kind": "video", "catalog": true, "defaultSeconds": 5, "maxSeconds": 30},
  "flowmusic": {"kind": "audio", "catalog": true},
  "suno": {"kind": "audio", "catalog": true},
  "seedream-4.0": {"kind": "image", "catalog": true, "upstream": "seedream-4-0"},
  "seedream-4.5": {"kind": "image", "catalog": true, "upstream": "seedream-4-5"},
  "seedream-5.0-lite": {"kind": "image", "catalog": true, "upstream": "seedream-5-0-lite"},
  "seedream-5.0-pro": {"kind": "image", "catalog": true, "upstream": "seedream-5-0-pro"},
  "nano-banana": {"kind": "image", "catalog": true, "upstream": "gemini-2.5-flash-image-preview-official"},
  "nano-banana-ext": {"kind": "image", "catalog": true, "upstream": "gemini-2.5-flash-image-preview"},
  "nano-banana-pro": {"kind": "image", "catalog": true, "upstream": "gemini-3-pro-image-preview-official"},
  "nano-banana-pro-ext": {"kind": "image", "catalog": true, "upstream": "gemini-3-pro-image-preview"},
  "nano-banana-2": {"kind": "image", "catalog": true, "upstream": "gemini-3.1-flash-image-preview-official"},
  "nano-banana-2-ext": {"kind": "image", "catalog": true, "upstream": "gemini-3.1-flash-image-preview"},
  "veo3.1-fast-ext": {"kind": "video", "catalog": true, "upstream": "veo3.1-fast"},
  "veo3.1-quality-ext": {"kind": "video", "catalog": true, "upstream": "veo3.1-quality"},
  "veo3.1-lite-ext": {"kind": "video", "catalog": true, "upstream": "veo3.1-lite"},
  "gemini-omni-1.1-flash-ext": {"kind": "video", "catalog": true, "upstream": "Omni-Flash-Ext"},
  "grok-imagine-1.5-video-ext": {"kind": "video", "catalog": true, "upstream": "grok-imagine-1.5-video-apimart"},
  "grok-imagine-1.5-ext": {"kind": "image", "catalog": true, "upstream": "grok-imagine-1.5-apimart"},
};
const RESERVATION_RATES = {
  "midjourney": {"unit": "usd_per_call", "price": 0.5, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-2.5-flash-image-preview": {"unit": "usd_per_image", "price": 0.039, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-3.1-flash-image-preview": {"unit": "usd_per_image", "price": 0.151, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-nano-banana-2.1": {"unit": "usd_per_million_tokens", "price": 0.0336, "inputPrice": 1.5, "outputPrice": 30, "maxInput": 128000, "maxOutput": 16000, "material": 0},
  "gemini-3-pro-image-preview": {"unit": "usd_per_image", "price": 0.24, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-3.1-flash-lite-image": {"unit": "usd_per_million_tokens", "price": 0.04, "inputPrice": 0.25, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "flux-2-flex": {"unit": "usd_per_image", "price": 0.2, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-2-max": {"unit": "usd_per_image", "price": 0.16, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-2-pro": {"unit": "usd_per_image", "price": 0.075, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-3-image": {"unit": "usd_per_image", "price": 0.607, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-3-image-klein": {"unit": "usd_per_image", "price": 0.036, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-kontext-max": {"unit": "usd_per_image", "price": 0.08, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-kontext-pro": {"unit": "usd_per_image", "price": 0.04, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-2.5-flash-image-preview-official": {"unit": "usd_per_million_tokens", "price": 0.039, "inputPrice": 0.3, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gemini-3-pro-image-preview-official": {"unit": "usd_per_million_tokens", "price": 0.134, "inputPrice": 2, "outputPrice": 120, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gemini-3.1-flash-image-preview-official": {"unit": "usd_per_million_tokens", "price": 0.067, "inputPrice": 0.5, "outputPrice": 60, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gemini-3.1-flash-lite-image-ext": {"unit": "usd_per_image", "price": 0.0336, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-nano-banana-2.1-ext": {"unit": "usd_per_image", "price": 0.1134, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gpt-image-1": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 10, "outputPrice": 40, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gpt-image-1-official": {"unit": "usd_per_million_tokens", "price": 0.1336, "inputPrice": 10, "outputPrice": 40, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gpt-image-1.5": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 8, "outputPrice": 32, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gpt-image-1.5-official": {"unit": "usd_per_million_tokens", "price": 0.1064, "inputPrice": 8, "outputPrice": 32, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "gpt-image-2": {"unit": "usd_per_image", "price": 0.71157, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gpt-image-2-official": {"unit": "usd_per_million_tokens", "price": 0.2109, "inputPrice": 8, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 1000000, "material": 0},
  "gpt-image-2.5-ext": {"unit": "usd_per_image", "price": 0.71157, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gpt-image-2.5-flare": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 8, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 1000000, "material": 0},
  "gpt-image-2.5-sunburst": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 8, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 1000000, "material": 0},
  "gpt-image-2.6-ext": {"unit": "usd_per_image", "price": 0.71157, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gpt-image-2.6-flare": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 8, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 1000000, "material": 0},
  "gpt-image-2.6-sunburst": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 8, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 1000000, "material": 0},
  "grok-imagine-1.5-apimart": {"unit": "usd_per_image", "price": 0.02, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-1.5-edit-apimart": {"unit": "usd_per_image", "price": 0.022, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-2.0-ext": {"unit": "usd_per_image", "price": 0.08, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-image": {"unit": "usd_per_image", "price": 0.02, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0.06},
  "grok-imagine-image-2.0": {"unit": "usd_per_image", "price": 0.08, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0.3},
  "grok-imagine-image-quality": {"unit": "usd_per_image", "price": 0.07, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0.3},
  "hy-image-v3.5-preview": {"unit": "usd_per_image", "price": 0.032, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "imagen-4.0-apimart": {"unit": "usd_per_image", "price": 0.05, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v4-image": {"unit": "usd_per_image", "price": 0.0857144, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v4-long-image": {"unit": "usd_per_image", "price": 0.7857144, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "mai-image-2.6": {"unit": "usd_per_million_tokens", "price": 0.04, "inputPrice": 8, "outputPrice": 38, "maxInput": 65536, "maxOutput": 2304, "material": 0},
  "mai-image-2.6-flash": {"unit": "usd_per_million_tokens", "price": 0.02, "inputPrice": 2.5, "outputPrice": 19, "maxInput": 65536, "maxOutput": 2304, "material": 0},
  "mai-image-2.7": {"unit": "usd_per_million_tokens", "price": 0.035, "inputPrice": 8, "outputPrice": 34, "maxInput": 32768, "maxOutput": 4096, "material": 0},
  "mai-image-2.7-flash": {"unit": "usd_per_million_tokens", "price": 0.011, "inputPrice": 2.5, "outputPrice": 10, "maxInput": 32768, "maxOutput": 4096, "material": 0},
  "minimax-h3-image": {"unit": "usd_per_million_tokens", "price": 0.1, "inputPrice": 2.678571, "outputPrice": 4.464286, "maxInput": 2000000, "maxOutput": 200000, "material": 0},
  "minimax-h3-image-highspeed": {"unit": "usd_per_million_tokens", "price": 0.19, "inputPrice": 3.571429, "outputPrice": 8.928571, "maxInput": 2000000, "maxOutput": 200000, "material": 0},
  "muse-image-ext": {"unit": "usd_per_image", "price": 0.01, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "qwen-image-2.0": {"unit": "usd_per_image", "price": 0.035, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "qwen-image-2.0-pro": {"unit": "usd_per_image", "price": 0.075, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "qwen-image-3.0": {"unit": "usd_per_image", "price": 0.025, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "qwen-image-3.0-pro": {"unit": "usd_per_image", "price": 0.07, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-4-0": {"unit": "usd_per_image", "price": 0.0278, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-4-5": {"unit": "usd_per_image", "price": 0.0347, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  // Flash's documented pixel/layer price exceeds the catalogue rate; reserve the higher rate.
  "seedream-5-0-flash": {"unit": "usd_per_image", "price": 0.09, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-5-0-lite": {"unit": "usd_per_image", "price": 0.0306, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-5-0-pro": {"unit": "usd_per_image", "price": 0.09, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-5-5": {"unit": "usd_per_image", "price": 0.035, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.7-image": {"unit": "usd_per_image", "price": 0.028, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.7-image-pro": {"unit": "usd_per_image", "price": 0.069, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "z-image-turbo": {"unit": "usd_per_image", "price": 0.0278, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "MiniMax-H3": {"unit": "usd_per_second", "price": 0.13, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 3.15},
  "MiniMax-H3-Context-IR": {"unit": "usd_per_million_tokens", "price": 0, "inputPrice": 0.8286, "outputPrice": 3.2858133, "maxInput": 1000000, "maxOutput": 100000, "material": 0},
  "MiniMax-H3-Max": {"unit": "usd_per_second", "price": 0.16, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 4.38},
  "MiniMax-H3-Regeneration": {"unit": "usd_per_second", "price": 0.05, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 1.392},
  "MiniMax-Hailuo-02": {"unit": "usd_per_second", "price": 0.1, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "MiniMax-Hailuo-2.3": {"unit": "usd_per_second", "price": 0.082, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "MiniMax-Hailuo-2.3-Fast": {"unit": "usd_per_second", "price": 0.055, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-fast": {"unit": "usd_per_call", "price": 2.4, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-quality": {"unit": "usd_per_call", "price": 4.8, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "apimart-zoe": {"unit": "usd_per_second", "price": 1.448, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flux-3-video": {"unit": "usd_per_second", "price": 0.53, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-omni-1.1-flash": {"unit": "usd_per_second", "price": 0.3, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "Omni-Flash-Ext": {"unit": "usd_per_call", "price": 1.125, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-omni-1.2-flash": {"unit": "usd_per_second", "price": 0.209, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-omni-1.2-flash-ext": {"unit": "usd_per_second", "price": 0.209, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-omni-flash-preview": {"unit": "usd_per_second", "price": 0.1, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-1.5-video-apimart": {"unit": "usd_per_second", "price": 0.25, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-video": {"unit": "usd_per_second", "price": 0.07, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0.36},
  "grok-imagine-video-1.5": {"unit": "usd_per_second", "price": 0.25, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0.3},
  "happyhorse-1.0": {"unit": "usd_per_second", "price": 0.2875, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "happyhorse-1.1": {"unit": "usd_per_second", "price": 0.215, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-3.0-turbo": {"unit": "usd_per_second", "price": 0.225, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v2-6": {"unit": "usd_per_second", "price": 0.168, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v2-6-motion-control": {"unit": "usd_per_second", "price": 0.112, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v3": {"unit": "usd_per_second", "price": 0.5357, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v3-motion-control": {"unit": "usd_per_second", "price": 0.168, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v3-omni": {"unit": "usd_per_second", "price": 0.5357, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v4": {"unit": "usd_per_second", "price": 0.235, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-v4-flash": {"unit": "usd_per_second", "price": 0.094, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "kling-video-o1": {"unit": "usd_per_second", "price": 0.168, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "muse-video-ext": {"unit": "usd_per_second", "price": 0.00294, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "pixverse-v6": {"unit": "usd_per_second", "price": 0.102, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "pixverse-v6-max": {"unit": "usd_per_second", "price": 0.124, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-1-0-pro-fast": {"unit": "usd_per_second", "price": 0.052, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-1-0-pro-quality": {"unit": "usd_per_second", "price": 0.13, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2-5-flash": {"unit": "usd_per_second", "price": 0.14192, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.0": {"unit": "usd_per_second", "price": 0.78, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.0-face": {"unit": "usd_per_second", "price": 0.625, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.0-fast": {"unit": "usd_per_second", "price": 0.1, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.0-fast-face": {"unit": "usd_per_second", "price": 0.215, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.0-mini": {"unit": "usd_per_second", "price": 0.0694, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedance-2.5": {"unit": "usd_per_second", "price": 1.0761, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "skyreels-v4-fast": {"unit": "usd_per_second", "price": 0.5, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "skyreels-v4-std": {"unit": "usd_per_second", "price": 0.625, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-fast-official": {"unit": "usd_per_second", "price": 0.3, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-lite": {"unit": "usd_per_call", "price": 0.7125, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-quality-official": {"unit": "usd_per_second", "price": 0.6, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "viduq3": {"unit": "usd_per_second", "price": 0.125, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "viduq3-mix": {"unit": "usd_per_second", "price": 0.145, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "viduq3-pro": {"unit": "usd_per_second", "price": 0.16, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "viduq3-turbo": {"unit": "usd_per_second", "price": 0.065, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "viduq4-preview": {"unit": "usd_per_second", "price": 0.446, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.5-preview": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.6": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.6-i2v": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.6-i2v-flash": {"unit": "usd_per_second", "price": 0.0694, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.7": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.7-r2v": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan2.7-videoedit": {"unit": "usd_per_second", "price": 0.1389, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan3.0-video": {"unit": "usd_per_second", "price": 0.1667, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "wan3.0-video-prime": {"unit": "usd_per_second", "price": 0.25, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "flowmusic": {"unit": "usd_per_call", "price": 0.08, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "suno": {"unit": "usd_per_call", "price": 1.2, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-4.0": {"unit": "usd_per_image", "price": 0.0278, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-4.5": {"unit": "usd_per_image", "price": 0.0347, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-5.0-lite": {"unit": "usd_per_image", "price": 0.0306, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "seedream-5.0-pro": {"unit": "usd_per_image", "price": 0.09, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "nano-banana": {"unit": "usd_per_million_tokens", "price": 0.039, "inputPrice": 0.3, "outputPrice": 30, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "nano-banana-ext": {"unit": "usd_per_image", "price": 0.039, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "nano-banana-pro": {"unit": "usd_per_million_tokens", "price": 0.134, "inputPrice": 2, "outputPrice": 120, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "nano-banana-pro-ext": {"unit": "usd_per_image", "price": 0.24, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "nano-banana-2": {"unit": "usd_per_million_tokens", "price": 0.067, "inputPrice": 0.5, "outputPrice": 60, "maxInput": 1000000, "maxOutput": 128000, "material": 0},
  "nano-banana-2-ext": {"unit": "usd_per_image", "price": 0.151, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-fast-ext": {"unit": "usd_per_call", "price": 2.4, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-quality-ext": {"unit": "usd_per_call", "price": 4.8, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "veo3.1-lite-ext": {"unit": "usd_per_call", "price": 0.7125, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "gemini-omni-1.1-flash-ext": {"unit": "usd_per_call", "price": 1.125, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-1.5-video-ext": {"unit": "usd_per_second", "price": 0.25, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "grok-imagine-1.5-ext": {"unit": "usd_per_image", "price": 0.02, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
  "doubao-seedance-2-5-flash": {"unit": "usd_per_second", "price": 0.14192, "inputPrice": 0, "outputPrice": 0, "maxInput": 0, "maxOutput": 0, "material": 0},
};
const MODELS = Object.assign({}, IMAGE_MODELS, VIDEO_MODELS, CATALOG_MODELS);
for (const model of Object.keys(MODELS)) if (MODELS[model].modern || MODELS[model].seedance || MODELS[model].catalog) MODELS[model].credits = true;
// Keep endpoint declarations statically readable by the upload preview.
const IMAGE_MODEL_NAMES = [
  "gpt-image-2",
  "gpt-image-2-ext",
  "gpt-image-2-official",
  "gpt-image-2.5-flare",
  "gpt-image-2.5-sunburst",
  "gpt-image-2.5-ext",
  "gpt-image-2.6-flare",
  "gpt-image-2.6-sunburst",
  "gpt-image-2.6-ext",
  "gpt-image-2-1k-low",
  "gpt-image-2-1k-medium",
  "gpt-image-2-1k-high",
  "gpt-image-2-1k-auto",
  "gpt-image-2-2k-low",
  "gpt-image-2-2k-medium",
  "gpt-image-2-2k-high",
  "gpt-image-2-2k-auto",
  "gpt-image-2.5-flare-1k-low",
  "gpt-image-2.5-flare-1k-medium",
  "gpt-image-2.5-flare-1k-high",
  "gpt-image-2.5-flare-1k-xhigh",
  "gpt-image-2.5-flare-1k-max",
  "gpt-image-2.5-flare-1k-auto",
  "gpt-image-2.5-flare-2k-low",
  "gpt-image-2.5-flare-2k-medium",
  "gpt-image-2.5-flare-2k-high",
  "gpt-image-2.5-flare-2k-xhigh",
  "gpt-image-2.5-flare-2k-max",
  "gpt-image-2.5-flare-2k-auto",
  "gpt-image-2.5-sunburst-1k-low",
  "gpt-image-2.5-sunburst-1k-medium",
  "gpt-image-2.5-sunburst-1k-high",
  "gpt-image-2.5-sunburst-1k-xhigh",
  "gpt-image-2.5-sunburst-1k-max",
  "gpt-image-2.5-sunburst-1k-auto",
  "gpt-image-2.5-sunburst-2k-low",
  "gpt-image-2.5-sunburst-2k-medium",
  "gpt-image-2.5-sunburst-2k-high",
  "gpt-image-2.5-sunburst-2k-xhigh",
  "gpt-image-2.5-sunburst-2k-max",
  "gpt-image-2.5-sunburst-2k-auto",
];
for (const model of Object.keys(CATALOG_MODELS)) if (CATALOG_MODELS[model].kind === "image") IMAGE_MODEL_NAMES.push(model);
const VIDEO_MODEL_NAMES = Object.keys(VIDEO_MODELS).concat(Object.keys(CATALOG_MODELS).filter(function (model) { return CATALOG_MODELS[model].kind === "video"; }));
const AUDIO_MODEL_NAMES = Object.keys(CATALOG_MODELS).filter(function (model) { return CATALOG_MODELS[model].kind === "audio"; });
const TEXT_TASK_MODEL_NAMES = ["MiniMax-H3-Context-IR"];
const RATIOS = ["1:1", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5", "16:9", "9:16", "2:1", "1:2", "21:9", "9:21", "3:1", "1:3"];
const EXT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "5:4", "4:5", "21:9"];
const STATUS = {
  submitted: "SUBMITTED",
  pending: "QUEUED",
  queued: "QUEUED",
  processing: "IN_PROGRESS",
  in_progress: "IN_PROGRESS",
  completed: "SUCCESS",
  failed: "FAILURE",
  cancelled: "FAILURE",
};
const IMAGE_COUNT = {
  type: "number",
  unit: "count",
  unitLabel: { en: "image", zh: "张" },
  description: { en: "Image generation unit price", zh: "图片生成单价" },
};
const RESOLUTION = { enum: ["1k", "2k", "4k"], description: { en: "Output image resolution", zh: "输出图片分辨率" } };
const QUALITY = { enum: ["auto", "low", "medium", "high"], description: { en: "Output image quality", zh: "输出图片画质" } };
const IMAGE_SCHEMA = { image_count: IMAGE_COUNT, resolution: RESOLUTION };
const TOKEN_FIELDS = {
  text_tokens: { type: "number", unit: "token", description: { en: "Text input unit price", zh: "文本输入单价" } },
  image_tokens: { type: "number", unit: "token", description: { en: "Image input unit price", zh: "图片输入单价" } },
  cached_text_tokens: { type: "number", unit: "token", description: { en: "Cached text input unit price", zh: "缓存文本输入单价" } },
  cached_image_tokens: { type: "number", unit: "token", description: { en: "Cached image input unit price", zh: "缓存图片输入单价" } },
  output_tokens: { type: "number", unit: "token", description: { en: "Image output unit price", zh: "图片输出单价" } },
};
const SECONDS = { type: "number", unit: "second", description: { en: "Video generation unit price", zh: "视频生成单价" } };
const VIDEO_SCHEMA = {
  seconds: SECONDS,
  mode: { enum: ["std", "pro"], description: { en: "Video generation mode", zh: "视频生成模式" } },
  audio: { type: "boolean", description: { en: "Whether audio is generated", zh: "是否生成音频" } },
};
const TOKEN_SCHEMA = Object.assign({}, IMAGE_SCHEMA, { quality: QUALITY }, TOKEN_FIELDS);
const EXTENDED_TOKEN_SCHEMA = Object.assign({}, TOKEN_SCHEMA, {
  quality: { enum: ["auto", "low", "medium", "high", "xhigh", "max"], description: QUALITY.description },
});
const CREDIT_SCHEMA = { credits: { type: "number", unit: "credit", description: { en: "Upstream generation unit price", zh: "上游生成单价" } } };
const TOKEN_EXAMPLE = {
  image_count: 1,
  resolution: "1k",
  quality: "medium",
  text_tokens: 16,
  image_tokens: 0,
  cached_text_tokens: 0,
  cached_image_tokens: 0,
  output_tokens: 439,
};

export const meta = {
  apiVersion: 1,
  // Older supported hosts require this flag before accepting automatic duration.
  requiredCapabilities: ["duration-auto@1"],
  key: "apimart",
  name: "APIMart",
  icon: "text:AM",
  version: "0.2.0",
  author: { name: "heyzeyu", url: "https://github.com/heyzeyu" },
  website: "https://github.com/heyzeyu/new-api-apimart",
  description: { en: "APIMart image, video and music tasks", zh: "APIMart 图片、视频与音乐任务" },
  baseUrl: "https://api.apimart.ai",
  auth: "api_key",
  models: IMAGE_MODEL_NAMES.concat(VIDEO_MODEL_NAMES, AUDIO_MODEL_NAMES, TEXT_TASK_MODEL_NAMES),
  fetchMode: "per_task",
  upstreams: ["vendor", "new_api"],
  // Keep the video-only release's default for historical task snapshots.
  // Images select an explicit profile, so image prices never affect videos.
  usageSchema: VIDEO_SCHEMA,
  usageProfiles: [
    { models: Object.keys(MODELS).filter(function (model) { return MODELS[model].credits; }), schema: CREDIT_SCHEMA },
    { models: ["gpt-image-2", "gpt-image-2-ext"], schema: IMAGE_SCHEMA },
    {
      models: [
        "gpt-image-2-official",
        "gpt-image-2-1k-low",
        "gpt-image-2-1k-medium",
        "gpt-image-2-1k-high",
        "gpt-image-2-1k-auto",
        "gpt-image-2-2k-low",
        "gpt-image-2-2k-medium",
        "gpt-image-2-2k-high",
        "gpt-image-2-2k-auto",
      ],
      schema: TOKEN_SCHEMA,
      examples: [{ label: "1K medium", facts: Object.assign({}, TOKEN_EXAMPLE, { output_tokens: 1056 }) }],
    },
    {
      models: [
        "gpt-image-2.5-flare",
        "gpt-image-2.5-sunburst",
        "gpt-image-2.5-flare-1k-low",
        "gpt-image-2.5-flare-1k-medium",
        "gpt-image-2.5-flare-1k-high",
        "gpt-image-2.5-flare-1k-xhigh",
        "gpt-image-2.5-flare-1k-max",
        "gpt-image-2.5-flare-1k-auto",
        "gpt-image-2.5-flare-2k-low",
        "gpt-image-2.5-flare-2k-medium",
        "gpt-image-2.5-flare-2k-high",
        "gpt-image-2.5-flare-2k-xhigh",
        "gpt-image-2.5-flare-2k-max",
        "gpt-image-2.5-flare-2k-auto",
        "gpt-image-2.5-sunburst-1k-low",
        "gpt-image-2.5-sunburst-1k-medium",
        "gpt-image-2.5-sunburst-1k-high",
        "gpt-image-2.5-sunburst-1k-xhigh",
        "gpt-image-2.5-sunburst-1k-max",
        "gpt-image-2.5-sunburst-1k-auto",
        "gpt-image-2.5-sunburst-2k-low",
        "gpt-image-2.5-sunburst-2k-medium",
        "gpt-image-2.5-sunburst-2k-high",
        "gpt-image-2.5-sunburst-2k-xhigh",
        "gpt-image-2.5-sunburst-2k-max",
        "gpt-image-2.5-sunburst-2k-auto",
      ],
      schema: EXTENDED_TOKEN_SCHEMA,
      examples: [{ label: "1K medium", facts: TOKEN_EXAMPLE }],
    },
    {
      models: ["gpt-image-2.5-ext"],
      schema: Object.assign({}, IMAGE_SCHEMA, { version: { enum: ["flare", "sunburst"], description: { en: "Image model version", zh: "图片模型版本" } } }),
    },
    { models: ["kling-v2-6", "kling-video-o1"], schema: VIDEO_SCHEMA },
    {
      models: ["kling-v3", "kling-v3-omni"],
      schema: Object.assign({}, VIDEO_SCHEMA, { mode: { enum: ["std", "pro", "4k"], description: VIDEO_SCHEMA.mode.description } }),
    },
    {
      models: ["kling-3.0-turbo"],
      schema: { seconds: SECONDS, resolution: { enum: ["720p", "1080p"], description: { en: "Output video resolution", zh: "输出视频分辨率" } } },
    },
  ],
  routes: [
    { method: "POST", path: "/apimart/v1/images/generations", type: "submit", models: IMAGE_MODEL_NAMES, decode: "decodeImage", render: "taskCreated" },
    { method: "POST", path: "/apimart/v1/videos/generations", type: "submit", models: VIDEO_MODEL_NAMES.concat(TEXT_TASK_MODEL_NAMES), decode: "decodeVideo", render: "taskCreated" },
    { method: "POST", path: "/apimart/v1/music/generations", type: "submit", models: AUDIO_MODEL_NAMES, decode: "decodeAudio", render: "taskCreated" },
    { method: "POST", path: "/apimart/v1/midjourney/generations", type: "submit", models: ["midjourney"], decode: "decodeMidjourney", render: "taskCreated" },
    { method: "GET", path: "/apimart/v1/music/tasks/:task_id", type: "query", render: "taskStatus" },
    { method: "GET", path: "/apimart/v1/tasks/:task_id", type: "query", render: "taskStatus" },
  ],
  protocols: [
    { name: "openai_image", models: IMAGE_MODEL_NAMES },
    { name: "openai_video", models: VIDEO_MODEL_NAMES },
    { name: "openai_responses", supports: ["stream", "sync", "background"] },
  ],
};

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}
function object(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(label + " must be an object");
  for (const key of ["__proto__", "constructor", "prototype"])
    if (Object.prototype.hasOwnProperty.call(value, key)) throw new Error("Unsafe request member");
  return value;
}
function specFor(model) {
  model = vendorModel(model);
  if (!Object.prototype.hasOwnProperty.call(MODELS, model)) throw new Error("Unsupported APIMart model");
  return MODELS[model];
}
function vendorModel(model) {
  const preset = IMAGE_PRESETS[model];
  return preset ? preset.upstream : CATALOG_MODELS[model] && CATALOG_MODELS[model].upstream || model;
}
function choice(value, fallback, options, label) {
  if (value === undefined) return fallback;
  if (typeof value !== "string" || !options.includes(value)) throw new Error(label + " must be one of " + options.join(", "));
  return value;
}
function integer(value, low, high, label) {
  if (!Number.isInteger(value) || value < low || value > high) throw new Error(label + " must be an integer between " + low + " and " + high);
  return value;
}
function media(value, inline, label) {
  if (typeof value === "string" && /^https?:\/\/[^\s@]+$/.test(value)) return value;
  if (inline && typeof value === "string" && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(value)) return value;
  // Only a decoder may produce a file placeholder from a host-issued file ref.
  if (inline && value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "__fileRef")) return value;
  throw new Error(label + (inline ? " must be an image URL or image Data URL" : " requires a public image URL; upload local images to APIMart first"));
}

const IMAGE_FIELDS = [
  "prompt",
  "n",
  "size",
  "resolution",
  "quality",
  "version",
  "image_urls",
  "mask_url",
  "output_format",
  "output_compression",
  "background",
  "moderation",
  "official_fallback",
  "nsfw_check",
  "complexity",
  "safety_identifier",
  "markup_url",
  "frame_count",
  "frame_duration_ms",
];
const VIDEO_FIELDS = [
  "prompt",
  "negative_prompt",
  "duration",
  "mode",
  "resolution",
  "aspect_ratio",
  "image_urls",
  "image_with_roles",
  "first_frame_image",
  "audio",
  "watermark",
  "multi_shot",
  "shot_type",
  "multi_prompt",
  "element_list",
  "video_list",
  "nsfw_check",
];
const ORIGIN_TASK_FIELDS = ["draft_task_id", "draft_from_task_id", "source_task_id", "extend_from_task_id"];
const COUNT_FIELDS = ["n", "sample_count", "max_images", "num_images", "batch_size", "num_outputs", "layers", "max_layers"];

function normalizedImage(model, source, requestedModel) {
  const spec = specFor(model),
    preset = IMAGE_PRESETS[requestedModel || model],
    req = {};
  if (spec.kind !== "image") throw new Error("An image model is required");
  if (spec.catalog) return normalizedCatalog(model, source);
  for (const key of IMAGE_FIELDS) if (source[key] !== undefined) req[key] = source[key];
  if (source.svg !== undefined || source.output_format === "svg") throw new Error("SVG writer generation is not supported by this plugin");
  if (source.markup !== undefined) {
    if (req.markup_url !== undefined) throw new Error("Use markup or markup_url once");
    req.markup_url = typeof source.markup === "string" ? source.markup : object(source.markup, "markup").image_url;
  }
  if (req.markup_url !== undefined && typeof req.markup_url !== "string") throw new Error("markup_url must be a string");
  if (spec.modern && spec.ext && source.aspect_ratio !== undefined) {
    if (req.size !== undefined && req.size !== source.aspect_ratio) throw new Error("size and aspect_ratio must agree");
    req.size = source.aspect_ratio;
  }
  if (req.nsfw_check !== undefined && typeof req.nsfw_check !== "boolean") throw new Error("nsfw_check must be a boolean");
  if (!spec.modern) {
    for (const key of ["complexity", "safety_identifier", "markup_url", "frame_count", "frame_duration_ms"])
      if (req[key] !== undefined) throw new Error(key + " requires GPT Image 2.6");
  }
  if (preset) {
    if (vendorModel(model) !== preset.upstream) throw new Error("The image preset does not match the mapped APIMart model");
    if (req.resolution !== undefined && String(req.resolution).toLowerCase() !== preset.resolution)
      throw new Error("resolution must match the image model preset");
    if (req.quality !== undefined && req.quality !== preset.quality) throw new Error("quality must match the image model preset");
    req.resolution = preset.resolution;
    req.quality = preset.quality;
  }
  req.prompt = text(req.prompt);
  if (!req.prompt || req.prompt.length > 32000) throw new Error("prompt must contain 1 to 32000 characters");
  req.n = integer(req.n === undefined ? 1 : req.n, 1, spec.count, "n");
  req.resolution = choice(typeof req.resolution === "string" ? req.resolution.toLowerCase() : req.resolution, "1k", ["1k", "2k", "4k"], "resolution");
  const gif = spec.modern && req.output_format === "gif";
  if (gif) {
    if (req.mask_url !== undefined || req.markup_url !== undefined || req.output_compression !== undefined) throw new Error("GIF does not support masks, markup or compression");
    if (spec.ext) {
      if (req.size !== undefined && req.size !== "auto") throw new Error("Ext GIF size must be auto");
      if ((req.image_urls || []).length) throw new Error("Ext GIF only supports text input");
      if (req.frame_count !== undefined || req.frame_duration_ms !== undefined) throw new Error("Ext GIF does not expose frame controls");
    } else {
      req.frame_count = integer(req.frame_count === undefined ? 9 : req.frame_count, 2, 16, "frame_count");
      if (req.frame_duration_ms !== undefined) {
        integer(req.frame_duration_ms, 20, 2147483640, "frame_duration_ms");
        if (req.frame_duration_ms % 10) throw new Error("frame_duration_ms must be a multiple of 10");
      }
      const dimensions = /^(\d{1,4})x(\d{1,4})$/.exec(req.size === undefined || req.size === "auto" ? "512x512" : req.size);
      if (!dimensions) throw new Error("GIF size must be auto or frame pixel dimensions");
      const width = Number(dimensions[1]), height = Number(dimensions[2]);
      const layout = req.frame_count <= 8 ? [4, 2] : req.frame_count === 9 ? [3, 3] : req.frame_count <= 12 ? [4, 3] : [4, 4];
      const fits = [[layout[0], layout[1]], [layout[1], layout[0]]].some(function (grid) {
        const w = width * grid[0], h = height * grid[1];
        return w <= 3840 && h <= 3840 && w * h <= 8294400 && Math.max(w, h) <= Math.min(w, h) * 3;
      });
      if (!width || !height || width % 16 || height % 16 || !fits) throw new Error("GIF frame sheet exceeds image dimensions");
    }
  } else if (req.frame_count !== undefined || req.frame_duration_ms !== undefined) throw new Error("Frame controls require GIF output");
  if (req.size !== undefined && !gif) {
    if (req.size !== "auto" && !(spec.ext ? EXT_RATIOS : RATIOS).includes(req.size)) {
      const match = typeof req.size === "string" && /^(\d{1,4})x(\d{1,4})$/.exec(req.size);
      if (!match || spec.ext) throw new Error("size must be a supported aspect ratio or WIDTHxHEIGHT");
      const width = Number(match[1]),
        height = Number(match[2]),
        pixels = width * height;
      if (
        !width ||
        !height ||
        Math.max(width, height) > 3840 ||
        Math.max(width, height) > Math.min(width, height) * 3 ||
        pixels < 655360 ||
        pixels > 8294400 ||
        (spec.tokens && (width % 16 || height % 16))
      )
        throw new Error("Image dimensions exceed the model limits");
      // Exact pixels take precedence over the resolution label at APIMart.
      req.resolution = pixels > 5242880 ? "4k" : pixels > 1572864 ? "2k" : "1k";
    }
  }
  if (preset && req.resolution !== preset.resolution) throw new Error("Image dimensions must match the model resolution preset");
  if (spec.tokens || spec.modern) {
    req.quality = choice(
      req.quality,
      "auto",
      spec.extendedQuality || spec.modern ? ["auto", "low", "medium", "high", "xhigh", "max"] : ["auto", "low", "medium", "high"],
      "quality"
    );
    req.output_format = choice(req.output_format, "png", spec.modern ? ["png", "jpeg", "webp", "gif"] : ["png", "jpeg", "webp"], "output_format");
    if (req.background !== undefined) {
      req.background = choice(req.background, undefined, ["auto", "opaque", "transparent"], "background");
      if (req.background === "transparent" && !["png", "webp"].includes(req.output_format)) throw new Error("Transparent backgrounds require PNG or WebP");
    }
    if (req.output_compression !== undefined) integer(req.output_compression, 0, 100, "output_compression");
    if (spec.modern && req.output_compression !== undefined && !["jpeg", "webp"].includes(req.output_format)) throw new Error("Compression requires JPEG or WebP");
    if (req.moderation !== undefined) choice(req.moderation, undefined, ["auto", "low"], "moderation");
  } else {
    for (const field of ["quality", "mask_url", "output_format", "output_compression", "background", "moderation"])
      if (req[field] !== undefined) throw new Error(field + " is not supported by this APIMart model");
  }
  if (req.complexity !== undefined) choice(req.complexity, undefined, ["low", "medium", "high"], "complexity");
  if (req.safety_identifier !== undefined && (typeof req.safety_identifier !== "string" || req.safety_identifier.length > 128)) throw new Error("safety_identifier must contain at most 128 characters");
  if (spec.ext) req.version = choice(req.version, "flare", ["flare", "sunburst"], "version");
  else if (req.version !== undefined) throw new Error("version is only supported by gpt-image-2.5-ext");
  if (req.official_fallback !== undefined && (typeof req.official_fallback !== "boolean" || (model !== "gpt-image-2" && model !== "gpt-image-2-ext")))
    throw new Error("official_fallback is only supported by gpt-image-2 and must be a boolean");
  if (req.official_fallback === true) throw new Error("official_fallback changes billing; select gpt-image-2-official explicitly");
  if (req.image_urls !== undefined) {
    if (!Array.isArray(req.image_urls) || req.image_urls.length > spec.references) throw new Error("Too many reference images");
    req.image_urls = req.image_urls.map(function (value) {
      return media(value, !!spec.inline, "image_urls");
    });
    // APIMart otherwise inherits unknown reference pixels and bypasses resolution pricing.
    if ((model === "gpt-image-2" || model === "gpt-image-2-ext") && req.image_urls.length && req.size === undefined) req.size = "auto";
  }
  if (req.mask_url !== undefined) {
    if (!(req.image_urls || []).length) throw new Error("mask_url requires a reference image");
    req.mask_url = media(req.mask_url, !!spec.extendedQuality, "mask_url");
  }
  if (req.markup_url !== undefined) {
    if (spec.ext || !(req.image_urls || []).length || req.mask_url !== undefined) throw new Error("Markup requires token-based GPT Image 2.6 reference input without a mask");
    req.markup_url = media(req.markup_url, true, "markup_url");
  }
  return req;
}

function normalizedSeedance(model, source) {
  const spec = specFor(model), req = {};
  const fields = ["prompt", "negative_prompt", "duration", "resolution", "size", "image_urls", "image_with_roles", "video_urls", "audio_urls", "generate_audio", "watermark", "seed", "return_last_frame", "tools", "nsfw_check", "output_format", "omni_reference_task_type", "draft"];
  for (const key of fields) if (source[key] !== undefined) req[key] = source[key];
  if (source.draft_task_id !== undefined) {
    if (model !== "seedance-2.5" || typeof source.draft_task_id !== "string" || !/^[A-Za-z0-9_-]{1,256}$/.test(source.draft_task_id)) throw new Error("A public Seedance 2.5 draft task ID is required");
    for (const key of Object.keys(source))
      if (!["model", "draft_task_id", "resolution", "output_format", "watermark", "return_last_frame", "nsfw_check"].includes(key)) throw new Error("Draft rendering cannot override inherited " + key);
    req.draft_task_id = source.draft_task_id;
    req.resolution = choice(source.resolution, "1080p", ["1080p", "4k"], "resolution");
    req.output_format = choice(source.output_format, "mp4", ["mp4", "mov"], "output_format");
    for (const key of ["watermark", "return_last_frame", "nsfw_check"])
      if (req[key] !== undefined && typeof req[key] !== "boolean") throw new Error(key + " must be a boolean");
    return req;
  }
  if (source.image_with_roles !== undefined && (source.first_frame_image !== undefined || source.last_frame_image !== undefined)) throw new Error("Use frame aliases or image_with_roles");
  for (const key of ["first_frame_image", "last_frame_image"]) {
    if (source[key] === undefined) continue;
    if (!req.image_with_roles) req.image_with_roles = [];
    req.image_with_roles.push({ url: media(source[key], false, key), role: key === "first_frame_image" ? "first_frame" : "last_frame" });
  }
  if (source.mode !== undefined) throw new Error("Seedance uses resolution instead of mode");
  if (source.aspect_ratio !== undefined) {
    if (req.size !== undefined && req.size !== source.aspect_ratio) throw new Error("size and aspect_ratio must agree");
    req.size = source.aspect_ratio;
  }
  if (source.audio !== undefined) {
    if (req.generate_audio !== undefined && req.generate_audio !== source.audio) throw new Error("audio and generate_audio must agree");
    req.generate_audio = source.audio;
  }
  for (const key of ["generate_audio", "watermark", "return_last_frame", "nsfw_check", "draft"])
    if (req[key] !== undefined && typeof req[key] !== "boolean") throw new Error(key + " must be a boolean");
  if (req.draft !== undefined && model !== "seedance-2.5") throw new Error("Only seedance-2.5 supports drafts");
  const modern = spec.maxSeconds === 30;
  if (!modern && (req.output_format !== undefined || req.omni_reference_task_type !== undefined)) throw new Error("This parameter requires Seedance 2.5");
  if (modern) {
    req.output_format = choice(req.output_format, "mp4", ["mp4", "mov"], "output_format");
    req.omni_reference_task_type = choice(req.omni_reference_task_type, "auto", ["auto", "reference", "edit", "extend"], "omni_reference_task_type");
  }
  req.duration = req.duration === undefined ? req.omni_reference_task_type === "edit" ? -1 : 5 : req.duration;
  if (!(modern && req.duration === -1)) integer(req.duration, 4, spec.maxSeconds, "duration");
  req.resolution = choice(typeof req.resolution === "string" ? req.resolution.toLowerCase() : req.resolution, req.draft ? "480p" : "720p", spec.fourK ? ["480p", "720p", "1080p", "4k"] : ["480p", "720p"], "resolution");
  if (req.draft && req.resolution !== "480p") throw new Error("Drafts require 480p");
  req.size = choice(req.size, "adaptive", ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9", "adaptive"], "size");
  req.generate_audio = req.generate_audio === undefined ? true : req.generate_audio;
  if (req.seed !== undefined) integer(req.seed, -1, 4294967295, "seed");
  let references = 0;
  for (const key of ["image_urls", "video_urls", "audio_urls"])
    if (req[key] !== undefined) {
      if (!Array.isArray(req[key]) || req[key].length > (key === "image_urls" ? spec.references : spec.mediaReferences)) throw new Error("Too many " + key);
      req[key] = req[key].map(function (url) { return media(url, false, key); });
      references += req[key].length;
    }
  if (req.image_with_roles !== undefined) {
    if (!Array.isArray(req.image_with_roles) || req.image_with_roles.length + (req.image_urls || []).length > spec.references) throw new Error("Too many reference images");
    if (!modern && (req.image_urls || []).length) throw new Error("Use image_urls or image_with_roles");
    req.image_with_roles = req.image_with_roles.map(function (entry) {
      object(entry, "image role");
      return { url: media(entry.url, false, "image_with_roles"), role: choice(entry.role, undefined, ["reference_image", "first_frame", "last_frame"], "role") };
    });
    if (req.image_with_roles.some(function (entry) { return !entry.role; })) throw new Error("Image role is required");
    references += req.image_with_roles.length;
  }
  const roles = (req.image_with_roles || []).map(function (entry) { return entry.role; });
  const first = roles.filter(function (role) { return role === "first_frame"; }).length;
  const last = roles.filter(function (role) { return role === "last_frame"; }).length;
  if (first > 1 || last > 1 || (last && !first)) throw new Error("Use one first frame before one last frame");
  if (first || last) {
    if (!modern && ((req.video_urls || []).length || (req.audio_urls || []).length)) throw new Error("Seedance 2.0 frames cannot accompany audio or video references");
    if (modern && !(req.video_urls || []).length && !(req.audio_urls || []).length && req.size !== "adaptive") throw new Error("Frame tasks require adaptive size");
  }
  if (!modern && (req.audio_urls || []).length && !(req.image_urls || []).length && !roles.length && !(req.video_urls || []).length) throw new Error("Seedance 2.0 audio requires image or video references");
  if (["edit", "extend"].includes(req.omni_reference_task_type)) {
    if (!(req.video_urls || []).length || req.size !== "adaptive") throw new Error("Edit and extend require reference video and adaptive size");
    if (req.omni_reference_task_type === "edit" && req.duration !== -1) throw new Error("Video edit requires automatic duration");
  }
  req.prompt = text(req.prompt);
  if ((!req.prompt && (modern || !references)) || req.prompt.length > (model === "seedance-2.0-mini" ? 32000 : 4000)) throw new Error("A supported Seedance prompt is required");
  if (req.negative_prompt !== undefined && (typeof req.negative_prompt !== "string" || req.negative_prompt.length > 4000)) throw new Error("negative_prompt exceeds model limits");
  if (req.tools !== undefined && (!Array.isArray(req.tools) || req.tools.length > 1 || req.tools.some(function (tool) { return !tool || tool.type !== "web_search" || Object.keys(tool).length !== 1; }))) throw new Error("Only the web_search tool is supported");
  return req;
}

function normalizedVideo(model, source) {
  const spec = specFor(model),
    req = {};
  if (spec.catalog) return normalizedCatalog(model, source);
  if (spec.kind !== "video") throw new Error("A video model is required");
  if (spec.seedance) return normalizedSeedance(model, source);
  for (const key of VIDEO_FIELDS) if (source[key] !== undefined) req[key] = source[key];
  if (req.nsfw_check !== undefined && typeof req.nsfw_check !== "boolean") throw new Error("nsfw_check must be a boolean");
  req.duration = integer(req.duration === undefined ? 5 : req.duration, 3, spec.maxSeconds, "duration");
  if (spec.durations && !spec.durations.includes(req.duration)) throw new Error("This model supports only 5 or 10 seconds");
  req.aspect_ratio = choice(req.aspect_ratio, "16:9", ["16:9", "9:16", "1:1"], "aspect_ratio");
  if (spec.turbo) {
    if (req.mode !== undefined) throw new Error("Kling Turbo uses resolution instead of mode");
    req.resolution = choice(req.resolution, "720p", ["720p", "1080p"], "resolution");
    for (const key of ["negative_prompt", "audio", "multi_shot", "shot_type", "multi_prompt", "element_list", "image_with_roles", "video_list"])
      if (req[key] !== undefined) throw new Error(key + " is not supported by Kling Turbo");
  } else {
    req.mode = choice(req.mode, "std", spec.fourK ? ["std", "pro", "4k"] : ["std", "pro"], "mode");
    if (req.resolution !== undefined) throw new Error("This Kling model uses mode instead of resolution");
    if (req.first_frame_image !== undefined) throw new Error("Use image_urls or image_with_roles for this model");
    if (req.audio !== undefined && (typeof req.audio !== "boolean" || (!spec.audio && req.audio)))
      throw new Error("Audio generation is not supported by this model");
    if (spec.audio) req.audio = req.audio === undefined ? false : req.audio;
  }
  if (req.watermark !== undefined && typeof req.watermark !== "boolean") throw new Error("watermark must be a boolean");
  if (req.image_urls !== undefined) {
    if (!Array.isArray(req.image_urls) || req.image_urls.length > (spec.omni ? 2 : spec.references))
      throw new Error("Too many reference images; use image_with_roles for Omni references");
    req.image_urls = req.image_urls.map(function (value) {
      return media(value, !!spec.inline, "image_urls");
    });
    if (spec.turbo && req.image_urls.length) {
      if (req.first_frame_image !== undefined) throw new Error("Use first_frame_image or image_urls, not both");
      req.first_frame_image = req.image_urls[0];
      delete req.image_urls;
    }
  }
  if (req.first_frame_image !== undefined) req.first_frame_image = media(req.first_frame_image, true, "first_frame_image");
  if (req.image_with_roles !== undefined) {
    if (!spec.omni || !Array.isArray(req.image_with_roles) || req.image_with_roles.length > spec.references)
      throw new Error("image_with_roles requires an Omni model and a supported reference count");
    if (req.image_urls !== undefined) throw new Error("Use image_urls or image_with_roles, not both");
    let first = 0,
      last = 0;
    req.image_with_roles = req.image_with_roles.map(function (entry) {
      object(entry, "image_with_roles entry");
      const role = choice(entry.role, "reference", ["reference", "first_frame", "last_frame"], "image role");
      if (role === "first_frame") first++;
      if (role === "last_frame") last++;
      return { url: media(entry.url, false, "image URL"), role: role };
    });
    if (first > 1 || last > 1 || (last && !first)) throw new Error("A last frame requires exactly one first frame");
    if (model === "kling-video-o1" && req.image_with_roles.length > 2 && (first || last))
      throw new Error("O1 cannot combine more than two references with frame roles");
  }
  // Base-video editing derives duration from remote media rather than the
  // requested duration. Do not advertise it until measured-duration settlement
  // has an independently verified upstream contract.
  if (req.video_list !== undefined) throw new Error("Reference-video editing is not supported in this plugin version");
  const references = (req.image_urls || []).length + (req.image_with_roles || []).length + (req.first_frame_image ? 1 : 0);
  if (model === "kling-v2-6" && ((req.audio && req.mode !== "pro") || ((req.image_urls || []).length === 2 && (req.mode !== "pro" || req.audio))))
    throw new Error("Kling 2.6 audio and last-frame constraints require a compatible pro request");
  if (req.multi_shot !== undefined && (typeof req.multi_shot !== "boolean" || (!spec.shots && req.multi_shot)))
    throw new Error("multi_shot requires Kling v3 or v3 Omni");
  if (req.multi_shot) {
    req.shot_type = choice(req.shot_type, undefined, ["customize", "intelligence"], "shot_type");
    if (!req.shot_type) throw new Error("shot_type is required for multi_shot");
    if (req.shot_type === "customize") {
      if (!Array.isArray(req.multi_prompt) || !req.multi_prompt.length || req.multi_prompt.length > 6) throw new Error("multi_prompt requires 1 to 6 shots");
      let duration = 0;
      req.multi_prompt = req.multi_prompt.map(function (entry, index) {
        object(entry, "shot");
        if (entry.index !== index + 1 || !text(entry.prompt) || entry.prompt.length > 512)
          throw new Error("Each shot requires a consecutive index and a prompt of at most 512 characters");
        duration += integer(entry.duration, 1, req.duration, "shot duration");
        return { index: index + 1, prompt: entry.prompt, duration: entry.duration };
      });
      if (duration !== req.duration) throw new Error("Shot durations must sum to duration");
    } else if (req.multi_prompt !== undefined) throw new Error("multi_prompt requires customized multi_shot");
  } else if (req.multi_prompt !== undefined || req.shot_type !== undefined) throw new Error("Shot parameters require multi_shot");
  if (req.element_list !== undefined) {
    if (!spec.shots || !Array.isArray(req.element_list) || !req.element_list.length || req.element_list.length > 3)
      throw new Error("element_list requires 1 to 3 subjects on Kling v3 or Omni");
    if (model === "kling-v3" && !(req.image_urls || []).length) throw new Error("Kling v3 subjects require at least one image_urls reference");
    req.element_list = req.element_list.map(function (entry) {
      object(entry, "element");
      if (
        !text(entry.name) ||
        !text(entry.description) ||
        !Array.isArray(entry.element_input_urls) ||
        entry.element_input_urls.length < 2 ||
        entry.element_input_urls.length > 4
      )
        throw new Error("Each element requires name, description and 2 to 4 images");
      return {
        name: entry.name,
        description: entry.description,
        element_input_urls: entry.element_input_urls.map(function (url) {
          return media(url, false, "element image");
        }),
      };
    });
  }
  req.prompt = text(req.prompt);
  if ((!req.prompt && !req.multi_shot && !(spec.turbo && references)) || req.prompt.length > (spec.turbo ? 3072 : 2500))
    throw new Error("A supported prompt is required");
  if (req.negative_prompt !== undefined && (typeof req.negative_prompt !== "string" || req.negative_prompt.length > 2500))
    throw new Error("negative_prompt must contain at most 2500 characters");
  return req;
}

// Catalogue models keep their native parameters; upstream enforces model-specific
// enums and required fields. Bound quantities here before quota reservation.
function normalizedCatalog(model, source) {
  const spec = specFor(model), req = {};
  if (source.svg !== undefined || source.output_format === "svg") throw new Error("SVG writer generation is not supported by this plugin");
  const hostFields = ["model", "metadata", "input", "stream", "background", "response_format", "seconds", "image", "images", "input_reference"];
  for (const key of Object.keys(source)) {
    if (hostFields.includes(key) && !(key === "background" && spec.kind === "image")) continue;
    req[key] = source[key];
  }
  if (model === "wan2.7-videoedit") {
    const metadata = source.metadata === undefined ? {} : object(source.metadata, "metadata");
    const audio = source.audio_setting === undefined ? metadata.audio_setting : source.audio_setting;
    if (audio !== undefined) req.metadata = { audio_setting: choice(audio, undefined, ["auto", "origin"], "audio_setting") };
    delete req.audio_setting;
  }
  if (model === "seedream-5-5" && req.layer_decomposition === true)
    req.layer_decomposition_options = Object.assign({ max_images: 30 }, req.layer_decomposition_options === undefined ? {} : object(req.layer_decomposition_options, "layer_decomposition_options"));
  const pending = [{ value: req, depth: 0 }];
  while (pending.length) {
    const item = pending.pop(), value = item.value;
    if (item.depth > 16) throw new Error("Request nesting exceeds 16 levels");
    if (Array.isArray(value)) {
      if (value.length > 100) throw new Error("Request arrays must contain at most 100 items");
      for (const child of value) pending.push({ value: child, depth: item.depth + 1 });
    } else if (value && typeof value === "object") {
      object(value, "request parameter");
      for (const key of Object.keys(value)) {
        const child = value[key];
        if (ORIGIN_TASK_FIELDS.includes(key) && item.depth !== 0) throw new Error("Task references must be top-level gateway task IDs");
        if (/(?:^|_)task_ids?$/.test(key) && !ORIGIN_TASK_FIELDS.includes(key)) throw new Error("Unsupported task reference: " + key);
        if (["image_urls", "image_with_roles", "video_urls", "audio_urls", "ref_images", "ref_videos", "img_references"].includes(key) && (!Array.isArray(child) || child.length > 30)) throw new Error(key + " must contain at most 30 references");
        if (/^(?:__fileRef|api_key|authorization|callback_url|webhook|webhook_url|custom_model_id|persona_id|voice_id|asset_id|image_id|request_id|task_id|task_ids)$/.test(key))
          throw new Error("Unsupported private reference or callback: " + key);
        if (COUNT_FIELDS.includes(key)) integer(child, 1, 100, key);
        if (["max_tokens", "max_output_tokens", "max_completion_tokens"].includes(key)) integer(child, 1, 1000000, key);
        if (["duration", "seconds", "length"].includes(key)) {
          if (model === "kling-v4-long-image" && key === "length" && item.depth === 0) choice(child, undefined, ["short", "medium", "long"], "length");
          else if (model === "wan2.7-videoedit" && key === "duration" && item.depth === 0) {
            if (child !== 0) integer(child, 2, 10, key);
          } else if (child !== -1) integer(child, 1, 360, key);
        }
        if (["width", "height"].includes(key)) integer(child, 1, 16384, key);
        if (["nsfw_check", "official_fallback", "watermark", "generate_audio", "prompt_optimizer", "max_mode", "layer_decomposition"].includes(key) && typeof child !== "boolean")
          throw new Error(key + " must be a boolean");
        pending.push({ value: child, depth: item.depth + 1 });
      }
    } else if (typeof value === "number" && !Number.isFinite(value)) throw new Error("Request numbers must be finite");
    else if (typeof value === "string" && (/^(?:asset|file):\/\//i.test(value) || value.length > 33554432)) throw new Error("Unsupported private asset or oversized value");
  }
  const maxPrompt = model === "kling-v4-long-image" ? 166000 : 32000;
  if (req.prompt !== undefined && (typeof req.prompt !== "string" || req.prompt.length > maxPrompt)) throw new Error("prompt exceeds " + maxPrompt + " characters");
  if (spec.kind === "image" && req.n === undefined) req.n = 1;
  if (spec.kind === "audio") {
    if (model === "suno") {
      if (!req.version) req.version = "v6";
      choice(req.version, undefined, ["v6", "v6-wild", "v6-mini"], "version");
      for (const key of ["custom", "instrumental", "auto_lyrics"])
        if (req[key] !== undefined && typeof req[key] !== "boolean") throw new Error(key + " must be a boolean");
      if (req.max_mode && !req.custom) throw new Error("max_mode requires custom mode");
      if (req.duration !== undefined && (!req.custom || req.duration < 10)) throw new Error("Suno duration requires custom mode and 10–360 seconds");
      for (const key of ["style_weight", "weirdness_constraint", "audio_weight"])
        if (req[key] !== undefined && (typeof req[key] !== "number" || req[key] < 0 || req[key] > 1)) throw new Error(key + " must be between 0 and 1");
      if (!text(req.prompt) && !(req.custom && req.instrumental)) throw new Error("Suno requires a prompt");
      if (text(req.prompt).length > (req.custom ? 5000 : 3000)) throw new Error("Suno prompt exceeds model limits");
      if (req.title !== undefined && (typeof req.title !== "string" || req.title.length > 80)) throw new Error("Suno title exceeds 80 characters");
      if (req.style !== undefined && (typeof req.style !== "string" || req.style.length > 1000)) throw new Error("Suno style exceeds 1000 characters");
    } else {
      if (!text(req.sound_prompt) && !text(req.lyrics)) throw new Error("Flowmusic requires sound_prompt or lyrics");
      if (req.length !== undefined) integer(req.length, 1, 240, "length");
    }
  }
  return req;
}

function decodedRequest(ctx, kind, responses) {
  let source = {},
    files = [];
  if (ctx.body && ctx.body.kind === "json") source = object(ctx.body.value, "request body");
  else if (ctx.body && ctx.body.kind === "multipart" && !responses) {
    for (const key of Object.keys(ctx.body.fields || {})) {
      const values = ctx.body.fields[key];
      if (values.length !== 1) throw new Error(key + " must be provided once");
      source[key] = values[0];
    }
    for (const key of ["n", "seconds", "duration", "output_compression"]) if (source[key] !== undefined) source[key] = Number(source[key]);
    for (const key of ["watermark", "audio", "multi_shot", "official_fallback", "nsfw_check", "generate_audio", "return_last_frame", "draft"])
      if (source[key] !== undefined) {
        if (source[key] !== "true" && source[key] !== "false") throw new Error(key + " must be true or false");
        source[key] = source[key] === "true";
      }
    for (const key of ["metadata", "image_urls", "image_with_roles", "multi_prompt", "element_list", "video_urls", "audio_urls", "tools"])
      if (source[key] !== undefined) {
        try {
          source[key] = JSON.parse(source[key]);
        } catch {
          throw new Error(key + " must be JSON");
        }
      }
    files = ctx.body.files || [];
  } else throw new Error("A JSON or supported multipart body is required");
  const model = text(ctx.model) || text(source.model),
    upstreamModel = vendorModel(text(ctx.upstreamModel) || model);
  const spec = specFor(upstreamModel);
  if (kind && spec.kind !== kind && !(kind === "video" && spec.kind === "text")) throw new Error("The model does not support this endpoint");
  const params = Object.assign({}, source.metadata === undefined ? {} : object(source.metadata, "metadata"), source);
  delete params.metadata;
  if (responses && typeof source.background === "boolean") {
    delete params.background;
    if (source.metadata && source.metadata.background !== undefined) params.background = source.metadata.background;
  }
  for (const key of ["callback_url", "webhook", "webhook_url"])
    if (params[key] !== undefined) throw new Error("Retrieve the gateway task instead of supplying a callback");
  if (params.stream !== undefined && params.stream !== false && !responses) throw new Error("Use Responses streaming or the native asynchronous route");
  if (params.response_format !== undefined && !["url", "b64_json"].includes(params.response_format)) throw new Error("response_format must be url or b64_json");
  let images = [];
  if (responses) {
    const texts = [];
    if (typeof source.input === "string") texts.push(source.input);
    else if (Array.isArray(source.input)) {
      for (const item of source.input) {
        if (typeof item === "string") {
          texts.push(item);
          continue;
        }
        object(item, "input item");
        const content = item.content === undefined ? [item] : typeof item.content === "string" ? [{ type: "input_text", text: item.content }] : item.content;
        if (!Array.isArray(content)) throw new Error("input content must be a string or array");
        for (const part of content) {
          object(part, "input content");
          if (["input_text", "text"].includes(part.type) && typeof part.text === "string") texts.push(part.text);
          else if (["input_image", "image_url"].includes(part.type)) images.push(typeof part.image_url === "object" ? part.image_url.url : part.image_url);
          else throw new Error("Unsupported Responses input content");
        }
      }
    } else throw new Error("input must be a string or array");
    params.prompt = texts.join("\n");
    if (upstreamModel === "flowmusic") {
      if (params.sound_prompt === undefined && params.lyrics === undefined) params.sound_prompt = params.prompt;
      delete params.prompt;
    }
  }
  for (const field of ["image", "images", "input_reference"]) if (params[field] !== undefined) images = images.concat(params[field]);
  if (params.image_urls !== undefined) {
    if (!Array.isArray(params.image_urls)) throw new Error("image_urls must be an array");
    images = images.concat(params.image_urls);
  }
  for (const file of files) {
    const placeholder = { __fileRef: file.ref, encoding: "dataUrl", maxBytes: file.field === "mask" ? 4194304 : 20971520 };
    if (file.field === "mask") {
      if (params.mask_url !== undefined) throw new Error("Only one mask is supported");
      params.mask_url = placeholder;
    } else if (/^(image(?:\[\d*\])?|input_reference)$/.test(file.field)) images.push(placeholder);
    else throw new Error("Unsupported file field");
  }
  // User JSON cannot manufacture host-owned multipart file references.
  for (const image of images)
    if (
      typeof image !== "string" &&
      !files.some(function (file) {
        return image && file.ref === image.__fileRef;
      })
    )
      throw new Error("Image references must be strings");
  if (
    params.mask_url &&
    typeof params.mask_url !== "string" &&
    !files.some(function (file) {
      return file.field === "mask" && file.ref === params.mask_url.__fileRef;
    })
  )
    throw new Error("mask_url must be a string");
  for (const key of ["markup_url", "first_frame_image", "last_frame_image"])
    if (params[key] !== undefined && typeof params[key] !== "string") throw new Error(key + " must be a string");
  if (images.length) params.image_urls = images;
  if (params.mask !== undefined) {
    if (params.mask_url !== undefined) throw new Error("Only one mask is supported");
    if (typeof params.mask !== "string") throw new Error("mask must be a URL string");
    params.mask_url = params.mask;
  }
  if (params.seconds !== undefined) {
    const seconds = typeof params.seconds === "string" && /^\d+$/.test(params.seconds) ? Number(params.seconds) : params.seconds;
    if (params.duration !== undefined && params.duration !== seconds) throw new Error("seconds and duration must agree");
    params.duration = seconds;
  }
  if (spec.kind === "video" && !spec.catalog && params.size !== undefined && (!spec.seedance || /^\d+x\d+$/.test(params.size))) {
    const ratios = {
      "1280x720": "16:9",
      "1920x1080": "16:9",
      "3840x2160": "16:9",
      "720x1280": "9:16",
      "1080x1920": "9:16",
      "2160x3840": "9:16",
      "1024x1024": "1:1",
    };
    const ratio = ["16:9", "9:16", "1:1"].includes(params.size) ? params.size : ratios[params.size];
    if (!ratio) throw new Error("size must use a supported video aspect ratio");
    if (params.aspect_ratio !== undefined && params.aspect_ratio !== ratio) throw new Error("size and aspect_ratio must agree");
    params.aspect_ratio = ratio;
    const mode = /^(1920x1080|1080x1920)$/.test(params.size)
      ? "pro"
      : /^(3840x2160|2160x3840)$/.test(params.size)
        ? "4k"
        : /^(1280x720|720x1280)$/.test(params.size)
          ? "std"
          : "";
    if (spec.seedance) params.size = ratio;
    if (mode) {
      if (spec.turbo || spec.seedance) {
        const resolution = mode === "pro" ? "1080p" : mode === "std" ? "720p" : "4k";
        if (params.resolution !== undefined && params.resolution !== resolution) throw new Error("size and resolution must agree");
        params.resolution = resolution;
      } else {
        if (params.mode !== undefined && params.mode !== mode) throw new Error("size and mode must agree");
        params.mode = mode;
      }
    }
  }
  if (spec.kind === "image" && ctx.operation === "edit" && !images.length) throw new Error("Image editing requires a reference image");
  const body = spec.catalog ? normalizedCatalog(upstreamModel, params) : spec.kind === "image" ? normalizedImage(upstreamModel, params, model) : normalizedVideo(upstreamModel, params);
  // Responses projects at most 64 artifacts; image and native replies retain all URLs.
  if (responses && outputCount(upstreamModel, body) > 64)
    throw new Error("Responses supports at most 64 outputs; use the image or native asynchronous endpoint");
  const originTaskIds = [];
  for (const key of ORIGIN_TASK_FIELDS) {
    if (body[key] === undefined) continue;
    if (typeof body[key] !== "string" || !/^[A-Za-z0-9_-]{1,256}$/.test(body[key])) throw new Error("A public gateway task ID is required");
    if (!originTaskIds.includes(body[key])) originTaskIds.push(body[key]);
  }
  return {
    kind: "submit",
    model: model,
    action:
      spec.kind === "image"
        ? images.length || (body.image_with_roles || []).length
          ? "image_to_image"
          : "text_to_image"
        : spec.kind === "audio" ? "text_to_audio" : spec.kind === "text" ? "text_to_text" : images.length || body.first_frame_image || (body.image_with_roles || []).length
          ? "image_to_video"
          : "text_to_video",
    requestBody: body,
    ...(originTaskIds.length ? { originTaskIds: originTaskIds } : {}),
  };
}

function endpoint(ctx, path) {
  let base = text(ctx.baseUrl).replace(/\/+$/, "");
  if (!/^https:\/\/[^/?#@\s]+(?:\/[^?#\s]*)?$/.test(base) && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(base))
    throw new Error("An HTTPS Base URL without credentials, query or fragment is required");
  if (base.endsWith("/v1")) base = base.slice(0, -3);
  return base + (ctx.upstream && ctx.upstream.kind === "new_api" ? "/apimart" : "") + path;
}
function authorization(ctx) {
  if (!text(ctx.apiKey) && !text(ctx.authHeader)) throw new Error("APIMart API key is required");
  return { Authorization: text(ctx.authHeader) || "Bearer " + ctx.apiKey };
}
export function buildSubmitRequest(ctx) {
  const model = vendorModel(ctx.upstreamModel || ctx.model),
    spec = specFor(model);
  const source = object(ctx.requestBody, "request");
  const body = spec.catalog ? normalizedCatalog(model, source) : spec.kind === "image" ? normalizedImage(model, source, ctx.model) : normalizedVideo(model, source);
  for (const key of ORIGIN_TASK_FIELDS) {
    if (body[key] === undefined) continue;
    const origin = (ctx.originTasks || []).find(function (task) { return task.taskId === body[key]; });
    if (!origin || origin.status !== "SUCCESS" || !text(origin.upstreamTaskId)) throw new Error("A successful owned gateway task is required");
    body[key] = origin.upstreamTaskId;
  }
  body.model = model;
  if (spec.ext) body.resolution = body.resolution.toUpperCase();
  return {
    url: endpoint(ctx, "/v1/" + (ctx.upstream && ctx.upstream.kind === "new_api" && model === "midjourney" ? "images" : model === "midjourney" ? "midjourney" : spec.kind === "audio" ? "music" : spec.kind === "image" ? "images" : "videos") + "/generations"),
    method: "POST",
    headers: Object.assign(authorization(ctx), { "Content-Type": "application/json" }),
    body: body,
  };
}
function taskData(body) {
  object(body, "APIMart response");
  if (body.error || (body.code !== undefined && body.code !== 200))
    throw new Error(text(body.error && body.error.message) || text(body.message) || "APIMart request failed");
  return object(body.data, "APIMart task");
}
export function parseSubmitResponse(ctx, response) {
  const body = object(response.body, "APIMart submission");
  if (body.error || (body.code !== undefined && body.code !== 200 && body.code !== 202))
    throw new Error(text(body.error && body.error.message) || text(body.message) || "APIMart submission failed");
  const entries = Array.isArray(body.data) ? body.data : [body.data];
  if (entries.length !== 1) throw new Error("APIMart must return exactly one task per submission");
  const entry = object(entries[0], "APIMart task"),
    id = text(entry.task_id) || text(entry.id);
  if (!id || id.length > 256 || !/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("APIMart task ID is invalid");
  const spec = specFor(ctx.upstreamModel || ctx.model);
  const request = spec.catalog ? normalizedCatalog(vendorModel(ctx.upstreamModel || ctx.model), ctx.requestBody) : spec.kind === "image"
      ? normalizedImage(vendorModel(ctx.upstreamModel || ctx.model), ctx.requestBody, ctx.model)
      : normalizedVideo(ctx.upstreamModel || ctx.model, ctx.requestBody);
  return {
    taskId: id,
    taskData: body,
    state: { requestedCount: request.n || 1, duration: request.duration || 0, hasInputImages: (request.image_urls || []).length > 0 },
  };
}
export function buildQueryRequest(ctx) {
  return { url: endpoint(ctx, "/v1/" + ((ctx.upstreamModel || ctx.model) && specFor(ctx.upstreamModel || ctx.model).kind === "audio" ? "music/tasks/" : "tasks/") + encodeURIComponent(ctx.taskId)), method: "GET", headers: authorization(ctx) };
}

function mediaEntries(data, kind) {
  const result = data && data.result,
    entries = result && result[kind];
  if (!Array.isArray(entries)) return [];
  const found = [],
    seen = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const value = kind === "music" ? entry.audio_url || entry.wav_url : entry.url;
    const urls = Array.isArray(value) ? value : [value];
    let hasURL = false;
    for (const url of urls)
      if (typeof url === "string" && /^https?:\/\/[^\s]+$/.test(url)) {
        hasURL = true;
        if (!seen.has(url)) {
          seen.add(url);
          found.push({ url: url, expires_at: entry.expires_at });
        }
      }
    // Count payloads rather than result objects. An entry carrying a URL and
    // Base64 is still one deliverable; prompt-only entries contribute nothing.
    if (!hasURL && kind === "images" && text(entry.b64_json) && !seen.has(entry.b64_json)) {
      seen.add(entry.b64_json);
      found.push({ b64_json: entry.b64_json });
    }
  }
  return found;
}
export function parseTaskResult(ctx, body) {
  const data = taskData(body),
    status = STATUS[text(data.status)];
  if (!status) return { status: "UNKNOWN", reason: "Unrecognized APIMart task status" };
  const result = { status: status };
  if (typeof data.progress === "number" && Number.isFinite(data.progress) && data.progress >= 0 && data.progress <= 100) result.progress = data.progress + "%";
  if (status === "FAILURE")
    result.reason = text(data.error && data.error.message) || (data.status === "cancelled" ? "APIMart task cancelled" : "APIMart generation failed");
  if (status === "SUCCESS") {
    const spec = specFor(ctx.upstreamModel || ctx.model), kind = spec.kind;
    const outputs = mediaEntries(data, kind === "audio" ? "music" : kind === "image" ? "images" : "videos");
    if (!(kind === "text" ? text(data.result && data.result.prompt) : outputs.length)) return { status: "UNKNOWN", reason: "APIMart completed without a media result" };
    // APIMart publishes the completed video before its settlement is visible.
    if (spec.credits && (data.billing_status === "held" || chargedCredits(data) === null)) return { status: "IN_PROGRESS", progress: "99%" };
    if (spec.tokens && !spec.credits && imageTokenUsage(data, ctx.state) === null) return { status: "IN_PROGRESS", progress: "99%" };
    result.progress = "100%";
    if (kind === "video") result.url = outputs[0].url;
  }
  return result;
}

function outputCount(model, req) {
  let count = 1;
  for (const key of COUNT_FIELDS) if (req[key] !== undefined) count = Math.max(count, req[key]);
  for (const key of ["sequential_image_generation_options", "layer_decomposition_options"])
    if (req[key] && req[key].max_images !== undefined) count = Math.max(count, req[key].max_images);
  if (req.layer_decomposition === true && ["seedream-5-0-pro", "seedream-5-0-flash"].includes(model)) count = Math.max(count, 17);
  return count;
}

export function extractUsage(ctx) {
  // These are quantities for task expressions, not multiplicative legacy ratios.
  if (ctx.usagePurpose === "billing_ratios") return null;
  const model = vendorModel(ctx.upstreamModel || ctx.model),
    spec = specFor(model);
  const req = spec.catalog ? normalizedCatalog(model, ctx.requestBody) : spec.kind === "image" ? normalizedImage(model, ctx.requestBody, ctx.model) : normalizedVideo(model, ctx.requestBody);
  if (spec.credits) {
    const rate = RESERVATION_RATES[model];
    if (!rate) throw new Error("APIMart reservation rate is unavailable");
    const count = outputCount(model, req);
    const inherited = ORIGIN_TASK_FIELDS.some(function (key) { return req[key] !== undefined; });
    const videoInput = ["video_urls", "video_url", "video_list", "ref_videos"].some(function (key) { return Array.isArray(req[key]) ? req[key].length > 0 : !!req[key]; });
    // Reference-driven catalogue edits can ignore duration; their source length is unknown.
    let seconds = req.duration > 0 ? req.duration : req.length > 0 ? req.length : spec.defaultSeconds || spec.maxSeconds || 360;
    if (req.duration === -1 || inherited) seconds = spec.maxSeconds || 360;
    if (spec.catalog && videoInput) seconds = 360;
    const inputSeconds = videoInput || inherited ? spec.seedance ? spec.maxSeconds : 360 : 0;
    let dollars = rate.unit === "usd_per_second" ? rate.price * (seconds + inputSeconds) : rate.price;
    if (rate.unit === "usd_per_million_tokens") dollars = Math.max(dollars, (rate.inputPrice * rate.maxInput + rate.outputPrice * rate.maxOutput) / 1000000);
    dollars = dollars * count + rate.material;
    // shortcut: reserve the output rate for unlisted Seedream input fees until separately published.
    if (model.startsWith("seedream-5-") && (req.image_urls || []).length) dollars += rate.price * req.image_urls.length;
    if (req.max_mode) dollars *= 2;
    if (req.nsfw_check) dollars += 32768 * 0.2 / 1000000; // Published moderation context and USD/M-token rate.
    const credits = dollars * 10;
    if (!Number.isFinite(credits) || credits <= 0 || credits > 2147483647) throw new Error("APIMart reservation is out of range");
    return { credits: credits };
  }
  if (spec.kind === "video")
    return spec.turbo ? { seconds: req.duration, resolution: req.resolution } : { seconds: req.duration, mode: req.mode, audio: !!req.audio };
  const facts = { image_count: req.n, resolution: req.resolution };
  if (spec.ext) facts.version = req.version;
  if (spec.tokens) {
    facts.quality = req.quality;
    // Reserve a conservative input allowance for images of unknown dimensions.
    // Completion replaces these quantities with validated provider token facts.
    facts.text_tokens = req.prompt.length * 4;
    facts.image_tokens = (req.image_urls || []).length * 16384;
    facts.cached_text_tokens = 0;
    facts.cached_image_tokens = 0;
    // APIMart's published table peaks at 23,719 output tokens per 4K max image.
    // Auto can select that highest quality; reserve it instead of assuming low.
    const bounds = spec.extendedQuality
      ? {
          "1k": { low: 196, medium: 439, high: 1756, xhigh: 3122, max: 7024, auto: 7024 },
          "2k": { low: 397, medium: 892, high: 3568, xhigh: 6343, max: 14272, auto: 14272 },
          "4k": { low: 659, medium: 1483, high: 5930, xhigh: 10542, max: 23719, auto: 23719 },
        }[req.resolution]
      : { low: 2636, medium: 5932, high: 23720, auto: 23720 };
    facts.output_tokens = bounds[req.quality] * req.n;
  }
  return facts;
}
function tokenCount(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647 ? value : null;
}
function chargedCredits(data) {
  if (data.credits_cost == null && data.cost == null) return null;
  for (const key of ["credits_cost", "cost"])
    if (data[key] != null && (typeof data[key] !== "number" || !Number.isFinite(data[key]) || data[key] < 0 || data[key] > 2147483647 / (key === "cost" ? 10 : 1)))
      throw new Error("APIMart settlement charge is invalid");
  if (data.credits_cost != null && data.cost != null && Math.abs(data.credits_cost - data.cost * 10) > Math.max(0.00001, data.credits_cost * 0.000001))
    throw new Error("APIMart settlement amounts disagree");
  return data.credits_cost == null ? data.cost * 10 : data.credits_cost;
}
export function extractUsageOnComplete(ctx, result, body) {
  if (result.status !== "SUCCESS") return {};
  const spec = specFor(ctx.upstreamModel || ctx.model),
    data = taskData(body),
    facts = {};
  if (spec.credits) {
    const credits = chargedCredits(data);
    if (credits === null) throw new Error("APIMart settlement charge is unavailable");
    return { credits: credits };
  }
  if (spec.kind === "video") return facts; // Fixed requested duration, never elapsed processing time.
  const outputs = mediaEntries(data, "images");
  if (outputs.length > 0 && outputs.length <= spec.count) facts.image_count = outputs.length;
  if (!spec.tokens) return facts;
  const tokens = imageTokenUsage(data, ctx.state);
  if (tokens === null) throw new Error("APIMart image settlement tokens are unavailable");
  return Object.assign(facts, tokens);
}
function imageTokenUsage(data, state) {
  const usage = data.usage;
  if (!usage) return null;
  const output = tokenCount(usage.output_tokens),
    input = tokenCount(usage.input_tokens);
  if (output === null || input === null) return null;
  const details = usage.input_tokens_details || {},
    images = tokenCount(details.image_tokens),
    cached = tokenCount(details.cached_tokens);
  if (typeof details !== "object" || Array.isArray(details) || (details.image_tokens !== undefined && images === null) || (details.cached_tokens !== undefined && cached === null)) return null;
  if (state && state.hasInputImages && images === null) return null;
  const imageTokens = images === null ? 0 : images,
    cachedTokens = cached === null ? 0 : cached;
  if (imageTokens > input || cachedTokens > input) return null;
  const cacheDetails = details.cached_tokens_details || {},
    cachedImages = tokenCount(cacheDetails.image_tokens);
  if (typeof cacheDetails !== "object" || Array.isArray(cacheDetails) || (cacheDetails.image_tokens !== undefined && cachedImages === null)) return null;
  if (cachedTokens && imageTokens && cachedImages === null) return null; // Do not invent a modality split.
  const imageCache = cachedImages === null ? 0 : cachedImages,
    textCache = cachedTokens - imageCache,
    textTokens = input - imageTokens;
  if (imageCache > cachedTokens || imageCache > imageTokens || textCache > textTokens) return null;
  return {
    output_tokens: output,
    text_tokens: textTokens - textCache,
    image_tokens: imageTokens - imageCache,
    cached_text_tokens: textCache,
    cached_image_tokens: imageCache,
  };
}

function nativeEnvelope(task, submitted) {
  if (submitted) {
    // The Ext endpoint uses the newer object envelope. Other models keep the
    // array envelope; both retain the gateway's public task identity.
    if (task.data && task.data.data && !Array.isArray(task.data.data))
      return {
        code: 200,
        data: { id: task.task_id, object: "generation.task", type: text(task.data.data.type) || "image", status: "pending", progress: 0, poll_url: "/apimart/v1/tasks/" + task.task_id },
      };
    return { code: 200, data: [{ status: "submitted", task_id: task.task_id }] };
  }
  const data = task.data && !Array.isArray(task.data.data) ? Object.assign({}, task.data.data) : {};
  data.id = task.task_id;
  data.status =
    { NOT_START: "pending", SUBMITTED: "submitted", QUEUED: "pending", IN_PROGRESS: "processing", SUCCESS: "completed", FAILURE: "failed" }[task.status] ||
    "pending";
  const progress = Number(String(task.progress || "").replace("%", ""));
  if (Number.isFinite(progress)) data.progress = progress;
  if (task.status === "FAILURE") data.error = { message: task.fail_reason || "APIMart task failed" };
  return { code: 200, data: data };
}
export const native = {
  decodeImage: function (ctx) {
    return decodedRequest(ctx, "image", false);
  },
  decodeVideo: function (ctx) {
    return decodedRequest(ctx, "video", false);
  },
  decodeAudio: function (ctx) {
    return decodedRequest(ctx, "audio", false);
  },
  decodeMidjourney: function (ctx) {
    return decodedRequest(Object.assign({}, ctx, { model: ctx.model || "midjourney" }), "image", false);
  },
  taskCreated: function (_ctx, task) {
    return nativeEnvelope(task, true);
  },
  taskStatus: function (_ctx, task) {
    return nativeEnvelope(task, false);
  },
  error: function (_ctx, error) {
    return { error: { code: error.code, message: error.message } };
  },
};

export function listArtifacts(task) {
  if (task.status !== "SUCCESS") return [];
  const data = task.data && task.data.data,
    artifacts = [];
  for (const kind of ["images", "videos", "music"]) {
    for (const [index, output] of mediaEntries(data, kind).entries())
      if (output.url)
        artifacts.push({
          key: kind === "videos" && index === 0 ? "video" : (kind === "images" ? "image_" : kind === "music" ? "audio_" : "video_") + index,
          type: kind === "images" ? "image" : kind === "music" ? "audio" : "video",
        });
  }
  return artifacts;
}
export function buildContentRequest(ctx) {
  const match = /^(image_|video_|audio_)(\d+)$/.exec(ctx.artifactKey);
  const kind = match && match[1] === "audio_" ? "music" : ctx.artifactKey === "video" || (match && match[1] === "video_") ? "videos" : "images";
  const index = ctx.artifactKey === "video" ? 0 : match ? Number(match[2]) : -1;
  const output = mediaEntries(ctx.data && ctx.data.data, kind)[index];
  if (!output || !output.url) throw new Error("artifact_not_found");
  // A CDN is a result recipient, never a recipient of the channel API key.
  return { url: output.url, method: ctx.clientRequest.method, credentialless: true };
}
function responseText(ctx, task) {
  const prompt = text(task.data && task.data.data && task.data.data.result && task.data.data.result.prompt);
  if (prompt && !listArtifacts(task).length) return prompt;
  const artifacts = ctx.artifacts || {},
    parts = [];
  for (const artifact of listArtifacts({ status: task.status, data: task.data })) {
    const url = text(artifacts[artifact.key] && artifacts[artifact.key].url);
    if (!url) throw new Error("Generated media artifact is unavailable");
    if (artifact.type === "image") parts.push("![image](" + url + ")");
    else {
      const tag = artifact.type === "audio" ? "audio" : "video";
      parts.push('<' + tag + ' controls src="' + url.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '"></' + tag + '>');
    }
  }
  if (!parts.length) throw new Error("Generated media artifact is unavailable");
  return parts.join("\n");
}
export const protocols = {
  openai_image: {
    decodeRequest: function (ctx) {
      return decodedRequest(ctx, "image", false);
    },
    render: function (_ctx, task) {
      const data = task.data && task.data.data,
        images = mediaEntries(data, "images");
      if (!images.length) throw new Error("APIMart image result is empty");
      const result = {
        data: images.map(function (entry) {
          return entry.url ? { url: entry.url } : { b64_json: entry.b64_json };
        }),
      };
      if (data.usage) result.usage = data.usage;
      return result;
    },
  },
  openai_video: {
    decodeRequest: function (ctx) {
      return decodedRequest(ctx, "video", false);
    },
    render: function (_ctx, task) {
      const data = task.data && task.data.data,
        video = mediaEntries(data, "videos")[0],
        result = {};
      if (video) result.url = video.url;
      if (data && data.error) result.error = data.error;
      return result;
    },
  },
  openai_responses: {
    decodeRequest: function (ctx) {
      return decodedRequest(ctx, "", true);
    },
    renderEvents: function (ctx, task, previousState) {
      const state = { status: task.status, progress: task.progress || "" };
      if (task.status === "SUCCESS")
        return {
          events: previousState && previousState.status === "SUCCESS" ? [] : [{ type: "output", data: responseText(ctx, task) }],
          state: state,
          done: true,
        };
      if (task.status === "FAILURE")
        return { events: [{ type: "error", code: "task_failed", message: task.fail_reason || "APIMart generation failed" }], state: state, done: true };
      if (previousState && previousState.status === state.status && previousState.progress === state.progress) return { events: [], state: state, done: false };
      const event = { type: "progress", message: String(task.status || "pending").toLowerCase() },
        progress = Number(String(task.progress || "").replace("%", ""));
      if (Number.isFinite(progress) && progress >= 0 && progress <= 100) event.progress = progress;
      return { events: [event], state: state, done: false };
    },
    renderFinal: function (ctx, task) {
      return {
        output: [
          { type: "message", status: "completed", role: "assistant", content: [{ type: "output_text", text: responseText(ctx, task), annotations: [] }] },
        ],
        metadata: { vendor: "apimart" },
      };
    },
  },
};
