# 通用操作记录节点

2026-10-19，继续[个人蒸馏与BOSS计划](guided-skills-boss-plan-20261015.md)。当前客户端#318/契约0.39.0、公开个人0.7.0/BOSS0.2.9保持。源码核对：templates/service.ts已有effect.prepare/resolve及Run结束未知处理，但动作库/节点格式尚无独立操作记录节点。外发主线不能只停在内部草稿；先将持久准备/去重和结果登记变成可见通用步骤，再接模板实际动作和真实账号核验。

## Figma先行

原文件sVciNUZHG9yx81gCpYzjH9、页面1:3、Section487:7024；复用配置与状态529:5533的布局、Ant Input139:2、Button1:146/1:148、Semantic Light/Dark及Noto Sans SC/Inter，不新增组件/变量或客户专属业务界面。

| 状态 | Light | Dark |
| --- | --- | --- |
| 准备操作、声明动作与去重键 | [927:9756](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9756) | [927:9862](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9862) |
| 可选人工核对目标与完整内容 | [927:9968](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9968) | [927:10074](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10074) |
| 登记本次准备回执、状态与证据 | [927:10180](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10180) | [927:10286](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10286) |
| 命中旧记录、结果未知停止 | [927:10392](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10392) | [927:10498](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10498) |

每板1440×1080、37 FRAME/35 TEXT/9 INSTANCE/21 VECTOR/3 ELLIPSE，无图片填充，原型继承连接已清除；Section扩为4480×112000。首次整板发现组件属性管理的旧文案未正确覆写，改用TEXT组件属性后重新看全部八板，旧配置读取文案已清除，字体明确核对Noto Sans SC/Inter。当前是可编辑静态状态规格，不把示意按钮或设计稿记作实际导航、客户端实现或业务通过。

## 通用范围与消费者门槛

[0.40.0候选](../../contracts/v0.40.0/README.md)定义effect v1 prepare/resolve、effect-node-v1和严格回执。准备不执行；同实例/action/key只创建一次submitting，同键任意已有状态execute=false，包括失败/未知。需要确认时使用既有人工核对，取消/期限不重试。登记只接受宿主实际账本中本实例/当前Run尚提交的本次记录，核对完整action/key/runId，不信任参数自报execute；confirmed/failed/unknown不是模型自行扩大权限的输入。

实际动作仍需条件分支、独立浏览器/文件节点和业务回执；此节点不证明站点、对象、内容正确，不能兜底错误连接。key的账号/对象/消息或文档版本组成归模板，不能自动换键重放unknown。授权/快照/取消检查复用宿主，不改变旧SDK1.0或账本表；公开导出无确认、真实证据、授权或历史。

客户端随后固定真实发布tag，补动作库、普通字段/变量配置、嵌套能力检测、宿主桥接和中文结果；入口无声明动作或未授权时阻止，非模板及作者副本不得偷借真实实例。需要局部复用既有模板SDK内部实现时，仍检查当前执行owner、活动Run和持久回执，Renderer不能直接写账本。

实际验收须通过UI制作“准备→execute条件→有界本机虚构操作→核对→登记”，原始ZIP导出、空工作区自行导入/授权；分别核对新键、同键跨Run/重开、deny/confirm拒绝/取消、失败/未知、回执不符/跨Run/终态、准备后中断及回包丢失。无新增/运行单元测试，保留类型/构建/格式及有意义人工运行。正式BOSS动作、登录/JD/会话校准、发送前复验、日限额和真实回执仍独立实施，不以通用节点或虚构文件操作代替。

本批只完成先行设计和契约资料，尚未改变客户端/模板或调用真实模型、写状态、登录或招聘外发。G3–G5/S01–S08/186/Agent目标、原付费重试待批准及暂不登录边界保持。
