# 任务中的网页元素选择 v1

2026-10-04，设计与消费约定；客户端本地提交 `8d578be` 已接入，原生界面因Mac锁屏尚未核对，不代表验收通过，详见[实施记录](design-implementation.md#2026-10-04-任务网页元素来源接入原生界面待解锁)。衔接 Figma 093 `23:2440` 的对象选择、115/116 的网页查看和117 `23:6221` 的真实目标聚焦，沿用 [网页来源](task-web-target.md) 与 [聚焦约定](embedded-browser.md)。

## 选择及确认

网页任务可选择整页，或通过现有人工拾取选定一个具体元素。选取、原字号聚焦和返回均不启动执行；仅确认后替换任务来源并进入理解页。目标卡、理解页与发送前上下文显示元素标签、类型、定位及框架层级。未确认候选、放弃、离开来源或切换对象不能改写任务。保留同一网页与草稿，来源失效时给出重选提示。

`task.web.preview` 和 `task.web.select` 在原严格参数上允许可选 `pickRequestId`（UUID）。缺省仍选择整页；提供后任何拾取、节点或来源核对失败均失败，不回退整页。Renderer仅提交任务id/revision、拾取请求id及宿主签发的token，不能提交元素描述、原生身份或页面证明。

Main内部 `browser.embedded.task-element.capture {requestId}` 复验真实候选的原生节点身份、文档及描述，返回 `{page, element:{requestId,target}}`。target仅包含已有RepairSelection的selector、framePath、label、tag、inputType、structural，不含输入值、DOM内容或下拉选项。Main在当前资源内保留对应原生节点身份，不向Renderer、模型或持久化输出backendNodeId/session。捕获后可取消拾取浮层；已捕获引用与浮层分离。后续捕获同一requestId必须复验原引用，不能重新绑定替代节点；新文档/资源不能恢复旧引用。每份资源最多保留128份当前文档引用，超限明确重开网页，不静默驱逐仍被任务使用的引用。

Host在任务/运行准入无变化的前提下构造并复核页面与元素令牌。选择保存到既有加密任务的 `webTarget.element`，同时进入采纳后的FlowRecord及不可变版本/快照。它仍是只读选择；替换/移除沿用任务revision递增与旧提案撤销。JSON文档增加可选字段，不改SQLite表或公开流程协议；既有无元素的整页选择语义不变。

## 规划和执行

模型上下文只包含已确认元素的可读标签、类型、selector和framePath及明确范围，不发送requestId或原生身份。发送前展示完整上下文，用户仍需确认供应商和内容。

元素任务允许browser read/wait且静态selector、framePath必须与选取一致；不允许navigate、其他定位或网页写入。其他value/assert/condition/loop/human及独立授权的文件输出沿用整页只读约束。模型输出、手动修改、采纳、运行准入和每个步骤均复核，不能扩大为整页读取或通过重开同URL复活元素。

Main内部 `browser.embedded.task-element.verify {page,element}` 根据资源中的原生身份复验，不从Renderer描述重新采信节点。选中网页执行接口另携带该element引用，在同一操作占用内读取前后复核；中途替换、导航或消失则不采用读取结果，后续文件步骤不执行。业务操作不自动重试。重启后仍可展示保存的元数据，但新的资源没有原生引用，必须重新选取。

## 验收边界

先核对主页面及单层跨源框架的真实拾取→聚焦→确认→理解与上下文，整页入口仍可用；同名替换、取消、切换任务/标签、迟到回执不能恢复旧选择。核对限制其他selector、框架和navigate的静态检查以及实际只读执行，后者不能由模拟AI或布局预览代替。当前阶段不新增/运行单元测试，按用户约定保留类型检查、构建、格式和人工界面核对；未执行项目如实记录。
