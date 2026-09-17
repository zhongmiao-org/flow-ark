# P1 契约 0.7.0：表单控件

继承 [0.6.0](../v0.6.0/README.md)，新增 browser v3。v1/v2 的字段、操作与框架语义不变；旧端拒绝 v3。流程格式仍为 1.0，能力标识 `browser-forms-v1`，无 SQLite 迁移，不自动改写旧流程、计划或快照。

v3 包含 v2 的全部操作、必填 framePath，并增加以下操作。selector 必须定位目标控件；同一命令的框架和控件操作共用超时预算。

| operation | value | 返回值与语义 |
| --- | --- | --- |
| select | 字符串或最多 100 个不重复字符串的数组，每个最多 2000 字符 | 仅原生 select，按 option.value 精确匹配；替换当前选中集合，返回选中值数组。单选必须恰好一个值，多选允许空数组清空。缺失或不可用选项失败，不降级按文字/索引猜测 |
| check | 布尔值 | 仅原生 checkbox/radio，设置目标状态并核对，返回 `{checked: boolean}`。相同状态不重复点击；radio 只接受 true，取消单选应选择同组其他项 |
| inputValue | null | 返回 input/textarea/select 的当前 value 字符串，用于读取实际填写值；不等同于 HTML 初始 value 属性。多选完整集合使用 select 的返回值或后续回执核对 |
| press | ArrowLeft/ArrowRight/ArrowUp/ArrowDown/Home/End/Tab/Enter/Escape/Space/Backspace/Delete | 向控件发送一次指定按键；不开放任意组合快捷键。返回 `{pressed: true}`，不代表业务成功 |

value 仍支持既有单键 `$ref`：保存时校验字面量与引用作用域，解析后在适配器接触页面前再次校验上述类型。此语义约束与 JSON Schema 一起构成契约；不将任意 JSON 视为可执行参数。

不直接注入 DOM 值或绕过只读、禁用、表单校验。控件状态变化不等于服务端接收；业务提交后仍需读取回执。失败不自动重放。自定义 ARIA 下拉/开关通过其可见输入和点击交互单独建流程，不拿原生 select 操作冒充通用组件支持。

生成命令 `python3 contracts/build_contracts.py --version 0.7.0`。发布标识 `contracts-v0.7.0`，实际发布以远程 tag 为准；发布后客户端才采用该固定副本。Chrome 为当前实机验证目标，Selenium 路线须单独报告模型与实机证据。
