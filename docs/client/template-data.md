# 可视化配置与状态编排

2026-10-15，接续[作者工作区](template-author-workspace.md)与[长期目标](guided-skills-boss-plan-20261015.md)。实际源码核对：模板SDK的configuration/state.get/state.set已存在，变量选择只提供流程参数/前序步骤/当前循环；作者副本是独立普通流程，未固定共享配置/状态调试上下文。个人蒸馏多入口与BOSS批次需要这些数据，不能通过业务大脚本绕过。

本批先定义[0.23.0](../../contracts/v0.23.0/README.md)与Figma，客户端保持0.22.0，尚未实现新能力。配置/状态节点不处理求职字段或站点逻辑；个人蒸馏规程继续归模板，并参考用户指定nuwa-skill的本地素材/表达/证据/边界方法作适配。

## 交互与语义

动作库增加通用“配置与状态”。在步骤配置中明确选择“读取本次配置”“读取最新状态”“按修订更新状态”；读取结果通过已有变量选择器的前序步骤value/revision引用。写入同时选择预期修订和完整新值，提示整值替换及冲突保留，不静默合并或隐式重试。

作者副本增加“调试配置与状态”入口，使用作者字段树中已固定的配置/状态Schema，初始值仅来自公开默认值。此表单保存的是私有调试值；配置/状态一起校验、双修订CAS提交，保存不运行、不带回、不进入ZIP。未完成字段/JSON、保存失败与并发修订保护保留输入和焦点。正式实例各入口共享状态，不同实例、不同作者副本独立。

Run固定上下文身份、包/Schema及配置，显式状态读取取得当前已提交值。更新必须拿到预期修订；SDK现有set也推进同一状态修订。节点和状态/回执同事务提交，真实中断后核对同一操作；未知结果保持待处理，不重新写入。执行详情区分Run取消与已提交状态，完整数据通过受保护本地结果通道查看，普通日志保持脱敏。

正式实例状态写入有独立动作授权；作者运行前检查列出对本副本调试状态的持久修改。节点本身不调用模型、不读取浏览器或文件，不扩大后续外发权限。

## 本批门槛

已先补读取配置/状态、按修订写入、私有调试表单、表单/运行并发冲突、提交后取消/未知核对、资源/动作要求及紧凑Dark设计，沿用原Figma文件的组件、Semantic Light/Dark与Noto Sans SC/Inter。原186板及验收结论保持。

| 状态 | Figma节点 |
| --- | --- |
| 读取本次配置 | [529:5533](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5533) |
| 读取最新状态 | [529:5639](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5639) |
| 按修订更新 | [529:5745](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5745) |
| 私有调试表单 | [529:5852](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5852) |
| 修订冲突 | [529:5958](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5958) |
| Run取消但写入已提交 | [529:6064](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6064) |
| 原写入结果待核对 | [529:6167](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6167) |
| 运行前检查及授权 | [529:6266](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6266) |
| 紧凑Dark未保存 | [529:6369](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6369) |

[结构记录](template-data-design-audit-20261015.json)：八张1440×1080、一张1040×700；332Frame、300Text、72Instance、189Vector、27Ellipse，零图片填充，字体核对通过。内容区与底部未越界，68条实际导航目标均存在；没有逐条点击全部原型。写入、调试及紧凑Dark全板截图已查看，随后将流程/运行/制作导航选中态按页面所属调整。Section扩为4480×32200，其他画板保留。画稿不等于客户端完成。

G2随后固定契约并实现宿主上下文/CAS、SDK修订联动、执行节点/变量、作者调试表单、运行前检查和完整结果。人工核对配置快照、两入口/两实例/副本隔离、重复及冲突、提交前后中断、重开、公开默认值/私有值导出边界。当前UI/UE阶段不新增或运行单元测试；格式资料和规范模块检查独立记录，不宣称行为已通过。

## G1格式与规范核对

0.23.0新增十个数据定义及一个context v1节点分支，RunSnapshot增加可选的固定templateData。已有定义除Node/RunSnapshot扩展外保持；包2.0/SDK1.0及Value语法不变。现有节点的type/version生成约束保持，新的操作沿用已用的条件字段校验形式。

AJV2020核对本批92个正反格式资料，以及既有AI/会话/资料/Skill/作者资料，共184项，无不符。规范模块另核对合法上下文/状态/编辑/回执、Schema/身份/内容/修订不符、有限JSON/Unicode/连续数组与预算等27项一致性，符合预期；独立TypeScript检查通过。42份机器文件摘要及治理链接/忽略边界另行检查。此范围只验证格式/规范数据，不证明真实CAS、权限或恢复行为；临时核对程序和详细结果仅留本机。
