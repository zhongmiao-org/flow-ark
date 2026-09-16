# P1 契约 0.1.0

发布标识：`contracts-v0.1.0`。规范与示例摘要见 [SHA256SUMS](SHA256SUMS)，远程 tag 是不可变版本的来源。

JSON Schema 2020-12 为唯一 wire 来源。通过 `$defs` 引用具体对象；未知字段、节点版本和格式拒绝。运行前额外验证语义引用、所需能力与本地资源。消费者固定整份 Schema 和 SHA256SUMS，独立生成类型，禁止运行时读取父目录。

## 执行语义

`steps` 为显式顺序。condition 的 then/else 是独立局部作用域，结束后条件节点输出所选分支输出对象；loop 逐项串行，输出每轮结果数组，循环体内 `item`、`index` 有效。容器中间输出不能在外部直接引用。只允许引用已完成的祖先/当前作用域节点，不支持任意连线回边。

值中只有形如 `{ "$ref": "steps.nodeId.field" }` 的单键对象表示引用；支持 `params.*`、`steps.*`、`item.*` 和 `index`，拒绝原型属性与缺失路径。不使用 eval。条件操作为严格 JSON 相等、非等、字符串/数组包含、大于及存在。

每次运行生成不可变快照。事件序号由唯一宿主写入方分配，状态与事件同一事务提交。脚本、浏览器及 Worker 不写数据库。错误、取消、崩溃无自动重试。副作用结果另记，不由 Run 成功推导业务成功。

## 运行接口

NodeExecutor 接收节点、已解析输入、AbortSignal、事件回调与能力接口，返回 JSON；这些函数不属于 JSON wire。BrowserDriver 接收 navigate/read/click/fill/wait/upload/screenshot/download 请求，只返回 JSON、ArtifactRef 或文本，不暴露 Page/WebDriver。浏览器绑定和受监督会话由宿主拥有，每 Run 独占租约。

Script SDK：`input`、`signal`、`logger.info(value)`、`progress(completed,total?)`、`artifact(name,content)`、`credential(id)`。可信脚本独立进程执行，不是安全沙箱；依赖在准入阶段固定，执行阶段不安装依赖。

PlatformConnector 仅保留文档边界：后续注册、心跳、事件补报、远程命令。本版无实现、网络握手或平台登录。

## 业务与模板

AI 草稿不授权外发；完整结果必须经过事实及上下文校验。七类动作各自 deny/confirm/auto，确认绑定账号、目标、内容、简历和上下文摘要。SUBMITTING 恢复为 UNKNOWN；UNKNOWN 不重发。实际联系方式与请求状态分开，重复读取去重。

模板摘要为规范 JSON（对象键按 Unicode 排序，数组保持原序）的 flow 的 SHA-256。摘要证明内容一致，不证明来源可信。内置来源与用户显式确认的本地导入分开；导入不运行。导出必须排除绑定、个人事实与动作授权，涉及字面量的代码/参数需要用户审阅，不承诺自动识别全部秘密。

## 兼容与迁移

首版，无历史格式迁移；`formatVersion=1.0`、节点 version=1。未知能力启动前拒绝。修改 enum/required/语义视为潜在破坏变更，发布新契约版本后升级消费者，不改写本版本。SQLite 迁移归客户端。

生成：`python3 contracts/build_contracts.py`。2026-09-16 在客户端使用 Ajv 8.20.0 的 2020-12 模式验证了合法示例、未知版本/字段拒绝、作用域引用和模板摘要篡改拒绝；客户端完整基础测试 16 项通过。本仓库不安装应用依赖。
