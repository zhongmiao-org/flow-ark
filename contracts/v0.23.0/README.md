# P1 契约 0.23.0：可视化配置与状态

2026-10-15，接续0.22.0。新增通用`context` v1（配置与状态）节点及`template-data-v1`能力，固定本次共享配置、读取实例状态、按修订原子更新状态。正式实例与作者编排副本使用独立宿主上下文，不能让业务作者借脚本才能连接共享字段。包2.0/SDK1.0、已有节点及Value路径语法保持；新数据通过前序步骤的`steps.<node>.value`引用，不新增隐含全局变量。

本批为G1格式与行为规范，发布以实际tag为准。客户端当前采用0.22.0，尚无这些节点或调试表单；设计及后续采用见[配置与状态编排](../../docs/client/template-data.md)。旧发布快照不变，无旧客户端迁移/兼容层。SQLite表布局不变，消费者新增受保护文档种类及显式采用记录，禁止清库。

## 节点与结果

- `configuration`：读取Run启动时固定的共享配置，输出`TemplateDataReadOutput`，revision为配置修订（从1开始）。运行中修改表单不改变当前Run的配置值或Schema。
- `state.read`：读取当前Run固定上下文中最新已提交状态，返回revision（从0开始）与完整value。它是显式读取当前状态，不把先前Run结果当默认参数；多次读取可以取得不同修订。
- `state.write`：value及expectedRevision均为Value。求值后expectedRevision须为0至9007199254740989的整数；新值符合固定状态Schema，成功恰好增加1。整值替换，无隐式深合并，不猜测冲突时保留哪个字段。作者用已有数据/条件/引用节点组成更新，新字段不可用时明确报错。

写入输出包括contextId、宿主生成的operationId、previousRevision、新revision、准确value及提交时间。重复请求返回同一已提交结果，不以当前状态替代当时结果。配置和状态可以是有界JSON，配置表单使用现有支持子集；数据及其来源不包含Key/登录态。节点不调用模型。

## 固定上下文与隔离

`TemplateDataContext`由宿主建立，包含版本、id、owner、配置修订、共享配置/状态Schema、配置值、Schema摘要和创建时间。摘要为UTF-8 canonical({configurationSchema,stateSchema})的SHA256。正式owner固定实例身份、包版本/摘要及入口；作者owner固定checkout/draft/基准修订/入口。id由宿主生成，模型、流程或Renderer不能自选owner/id以读取另一实例。

RunSnapshot可带templateData；有这些节点时必须带有效且已就绪的上下文。宿主按实际流程记录解析身份、固定配置和Schema，经Worker端接口注入；执行核心仍不依赖数据库/Electron。外部直接提交一段形似上下文的JSON不构成绑定授权。没有正式实例或已登记作者副本时阻止节点，不以空对象/其他实例填补。

正式实例同包各入口共享状态存储和修订，不同实例互不读取。上下文Schema/包身份由当前Run固定；写入时再次核对目标仍属于同一不可变包与Schema。状态值和回执经统一加密存储；完整结果经本机受保护的类型结果通道提供，普通日志仍脱敏/有界，不以截断日志充当完整状态。

每个新编排副本另建独立调试上下文，只用作者Schema及显式公开默认值初始化，不读取正式实例配置/状态/Key。默认值暂不符合约束时允许打开副本和调试表单，Run前明确阻断并定位问题。副本的Schema及基准修订固定，后续制作草稿不隐式同步到旧副本。不同入口副本也独立；正式多入口共享状态须在安装后的调试实例验证。

作者通过“调试配置与状态”表单填写本副本的私有配置/状态，以expectedConfigurationRevision和expectedStateRevision同时CAS保存。配置改变时配置修订增加1，状态改变时状态修订增加1；无变化不增加。失败/冲突保留输入，明确读取新值和对照后再保存；稳定requestId重试只返回原保存结果，内容变化须新请求。配置和状态一起校验/一起提交，不能一半成功。保存不执行流程，不授予外发权限。

副本的本机配置/状态、修订、上下文、回执和Run结果均不带回制作定义或ZIP。带回仍只采用步骤和中性参数，原共享Schema保留；公开默认值只能在作者字段页显式维护。流程导出只带节点/Value引用及推导能力/动作，不夹带RunSnapshot.templateData。

## CAS、请求身份与中断

宿主从固定Run及真实节点实例派生稳定operationId，节点循环位置不同则身份不同。`TemplateDataWriteRequest`绑定contextId/runId/nodeInstance/expectedRevision/value；requestSha256为完整请求canonical JSON的SHA256。同operationId不同内容明确拒绝，不覆盖原回执，不把重试变成第二次写入。

写入顺序：校验上下文/授权/Schema和取消状态 → 持久化prepared请求摘要 → 同一SQLite事务检查当前revision、写入新状态和written回执。CAS不符时持久化conflict及currentRevision，不修改状态。事务失败不单独登记written，记录/上报unknown并禁止自动重放。具体SQL/表名由消费者实现，不是跨端契约。

read/reconcile先读取原操作：written只返回原结果；仍在派发中显示待处理；重开后prepared/unknown不自动执行。宿主确认没有活动写入后，依据同一事务的持久记录核对：取得written记录即确认；一致数据库中仍只有prepared且没有terminal提交记录，标cancelled（未提交），由用户另起新运行。数据库不可读、记录矛盾或上下文丢失仍保留unknown并通知用户，不能把观察失败当未执行。查看回执不改变状态值、不创建新请求。

取消在提交前使prepared转cancelled且状态不变；事务完成后取消只能停止后续步骤，已提交写入及written回执保留。Worker超时/进程退出/窗口关闭均不撤销已提交数据。Schema变化、实例缺失、权限撤销或存储故障应阻止新写入并保留可定位的Run/节点记录。

SDK1.0既有state.get/set继续各自语义，不据此声称旧set具备CAS。消费者让所有SDK set、显式调试表单和新节点共用同一状态修订；旧set即使值相同也作为一次成功写入增加1，使已读取旧revision的新节点明确冲突。新实例初始revision为0；已存在实例首次建立修订登记时保留当前状态作为revision0，原子建立且不触发执行/清空/重写值。不得保留绕过修订的内部写入路径。

## 能力、动作与结果边界

Flow声明template-data-v1；正式入口涉及state操作时还声明现有state能力。状态写入推导独立写动作，default deny；使用者按现有deny/confirm/auto配置并在提交前复验。只读配置/状态不隐式授予写权限。作者副本只改其调试状态，运行前检查列出本机持久变化，正常试运行确认后才执行；它不能访问正式实例或扩大浏览器权限。

数据、Schema、请求、回执和表单保存结果各最多2MiB UTF-8 JSON、50000成员、40层；所有有限数值/Unicode/保留键校验在宿主执行。配置Schema另沿用既有12层表单限制；禁止外部引用与自定义$id。不静默截断、安装依赖、读取相邻目录或把状态当作脚本执行。

这些能力不等于业务去重、每日限额、会话接管或外发提交回执已经实现。BOSS动作仍由后续独立契约/模板承载。所有模型调用仍使用用户自有Key，状态节点不内置Provider或业务提示词。

## 资料与采用顺序

Schema新增TemplateDataOwner/Context/State/ReadOutput/WriteOutput/Output/WriteRequest/WriteReceipt/EditRequest/EditResult，并扩展Node与RunSnapshot。示例和template-data.cases.json只验证格式；template-data.ts校验有界数据、Schema摘要、修订关系与请求/回执一致性，不实现事务、权限、进程恢复或UI。

治理源文件/设计经PR发布真实contracts-v0.23.0 → 客户端固定复制/生成类型并实现与人工核对 → 模板采用。消费者须分别核对读/写/取消、两入口/两实例隔离、作者副本私有表单、SDK修订联动、并发冲突、同请求重复/内容冲突、提交前后中断、完整历史、导出复导及原资料保留。格式通过、画稿、CI、安装和业务验收分别记录，不能互相替代。
