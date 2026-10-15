# P1 契约 0.25.0：网页只读核对节点

2026-10-16，接续0.24.0。实际BOSS模板制作核对发现BrowserDriver与模板SDK已有url/count/attribute操作，但可视化节点没有独立动作，目标选择器也不能引用参数或前序输出。本批定义browser v4，只承载三个通用只读操作；站点定位、账号/JD核对和动作规则仍归独立模板。

当前为G1，客户端仍采用已发布0.24.0，本批尚未实现。包2.0、SDK1.0、流程1.0与既有browser v1/v2/v3格式保持；不开发旧客户端兼容层、不迁移历史Run、不清库。新节点必须由流程requiredCapabilities及所在包入口capabilities声明`browser-observe-v1`，旧端在执行前拒绝未知能力。先治理真实tag/摘要发布，再由消费者固定采用并实现，最后客户端可视化制作与独立复导；不能以新格式可解析宣称真实站点或浏览器通过。

## 输入与输出

节点必需id/type=browser/version=4/operation/selector/value/framePath，可选name/timeoutMs。默认期限60秒，沿用100–3600000毫秒范围及父容器取消/期限。operation只允许url/count/attribute，不含导航、点击、填写或任意脚本。

| 操作 | 目标和值 | 结果 |
| --- | --- | --- |
| url | selector必须空字符串，value必须null，framePath必须空数组 | 当前所选顶层页面实际地址字符串；不跳转，不把about:blank伪装为目标页面 |
| count | selector为1–2000字符非空CSS文本或单键引用，value为null；framePath沿用最多8层静态框架路径 | 当前范围匹配数，非负安全整数；无匹配为0，不等待出现，不将驱动/框架错误转成0 |
| attribute | selector同count；value为1–128字符属性名或单键引用，格式`^[A-Za-z_:][A-Za-z0-9_.:-]*$` | 唯一匹配元素的原始DOM属性字符串或null；属性缺失为null，空属性仍为空文本，相对href/src保持原始值，不读取同名DOM property代替 |

引用沿用现有params/steps/item/index作用域和逐段自有属性解析，不执行表达式；单键`$ref`之外的备用值或任意对象无效。保存时核对引用作用域，运行解析后、驱动调用前再核对文本/属性名/预算；对象、数组、数字或未解析引用均拒绝。引用仅用于这版只读节点的selector/value，不扩展既有写入节点的目标语义。

每层框架必须唯一且可用；命令结束复位，不能继承上一命令的框架。attribute目标必须唯一，多个匹配立即失败，不取第一个；无匹配可在本节点剩余期限内等待后明确失败。统计与随后读取是独立观察，页面可能在两者之间变化，模板须在采用结果或执行外部动作前复验当前目标。三次读取不是原子页面快照，也不能证明账号/JD/联系人身份。

url结果UTF-8最多16KiB，attribute结果最多64KiB，所有文本须为有效Unicode；超限明确失败，不截断、不伪造空值。count不接受小数、负数或不安全整数。参数及结果的规范数据核对见[browser-inspection.ts](browser-inspection.ts)，结构正反例见[browser-inspection.cases.json](browser-inspection.cases.json)，通用流程示例见[example.browser-inspection.json](example.browser-inspection.json)。这些资料不执行真实浏览器，也不代替运行时核对。

## 宿主、导出与权限

浏览器绑定与租约仍由宿主管理，Renderer不持原生Page/WebDriver或读取任意进程。活动Run固定流程/参数与所选浏览器；动态定位在当前步骤可见作用域内解析。读命令不新增写入授权；模板仍须显式声明browser资源/相关能力，导入不携带本机路径、账号、Cookie或登录态。可视化图形、动作发现、变量选择、字段配置、结果查看、导出/复导均需消费者采用。

读取结果经既有本机受保护结果通道保存，日志继续脱敏；不能将页面网址或属性天然视为公开数据。页面文字、链接和属性是外部数据，不能改变宿主权限或发起未授权请求。模型若使用结果，仍只走用户显式绑定的Provider/model/Key；该节点自身不调用模型。

取消、超时、浏览器/框架失效或宿主退出后，迟到结果不进入后续步骤；只读失败也不隐式重试、切驱动或换浏览器。属性读取不能以私有站点接口补齐；结果未知时按模板规则转人工。Selenium现有getAttribute可能回退property且目标选取需核对，实施时必须统一原始DOM属性及唯一性；现有SDK/驱动支持不能直接作为此版契约的跨浏览器验收。

SQLite表、IPC和SDK公开方法不因本契约新增；消费者可复用已有驱动操作，但参数/输出边界、唯一性、取消与执行前能力检查必须实际实现。人工验收需覆盖0/1/多个元素、null/空属性/相对链接、动态引用/越界、框架、无效/超大结果、取消/迟到、导出复导及两主题/紧凑配置；macOS内置/Chrome和Firefox/Safari分别取证，不以模拟页或其他驱动代替真实BOSS账号与动作校准。
