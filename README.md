# new-api-apimart

面向 [new-api](https://github.com/QuantumNous/new-api) 的独立 APIMart 任务插件，插件标识为 `apimart`。单个 `plugin.js` 即可安装，无需修改网关 Go 路由。

## 模型覆盖

按 2026-11-21 APIMart 公开模型与价格清单核对，共 255 个模型标识；另补入官网 TTS 文档列出、价格目录未收录的 `gpt-4o-mini-tts`，合计 256 个。完整清单和同步模型的接口分组在 [models.json](models.json)。

| 接入方式 | 范围 |
| --- | --- |
| 本任务插件 | 123 个公开异步模型，另保留旧模型、官网别名与画质预设，共声明 173 个标识 |
| 图片任务 | GPT Image 1 / 1.5 / 2 / 2.5 / 2.6，Gemini / Nano Banana，Flux，Grok，Seedream，Qwen，Wan，Kling Image，MiniMax，MAI，Midjourney 等 |
| 视频任务 | Seedance 1 / 2.0 / 2.5 / Flash，Kling，Veo，Grok，Wan，Vidu，PixVerse，MiniMax，HappyHorse，SkyReels 等 |
| 音乐任务 | `suno`、`flowmusic`，原生 JSON 参数提交、轮询和音频结果下载 |
| 文本任务 | `MiniMax-H3-Context-IR`，返回增强提示词，使用视频原生提交路径或 Responses |
| 现有 OpenAI 兼容渠道 | 133 个同步模型：124 个文字模型、3 个向量模型、1 个审核模型、3 个转录模型、1 个 TTS 模型、`dall-e-3` |

这些数字表示模型清单与接口分发覆盖，不表示逐个模型已实际付费生成成功，也不代表已实现官网所有素材管理和编辑动作。账号可用型号以使用自己的 Key 查询 `GET /v1/models` 为准。

## 安装与渠道配置

本地直接在「任务插件 → 上传插件」上传 `plugin.js`。新建「任务插件」渠道，选择 **APIMart**，填写 Base URL `https://api.apimart.ai` 和 APIMart Key；将要开放的异步模型添加到该渠道。

文字、向量、审核、转录、TTS 与 DALL-E 3 另外新建 **OpenAI** 类型渠道，使用同一 Base URL 和上游 Key。按 `models.json` 的 `openaiChannel.endpoints` 添加模型，并配置对应价格。TTS 使用 `/v1/audio/speech`；它们不经过本任务插件，不需要改宿主代码。

同名模型支持与内置插件共存，最终选择的渠道决定执行哪个插件。共享模型建议配置 `apimart::<模型名>` 的提供商价格，防止套用其他渠道的计费方案。安装插件不会自动开放分组、创建渠道或设置价格。

市场索引：

```text
https://raw.githubusercontent.com/heyzeyu/new-api-apimart/main/marketplace.json
```

索引固定到版本标签并带源码 SHA-256。工作区版本为 **0.2.0**；提交代码并发布对应 `v0.2.0` 标签后，远程索引才可安装该版本。本次修改没有发布版本。

宿主须支持 Task Plugin API v1、usage profiles、`unitLabel`、原生路由、origin tasks 归属校验及对应的标准协议。CI 固定的宿主提交见 `.github/workflows/test.yml`。

## 任务接口

以下均使用网关令牌，客户端无需持有上游 APIMart Key。

| 网关接口 | 用途 |
| --- | --- |
| `POST /v1/images/generations` / `/v1/images/edits` | 标准图片请求，等待异步任务完成后返回图片 |
| `POST /v1/videos` | 标准视频请求，返回网关任务 ID |
| `POST /v1/responses` | 图片、视频、音乐、Context-IR，支持同步、流式进度和 `background: true` |
| `POST /apimart/v1/images/generations` | 原生异步图片提交 |
| `POST /apimart/v1/videos/generations` | 原生异步视频或 Context-IR 提交 |
| `POST /apimart/v1/music/generations` | 原生异步音乐提交 |
| `POST /apimart/v1/midjourney/generations` | Midjourney Imagine 提交 |
| `GET /apimart/v1/tasks/{task_id}` | 查询任何本插件任务 |
| `GET /apimart/v1/music/tasks/{task_id}` | 音乐任务查询别名 |

Seedance 示例：

```bash
curl "$GATEWAY_URL/apimart/v1/videos/generations" \
  -H "Authorization: Bearer $GATEWAY_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"seedance-2.5","prompt":"一只猫在草地上奔跑","resolution":"720p","duration":5,"generate_audio":false}'
```

GPT Image 2.6 示例：

```json
{"model":"gpt-image-2.6-flare","prompt":"A red circle on white","n":1,"resolution":"1k","quality":"medium","nsfw_check":true}
```

Suno 示例：

```json
{"model":"suno","version":"v6","prompt":"A quiet piano melody","instrumental":true}
```

官网异步模型的 JSON 参数可直接提交；标准协议的扩展参数可放入 `metadata`。已有 Image 2 / Kling 和新 Seedance 2.x 使用专用校验，其余目录模型保留原生参数并在本地限制数量、时长、嵌套深度、私有引用和回调；具体型号的必填项、枚举、素材时长等仍由上游校验。不要将任意模型的文生图示例直接当作运动控制、视频编辑等任务的完整请求。

图片成功结果位于 `result.images`，视频位于 `result.videos`，音乐位于 `result.music`，Context-IR 位于 `result.prompt`。Responses 使用网关生成的图片、视频或音频下载链接。下载 CDN 文件时不携带渠道密钥。

支持 `source_task_id`、`extend_from_task_id`、Seedance 2.5 的 `draft_task_id` 和 Flux 3 Video 的 `draft_from_task_id`，传入值必须是**当前用户的网关任务 ID**。宿主先验证归属、插件和渠道并固定原渠道，插件只在拿到已成功的授权任务后替换成上游 ID。不能直接填写 APIMart 私有任务 ID；未接入归属校验的其他任务引用字段会被拒绝。

转发到另一个 new-api 时，两端均需安装该插件，上游类型设置为 New API；插件自动使用 `/apimart/...` 路径。

## 计费

原有 Image 2 / 2.5 和五个 Kling 模型继续使用原来的图片数、模态 token、时长等用量字段，保留历史计费配置。

新增模型使用 `credits` 用量字段，完成后读取上游任务的 `credits_cost`，或将美元 `cost` 乘 10 转为 APIMart 积分；两者同时存在时校验一致性。每个 APIMart credit 对应 0.10 美元，上游账号折扣已反映在实际费用中。管理员在价格输入中设置每 credit 的售价及所需加价，不能将整个任务价格填成每 credit 的单价。

预扣使用随插件发布的公开原价快照，按允许的输入、输出上限和请求数量做保守估算，完成后按上游实扣结算。token 模型可能预留数十美元；已核实默认时长的普通视频任务按文档默认值预留，例如 Flux 3 Video 默认 5 秒；自动时长按模型上限预留。缺少已核实默认值的型号，以及可能由参考视频决定输出时长的任务，仍采用 360 秒的保守估算；引用视频或原任务会追加输入时长预留，可能达到数百美元并导致余额检查失败。显式 duration 可降低普通生成的输出预留，参考视频任务仍保守处理；实际费用通常低得多。这是当前预扣策略的已知限制。价格快照不会自动更新，上游调价、账号定制合同与新计费维度可能导致实际费用超过预扣，需要随版本重新核对。

Seedream 5.5 图层拆分省略输出上限时按 30 张预扣，5.0 Pro / Flash 按最多 17 张预扣。未单独公开的 Seedream 输入图费用暂按输出单价预留；Flash 文档与目录价格不同，暂取较高的文档价预留。这些都是预扣估算，最终仍按账号返回的实际费用结算。

上游已生成结果但尚未返回费用，或 `billing_status` 仍为 `held` 时保持处理中（99%），实扣费用齐全后才完成；错误或矛盾的费用不会作为成功结算。若费用始终缺失，任务会受宿主超时机制限制，部署前必须确认账号返回此字段。钱包预扣、补扣、失败退款和幂等结算由宿主负责。

## 边界与风险

- 模型覆盖依据公开目录快照，未逐项实际调用上游；路由、账户权限、供应库存、真实输出和价格须用部署账号验证。未在此清单中的未来新型号需要更新插件。
- 新目录模型以 JSON 和公网素材 URL 为主；不提供官网上传、资产管理、Suno 自定义模型 / Persona / 私有声线或 `asset://` 共享账号素材。拒绝客户端回调和伪造的文件引用。
- Midjourney 当前接入 Imagine，不包含其全部二次编辑、按钮和视频动作；音乐接入生成，不包含全部裁剪、混音、分轨等工具动作。
- GPT Image 2.6 支持静态图片和 GIF 参数，本插件暂不支持 SVG 写作流程。
- 旧 Image 2 图生图未指定尺寸时，插件显式发送 `size: auto`，使输出按请求分辨率定价；需要保持参考图比例时应显式指定比例或合法像素尺寸。
- 旧 token 图片模型若缺少上游用量或输入模态 / 缓存拆分，会继续等待并拒绝用预扣估算值完成结算。若上游一直不返回约定用量，任务受宿主超时机制限制；部署前须确认账号会返回这些字段。已经完成的历史任务不会自动重算。
- Responses 接口最多请求 64 个输出，以匹配宿主附件上限；Seedream 5.5 的 65–100 层任务请使用标准图片或原生异步接口，结果保留完整图片地址。
- 尺寸和清晰度参数不能保证上游精确输出任意请求像素。标准图片与 Responses 的同步等待也可能先于长任务结束，超时后应继续查询已有任务，避免重复提交计费。

## 开发与验证

无需 Node 依赖，使用 Node.js 22+ 或 Bun：

```bash
bun run marketplace
bun run check
```

在 new-api 源码目录验证真实 JavaScript 引擎及内置插件共存：

```bash
go run /path/to/new-api-apimart/tools/contract/main.go \
  -plugin /path/to/new-api-apimart/plugin.js \
  -fixture /path/to/new-api-apimart/test/contract-fixture.json
```

测试数据为合成任务和媒体地址，不包含真实 Key、任务凭据或账号账单。目录覆盖测试验证全部公开模型均有任务或同步渠道分组，并校验所有声明的宿主协议绑定。正向解码用例还经过真实宿主适配器的提交验证与用量校验，覆盖自动时长和 Wan 编辑的显式零时长。另按官网 66 个型号的示例固化原生请求契约，采用合成提示词和任务 ID；89 个文档中的生成请求示例已做本地接收校验。这些检查不能替代上游实际调用。

任务归属引用遵循 OWASP Authentication、Session Management、Authorization Cheat Sheets 的服务端校验、默认拒绝和对象归属检查原则。未修改宿主登录或会话机制；本地运行了宿主拒绝跨用户、跨插件、跨渠道和禁用渠道引用的测试，不声明完成全面 ASVS 合规认证。

## 来源与许可

- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) / [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) / [Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [APIMart 官方文档](https://docs.apimart.ai/cn)
- [任务状态及费用字段](https://docs.apimart.ai/cn/api-reference/tasks/status)
- [公开模型与价格目录](https://api.apimart.ai/api/pricing/models/all)
- [new-api Task Plugin API v1](https://github.com/QuantumNous/new-api/blob/206e0fa5c600127a314a97f88592c067f784f4a6/docs/plugin-api/v1.md)

AGPL-3.0-only，见 `LICENSE` 与 `NOTICE`。本项目由社区维护，非 APIMart 官方 SDK；开发由 OpenAI Codex 辅助完成。
