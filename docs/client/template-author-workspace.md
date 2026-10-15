# 可视化模板制作工作区

2026-10-15，接续[长期目标](guided-skills-boss-plan-20261015.md)G1/G2。现有客户端能导出单流程、安装和使用多入口模板；template.create是创建使用实例，尚无完整的从零制作工具。本批先补设计及[0.22.0契约](../../contracts/v0.22.0/README.md)，客户端仍采用0.21.0，不据此计作作者工具已实现。

## Figma先行

在原文件、本批Section增加十四个原生状态，复用Button、AntInput、AntSelect、AntCheckbox、Semantic Light/Dark和Noto Sans SC/Inter，原186板与前批设计保留。

| 状态 | 节点 |
| --- | --- |
| 制作草稿列表 | [522:5403](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5403) |
| 基本信息 | [522:5493](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5493) |
| 多入口与编排 | [522:5602](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5602) |
| 可视化字段树 | [522:5715](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5715) |
| 公开提示词与绑定 | [522:5851](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5851) |
| 资源与动作 | [522:5959](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-5959) |
| 入口编排副本 | [522:6068](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6068) |
| 核对带回与提示词冲突 | [522:6159](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6159) |
| 完整包公开核对 | [522:6258](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6258) |
| ZIP保存与复导 | [522:6350](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6350) |
| 导出结果未知 | [522:6447](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6447) |
| 草稿并发与离开保护 | [522:6534](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6534) |
| 从准确包复制 | [522:6626](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6626) |
| 紧凑Dark与未保存编辑 | [522:6724](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=522-6724) |

[结构记录](template-author-design-audit-20261015.json)：十三个1440×1080及一个1040×700，510Frame、447Text、106Instance、299Vector、42Ellipse、3Rectangle，零图片填充，字体家族核对通过。54条实际跨板导航目标有效；尚未实际点击全部原型。Section扩为4480×28640。字段树、公开提示词及紧凑Dark已看全板截图，正文为多行，内容区子项和紧凑底部未越界；有限看图不代表全主题或真实UI通过。

## 设计与契约边界

- 制作草稿、安装包、实例及编排副本独立。制作不执行或调用模型，也不借用实例Key/绑定/权限；调试仍走运行前检查。草稿保存采用修订CAS，失败/冲突保留输入，三选离开并恢复焦点。
- 常用字段通过可视化树维护标量、嵌套对象、数组、选项、必填、约束和公开默认值；共享配置、输入、结果、状态分别编辑。高级JSON可选，不能成为常用表单必经路径。模板配置/状态访问沿用现有SDK；真实编排暴露原生值引用或状态缺口时再补通用能力，不能用业务大脚本掩盖。
- 提示词独立维护公开原文，绑定AI/conversation的instructions。作者内部标记在导出时编成普通正文，同时附带prompts原文及assets/template-author.json；后者仅用于恢复准确编辑关系。映射/原文/步骤逐字核对，无映射的普通包保留独立字面量，包2.0/SDK1.0与节点不变。
- 编排副本保存不自动改写入口。明确带回前核对两端修订/摘要，提示词被手改或节点失效须修正规程或明确解除绑定，不静默覆盖；共享Schema不因带回流程而被替换。
- 附加公开文件/依赖有界保留，生成路径冲突明确失败。每入口资源/动作按作者补充与节点最低要求取并集，默认deny；同名不同类型拒绝。公共文件核对覆盖手写字面量、脚本、README、提示词及默认值，不能只排除绑定就当脱敏完成。
- 导出固定有效草稿和完整包/归档摘要，人工核对后通过系统对话框选位置、独占新建并同步/读回。稳定操作身份与choosing/writing/written/cancelled/failed/unknown独立记录；未知只核对原目标，不重写、覆盖或隐式删除。Main选位置不替代宿主内容/版本/文件检查。

## G1格式证据与后续实施

新增12个语言无关定义、30个正反作者格式资料、5个作者示例及规范校验模块。AJV2020实际核对本批与既有AI/会话/资料/Skill共92个正反格式资料，无不符；19项定义/公开映射一致性核对符合预期。生成的9文件虚构公共包通过清单/摘要/映射校验，步骤正文与公开提示词一致，不含作者内部标记。规范TS模块独立类型检查通过；34份机器文件摘要、治理边界/链接及diff检查通过。这些不是CAS、恢复或UI行为验收；发布以真实tag记录为准，客户端仍需随后采用。

G2补齐固定契约与IPC、加密草稿/CAS、可视化字段树/表单预览、提示词/资源/动作、现有编排器的副本/带回、多入口编译/文件核对/系统保存与未知恢复。再用隔离虚构资料进行原生从零制作→调试→导出→另工作区复导/重新绑定，以及并发、中断和失败核对；源文件、tag、消费者提交、CI、安装和业务分别记录。

没有新增或运行单元测试。真实自有Key、nuwa适配的个人蒸馏、BOSS站点/外发、完整公开复用及186/U01–U12/Agent完整流程目标继续保留。
