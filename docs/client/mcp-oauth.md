# MCP OAuth：授权前检查 v1

2026-09-24。对应自定义 MCP `23:5493` 与 U07，补齐 [连接发现](mcp-connections.md) 的 OAuth 前置读取。完整目标仍包括登录授权、PKCE 回调、令牌安全存储/刷新、能力核对与使用；本协议当前实现范围仅为真实授权元数据检查，不把检查成功称为登录成功或可执行连接。

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
