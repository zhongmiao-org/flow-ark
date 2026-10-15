# 通用资料解析

2026-10-15，接续[长期计划](guided-skills-boss-plan-20261015.md)的G1/G2。现有[任务附件](task-attachments.md)仅支持文本与图片，不能替代可视化流程中的PDF/DOCX资料读取。本批先定义独立document节点，使用已绑定的只读目录与明确相对文件名，返回可引用的正文与来源定位；求职材料选择规程仍归模板。

## Figma先行

沿用原文件与本批Section，新增四个1440×1080原生可编辑状态；使用现有Button/AntInput、Semantic Light/Dark及Noto Sans SC/Inter，未新增主题或截图铺底。

| 状态 | 节点 |
| --- | --- |
| 节点配置 | [509:5337](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=509-5337) |
| 来源与正文 | [509:5425](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=509-5425) |
| partial/empty缺口 | [509:5520](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=509-5520) |
| 失败与恢复 | [509:5603](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=509-5603) |

新增子树结构：130Frame、110Text、11Instance、84Vector、12Ellipse，零图片填充；字体断言通过。实施前读取了配置与结果高保真上下文，沿用现有检查器、Ant Design和主题；结果区窄容器改为单列。原186画板、前批设计和验收保留；固定跳转原型未实际点击，不等于功能完成。完整页面禁用、焦点与异常状态仍需逐项验收。

## 契约与状态

新增[0.20.0契约](../../contracts/v0.20.0/README.md)：document v1与document-extract-v1、DocumentSource/Unit/Warning/Result，以及流程/结果示例和正反格式资料。[治理PR #745](https://github.com/zhongmiao-org/flow-ark/pull/745)实际合并至`ae9d4fcfa2b4ebe89eaa3d53fe11260d472df486`，`contracts-v0.20.0`已推送并核对远端指向同一提交。客户端采用与验证范围见下文，不据此宣称完整个人蒸馏通过。

格式验证：16个正反例与2个流程/结果示例通过，包含相对来源、定位类型、ready/partial/empty和缺口警告约束。`python3 .github/check-governance.py`、`git diff --check`通过；未新增/运行单元测试。这些仅是协议格式证据，不证明解析库、子进程取消或界面功能。

解析不调用模型、不需要Key；后续对话/整理仍使用用户显式绑定的Key。读取只限明确文件，缺页/空正文和失败独立显示，不自动OCR或静默截断，不把来源定位当作事实正确性。工作区个人Skill、资料集合选择、发送核对和最终版本确认仍需后续能力，不能以单个解析节点替代G3完整路径。

## 客户端G2交付

[客户端PR #275](https://github.com/zhongmiao-org/flow-ark-client/pull/275)采用0.20.0及上述治理基线；[最新CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38726083280)的Validate/Auto Merge通过，实际合并`dc7c8925efdaf9623bc1c52d143342b6b9453c93`。较早取消的检查不计通过。本地`pnpm typecheck`、`pnpm build`、修改源码格式与diff检查、21份机器契约摘要核对通过；未新增或运行单元测试。

- 可视化编排：文件动作库增加“解析资料”，配置逻辑目录和明确相对文件名，支持参数/前序输出引用。预检列为只读目录；变量引用、步骤摘要和标准ZIP能力声明同步支持，没有招聘专属逻辑。
- 宿主读取：只读绑定目录的普通文件，拒绝目录越界和最终文件链接，读取前后检查文件身份及变化。原始文件限8MiB，结果限1MiB、50000字符、1000单元和100页PDF；超限失败，不采用截断正文。
- 独立解析：PDF.js处理可读文字，DOCX校验ZIP/XML后提取正文和表格段落，文本严格UTF-8。所需资源随包提供，解析输入只有字节与格式，不含Key或目录绑定。轻量监护进程负责取消、期限和父连接断开后的回收；不将进程隔离称安全沙箱或操作系统级内存配额。
- 结果核对：输出显示来源、原始摘要、ready/partial/empty、缺口与页/段/行定位，完整文本可展开。保留原始结构化输出，不自动发送给AI或视为事实确认。结果归已保存的运行输出，没有新增独立资料库或数据库迁移。

## 人工证据与实际边界

资料全部为本机生成的虚构内容，详细回执与截图只留本机。

1. 真实文件/进程：中文PDF、含空页PDF、DOCX正文/表格、UTF-16 DOCX XML、UTF-8换行及精确字符上限实际提取。空页和修订内容显示缺口，删除内容未混入正文。密码PDF、坏编码、错扩展内容、超大/超长、XML实体/深度、ZIP展开超限、最终链接及实际目录越界明确失败；人工取消后回收确认。这些具体文件不能证明任意PDF/DOCX兼容。
2. Runtime/Worker：只读预检后运行虚构含空页PDF，完成并保存partial来源/正文；关闭重开同一加密存储仍可读原摘要和状态。没有实际修改原文件后重开，不将该场景计通过。
3. 生产组件：配置与结果在Light/Dark及宽/窄容器人工查看，来源定位切换、完整文本展开、缺口提示可见；预览不能调用真实宿主。不是完整原生运行路径。
4. ZIP函数路径：实际导出、写ZIP、重读和实例化，保留document能力与只读逻辑资源，参数清空，包内无资料正文、原文件或本机绑定。尚未由客户端完整可视化制作并在另一工作区导入，不计S05/S06通过。
5. 安装包/原生：`pnpm package:mac`成功；包内真实Electron/监护/解析进程读取虚构中文PDF、两种DOCX与文本，密码PDF停止，证明本次依赖及资源路径可用。旧实例正常退出、完整备份后串行更新，安装摘要与候选一致。原工作区唯一实例中添加资料动作，Dark文档形状与检查器可见；随后撤销恢复原零步骤并返回列表，全部加密文档一致。未在该原生界面保存或执行资料流程；完整原生解析、异常和重启路径继续待验收。

仍缺个人Skill工作区与版本确认、资料集合与明确发送核对、可视化模板完整作者路径及真实自有Key蒸馏/BOSS验收。本批仅补资料提取基础，不改变剩余目标或原186板结论。
