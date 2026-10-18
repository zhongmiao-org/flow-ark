# 通过UI选择前次入口结果

2026-10-19，状态：先行设计与未发布契约草案，尚无客户端采用、安装更新或实际结果复用。前置[0.41.0普通只读结果](entry-result-view.md)已由#321交付，但普通显示投影不能作为完整业务来源。本批发现BOSS内部草稿的conversationKey等身份会被现有显示策略遮蔽，先定义独立受保护复用数据，再实现绑定；不能以复制JSON/私人Store或大脚本绕过。

## 使用路径与完整边界

作者在模板“资源与动作”声明只读结果资源及允许的来源入口，在编排添加通用读取节点。正式使用者在参数与资源中打开本实例目录，预览准确Run/入口/版本/数据范围，明确选择并保存；模板只接收已绑定资源，不枚举其他实例。制作副本同样操作，但只在同一作者草稿范围，不伪装正式实例。

完整值采用普通可展开数据阅读区：对象/数组逐层展开、加载更多字段，完整数据不因摘要预算而只能查看JSON。输入框、下拉框、取消/返回、保存及失效提示复用既有组件；未选择/超限/旧副本不可复用时明确阻止依赖运行。普通查看不额外反复确认；选择和保存针对本次准确资源，运行及外发仍有自身既有检查。

详细私有副本、凭据过滤、完整Schema再次校验、目录与许可、CAS/迟到、当前绑定撤回、不可变旧Run、引用删除保护、公开导出解绑、恢复与费用边界见[未发布规范](../../contracts/drafts/run-result-binding/README.md)。这份规范仍须固定过滤算法和机器正反资料，再发布正式契约；不能据设计提前加入客户端能力白名单。v1仅正式模板/固定作者SDK来源，普通无身份流程及跨拥有者共享需另行契约，不冒充整个Agent目标已完成。

## Figma先行

沿用唯一文件sVciNUZHG9yx81gCpYzjH9的Product Screens页1:3。未发现对应Code Connect，已读原来源绑定827:8889/8979及只读结果862:9027的实例、字体、变量、文字样式，再复用Button/AntInput/AntSelect、Semantic Light/Dark、Noto Sans SC/Inter与原生自动布局。没有新增设计系统、业务客户端页面或整页栅格。

画板目录由下方机器记录固定。首轮截图发现新容器默认填充和语义颜色回退问题，按既有变量值与透明容器修正；随后修正说明文本的HUG换行、多行全文和紧凑版继承固定尺寸，内容区独立滚动、操作区保留。所有新图均须完成整图查看后才记设计核对；静态设计不代表可点击原型、客户端或业务通过。

| 状态 | Light | Dark |
| --- | --- | --- |
| definition | [936:9918](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-9918) | [936:10031](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10031) |
| picker | [936:10144](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10144) | [936:10260](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10260) |
| preview | [936:10376](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10376) | [936:10488](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10488) |
| bound | [936:10600](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10600) | [936:10712](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10712) |
| stale | [936:10824](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10824) | [936:10933](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-10933) |
| unavailable | [936:11042](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11042) | [936:11151](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11151) |
| author | [936:11260](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11260) | [936:11375](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11375) |
| node | [936:11490](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11490) | [936:11608](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11608) |
| read | [936:11726](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11726) | [936:11838](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11838) |
| exported | [936:11950](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-11950) | [936:12062](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=936-12062) |
| compact-preview | [940:9992](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=940-9992) | [940:10082](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=940-10082) |
| reader | [943:9996](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=943-9996) | [943:10090](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=943-10090) |

共24张可编辑图，22张1440×1080、2张1040×700；均已整图查看，实例/文字/语义主题保留，没有图像填充或原继承跳转。紧凑版正文702×240独立纵向滚动，固定操作区702×108。范围与节点见[机器记录](run-result-binding-design-20261019.json)。这些是本能力的先行状态，不能计作原186张完整验收。

## 接续与验收

1. 正式G1同时覆盖资源/节点、ref/完整读取、固定过滤算法、包/作者校验、私有登记和运行快照；不修改已发布0.41.0，不把客户端类型当语言无关协议。
2. G2接入现有模板作者/参数资源/动作库/变量选择器/普通阅读，不要求Run ID、路径、JSON游标或编辑公开包。小型目录索引、最终副本与选择许可归宿主；模型/脚本不获得任意历史接口。
3. 真实原生UI核对同实例/同作者、其他拥有者拒绝、声明入口/失败/活动/旧记录、取消/过期/并发/迟到/未知保存、0/false/null、秘密字段与过滤后Schema失败、192KiB/完整展开及持久重开。受控参考不能替代这一层。
4. 作者UI制作/原始ZIP导出及独立使用者只配置自己的资料/Key/资源、自己的来源运行与绑定；新实例未绑定、旧历史受保护。再接BOSS来源/草稿/预留/effect/实际回执，不能以只读引用代替发送。

本批#321安装版、公开个人0.7.0/BOSS0.2.13保持，原本人247文档/94事件/2保护文件/7Run/31流程与22来源索引不作编辑；没有模型、重试、最终Skill、BOSS登录/权限或招聘动作。完整G3–G5/S01–S08/186/Agent继续。当前阶段不新增或运行应用单元测试。
