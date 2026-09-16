# 本地运行产物接口

2026-09-16 增量接口说明。仅用于客户端 Renderer → Main → 本地宿主，不属于平台设备协议。请求在 Main 按白名单校验；不接受 Renderer 指定任意文件路径。

- `run.detail` 请求为 `{"id":"运行 ID"}`。保留 run/events/output/snapshot/artifacts；每条 artifact 返回既有 artifactId/runId/name/path/size/time，增加布尔值 `available`。每次读取按登记的真实路径检查普通文件是否仍存在；路径被换成其他符号链接也视为不可用。此字段是当前可访问性，不是内容完整性证明。新增响应字段兼容既有客户端，不改写历史记录或 Run 状态。
- `artifact.reveal` 请求仅接受 `{"id":"产物 ID"}`，成功返回 `true`。Main 通过宿主私有 `artifact.resolve` 查找已登记产物并重验可用性，再调用系统文件管理器定位文件。未知 ID 或丢失/替换的路径返回错误；不执行文件。
- `artifact.resolve` 为 Main → 宿主内部方法，输入同上，返回登记的绝对路径。不得加入 Renderer/Preload 白名单。

无 SQLite 迁移，available 不入库；旧版本仍能读取相同历史数据。新增客户端保持已有来源帧校验及 2 MiB IPC 输入上限。验证需覆盖未知 ID、任意路径注入、正常文件、删除文件、符号链接替换和历史成功状态不变。
