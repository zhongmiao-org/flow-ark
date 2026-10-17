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
