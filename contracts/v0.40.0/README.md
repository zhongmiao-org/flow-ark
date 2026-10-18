# P1 契约 0.40.0：可视化操作准备与结果登记

2026-10-19，接续不可变[0.39.0](../v0.39.0/README.md)。新增effect v1节点、effect-node-v1能力和两个严格结果格式；包2.0、SDK1.0、既有effect.prepare/resolve、IPC及SQLite表保持。本候选尚未发布，不提前由消费者采用。先行[八张明暗Figma及实施门槛](../../docs/client/visual-effect-node.md)。

## 节点与输入

两种operation共同包含id/type=effect/version=1、可选name/timeoutMs。字段不能跨操作混用；普通文字和引用由既有变量选择器维护，不要求编辑JSON。

| operation | 必需 | 可选 |
| --- | --- | --- |
| prepare | action：当前入口声明的固定动作ID；key：非空文本或引用 | description：文本或引用；review：null或version=1、target/content文字或引用 |
| resolve | receipt：准备步骤的完整结果或引用；state：作者固定选择confirmed/failed/unknown | evidence：JSON值或引用 |

key最多1000字符/4096 UTF-8字节，非空白；description最多1000字符/4096字节。review.target非空白且最多4096字符/16384字节，content允许空文本且最多100000字符/262144字节。不trim、截断、概括或隐式拼接目标。可选description省略按空说明处理；review省略/null不提供独立正文核对，但不取消confirm动作本身的确认。

只允许既有params/steps/item/index引用范围；拒绝空段和__proto__/prototype/constructor。动作ID与结果state是固定选择，不由模型或运行变量扩大。引用解析后再次校验文本、严格Unicode、字符/字节和结构范围；错误在持久准备或登记之前拒绝。

evidence省略表示无证据，显式null保持；其JSON最多131072字节、32层、10000值节点，键和值均为严格Unicode，拒绝保留键、非有限数字及非JSON对象。证据是模板提供的核对记录，不是宿主证明操作成功；不能把程序返回、点击完成、模型判断或人为选择confirmed当作真实站点/文件回执。

## 准备语义与回执

仅在有效的正式模板入口上下文中执行；实例、入口、不可变Run、包和授权来自宿主，不接受节点输入冒名指定。宿主复用既有effect账本，按准确实例/action/原始key去重，不增加自动重试或新授权模式。

1. 当前入口必须声明该action及effect/effect-node-v1；不存在或deny授权直接阻止，不能因已有回执而绕过当前入口准入。资源及后续浏览器/文件动作仍各自检查。
2. 同键存在submitting/confirmed/failed/unknown任一记录，返回原记录状态及原runId、execute=false，不覆盖首次记录、再次请求确认或重新执行。不同实例/动作仍独立；key的业务组成和版本、对象、账号区分由模板负责，宿主不猜测。不能以自动换键规避未知结果。
3. 新键在confirm授权下通过既有持久人工请求等待，review内容在请求中固定；拒绝、取消或期限在准备落盘前停止，不留下可执行回执。auto不弹确认；节点不能把confirm升级成auto。
4. 接受后复核活动Run、取消及当前入口，再于同一宿主事务检查同键并持久化submitting。只有确实创建了本次记录才返回execute=true；若提交后无法返回，记录按既有Run结束/恢复边界成为unknown，不自动重放。
5. 严格EffectPrepareResult含version=1/operation=prepare、id（64位小写hex）、action、原始key、runId、execute、state。execute=true时state必须submitting，runId是当前Run；execute=false时runId是原记录Run，不能冒称本次已执行。宿主输出前核对实际账本，不采信模型或脚本自报身份。

准备节点只登记意图，不点击网页、发送消息、写文件或证明任何业务成功。模板须把后续实际动作放在execute严格为true的条件分支，再以独立步骤核对并登记；该节点不会自动约束任意未连接的业务分支，也不替代发送前账号/目标/消息/Skill/授权复验。

## 登记、取消与恢复

resolve必须取得execute=true且state=submitting的完整准备结果。宿主复验实际账本的id/action/key/runId、当前实例和入口动作、该Run仍活动且记录仍submitting；不能只检查可伪造的receipt.execute或把记录ID当授权。其他Run/实例、去重回执、终态、伪造或不一致回执均拒绝，不能重写原记录。新增本次登记不支持自动重试；未知只核对原记录。

登记在原宿主事务中把记录转为confirmed/failed/unknown，按既有语义保留evidence（显式null不当作缺失）。unknown建立来源明确的本地待办；通知失败不丢账本/待办，不把通知失败当成重新执行理由。严格EffectResolveResult为version=1/operation=resolve、id及实际state，须与本次请求和已写记录相同；登记回执丢失不能再执行原业务。

准备成功后取消、节点期限、崩溃或Run结束，尚未登记的submitting按既有生命周期转unknown；不能自动标failed或重放。等待人工确认不产生真实外发；等待对方回复仍通过有限批次持久化并释放运行槽。没有新增撤销/删除/重置账本功能，也不抹去原Run/旧记录。

## 能力、作者与采用

流程和准确入口均需effect与effect-node-v1；入口至少声明一个实际动作。prepare.action必须属于该入口及清单；resolve中的实际receipt.action也需属于当前入口。配置非空review时另需human-review-v1。作者与正式ZIP均检查，嵌套条件/循环不能逃过；新节点不因SDK effect能力单独存在就可运行。

普通非模板流程可保留未就绪配置，但正式执行缺模板上下文必须阻止。作者编排副本继续是隔离调试；当前既有作者SDK不具备真实effect执行，新增节点不得静默采用其他实例授权或产生外部动作。若后续扩展作者模拟须另列明确范围，不把模拟计真实提交。

可视化维护操作、动作、key/description、核对target/content、完整回执变量、固定终态及证据。结果使用中文状态、是否允许、原Run来源和后续建议，原始格式仅留高级调试。导出只含逻辑动作/引用/配置，不含账本、授权、确认内容、实际证据或任何本机绑定；未知能力的客户端按现有准入阻止，不自动降为script或升级旧快照。

effect-node.ts只校验格式、范围和输入/输出关联，不实现事务、授权、生命周期或真实业务证明。格式资料及参考核对不等于宿主执行、原生UI、模板全程制作、真实招聘或所有故障通过。build_effect_node.py从固定0.39.0可重建新快照；已封存SHA256SUMS不可覆盖。发布真实tag后再由客户端固定采用，先做虚构本机操作的完整UI导出复导，再由模板作者接招聘动作；暂不登录与原付费重试边界保持。
