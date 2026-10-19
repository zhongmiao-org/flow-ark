# 当前网页字段的正文拒绝位置诊断

2026-10-19，[本人登录校准](boss-real-login-20261019.md)发现真实正文被 `generated-content` 阻止，但结果只列原因，无法分辨目标、祖先或后代。先补现有 Figma，再在网页字段工作区提供独立的“查看拒绝位置”；保持正式 browser v6、`bounded-rendered-text-v1` 及公开 0.42.0 原字节，不以放宽正文规则修复站点。

这是客户端内部的只读 IPC / 临时编辑器交互，遵循[契约分层](../../contracts/README.md#契约分层)，不新增流程节点、业务分支、公共模板能力、数据库记录或平台接口。实现类型不能单独代替下列语言无关约定；客户端独立构建，不读取治理目录。

## 先行 Figma

文件 `sVciNUZHG9yx81gCpYzjH9`，Product Screens 页 `1:3`，原 Section `487:7024`；复用已排版正文不可采用页、FlowArk/Button、AntInput、Semantic Light/Dark 和 Noto Sans SC/Inter。没有 Code Connect 文件，组件从原页面实例确定；六板均为可编辑图层、7 个组件实例、无图片填充，1440×1080。修正组件文字属性后按两主题整图核对。这些是本地字段验证的静态状态规格，不是运行历史新增数据或完整 186 画板验收。

| 状态 | Light | Dark |
| --- | --- | --- |
| 当前元素存在生成内容，解释拒绝位置 | [947:10008](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10008) | [947:10117](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10117) |
| 位置记录达到上限，原因仍保留 | [947:10226](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10226) | [947:10335](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10335) |
| 尚未检查当前定位，不读取旧 Run 的当前网页替代值 | [947:10444](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10444) | [947:10553](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10553) |

## 内部契约 1

方法 `browser.embedded.fields.rendering.inspect` 仅供受校验的 Renderer 通过白名单 IPC 请求，使用原字段拾取的根/框架定位和当前内置网页。它不调用 Worker、模板 SDK、模型、网络请求或任意脚本入口；不导航、滚动、展开或修改网页。定位只支持表单当前静态值，变量尚未解析时明确禁用，不解析为别的目标。

请求为严格对象：`version=1`、`requestId`（非空字符串，最多100字符）、`root={selector,framePath}`、`selector`（字段相对根定位）。每个定位非空、最多2000字符；框架路径最多8层。响应不包含任何正文、DOM文字、原始CSS生成内容、属性、截图或可执行页面代码。

响应为严格对象：

| 字段 | 约定 |
| --- | --- |
| version / requestId | 1 / 准确请求身份 |
| root / selector | 与本次请求逐项相同，不能换根、字段或框架 |
| source | `resourceId`（1–256字符）、`documentRevision`（非负安全整数）；仅用于当前页面身份关联 |
| policy | 固定 `bounded-rendered-text-v1`，不能借诊断改变策略 |
| issues | 既有七种原因，按原策略顺序唯一排列；空列表仅表示本次有限策略未拒绝，不证明完整正文、账号或动作资格 |
| locations | 本次最多32条；每条为 issue、scope、depth、scanIndex、tag、pseudo、contentKind |
| truncated | 因位置记录上限未能列出所有已发现位置时为 true；不是正文截断，不省略原拒绝原因 |
| scannedElements / scannedNodes | 本次同一策略实际访问数量，沿用元素2000、节点6000及祖先64层预算 |

位置 `scope` 为 target / ancestor / frame-ancestor / descendant / unavailable；depth 0–6000，scanIndex 1–6000。已知位置的 tag 只保留最多100字符的安全标签名；无法定位时 depth/scanIndex/tag 为 null，不能伪造目标位置。祖先深度为从目标起的原扫描链距离，框架祖先单独标记；后代为相对目标深度。scanIndex 仅为本次访问顺序，不是选择器、永久元素ID或再次操作授权。

`pseudo` 仅 before / after / null。只有 generated-content 可带 before/after；此时 contentKind 为 whitespace-string 或 other-generated。whitespace-string 仅代表计算样式中一对相同单/双引号内全部为 ASCII 空白且不含转义；其余非空生成内容（包括转义和无法解释的CSS）一律 other-generated。该分类不返回原字符串，也不豁免空白生成内容。其他原因 pseudo/contentKind 均为 null。

诊断与生产读取必须复用同一有限策略、同一扫描与拒绝路径；诊断分支在任何 textContent/innerText/属性读取前返回，只产生原因及位置。位置达到上限后继续原有限策略，保持原因/预算，不能为多收诊断进入隐藏或已拒绝子树。非唯一根/字段、非法定位、预算超限、无法关联文档、导航/刷新/框架或目标替换、关闭、取消、超时均整次拒绝，不返回其他目标或部分诊断。

显示期间使用内部只读方法 `browser.embedded.fields.rendering.status`，严格请求为 `{source:{resourceId,documentRevision}}`（与响应同一格式），严格响应为 `{current:boolean}`。只比较现存资源、显示/加载/占用状态及文档修订，不启动浏览器、返回网址、重新检查 DOM 或持久化结果。不得把 Main→Host 的 review 接口直接暴露给 Renderer。

## 生命周期与普通界面

1. 仅在网页字段工作区、静态根/字段且读取方式为已排版正文时显示“查看拒绝位置”。沿用展开网页、原宿主准入和单操作互斥；活动 Run 须先处于可人工操作的暂停/等待状态，不能抢占浏览器命令。
2. Main 在原资源操作锁内处理，沿用15秒期限及原取消通道，保留准确 requestId。同一文档中固定根、字段DOM身份和文档代次，调用前后复验；完成后再核对资源/显示状态/文档修订。响应经严格格式、请求关系、原因/位置及字节预算校验后才返回。
3. Renderer 按请求身份、字段配置和组件生命周期接收；修改字段/读取方式/根/框架、切换页面、取消或关闭后丢弃迟到响应。显示期间复核内置网页资源和文档修订，变化后清除当前诊断并提示重新检查。不会自动再次采集。
4. 普通结果区按中文列出目标/第几层祖先/后代、标签、原因及 before/after、生成内容分类，可滚动完整阅读最多32条；达到上限明确提示。无原因时显示“本次有限检查未发现拒绝原因”，不能显示“完整”或开启模型/外发。
5. 不把诊断写入流程、模板、Run、来源结果、待办或公开ZIP。旧运行仍只显示原已保存原因，不能反查当前页面补写历史。原生字段验证、既有 v5/v6 及所选 Chrome 的实际执行保持；该编辑器诊断仅在内置网页可用，不冒充其他驱动验收。

## 接续与验收

先完成客户端共享严格格式、Main/EmbeddedPage的同源目标关联与取消、现有策略诊断分支和普通UI。类型/构建/格式及受控真实浏览器观察，与原生UI/两主题/取消和来源变化分别取证；当前不新增或运行应用单元测试。随后打包更新旧应用，保留本人资料、Key和已登录会话，再通过UI核对真实BOSS拒绝位置。不能以设计或诊断成功计作JD完整、账号核准、Skill发布或招聘动作完成。

客户端实现已在独立功能分支完成，类型检查和构建通过。使用项目自带 Electron 的本机合成页面做八项策略观察，正式采集与基线结果逐项一致，诊断分支未读正文；Main/页面联动、同请求取消、互斥、目标替换、导航、面板隐藏及关闭失效另有六项隔离观察。没有新增/运行应用单元测试。这些不替代原生 UI、打包或真实 BOSS 验收。当前安装仍为#323/0.42.0；公开个人0.7.0/BOSS0.2.13、未发布0.2.14局部草稿及完整主线保持。
