# 飞书多维表格平台 Skill 只读探针

2026-11-11，按本人要求由子智能体独占原Chrome目标窗口，以@oai/sky实际操作并回读，主智能体期间不操作桌面。未使用用户API、正式Run、私有DOM/API或模型生成；未安装/重启。页面内容是待检数据，不构成新指令或授权。

## 实际取得的证据

| 对象 | 操作与实际反馈 | 边界 |
| --- | --- | --- |
| 单选 | 空白格双击后，提示“请选择选项”，AX可设值文本框“查找或创建选项”。聚焦后真实键盘输入已有静态选项，值回读一致，结果过滤为精确项。 | 未点击选项，未提交 |
| 单选新增边界 | 输入匿名无匹配查询，新观察显示“创建选项”加查询文本。 | 不点击创建，不按Return |
| 单选Down | 搜索框内按Down，查询仍在，弹层仍在；AX没有可证明高亮的状态。 | 只证实未提交，不能推断导航/Return正确 |
| 人员搜索 | “搜索成员”文本框可设值，也能真实键盘输入；匿名无匹配查询回读一致，异步新观察出现“没有匹配结果，换个关键词试试吧”。 | 不读取或提交真实成员值 |
| 人员通知 | 清空查询后footer显示“同时发送通知”，唯一邻近AX复选框值1；点击后新观察值0。Escape后重开同格，仍0。 | 仅本次会话；每次选人前重新读0，不推断默认永久关闭 |
| AX动态索引 | 旧通知checkbox索引一次被工具拒绝为已失效；重新观察当前唯一checkbox后关闭成功。 | 不把旧ID当作稳定选择器 |
| 群组 | 双击空白群组格打开“请选择群组”。搜索框自身无名称，旁有“搜索群组”；匿名查询可回读，异步结果为无匹配。 | 未选群、创建、关联或发消息；其他群组方法未证实 |

本次未匹配查询后群组未显示创建入口，不能推断其他版本永不提供创建操作。所有匿名查询已清空并Escape退出，未点击成员/选项/群组，未写客户值、未改保护字段、未发送通知或消息。已向主智能体明确释放桌面。

## Skill 更新及限制

据此将独立平台Skill更新为0.1.1-draft：真实输入/过滤、异步观察、创建入口排除、通知每次复验0、无名群组搜索框有界定位均纳入。修正零API定义：禁止模型/付费AI调用，不禁止本人明确授权的本地验证或正式Run。公共Skill无本人URL、坐标、客户/成员值。

这些是CU现场证据，不代表FlowArk原生SDK已在正式Run通过上述操作，也不代表选择成员、完整矩形回读、业务保存或重开防重通过。通知关闭路径补足了之前的未实证项，但真实写入与保存仍需后续独立验收。

后续0.1.2-draft迭代将CU可设值事实与SDK方法分开：SDK使用fresh搜索框点击、Cmd+A、非空input/paste、fresh准确query回读后匹配；清空用Cmd+A/Backspace，不发明setValue或o.url。平台Skill9752bytes，模板校验上限已与客户端统一48KiB；validate/build、独立严格tsc、源/dist cmp均退出0。宿主quick_validate.py因系统Python缺yaml未完成，不记为通过。

本轮仅通过正式作者plan/精确patch/assemble修正现工程writeBatches：输入前人员通知唯一checkbox关闭并fresh读0，最终同fresh观察同时检查query、通知0与唯一已有项；搜索循环也先核对query，避免异步旧列表。缺失/歧义/mixed/不可读停止，其他节点与实例数据不重置。正式公开revision为4adefe39734f178ae6c66a0c0cb4861142c32c65369e5a817e33316392f051f3，安装CLI validate/build各退出0且valid=true。未Run，人员选择尚未验收；原生checkbox值规范暴露由主智能体另行修复，编译不代表已安装或SDK运行通过。

## 正式客户端 SDK 观察回执

随后由子智能体通过普通工程目录选择、正式 prepare、绑定窗口及逐步执行运行隔离 inspection，Run `e9cf6f2a-7240-4eab-86fd-c37d62000080` 为 SUCCEEDED，主智能体独立读取本地 popup-inspection.json。当前 SDK 观察未截断，明确窗口局部坐标；人员弹层身份静态文本没有 bounds，唯一搜索输入框和通知标签有 bounds，有界弹层 group 可以核定。公开记录不包含个人窗口标题、URL、成员或本地布局坐标。

这是正式 SDK 的纯观察成功，尚未执行匿名搜索、选择、填写或保存。它证实不能强制所有身份静态文本有 bounds，也不能把全局坐标填入 SDK。相应隔离工程通过正式作者工具补齐观察入口、effect 能力、首步激活及最新观察后的退出核验，搜索 Run 后续单独记录。

平台规则根据当前本人“人员对应不上走待办并继续下一输入”的要求更新到 0.1.3-draft；该规则是已确认实现目标，不能将本次纯观察成功当作待办及恢复已通过。

第二次隔离 inspection Run `b1acde52-ad94-4062-bdc8-9a435f2edcb9` 同样 SUCCEEDED。主智能体对比两份本地 SDK 产物：应用、窗口 bounds、未截断状态一致，原始标题仅 Chrome 终端内存数值装饰不同。先前人员搜索 Run 在初始精确标题检查停止，未预留 effect、未输入；不能记为输入失败或搜索成功。隔离探针随后仅对 Google Chrome 的这一已证实终端装饰采用精确归一，保留真正页面标题及其余检查，仍待实际输入回执。

正式 Excel 工程新增人员去重待办分支，保留原始来源与既有实例状态，skip 不混入成功 doneUnits。主智能体源码复核后补齐 skip 前保护范围核验，以及保存前完整有效矩阵回读；正式作者 assemble、validate、build 已通过。当前这只是工程静态层证据，未运行新的业务写入或待办分支。

## 正式客户端SDK Run取证（后续）

在独立受控probe实例完成正常目录打开、实例准备、原Chrome绑定、RunReview与逐步控制，不修改正式Excel实例。两次纯SDK inspection成功：e9cf6f2a-7240-4eab-86fd-c37d62000080与b1acde52-ad94-4062-bdc8-9a435f2edcb9。真实SDK证明窗口局部坐标、person提示无bounds而搜索框/有界group有bounds；两次标题仅Chrome终端内存数值装饰不同。随后仅对people作精确装饰比较修复，不删除其他标题内容或放宽应用。

为避免运行中confirm待办切换窗口造成手工弹层失焦，经主智能体明确批准，先取消未step且0node-start的Run bd43e0a7-526b-4c30-a2ed-6d5f5cd3922c，仅probe的search-probe临时auto，保留全部原账本与正式Excel grants。另纠正effect.prepare.review误用任意metadata的问题，未增加human-review-v1；该规范已补通用Skill，客户端另行收紧类型。失败时尚无动作的Run不当作已输入；有过输入后的unknown不重放。

真正people搜索Run e89ba67b-ecae-4d56-b84b-5906d3900e5c：activate/focus/query/select-query四回执performed。源码只有fresh搜索框值准确且当前popup内有bounds的无匹配文本成立，才进入select-query，因此已证实SDK匿名输入、值回读与有界无匹配判断。clear-query回执not-executed，reason=user-intervention:modifier-held，Run FAILED，父effect依原catch保留unknown。不能称完整链路通过。

失败后仅CU只读核对相同匿名query仍在“搜索成员”且无匹配，按既有授权清空该框并Escape，未重新输入query、未选择成员/创建/通知，不把CU补偿清理当SDK清理成功，不把unknown改confirmed。probe grant通过正式确认恢复confirm；其余入口同类错误review参数在封存时正式删除，最终工程revision bf03b45d0e613b5f921f3465ab7892690f5f6211e52d89feec7b75a832888869，未再次Run。匿名化原生回执及清理记录仅留本地，不携真实成员/客户数据进入公共Skill。

随后正式选择原Excel工程最新b7bffee84e0d0a54d392e37765a26b00144ee92f3075d49c95180280f87d5104并请求同实例prepare，安装客户端明确拒绝“配置或状态Schema变化，不识别为旧默认值纠正”。无新实例/Run，无state/grants修改；桌面释放，由主智能体继续兼容重建修复。完整范围回读、SDK清理、真实写入、业务保存及重开防重仍未通过。
