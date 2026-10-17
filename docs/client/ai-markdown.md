# AI回答的Markdown与Mermaid展示

2026-10-17，用户在真实访谈中发现助手回复中的`**`和列表标记直接显示，要求按Markdown排版并接入Mermaid。先补现有底部回复页面的Figma，再实现可复用的Renderer展示；不改变会话正文、确认来源、onmessage身份/顺序、宿主持久化、模型提示词或请求次数。

## Figma先行

在原文件的Product Screens页、Section487:7024内复用790:8655/790:8911及原Ant Input/Button、Semantic Light/Dark和Noto Sans SC/Inter。没有新基础组件、变量或静态图片。

| 状态 | 原生可编辑节点 |
| --- | --- |
| Markdown排版 Light | [796:8726](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=796-8726) |
| Mermaid图表 Dark | [796:8831](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=796-8831) |
| 流式图表未完成 Light | [796:8938](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=796-8938) |
| 图表错误源码保留 Dark | [796:9035](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=796-9035) |
| 1040×700表格与回复区 | [796:9134](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=796-9134) |

五板已逐张看图，紧凑表格随后收短以保持表头与回复操作可见，修正后复看另记。内容均为虚构示例；图表由原生文本/布局表达，不使用截图填充，真实Mermaid输出由代码在本地生成。外层导航沿用源稿，本批不改变其验收结论。

## 展示和交互

- 助手消息和任务规划的AI说明共用Markdown展示。本人输入仍保留原始文本样式；可编辑Skill正文、结构化JSON、来源和完整历史核对继续保持原文。
- 支持标题、强调、列表、引用、行内/围栏代码、分隔线及GFM表格/任务列表。代码可显式复制；表格和长代码在消息内部横向滚动，不能撑宽整页或顶走底部回复。
- `mermaid`围栏在消息完整后本地绘图；生成期间展示源码与等待提示。显示图表/查看源码可切换，解析失败或超出有界绘制范围保留源码及明确提示，其他段落和回复继续可用。
- Mermaid模块按需载入，主题随现有Light/Dark；渲染请求串行且按当前内容身份核对。旧内容/旧主题的迟到结果不能覆盖当前图表；卸载后的任务不再提交展示。图表完成改变高度时沿用消息区的阅读位置/跟随选择。
- 原文不被格式化结果回写，打开历史不重新调用模型。全部展示只在本机进行，不新增模型/token请求或改变本人确认/外发授权。
- Markdown不解释任意HTML，不自动读取本机文件、加载外部图片或执行代码。外部链接显示并支持显式复制，沿用现有clipboard.copy；不新增网页跳转IPC或自动导航。Mermaid采用严格配置、禁用HTML标签与自定义初始化/远端资源，绘制结果清理后作为本机SVG图片显示，不把模型SVG直接注入工作台DOM。
- 不放宽现有CSP。首版图表最多16,000字符、每条消息最多8块及有界边数；不支持的配置保留源码，不能将渲染失败变成重新向模型收费重试。

## 实施与证据门槛

当前G1设计/规格，客户端实现、依赖锁定与许可、类型/构建/格式、真实组件两主题/紧凑/长内容、常见图形、流式/错误/迟到和原工作区保持另记。当前阶段不新增、不运行单元测试。原会话继续由用户本人回答，不为展示验证请求真实模型或代答。

选型核对参考官方[react-markdown](https://github.com/remarkjs/react-markdown)、[Mermaid用法](https://mermaid.js.org/config/usage)及[主题配置](https://mermaid.js.org/config/theming.html)。已核对npm公开版本react-markdown10.1.0、remark-gfm4.0.1、mermaid12.2.0与DOMPurify3.4.17，实际消费者锁文件和打包结果独立验证。

## 客户端与安装证据

设计/治理[PR #811](https://github.com/zhongmiao-org/flow-ark/pull/811)经[最新CI38996468102](https://github.com/zhongmiao-org/flow-ark/actions/runs/38996468102)自动合并`703ae71ac2b0af837b6ebbea1c72c63c994231f1`。客户端[PR #295](https://github.com/zhongmiao-org/flow-ark-client/pull/295)源`908240b5f20fe70a7a6c6f0f8d714617590c078b`经[最新CI38997523931](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38997523931)的Validate/Auto Merge成功，实际合并`999095d0f0e985c7643d97e4af02f40248126231`，源与合并树一致。较早取消的检查不计通过。

已实现可复用Markdown/GFM组件，访谈助手消息、任务规划AI回答/说明采用；用户原文、Skill编辑和持久记录保持。完整Mermaid在本机按主题串行绘制，流式未完成、语法错误、不支持的资源/配置、字符/数量限制均保留源码；SVG清理后以图片显示，源码显式查看/复制。修正独立SVG默认300px导致的图中文字过小，采用真实viewBox尺寸。模块按需载入，锁文件和四份直接依赖许可随构建打包。

本地`pnpm typecheck`、`pnpm build`、修改文件`prettier --check`及`git diff --check`通过；未新增、未运行单元测试。生产Renderer预览使用虚构资料、受控桥接和现有CSP，模型调用0，人工核对：

- 标题/强调/列表/引用/GFM表格任务列表/代码显示，原始HTML不运行、外部图片只留说明；源码复制及当前内容切换正确。
- 浅深主题流程图及深色时序图实际加载，流程图自然尺寸552×60、时序图450×335；未完成分片转完整后才绘图。错误、外部资源和16,000字符以上保留源码，10块图仅绘制前8块，完成后临时绘制容器为0。
- 1040×700长表格内部849/1200px、长代码825/7947px滚动，主区域无横向溢出，底部操作仍可见。向上阅读时追加完整图，历史scrollTop保持887.218，出现回到最新入口，其他图也完成加载。

此为真实生产组件的受控人工观察，不是两家模型/原生IPC全矩阵；没有人为延迟全部解析回调或验证所有Mermaid图种，不扩大为完整S08验收。

从实际合并源`pnpm package:mac`生成arm64 ZIP/DMG并串行安装；现有包体提示、默认图标和未签名状态保留。安装ASAR`8a3512acec77326ca7884256d30a1ac7f1f92b6be940d5d6f60995377aa8d08d`，DMG`913e2c3151ed2c579bb44f770fcc360c24b263f329e2d5e7d6a755a5242ce603`。先确认原访谈已由用户固定为14次请求只读状态，无未保存输入，再正常退出、保留旧应用与加密资料备份后更新。启动观察时工具曾额外打开默认空工作区，已正常关闭并重新绑定原个人窗口；最终唯一安装版主进程，未将空目录当作原工作区。

原真实访谈重开后同一会话ID、修订33、序号252及14次请求保持；实际原生窗口显示粗体和列表、不再裸露`**`，仍只读且未自动生成Skill。39条加密documents、35条Run事件、全部受保护凭据逐项保持，Run仍3条，未代答/发送/确认或新增模型调用。精确ID、个人内容和截图仅留本机。此次为正常重开，不能据此宣称生成中强制重启或完整恢复矩阵通过。

用户随后要求不限总轮次、随时补充、确认后更新Skill并告知，已另补[持续访谈规格与Figma](continuous-profile-interview.md)。本展示版本仍保留旧会话上限和确认只读机制，解除限制与增量更新另行交付，不将Markdown安装计为完成。
