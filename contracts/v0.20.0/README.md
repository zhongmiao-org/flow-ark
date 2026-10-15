# 0.20.0 · 本机资料文本提取

2026-10-15。新增通用`document` v1节点、`document-extract-v1`能力及DocumentResult。流程1.0、包2.0、SDK1.0不变；须以实际发布tag确认可采用版本。此前快照与摘要保持不可变。本协议不定义个人事实、求职字段或BOSS规则。

## 节点与资源

节点含id、type=document、version=1、binding（固定逻辑目录）和file（相对文件名Value）；可选name、timeoutMs沿用节点语义。只解析指定的一个普通文件，不遍历目录。绑定为目录read或readwrite，模板当前入口显式声明document、document-extract-v1及该目录read资源；不增加外发动作授权。用户Key不是解析前提，解析不调用模型、联网、执行宏或文档脚本。

file可用参数/前序结果引用，解析后必须是1–1000字符安全相对路径；拒绝绝对路径、盘符、反斜线、空段、`.`/`..`、NUL及目录本身。以本次Run固定的目录绑定定位，不跟随越界链接；非跟随叶子链接句柄有界读取，核对前后设备、inode、大小、mtime与ctime。原始字节上限8MiB，空文件只对文本有效；读取期间变化、非普通文件和权限失败均失败，不产出可采用正文。错误信息不泄露绝对路径。

明确支持UTF-8的txt/md/csv/tsv/json/log/yaml/yml/xml，及pdf/docx。扩展名与实际内容相符；未知格式、损坏、需密码的PDF和加密DOCX明确报错。不隐式调用OCR、云解析、Files API或其他模型，也不扫描相邻项目文件。原文件保持只读。

## 输出与提取范围

DocumentResult包含version=1、status=ready|partial|empty、source、text、units和warnings，字段见[p1.schema.json](p1.schema.json)。source仅含逻辑binding、相对name、实际format=text|pdf|docx、byteLength与原始字节SHA256，不含绝对路径、完整原文件或Key。

- PDF以页为单元，最多100页；仅提取可读取文字，不渲染或OCR，不保留原排版。空页保留位置并以empty-unit警告，不推测它是扫描件还是实际空白；不存在的字体/不支持的内容导致失败或明确缺口，不能假装完整。
- DOCX仅主文档正文，按文档顺序提取段落（含表格内段落）；文本、制表符和换行保留。页眉页脚、批注、脚注、嵌入对象、图片及排版不在范围内，body-only警告始终说明。删除修订不作为当前正文，发现修订标记以tracked-changes警告转partial。嵌入对象不执行或展开，以embedded-content警告转partial。仅解析所需XML，不跟随外部关系。宏文档和不支持的包结构拒绝。
- 文本按行（LF/CRLF/CR标准化为LF）定位，严格UTF-8解码，拒绝二进制控制内容；空行保留，不单独视为缺口。BOM去除，仅作用于提取文本，source摘要仍基于原字节。

units最多1000项，index从1连续增长，kind与格式匹配为page/paragraph/line，locator为可读来源（例如“第 2 页”），text保留该单元正文。总text必须等于units按顺序以`\n`连接，最多50000个JS UTF-16码元；单元数、页数、字符数或结果序列化超过1MiB整次失败，不静默截断。

warnings含code、可读message、unit（准确索引或null），最多1100项。text-only与body-only是范围说明；empty-unit仅用于PDF空页，tracked-changes与embedded-content是内容缺口。text无非空白内容时status=empty；有文字且含上述缺口时partial，其余为ready。运行结果须显示状态、原始摘要、定位、完整提取文本与警告，不能将empty/partial呈现为可直接采用的完整材料。模板用status条件分支核对后，再明确选择要交给AI的单元；节点成功不等于事实确认、Skill确认或发送许可。

## 解析进程、预算与取消

解析库运行于单独进程，只接收本次已读取字节与格式，不获得目录绑定、其他文件路径或Key。PDF内联数据输入，关闭运行时求值和远程资源读取；所需CMap/字体数据只可从应用发布的受信资产加载。DOCX ZIP最多2000条、声明和实际展开合计32MiB、主XML8MiB；XML元素深度最多64、元素总数最多100000。拒绝重复条目、加密条目、危险路径、DTD/实体声明及超限XML，不将ZIP解压到文件系统。

解析期限取节点剩余期限与30秒较小值，取消/期限先撤销本次请求，回收该解析子进程并等待退出；迟到结果不得提交为步骤成功。进程异常、内存耗尽或格式失败不自动重试，不用退出码0替代结果结构及来源校验。独立进程不是安全沙箱，V8堆限制不等于操作系统总内存限制。宿主/Worker退出沿用已有子进程回收规则。

结果随普通节点输出纳入加密运行历史与不可变快照；源文件随后变化不改写历史，新运行重新读取并生成新摘要。失败/取消不登记半成品，不产生外部输出文件。模板导出仅声明逻辑资源和节点，不夹带已解析正文、运行历史、原字节、登录态或凭据；本机目录必须由使用者重新绑定。

## 采用与验证

治理合并并发布contracts-v0.20.0后，客户端固定复制契约、生成静态校验器/类型并记录基线，独立构建。Figma状态和实施证据见[资料解析记录](../../docs/client/document-extraction.md)。当前为新增契约，不能称已支持PDF/DOCX或已完成蒸馏。当前UI/UE阶段不新增或运行单元测试；格式示例仅证明结构，客户端须另做真实解析与界面人工核对（包含空页、DOCX表格/修订、损坏/加密、边界、取消、迟到、来源变化及ZIP复导）。

参考一手接口：[PDF.js API](https://mozilla.github.io/pdf.js/api/)、[PDF.js Node示例](https://github.com/mozilla/pdf.js/tree/master/examples/node)、[OOXML主文档结构](https://learn.microsoft.com/en-us/office/open-xml/word/structure-of-a-wordprocessingml-document)。实现时固定实际依赖版本和许可证，不因本文引用就宣称当前库兼容。
