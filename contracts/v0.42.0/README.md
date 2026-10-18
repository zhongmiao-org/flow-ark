# P1 契约 0.42.0：已保存入口结果的显式绑定与读取

2026-10-19，接续不可变[0.41.0](../v0.41.0/README.md)及治理[#895](https://github.com/zhongmiao-org/flow-ark/pull/895)的[24张先行Figma](../../docs/client/run-result-binding.md)。本版目前是正式候选，**尚未发布、客户端不得提前采用**；实际PR合并、完整树及机器资料核对后才建立真实contracts-v0.42.0。包2.0/SDK1.0保持，增量能力run-result-read-v1须由客户端明确识别，不支持时阻止，不降级为原值或显示摘要。

权威语言无关定义在[p1.schema.json](p1.schema.json)的RunResult命名空间；[独立wire](run-result-binding.schema.json)与其对应定义一致。新增Node分支、模板/作者run-result资源及sourceEntries、RunSnapshot.resultSources；只读节点只有version1/read/binding，不接收Run ID/路径/latest/Schema/执行开关。新资源仅access:read且sourceEntries须是同定义真实入口；公开声明与本地绑定/快照分开。`{result:ref}`是私有资源slot；resultSourceChoices仅本次已有CAS保存IPC的可选许可映射，不持久化许可。

[格式/归属资料](run-result-binding.cases.json)、[目录/私有关系资料](run-result-binding.semantic.json)、[合成过滤资料](run-result-credentials.cases.json)和[参考](run-result-binding.mjs)不能证明真实来源、秘密集合、宿主事务/单调时钟、UI或模型/招聘通过。可用`node contracts/v0.42.0/check-run-result-binding.mjs /absolute/dependency-directory`核对，只需已有AJV 2020依赖，不导入应用运行时。消费者仍须独立采用发布快照、生成类型、接宿主/Worker/普通UI及准确运行验收；当前#321安装和公开个人0.7.0/BOSS0.2.13不因候选改变，没有原本人访谈/Key/最终Skill/招聘动作。

正常路径：作者在客户端声明资源/来源入口、添加通用节点；使用者在参数与资源中从本实例目录完整阅读、选择准确结果，再保存。完整数据普通展开/加载更多，JSON仅可选高阶详情。无固定模板/作者身份的普通流程及跨owner共享不属于本版，须明确阻止；完整Agent目标保持，后续另行定义授权，不称已全面接通。

正式实例只选同一instance及相同packageKey/digest的声明入口；作者只选同一draft可核验的固定SDK来源，允许旧修订、不借当前checkout伪造来源。仅SUCCEEDED且完整复用副本可用；旧显示投影不可逆推原值，不回填旧Run或读取Key重建。引用不证明页面当前、事实准确、账号或外发权限；业务规则继续归独立模板。

## 数据策略、宿主状态和保存协议

本规范与主Schema及独立wire共同约束本版。纯参考不会创建真实宿主来源、权限或事务；真实发布前客户端不得采用。先行24张Figma没有因本次格式补全新增交互。

## credential-redacted-v1 的确定算法

1. 输入必须是完整JSON。沿0.41.0 canonical：对象键按UTF-16码元排序，数组保序；字符串不作Unicode归一化，JSON转义（包括孤立代理码元），UTF-8字节取JSON编码之后的字节，-0编码为0。拒绝非有限数字、undefined、稀疏数组、非普通对象、循环或超过64层。先核对原值canonical不超过196608字节，再做递归Schema验证/过滤；不截断原值。读取响应整个canonical不超过524288字节，先预算再递归格式校验。
2. 原授权Run的最终已知秘密集合最多256项，包含每个非空字符串；每项原UTF-8最多16384字节，总和最多65536字节（去重前计算）。不忽略短秘密；任何无效项/超限均不提供复用，不影响原始Run/结果保存。集合仅瞬时存在，不持久化、不写日志，不从凭据库补读。去重后按UTF-16长度降序、同长度按UTF-16码元升序处理。
3. 字符串先依上述次序逐项把全部非重叠、区分大小写的秘密子串替换为空串，再依次删除以下模式的全部非重叠匹配。模式按ASCII集合解释：`(?:sk[-_]|ghp_|github_pat_)[A-Za-z0-9_-]{8,}`（前缀区分大小写）；`Bearer[ 空格或水平制表符]+[A-Za-z0-9._~+/-]+=*`（Bearer忽略ASCII大小写）；三段`[A-Za-z0-9_-]{8,}`以点连接，首段前一UTF-16码元不得属于`[A-Za-z0-9_-]`（串首允许），避免长连续字符上的重复回溯。其他两种模式没有边界断言；不是所有未知秘密的检测器。
4. 删除可能拼成新的秘密（如秘密ab、原aabb）。重复完整轮次直到不变，最多64轮；第64轮仍改变则整次拒绝，不返回部分内容。空串替换保证不引入含秘密的占位符；不使用可能与秘密相撞的固定中文遮蔽词。
5. 对象键先用步骤3–4处理；键有变化时整次拒绝`credential-in-key`，不改名、不生成匿名键、不合并碰撞键。否则原键保留。将字段名仅做ASCII A–Z小写化，再删除ASCII下划线、点、连字符、空格及水平制表符；不作NFKC、不删除其他Unicode字符。若归一化键准确等于以下之一，整个值替换为空串：apikey、apisecret、authorization、proxyauthorization、accesstoken、refreshtoken、idtoken、bearertoken、password、passwd、secret、clientsecret、credential、credentials、cookie、setcookie、privatekey、signingkey、sessiontoken、密钥、密码、凭据。其他值递归处理，数组保持位置，null/boolean/有限数字保持。
6. `conversation`、`facts`、`content`、contact及tokenCount等不在上述集合内，不因名称整体遮蔽；其中已知秘密/模式仍按字符串规则过滤。原型同名键也是普通JSON自有键，参考用自有属性定义，不通过赋值触发原型setter；业务Schema或包现行限制仍适用。
7. 完整原值必须先通过固定完整业务Schema；过滤后再次按**同一Schema**校验。必填、类型、const、pattern等任一失败均不可复用，不删必填、不改Schema、不猜补。`dataChanged`比较前后canonical，dataSha256/dataBytes只描述实际交付过滤副本。原值/记录/快照摘要只归加密私有核对。
8. 所有公开元数据、来源及注解也使用相同文本规则。正式source的entryName可保护（为空时不提供副本）；其他来源字段必须保持准确值，任何保护改变其值均拒绝。索引名称可为空，不能返回保护前标题。标签沿0.41.0明确归属/存在的RFC6901规则；路径必须准确指向交付值，label/description保护后为空则省略对应注解并标labelsComplete=false，不返回旧私有路径。Schema不返回Renderer，不对它做保护后执行。

[过滤参考](run-result-credentials.mjs)仅为上述变换的确定参考，固定Schema两次校验、元数据和来源/标签边界由宿主负责；参考函数返回结果不构成已获授权的可复用副本。

## 原Run登记与目录

原Run完成收尾时，在清除已获准秘密集合之前，先核对固定快照/执行版本、准确template-result或author-sdk-result及完整Schema；完整Schema限64KiB并在解析前检查，包沿既有20MiB压缩/100MiB解压/512文件限制。异步I/O后再次核对全部来源，最后秘密集合快照之后不再await；失败/取消/活动Run不登记可执行来源。此处复用0.41.0准确历史核对原则，不能调用依赖当前作者checkout的执行准入来替代旧来源读取，也不放松真正执行的准入。

成功时用同一宿主事务写加密KV `run-result-reuse`（准确runId唯一键）及拥有者范围小索引 `run-result-index:<ownerDigest>`。ownerDigest仅由可信owner的canonical SHA256产生，不接收任意namespace。正式owner含instanceId及固定packageKey/digest，作者owner含draftId；索引原始登记位置由Store持久顺序提供。不可用且安全元数据可证明时，仅登记固定原因行；未知或秘密身份无法保护则不登记行。相同Run重复收尾只允许核对原记录，不覆盖旧证明，不自动重建。

Proof保存wire定义的原快照/完整原值/原来源/原结果记录摘要、过滤副本和准确ref、finalized/finalSecretsComplete、策略和proofSha256。proofSha256是排除自身后的完整canonical SHA256；不是签名或授权，私有宿主来源仍须证明。ref.run必须等于proof.run，数据摘要/字节须一致；Schema摘要位于固定source。私有proof/index不得由IPC或Worker传入，不含秘密集合。登记事务失败/unknown时无可用声明，读回准确记录核对才可使用；不改变原业务Run终态/结果，也不以索引存在充当完整校验。

目录通过拥有者范围索引分页，每批最多20行，先核对owner/允许入口，再按不区分ASCII大小写的entryName/entryId/run.id字面包含query过滤；不作Unicode归一化，空查询匹配范围内全部。query最多200字符、最多800 UTF-8字节。空页仍可有next，说明已扫描有限一批；位置严格向前。不存在其他拥有者标题、Schema、结果值或原错误回传。candidate仍须预览完整核对；旧Run无index不会出现，没有补写或自动重跑。

## 目录、预览、选择与保存

`resultSource.list/preview/select/inspect`严格使用wire定义；宿主按target实际解析当前owner/保存revision/完整定义/声明资源，计算其完整指纹targetSha256。普通无模板/作者身份的目标明确拒绝。本版不支持跨实例、跨包版本、跨author draft或formal/author混用，名称相同无效。允许同作者较早固定修订，不使用当前定义替换其旧Schema/来源。sourceEntries只能引用同定义实际存在的入口，最多64个；入口上限50保持。

首次list固定可信索引ceiling，后续cursor含随机cursorId及固定targetSha256/binding/querySha256/ceiling/before。cursor必须和宿主登记的准确完整cursor相同，不能只信调用者摘要；ceiling不得超真实上界，before不得超过ceiling+1。页扫描最多20，next.before严格小于上次before；宿主登记位置决定次序，墙钟不证明因果。cursorId、reviewId、choiceId均为密码学随机32字节的小写64位hex，不可预测；readStamp只是响应完整性摘要，不能代替许可。

预览只接收准确target/binding/runId，先过滤本owner/允许入口再读取完整来源、Schema、原值与私有证明。跨范围猜ID统一source-unavailable，不泄露其存在/标题。只SUCCEEDED、最终已知秘密副本及完整二次Schema核验通过返回available。available含完整value、labels、ref、reviewId、expiresAt/readStamp；unavailable不含值/原错误。返回前再次核对源记录、目标revision/指纹及存储状态，不能拼接不同读次。完整Schema仍用固定原版，禁止外部引用、下载或执行；引用及HTML/脚本/模型命令只是数据。

Review/choice/cursor全部归宿主当前进程的短期内存许可池，共最多512个未过期句柄；期限按宿主单调时钟从创建起最多600000ms，`expiresAt`只供UI提示，墙钟跳变不延长许可。重开池清空；到期/目标变化/数据变化/取消已撤销的许可拒绝。满额先清理到期项，仍满则明确错误，不复用或自动确认。下一页可消费其准确cursor后登记新cursor，不因翻页无限积累。来源数据/原Schema不复制进许可，许可固定ref/proofSha256及准确目标。

select接收准确reviewId/readStamp及reviewed:true，重新核对源/目标/许可，创建choiceId并将ref返回本机表单草稿；不保存、不创建Run、不执行源入口。相同未过期preview可重复选择同一准确来源，旧选择不转移至新目标；不能通过模型文字伪造用户点击。inspect**仅查看当前目标已保存的绑定**，不接受任意ref/Run；未保存预览继续由原preview结果阅读或重新预览，不能借inspect扩大范围。

沿现有保存IPC/CAS额外接收可选`resultSourceChoices:SaveChoices`（binding→choiceId），它只属本次保存请求，不写入Bindings/实例/公开定义。新增/变化的`resources[binding]`必须是严格`{result:ref}`，且宿主有匹配该目标保存前指纹、binding、准确ref及proofSha256的未过期choice许可。未改变的既有绑定无需反复点选，但保存时仍检查其声明/格式和引用完整性；移除绑定不要求选择许可。其他资源字段不能混入此slot，其他kind禁止带result；target revision和当前完整保存文档同时CAS，所有变更及依赖登记原子完成。失败保留旧绑定，unknown先读回实际保存状态核对；正常保存后清理对应选择许可。没有许可的高级JSON不能成为授权旁路。

## Run固定与维护

新Run准备时准确读取每个声明使用的result资源，校验当前绑定、来源成功/完整proof/Schema及先行登记顺序。快照的可选`resultSources:PreparedSources`固定binding/ref/owner/proofSha256/registeredPosition；映射键等于binding、来源run.id不等于消费者Run、可信登记必须在消费者准备前完成。该字段纳入executionVersion的canonical摘要；没有资源时省略，旧Run不改写。快照不带choice/review、原值/秘密集合，不在公开包内。没有resultSources却执行读取节点时拒绝，不回填。

Main向受控Worker交付节点请求时，宿主核对活动Run、当前准确节点及声明、不可变快照、当前保存绑定仍允许相同ref，再校验固定来源与证明；只交付该节点Read，无目录/任意Run接口。异步后和交付前复核当前目标/绑定、取消/租约/源身份，撤回或变更则停止。新读取不隐式依赖“最新”，已读数据、已发模型/网络和外部动作不可撤回；停止活动Run需取消。旧Run和历史读取保持不可变，既有状态写/effect/浏览器当前权限检查继续适用。

流程/实例、所有不可变版本/Run快照、计划及作者调试引用都计入来源Run/包/proof/index保护；当前解绑不能解除旧引用。正常维护不得删仍被引用的记录，显式外部丢失则后续读取拒绝，不补源/迁移/重放。没有新增数据库表或启动迁移，也不虚构删除UI。公开ZIP、作者带回和新实例不包含私人ref/resultSources/许可/proof/index；只保留逻辑资源/sourceEntries/节点/能力。复制实例必须清空result绑定，重新由使用者在UI选择自己的来源。

## 格式与失败边界

请求和值先核对完整canonical预算/深度再递归格式校验；read/available/selected/inspect的readStamp按移除该字段后的完整响应canonical SHA256计算。List没有readStamp，准确cursor还需内存许可、目标指纹与有限索引核对。所有回应都须匹配target/binding，前端按当前请求序号/目标/binding归并，迟到不能覆盖新选择或保存；关闭/换目标取消本地请求，不能依靠一次JS回调顺序保证正确。

固定reason见wire；source-unavailable合并越界/缺失/无法证明，source-not-succeeded、reuse-unavailable、schema-invalid、result-invalid、read-limit、privacy-unavailable、changed-during-read、storage-unavailable只在已获准范围内用于可读失败说明。原始路径、AJV错误、异常及私人Schema不回传。Read的schemaValidation:passed只证明固定结构，SUCCEEDED只证明Run终态；均不证明事实准确、网页当前、招聘账号或外发成功。

新的run-result-read-v1声明贯穿流程、入口、资源、包/作者校验与Worker白名单；旧客户端不识别时明确阻止，不静默丢节点/资源或降级为原始值。包2.0、SDK1.0保持，不增加任意SDK历史读取。执行模型仍是可信脚本，公开包还须作者核对，不声称有OS沙箱或通用秘密外流检测。无模型请求或费用的list/preview/select/save/inspect不得自动启动源Run；真实模型只能后续显式运行且使用用户自有Key。

## 发布与消费

本快照由build_run_result_binding.py从固定0.41.0及本次评审草案重建。SHA256SUMS封存后不可覆盖；README中的候选描述保留封存时含义，实际发布/采用证据写治理记录，不改旧机器快照。必须先实际PR/tag，再客户端独立采用；完整G3–G5/S01–S08/186/Agent、本人付费失败片段的既有授权、暂不登录和真实招聘边界保持。
