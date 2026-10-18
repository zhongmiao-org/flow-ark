# 模板 SDK 1.0

模板脚本 default export 一个 async 函数，参数为宿主提供的 SDK。脚本运行于独立受监督进程，面向可信代码；这些接口不是系统级安全沙箱。

既有 input、signal、logger.info、progress、artifact 继续存在。新增 template 接口由当前脚本调用身份推导实例、入口、Run、版本与资源，脚本不能自行指定其他实例或 Run：

| 接口 | 行为 |
| --- | --- |
| configuration() | 读取运行快照中的实例普通配置 |
| resource(path) | 读取当前已固定包内 UTF-8 静态资源 |
| validate(schemaPath, value) | 以包内 Schema 校验业务输入或结果 |
| browser(resourceId, command) | 通过统一 BrowserDriver 操作绑定浏览器，url 命令支持观察导航；不返回原生对象 |
| file(resourceId, operation) | 在声明且绑定的文件/目录中读写；输出通过产物接口登记 |
| ai(resourceId, request) | 使用本地绑定的 Provider、model 和受保护 Key；模板只传 instructions/input/schema |
| state.get()/state.set(value) | 宿主读写当前实例状态，按 stateSchema 校验 |
| human(request) | 持久化待办，等待用户输入/确认，可取消；结果限定本次 Run |
| attention(request) | 幂等建立本地待办，系统通知失败不丢待办 |
| effect.prepare(request)/effect.resolve(request) | 原子去重、提交前落盘、记录 confirmed/failed/unknown；未知不重放 |
| result(value) | 按入口结果 Schema 校验并记录结果 |

已通过入口结果 Schema 校验并保存的 `result(value)` 是显式入口结果；完成阶段仅在准确 Run 的结果记录不存在时才采用流程输出。`null`、`false`、`0`、空文本、空对象和空列表均是已保存的 JSON 值，不因空值含义被步骤输出覆盖。结果仍须按固定入口 Schema 校验；保存结果不代表业务操作成功。此说明澄清既有 SDK 语义，不新增字段、持久化格式或动作授权。

宿主在每次 RPC 前后核对脚本 owner 和取消状态；只读入口不会因其他入口需要 AI 而被要求提供 Key。准备副作用必须引用入口声明的 action，执行结果核验由模板负责。SDK 不实现网站选择器、招聘状态或事实推理。

AI 供应商接入使用通用 AIRequest/AIResult，不包含求职提示词。完整 JSON 返回后进行 Schema 校验，截断/错误不使用、不静默重试或切换模型。实例配置和授权修改不改变活动快照。

## 请求与结果字段

- `file(id, {operation:'read'})` 读取文件；目录还需 `name`。写入请求为 `{operation:'write', name?, content}`，UTF-8 单次最多 10 MiB。绑定目录中的符号链接不能越界，输出同时登记为运行产物。
- `human({title, description?, schema?, review?})` 等待最长十分钟；取消、超时、宿主退出后原请求失效。`template.answer({id,value})` 仅响应当前仍在等待的请求。可选 `review:{version:1,target,content}` 由模板提供完整的核对目标与拟执行文本；使用时入口还须声明 `human-review-v1`。宿主校验并固定保存，界面不从说明文字猜测。字段限制与边界见[契约0.16.0](../../contracts/v0.16.0/README.md)。
- `attention({key,title,detail?})` 使用实例内去重键。按[0.26.0](../../contracts/v0.26.0/README.md)，宿主将当前Run、实例和入口保存为独立origin；请求不能指定来源。detail为任意JSON，显式null保留，省略才为空对象；其中runId/runIds/origin只是模板数据。同实例同key始终返回首条提醒，保留首次来源、详情、时间及已读状态；跨Run不改写，无来源的既有记录不回填。该来源扩展不增加请求字段、方法或动作授权。
- `effect.prepare({action,key,description?,review?})` 返回 `{id,execute,state}`；可选 review 与 human 相同，需要 `human-review-v1`，仅 confirm 授权进入人工确认；auto/deny 及去重规则不变。仅 `execute:true` 可以执行动作。同键已有记录（包括 failed/unknown）均不重新授权。`effect.resolve({id,state,evidence?})` 仅允许本 Run 的 submitting 记录终结；Run 结束和崩溃恢复将未核验记录置为 unknown。
- `ai(id,{instructions,input,schema})` 返回 `{provider,model,requestId,output,usage}`。模板脚本不能通过旧 credential SDK 读取 Key。
- `browser(id,{operation,selector?,value?,timeoutMs?})` 当前公开 url/navigate/read/count/attribute/inputValue/wait/click/fill/select/check/press。监听导航使用有期限的 url 轮询并检查 signal；不得无限占用 Run。通用节点的上传/下载等能力仍由通用 BrowserDriver 契约约束。

人工输入的 `schema` 仍由宿主按完整 JSON Schema 校验。2026-10-09 客户端字段展示在配置表单子集之上支持数组 `minItems`：非负安全整数，且不超过声明的 `maxItems`（未声明时受编辑器1000项上限约束）。不足项在列表分组提示并阻止提交；不为满足数量自动创造条目。展示支持探测不改写原 Schema，宿主始终校验原请求。不支持的格式保留明确的 JSON 输入入口。这不扩展模板配置 Schema 契约，不允许包配置开始使用未声明的关键字。

配置及入口输入使用 configuration-schema.ts 中的可渲染 Schema 子集；状态/结果可使用 JSON Schema 2020-12 的本地引用。能力不足使相关入口不可运行；不能通过配置默认值获得动作授权。每次脚本 RPC 身份来自 Host 签发的 owner，不能由模板参数替换。客户端当前全局 FIFO 串行队列同时保证同实例入口不会并行修改状态。
