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

宿主在每次 RPC 前后核对脚本 owner 和取消状态；只读入口不会因其他入口需要 AI 而被要求提供 Key。准备副作用必须引用入口声明的 action，执行结果核验由模板负责。SDK 不实现网站选择器、招聘状态或事实推理。

AI 供应商接入使用通用 AIRequest/AIResult，不包含求职提示词。完整 JSON 返回后进行 Schema 校验，截断/错误不使用、不静默重试或切换模型。实例配置和授权修改不改变活动快照。
