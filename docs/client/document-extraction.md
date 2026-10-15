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

新增子树结构：130Frame、110Text、11Instance、84Vector、12Ellipse，零图片填充；字体断言通过。已查看节点配置完整截图，字段与文字无截断。原186画板、前批设计和验收保留；固定跳转原型未实际点击，不等于功能完成。实施前仍需读取相关高保真上下文，补实际检查器与结果页的布局适配、禁用/焦点与紧凑状态。

## 契约与状态

新增[0.20.0契约](../../contracts/v0.20.0/README.md)：document v1与document-extract-v1、DocumentSource/Unit/Warning/Result，以及流程/结果示例和正反格式资料。发布以真实tag与CI合并为准；客户端当前尚未采用，本批不能称支持PDF/DOCX。

格式验证：16个正反例与2个流程/结果示例通过，包含相对来源、定位类型、ready/partial/empty和缺口警告约束。`python3 .github/check-governance.py`、`git diff --check`通过；未新增/运行单元测试。这些仅是协议格式证据，不证明解析库、子进程取消或界面功能。

解析不调用模型、不需要Key；后续对话/整理仍使用用户显式绑定的Key。读取只限明确文件，缺页/空正文和失败独立显示，不自动OCR或静默截断，不把来源定位当作事实正确性。工作区个人Skill、资料集合选择、发送核对和最终版本确认仍需后续能力，不能以单个解析节点替代G3完整路径。
