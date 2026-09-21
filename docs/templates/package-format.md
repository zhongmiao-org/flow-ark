# 标准模板包 2.0

2026-09-21 决策。实现及验收状态见 [验收记录](acceptance.md)。模板作者、客户端及打包器共同遵守，业务 Schema 不进入客户端公共类型。

## 包布局和摘要

文件名 `<id>-<version>.flowark-template.zip`，亦接受相同格式的 `.zip`。根目录为 manifest.json，flows/ 包含每入口流程；schemas/、scripts/、prompts/、assets/ 和 README.md 按清单携带。一个包一个模板，可包含多个入口。不接受目录安装、旧 JSON、多模板套件、安装钩子或可执行安装器。

清单使用 contracts/v0.8.0 的 TemplateArchiveManifest。所有非 manifest.json 文件必须恰好出现在 files 中，记录原始字节大小和 SHA-256。contentDigest 为清单去掉 contentDigest 后递归按对象键排序、保留数组顺序、UTF-8 JSON 编码的 SHA-256；因此也覆盖所有资源。ZIP 元数据不参与内容身份。作者和来源是声明，不是已验证签名。

大小上限：压缩 20 MiB、展开总量 100 MiB、每文件 10 MiB、文件数 512（含 manifest.json）。拒绝加密、路径穿越、绝对路径、反斜杠、符号链接、特殊文件、大小写或规范化路径冲突。所有路径限清单定义的 ASCII 相对路径；不得有空段、`.` 或 `..`。包中禁止 node_modules、原生扩展、浏览器和驱动。

脚本为可信代码，模板自有代码及精确记录版本/许可证的纯 JS 依赖在开发阶段静态打包；不允许运行时安装。包资源只读，运行以固定版本及摘要引用，不从开发目录读取。

## 多入口及资源

每个入口声明流程、输入/结果 Schema、能力、资源、动作和能否定时。configurationSchema 与 stateSchema 在实例内共享。所有 Schema 必须可本地编译，禁止远程引用。表单由受限声明渲染，无自定义 Renderer 代码。

资源使用逻辑 ID：file、directory、browser、ai，并声明 read/write/readwrite/use。敏感绑定与普通配置分开。actions 的默认值必须为 deny；实例可设 deny/confirm/auto，但包本身不授予权限。仅检查当前入口需要的资源，缺能力时阻止该入口，不能换浏览器或 AI 供应商。

入口创建独立 Run，同一实例串行；计划固定入口、配置、绑定与包版本。配置准备、解析和校验中需要执行代码的部分也是显式入口，不在安装或表单打开时运行。

## 安装与生命周期

选择包 → 固定临时副本并校验 → 显示作者声明、入口、能力和动作 → 确认安装 → 创建实例 → 配置绑定和权限 → 显式运行。Renderer 只传令牌，不接收 ZIP 或任意解包路径。检查时不运行包代码；临时区全部通过后原子进入受管理目录。失败和取消清理临时区。

同 ID/版本/摘要导入是无操作；同 ID/版本不同摘要拒绝。新版本并存。采用新版创建新实例，只复制符合新 Schema 的普通配置，重新核对资源与授权，不迁移业务状态。导出不含实例和凭据，编辑后导出生成本地新身份。引用中的版本不可物理删除，卸载不删除用户文件。

现有 JSON 辅助结构不等于正式包，旧业务类型退出支持，不提供旧招聘执行兼容。维护工具仅按本次用户授权清理日常旧工作数据，不是安装升级时自动清库策略。

## 规范校验实现

契约 0.8.0 同时发布 `package-format.ts` 与 `configuration-schema.ts`，其 SHA-256 与 JSON Schema 一起纳入 SHA256SUMS。打包器与客户端复制固定版本，不能从相邻检出目录 import。规范模块仅依赖 Node crypto、Ajv 与同目录契约；ZIP I/O 留在实现仓库。

包路径限定 ASCII 相对路径，根部仅 manifest.json、README.md 或指定资源目录；目录条目无需写入 ZIP。脚本节点 `code` 为 `@package:scripts/<name>.js`，静态包 dependencies 必须为空（依赖已打包，精确版本和许可证在清单 dependencies 中记录）。导入校验不执行脚本。资源本身只读，运行时脚本物化为固定版本快照并由客户端编译器再次检查。
