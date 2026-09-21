# 描述与附件：本机上下文协议 v1

2026-09-22。对应 Figma [描述与附件 23:2280](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2280)，470 / 658 两栏、24 间距、700 最小高度。文件、网页链接和截图分别明确选择来源；取消不加入，增删和返回保留草稿，发送前核对实际文本或图像。附件只供理解，不授予文件操作、网页定位或应用控制权限。

## 来源与持久化

首次支持 UTF-8 文本（txt、md、csv、tsv、json、log、yaml、yml、xml）及 PNG/JPEG。截图入口打开图片文件选择器，不自动截屏或读取剪贴板。其他格式明确拒绝，文档/工作簿解析另行扩展验证。

Main 系统选择器一次选一项，只向宿主交付所选路径。Renderer 不能提交路径、字节、MIME、摘要或来源证明。宿主以非跟随叶子链接的句柄有界读取普通文件，核对前后身份、大小、修改时间；文本严格 UTF-8 解码并拒绝二进制控制内容。图片依据实际内容检查格式/尺寸，Main 原生解码器再验证完整图片。文本上限 200 KiB 且 50000 字符；图片单项 4 MiB、每边 8192 px、1600 万像素，最多四张、合计 12 MiB。超限整次拒绝，不截断或读取相邻文件。

沿用加密 documents，`task-attachment` 保存 version:1、id、taskId、kind:text|image、name、mimeType、size、sha256、selectedAt 和 text 或 base64；图片另含 width/height。ai-task.attachments 保存无正文/字节的元数据数组。不保留原路径；原文件变化不改变副本，需移除重选。读取前核对本任务归属、元数据与 SHA256，缺失或篡改不发送。

副本增删与任务 revision 在同一 Store 事务，失败无孤立附件；移除不改原文件、流程、Run、计划或产物。迟到选择、并发编辑、取消、退出/休眠及超时不能写回。重开不自动导入或发送，无 SQLite 迁移。

## 本机白名单 IPC

| 方法 | 严格输入与行为 |
| --- | --- |
| task.attachment.choose | id、revision、kind:file|image；请求系统选择并导入，返回 TaskDetail；取消不写入、不取消原生成 |
| task.attachment.remove | id、revision、attachmentId；核对本任务归属后原子移除 |
| task.attachment.preview | id、revision、attachmentId；只读返回 name、kind 和完整 text 或 image data URL，不读取原文件或请求网络 |

Host/Main 私有 task.attachment.file 与 task.attachment.image.validate 不进入 Renderer 白名单。文件和输出目录共用选择器占用保护，内部等待超时短于外层 RPC。成功增删递增任务 revision、取消在途生成、清除提案/撤销/修复依据，保留描述、手填资料和补问；CAS 冲突保留界面输入。

## 模型输入

宿主产生 `_flowark_attachment_` 保留 ID 前缀的 AIPlanningContext，task.save.context 不能冒用。文本以 kind:file 和已选正文加入；图片以 kind:image 和文件名/尺寸/格式/摘要元数据加入。附件、手填文本、网页和输出合计最多 20 项；文本仍遵守单项 50000、合计 200000 字符与规划 JSON 2 MiB。文件名明确纳入发送核对，路径、其他文件、完整历史、凭据及登录态不自动加入。

图片字节通过宿主内部 `PlanningImageV1 {id,name,mimeType,data,width,height}` 按附件 ID 对应传给供应商适配器；不塞入文本 JSON，不扩展脚本 SDK AIRequest，不写入模板/流程/执行快照。DeepSeek Chat Completions 使用 user content 的 text + image_url(data URL)；OpenAI Responses 使用 input_text + input_image(data URL)，保留显式模型、store:false、结构化结果校验与取消。发送前再次校验预算，只发已选副本，不抓取远程 URL、不调用 Files API。模型不支持图像时保留草稿报错，不丢弃图片、换模型或重试。

专用网页目标修复沿用[目标修复](task-target-repair.md)的独立发送范围，不自动加入本任务文件、图片或补问答案。普通规划与单步修改可使用已选附件；修复核对页的受限上下文不能因通用附件功能而扩大。

已读取 [DeepSeek Vision](https://api-docs.deepseek.com/guides/vision/) 与 [OpenAI Images and vision](https://developers.openai.com/api/docs/guides/images-vision) 核对接口形状，不能据此宣称真实模型验收。公开规划格式 1.0、契约 0.12.0、SDK 1.0、包 2.0 和既有 tag 不变；新增本机附件 v1 和宿主内部媒体输入。

## 验证边界

覆盖路径/字节/保留 ID 伪造、取消和迟到结果、并发 CAS、事务失败、非普通文件/链接/过大/非法 UTF-8/假图像/尺寸超限、原文件变化后副本稳定、跨任务与篡改拒绝、总项数/文本/图片预算、真实图片块与路径不外发、增删取消生成及重开不发送。GUI 验证选择、预览、移除、配置返回、理解页联动和三尺寸，严格串行。系统选择器/解码/HTTP 夹具、真实 Main 解码、原生选择器操作、真实模型与 U02/U12 分开记录。
