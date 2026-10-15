# 持久引导会话

2026-10-15，按[长期计划](guided-skills-boss-plan-20261015.md)推进G1/G2。新增通用conversation节点，为独立个人蒸馏提供多轮访谈基础；求职事实字段和访谈规程归模板，客户端不内置业务提示词。

## 使用与边界

节点创建/读取独立会话后立即返回状态，等待用户不占Run。用户从待办进入，核对指令、已选上下文、模型和自有Key费用，保存输入或发送下一轮；完整成功后才能确认对话。来源流程按confirmed条件读取transcript，再整理事实和Skill。新运行不自动重放外发，确认对话不授予发送权限，也不替代最终Skill确认。

数据与消息见[0.19.0契约](../../contracts/v0.19.0/README.md)。宿主负责加密持久化、单会话请求串行、修订和请求身份、取消、预算与重开；Renderer通过onmessage接收带序号的完整持久化快照，重复/旧事件丢弃，跳号或连接中断按完整快照核对，不拼接失序残片。恢复不自动调用模型。

## Figma先行

在原Section新增8个原生可编辑状态：

| 状态 | 节点 |
| --- | --- |
| 节点配置 | [505:5303](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5303) |
| 对话与输入 | [505:5408](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5408) |
| 生成与取消 | [505:5500](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5500) |
| 未完成与重试 | [505:5588](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5588) |
| 确认只读 | [505:5676](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5676) |
| 修订冲突 | [505:5761](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5761) |
| 消息核对恢复 | [505:5848](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5848) |
| 紧凑会话 | [505:5934](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5934) |

复用原Button/AntInput、文字样式和Semantic Light/Dark。结构检查：268个Frame、222个Text、34个Instance，零图片填充，字体仅Noto Sans SC/Inter；原186与前批场景保留。已读取配置/对话/紧凑的高保真上下文与截图，修正紧凑首卡宽度和多行输入后再看图；有限原型未实际点击验证，不等同可输入/流式功能通过。完整控件禁用、未保存离开与键盘焦点仍需按实施补细并核对。

## 交付状态

当前为治理/契约及Figma批次，待PR与tag发布；客户端尚未采用0.19.0。格式正反例和流程示例通过，只证明Schema格式。未新增/运行单元测试，未使用真实Key或模型。个人工作区镜像、资料解析和Skill最终确认仍属后续契约/能力，不将会话保存在加密数据库等同于已完成工作区落盘。
