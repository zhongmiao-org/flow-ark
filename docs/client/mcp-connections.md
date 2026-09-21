# 应用与工具：MCP 连接发现 v1

2026-09-22。对应 Figma 23:4867、23:5493、23:8773、23:8920 与 U07。完整目标仍包括预设、OAuth、系统权限、任务绑定与执行；本增量先定义真实连接发现和持久化生命周期，不把发现工具当作执行授权，也不以协议文档代表页面或真实服务验收。

## 来源和传输

宿主独占 MCP 客户端。HTTP 使用明确输入的 HTTPS 地址，开发与本机服务允许字面 loopback HTTP；拒绝地址内用户信息、片段及查询串，Token 只通过认证字段处理。禁止自动跟随重定向或从服务返回内容另开 URL。认证首先实现 none / bearer；OAuth 的授权回调、PKCE、令牌刷新与作用域变化另按独立协议接入，当前不能显示已完成 OAuth。

stdio 使用绝对可执行文件路径和参数数组，不使用 shell，不搜索 PATH，不自动下载或安装，不将完整父进程环境传给工具服务。创建客户端不启动程序；用户明确发现/重连才启动所选程序。来源/参数必须在操作前显示。它是可信本机程序，不是安全沙箱；只读发现仅指客户端不发送执行方法，不能保证第三方程序启动无副作用。程序错误输出不直接进入产品日志。

明确选择 MCP 2026-07-28 或 2025-11-25；默认当前协议，失败显示兼容问题，不自动启动探测兄弟进程、切换地址、程序、认证或协议。采用官方 TypeScript client 2.0.0；新协议使用 server/discover，旧协议使用 initialize。连接发现只调用协议发现与 tools/list，不读取 resources、不取 prompts、不发送 tools/call、roots、sampling 或 elicitation。请求有总时限、取消和响应大小/分页/数量限制；关闭需回收本次创建的进程，不影响用户已有程序。

## 内容和状态

ConnectionConfig v1 包含 displayName、source（用户填写的来源说明）及 transport：http 的 url/auth，或 stdio 的 command/args；protocolVersion 明确固定。没有密码或 Token、账号已验证、系统授权、任务执行许可字段。服务返回 name/version、工具的名称/说明/输入输出 Schema/注解是外部声明，不能证明账号/工作区或可信发布者；readOnlyHint 等提示也不构成授权。

每个已保存连接有 id、revision、config、capabilityDigest、tools、server、testedAt、credentialRef（仅宿主可见）。配置和发现快照使用既有加密 documents 的 mcp-connection v1，不改公开流程、模板包、SDK、SQLite 表或历史快照。凭据通过系统保护存储，使用连接专属不可变引用；明文不持久化至普通文件或回显至 Renderer。

发现请求先生成内存候选，绑定 requestId、配置摘要、原连接 revision 与完整能力摘要；成功不自动保存，也不授权任何任务。用户核对后通过一次性 token 保存，五分钟超时，配置/修订/连接状态变化和取消使旧候选失效。新能力必须重新核对才能替换已保存能力，保存失败保留原连接，迟到结果不能恢复已断开的连接。断开立即撤销候选和进行中发现；重连显式发起新发现，不重放工具调用或任务。重开后只有保存的历史测试记录，当前状态为未验证，不自动联网或启动程序。

系统退出、休眠和宿主关闭先撤销在途请求，再等待连接关闭；无法确认本次进程回收时显示故障，不能继续启动另一轮。保存后的历史能力不作为实时可用性或任务权限证明。任务目标/固定版本的 MCP 绑定和 tools/call 执行协议需在后续增量先定义，再接入规划与执行。

## 本机接口

| 方法 | 输入与行为 |
| --- | --- |
| tool.connection.list | 空对象；读取保存的连接和本次生命周期状态，不发网络请求 |
| tool.connection.discover | requestId、config、reviewedSource:true，可选 connectionId/revision 与 Bearer Token；有原连接时必须 CAS，返回候选及一次性 token，不保存 |
| tool.connection.cancel | requestId；取消所属发现/候选并关闭，仅影响本次请求 |
| tool.connection.save | token、reviewedCapabilities:true；重新核对候选与当前 revision，保存经过核对的配置/能力 |
| tool.connection.disconnect | id、revision；使在途操作与候选失效，保留配置和历史能力，状态为 disconnected |
| tool.connection.remove | id、revision、confirmed:true；显示影响后删除连接记录，不能删除历史任务/运行/产物 |

Renderer 只接收凭据是否存在，不接收引用或内容。敏感凭据输入只能前往该请求明确选择的源；错误不包含 Token、响应正文、服务 stderr 或其他账户秘密。内部密钥存取不进入 Renderer 白名单。用户输入/服务内容不是执行指令，能力发现不赋予模型任意调用权限。

删除期间独占该连接，先撤销并关闭发现，再删除专属凭据与连接记录。系统存储不可用或删除失败时保留可重试记录，显示未完成原因，不声称已删除；其他连接、供应商凭据和数据密钥保持独立。发现不自动恢复删除中的连接。HTTP 当前协议的工具请求头声明须符合官方 SDK 的静态可达、原始类型与唯一名称规则，非法声明使本次发现失败，不静默丢弃工具后宣称清单完整。

## 验证与后续门槛

验证真实 HTTP/stdio 传输、当前/旧协议、单次进程启动、取消/超时/关闭、401、重定向、非法/过大响应、循环分页、工具重复、Schema/摘要和来源隔离；覆盖候选过期、CAS、失败回滚、断连/重开不重发和密钥不回显。GUI、系统保护真实读写、预设本机助手、OAuth、真实第三方账号、权限变化与固定任务执行分别验收；隔离本机服务不冒充真实生产连接。

参考：[MCP 架构](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)、[协议版本](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)、[Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)、[官方 TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)。
