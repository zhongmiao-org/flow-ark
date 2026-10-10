# MCP OAuth：授权前检查与公开客户端登录

2026-09-24。对应自定义 MCP `23:5493` 与 U07，补齐 [连接发现](mcp-connections.md) 的 OAuth 前置读取。v1 定义真实授权元数据检查，下文 v2 扩展已注册公开客户端的登录、回调、令牌保护与刷新。客户端本地实现及人工证据见[实施记录](design-implementation.md)；动态注册、机密客户端、真实提供者和原生系统验收仍待补齐，不把配置检查成功称为登录成功或可执行连接。

## 交互与边界

用户在自定义 HTTP 连接中选择 OAuth、填写服务地址和来源，再明确确认读取服务及其声明的认证站点。检查只发送无凭据 GET，不发工具调用、授权码/令牌请求或客户端注册，不打开网页、不读账号、不保存连接。stdio 不使用此流程。页面显示资源、认证站点、服务要求的权限范围及来源、PKCE/客户端注册支持和逐站点问题；服务声明不证明账号、发布者或实际授权。

检查中可取消，等待清理完成后才能重新发起；离开、配置修改和迟到回复不恢复旧结果。更换地址/认证方式/协议/来源撤去结果。结果标注检查时间和五分钟有效期；过期需显式重新检查，不自动联网。多个认证站点都列出，不把首个站点自动选为登录目的地。

## 本机接口

`tool.connection.oauth.inspect` 输入 `{requestId,url,protocolVersion,reviewedSource:true}`，requestId 使用既有连接请求 ID 约束，url 使用既有 HTTPS/字面回环 HTTP 地址规则，protocolVersion 为客户端现有两种明确版本。输出 `OAuthInspection` v1：url、resource、checkedAt、expiresAt、scopes、scopeSource（challenge / resource / unspecified）、servers（各站点 issuer、状态、问题、验证后的授权/令牌地址及客户端识别方式支持）、contactedOrigins。没有凭据、账号已验证或任务授权字段。

复用 `tool.connection.cancel` 的 requestId 取消检查。宿主最多一个发现/授权检查并行，检查总期限 30 秒，取消/退出/休眠共同撤销。此阶段不持久化结果，不改变已保存连接 revision、状态或任务绑定；不能用普通 discover/save 接口保存 OAuth 伪配置。方法走现有白名单 IPC 和 Runtime，不由 Renderer 联网。

## 读取与校验

1. 对明确服务地址做无凭据 GET，读取 401 challenge 后立即关闭正文；禁止重定向。优先使用 challenge 的 resource_metadata，否则依规范按带路径、根路径的 well-known 地址读取 Protected Resource Metadata。缺失、格式错误、资源与当前服务不匹配均失败，不猜测认证站点。
2. 认证站点最多八个，逐个读取 RFC 8414 / OIDC well-known 元数据，沿用官方 SDK 的标准回退顺序及严格 issuer 字符串匹配。不得关闭 issuer 校验；一个站点错误应显示该站点问题，不把它当作可用站点。
3. 使用授权码方式必须声明 code 响应与 S256 PKCE；缺失记为不满足要求。展示客户端元数据文档、动态注册和预注册的支持信息，当前不实际注册。任何令牌地址、授权地址或注册地址都须通过 URL 规则，不执行地址。
4. 权限范围优先使用 challenge 的 scope，否则取资源 scopes_supported；两者都没有时说明未声明，不猜测、不添加 offline_access。最多 128 项，每项最多 200 字符。
5. 所有 URL 禁止用户信息与片段；元数据/issuer/端点不接受查询串，HTTP 仅允许已选字面回环服务的同源地址。远程服务声明回环 HTTP 或跨源明文地址须拒绝。每份 JSON 正文最多 1 MiB，总请求最多 32 次，不发送 Authorization/Cookie，不自动跟随重定向。响应正文、外部错误描述不作为产品指令或原样异常输出。

## 后续授权闭环门槛

登录接入须独立补充一次性授权会话：绑定配置摘要、所选 issuer、resource、范围、client ID 和原连接 revision；使用随机 state、S256 PKCE、受限回环回调与超时取消。回调先验证 state 和 RFC 9207 issuer，再向已绑定 token endpoint 交换，授权与令牌请求均携带 resource。令牌和注册秘密仅进入系统保护存储，Renderer 不读取；刷新不得扩大范围、切换 issuer 或自动重放结果未知的工具调用。认证完成后仍须真实 tools/list 和用户能力核对才可保存，断开/删除/休眠取消在途会话。上述闭环未实现前，页面必须明确“尚未登录或保存连接”。

本阶段类型/构建与人工回环 HTTP 证据单独记录；真实第三方、系统浏览器登录、凭据保护、取消竞态、全部错误组合及 186 画板仍须后续验收。按用户阶段约定暂不新增或运行单元测试。

参考：[MCP 授权](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)、[授权服务器发现](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery)、[2025-11-25 授权](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)。

## 授权闭环 v2：已注册公开客户端

2026-09-24 先定义后实现。本节扩展 v1，不把协议批准视为已经实现。首次接入支持用户从所选服务取得的公开客户端 ID（token_endpoint_auth_method=none）；动态注册、客户端元数据文档与机密客户端仍需后续接入，不能自动假造 ID 或索取客户端秘密。用户明确选择一个满足要求的认证站点，填写 client ID 和回调端口，核对固定回调 `http://127.0.0.1:<port>/oauth/callback` 已向该服务登记。端口 1024–65535、默认 48185，占用时报错，不改用第二端口。

检查返回宿主签发、五分钟有效的一次性 inspectionToken。授权请求 `tool.connection.oauth.authorize` 携带 requestId、inspectionToken、完整 OAuth ConnectionConfig（http/auth=oauth，oauth 含 issuer/clientId/callbackPort）、reviewedAuthorization:true，以及修改连接时的 connectionId/revision。宿主绑定检查对应的 URL/协议、所选 issuer、资源、全部展示范围、完整配置和原 revision；不接收 Renderer 提供的端点、授权 URL、state 或令牌。使用一次性 inspectionToken 后重试须重新检查。来源或范围变化须重新核对，不以第一次自动选中的站点代替用户选择。

2026-10-10 登录区键盘衔接：公开客户端 ID 与回调端口输入中的 Enter 使用“登录并核对能力”的同一条件判断，不隐式提交外层认证配置检查。尚未核对、客户端为空、端口无效、检查过期或操作忙时不提交，保留选站和输入；确认框中的 Enter 不触发登录或重新检查。普通连接配置与明确“检查认证站点与范围”入口保持原行为。实际App虚构接口局部核对见实施记录，真实提供者、IME与完整原生路径另行验收。

授权最多十分钟，与发现共用单一在途槽。先独占绑定 IPv4 127.0.0.1 的声明端口，再生成随机 state 和 S256 verifier/challenge，通过仅 Main 可用的内部接口打开系统浏览器。禁止 Renderer 任意打开网址；只打开宿主已绑定的授权地址，携带 client_id、redirect_uri、response_type=code、state、code_challenge、scope 和 resource。重复点击不重复打开，不因打开结果未知自动重试。取消/离开/退出/休眠关闭回调监听，旧回调和迟到令牌不能恢复候选或保存连接。浏览器窗口由用户管理，不关闭已有浏览器。

回调只接受 GET、准确 Host/路径和有界 URL；state 使用常量时间比较，重复的 state/code/iss/error 参数拒绝，错误回调也先校验 issuer。按 RFC 9207 及 MCP 规则：声明支持 iss 时缺失拒绝；任何存在的 iss 都须与已验证 issuer 精确相等。正确回调只消费一次；无效 state 不终止另一会话。页面仅返回固定说明、不反射外部文本，no-store / no-referrer，不记录查询串。

授权码仅发送到已验证的 token endpoint，携带同一 resource、client ID、redirect URI 和 PKCE；不跟随重定向、不重放授权码交换，限制正文和期限，失败仅给出脱敏说明。只接受合法 Bearer token，返回范围不得超出核对范围。随后真实发现与 tools/list，成功生成既有一次性能力候选，不立即保存。候选与连接公开显示 issuer/client ID/资源/授予范围/到期时间，不显示码、verifier、access/refresh token 或系统凭据引用，也不假称账号身份已验证。

系统保护存储保存连接专属 OAuth 凭据包，绑定 issuer/resource/client ID/token endpoint、授予范围与到期时间。范围、目的地和客户端识别信息不得从 Renderer 覆盖。重连或工具调用前若 access token 过期且存在 refresh token，可向原 token endpoint 刷新一次；不扩大范围、不切换 issuer/resource，不追加 offline_access。不因工具调用的 401 或未知结果重放工具操作。刷新失败/结果未知/保护存储失败使连接需重新授权，旧刷新令牌不自动再次使用。刷新轮换在宿主独占下安全保存，保存失败不继续发送新 access token；未知到期时间以服务响应为准，收到 401 提示重连。

断开/删除、原 revision 变化、任务在用、候选取消与五分钟过期继续采用现有连接规则；令牌保护不可用时不得降级明文文件。此协议不改变用户任务操作授权、不可变快照、工具执行去重及结果未知语义。真实系统浏览器、真实提供者注册策略和全部原生回调须独立验收，回环夹具只证明所执行的开发路径。
