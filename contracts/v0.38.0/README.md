# P1 契约 0.38.0：关联字段只读采集

2026-10-18，接续不可变[0.37.1](../v0.37.1/README.md)。新增 browser v5、`browser-fields-v1` 和四个数据定义，保留原节点语义、SDK 1.0、包 2.0、IPC 和数据库格式。本候选未发布，不得由消费者提前采用。先行[八状态 Figma 与交付边界](../../docs/client/browser-associated-fields.md)。

## 输入与采集

`BrowserFieldsNode` 的 operation 固定 collect，selector 是唯一根元素的 CSS 定位，framePath 沿用最多八层唯一 iframe 路径。fields 为有序 1–20 项，key 为唯一的 ASCII 标识，禁止 __proto__/prototype/constructor；每项有相对根元素的 selector、operation（text/attribute）、attribute（文字时严格 null）及 required。根和字段定位、属性名支持既有作用域引用；执行前必须解析成严格文字，不能把对象转换为文字。只支持后代元素，不自动包含根本身，不穿越 Shadow DOM 或其他框架。CSS 语法错误拒绝；不允许任意页面脚本。

一次驱动调用在选定框架的同一同步 DOM 执行中查询根、查询各字段并读取原始值，中间不得 await、轮询、自动重试或执行写入。根 0 项或多项均拒绝整次采集。text 使用 textContent，不承诺只含可见文字；attribute 使用 getAttribute，保留相对值、null 和空文字。不能以依次调用 count/read/attribute 冒充同次采集。

宿主在调用前后核对同一浏览器会话、顶层及目标框架的文档身份/代次和取消状态。导航、刷新（即使网址相同）、框架更换/脱离或期限到达均丢弃整次结果。网址相同不是文档身份验证，驱动若无法证明此边界就必须拒绝 collect，不回退为多次独立读取；拒绝不静默切换驱动。浏览器内部句柄/文档标识不进入可移植节点或公开结果。

## 输出与完整性

`BrowserFieldsResult` 严格含 version=1、operation=collect、url、documentUrl、selector、framePath、complete 和按原顺序的 fields。两个网址分别为本次顶层与目标框架文档网址，文档网址在同步读取内取得；框架为空时应一致。每项重复准确的 key/selector/operation/attribute/required，附 count、status、value，不能省略缺失项或调换顺序。

| 情形 | status | value |
| --- | --- | --- |
| 匹配 0 项 | missing | null |
| 匹配多项 | ambiguous | null，不选择第一项 |
| 唯一元素，属性不存在 | missing-attribute | null |
| 唯一元素，原始值为空或仅空白 | empty | 保留原始空文字或空白 |
| 唯一元素，非空值 | ok | 保留原始文字 |

count 为非负安全整数。任何字段 ambiguous、或 required 字段不是 ok，complete 必须 false；可选字段 missing/missing-attribute/empty 不阻止完整。完整性只能由宿主按准确配置和真实驱动结果推导；格式参考无法证明 DOM 来源。必填不是禁止返回不完整结果，后续模板必须检查 complete 再选择其业务分支。

所有定位限 2000 字符，属性名 128、key 64；严格 Unicode，无效代理字符拒绝。每项原始值最多 8192 UTF-8 字节，网址各 16384 字节，整个 JSON.stringify 结果最多 65536 字节（不美化、包含元数据）；任意超限拒绝整次结果，不截断或采用部分字段。即使 JSON Schema 字符数通过，字节预算仍须核对。

## 权限、作者与迁移

流程必须同时声明 browser 和 browser-fields-v1，正式包入口也必须覆盖两项并包含自己的 browser/use 资源。作者定义校验同样检查。执行仍需明确当前入口浏览器绑定；此能力不产生账号身份、发送许可或 effect 授权。模型和页面文字不得更改字段配置、匹配计数、来源归属或 complete。

新增节点版本，不迁移或改写既有 v1–v4 节点/Run；不支持能力的客户端应在导入或运行预检时拒绝。SDK 1.0 暂不增加 collect 调用，本批首先用于可视化通用节点；公开模板须在支持本契约的客户端 UI 中编排、调试、导出和独立工作区复导，不能手改包来补能力。

本读取并不冻结整个页面、提供签名来源、验证账号/职位真实性或消除读取后的变化。业务动作前重新核对、消息排序和去重、未知状态人工接管仍由模板与宿主各自边界实现。BOSS 定位/规则归模板；没有登录校准不能把公共页面观察计为业务通过。

## 验证与采用

`browser-fields.ts` 是纯格式与关联参考；`browser-fields.cases.json` 记录正反格式资料，不能替代真实浏览器/框架/取消验证。`../build_browser_fields.py --output <空目录>` 从固定 0.37.1 重建；除 Schema 和两个调用新能力检查的参考模块之外，原 115 份机器资料保持字节一致。发布 tag、消费者实现、安装包、UI 制作和真实站点分别记录，当前均未由本候选证明。
