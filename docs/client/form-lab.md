# 本地复杂表单实验室

2026-09-17。按当前优先级，使用虚构数据验证通用网页控件、实际接收字段与错误处理。页面和接收服务仅用于开发验证，监听 `127.0.0.1`，数据只在本次服务内存中保留；不引入 P2 服务端、账号或 AI 依赖。

## 使用

在客户端目录执行：

```sh
pnpm forms:serve
# 打开 http://127.0.0.1:4178
```

可用 `FLOWARK_FORM_LAB_PORT` 修改端口。页面提供流程包与 `fictional.txt` 下载。将样本放入独立练习目录，导入流程后绑定本机 Chrome，并将文件绑定 `work` 指向该目录，再手动运行。流程会生成或覆盖 `event-counts.json`、`form-receipt.json`，截图保存在运行产物中。导入不执行、不携带本机浏览器或文件路径。

配套流程使用契约 0.7.0 的 browser v3，需要 0.1.5；同日后续已安装 0.1.5 调试预览并完成安装版验证，见 [逐步调试交付](debugging.md)。旧版 0.1.4 会拒绝新节点版本。下方 56 项单元等记录属于最初表单增量，后续完整检查以调试交付记录为准。

## 控件与观察

| 类别 | 页面内容 |
| --- | --- |
| 输入 | text、email、password、tel、url、number、search、textarea、datalist、contenteditable；中文、换行和特殊字符 |
| 选择 | 同组 radio、checkbox、原生单选/多选 select、禁用选项；按状态重复设置与清空多选 |
| 日期与数值 | date、time、datetime-local、month、week、range、color；日期先后和数字范围校验 |
| 动态交互 | 异步省市联动、自定义搜索下拉、ARIA 开关、条件显示的必填项、联系人增删 |
| 文件与提交 | 小于等于 64 KiB 的 txt、只读/禁用字段、必填与格式校验、模拟服务端拒绝、重置 |

右侧显示当前字段、最近事件与服务端回执，可展开查看 change 次数。密码只保留长度，不进入回显和提交载荷。上传内容由本地接收端独立计算 SHA-256，正常场景逐字段比较实际接收值与预期；不能只凭按钮点击或页面提示判成功。

客户端通用浏览器面板增加「选择选项」「设置勾选」「读取输入值」「按键」，无需手改 JSON。`select` 只操作原生 select，精确按 option.value 匹配；自定义组件使用可见输入和点击。`check` 设置目标状态并复核，不通过重复点击猜测状态；取消 radio 应选择同组其他项。框架路径继续逐层定位，无框架时使用空路径。

## 自动验证及证据

```sh
pnpm check
pnpm test:forms
pnpm test:desktop
```

`test:forms` 启动随机本地端口，通过真实 Runtime → Worker → BrowserDriver 执行导入流程。使用本机 Chrome、独立临时 Profile、空自动化浏览器缓存；不下载浏览器、不读取日常 Profile。可用 `FLOWARK_CHROME_PATH` 选择已安装 Chrome。真实浏览器验证不加入默认 check 或 CI。

2026-09-17，macOS / Chrome 153.0.8010.48 / playwright-core 1.63.0：

- `pnpm check` 通过类型检查、56 项单元测试及构建。新增契约/参数验证与 Selenium 控件模型；模型不等于 Firefox/Safari 实机通过。
- `pnpm test:forms` 共 9 个场景通过预期断言：浏览器原生校验；6 个禁止/无效操作；完整表单；服务端拒绝。
- 原生校验拒绝缺失必填、错误邮箱、越界数字及结束日期早于开始日期，接收端请求计数保持 0。
- 只读填写、禁用填写、缺失选项、禁用选项、取消 radio、单选传多值均以 FAILED 结束；后续节点没有开始，也没有写入哨兵文件。后三项同时核对具体错误原因。
- 正常流程逐字段核对接收值、文件字节与 SHA-256、回执 JSON 产物。重复设置 radio/checkbox 后，相应 change 事件各为 1；提交节点仅开始一次，截图已查看。
- 拒绝场景收到 HTTP 422，界面显示失败、回执为 rejected；该 Run 的 SUCCEEDED 表示「预期拒绝断言通过」，不表示业务提交成功。接收端总共 2 次请求、1 次接受、1 次拒绝，没有自动重发。
- 开发版 `pnpm test:desktop` 通过新增四种操作的配置、保存和重开；旧操作保持 browser v2，新操作采用 v3 并保留框架路径。已查看 `test-results/browser-form-editor.png`，通用右侧仍无招聘字段。

报告位于客户端忽略目录 `test-results/form-lab.json`，记录每个 Run、实际状态、错误、截图与宿主退出结果。最终日志为 `/private/tmp/flowark-form-lab-final-check.log`、`/private/tmp/flowark-form-lab-live-final.log`、`/private/tmp/flowark-form-lab-desktop.log`。开发中曾发现原生 select 元数据读取方式错误，以及折叠区未展开导致事件文本为空，均已修正后重跑。沙箱内复跑因 localhost 监听权限被拒，授权执行后重新验证。

未将本次结果计入浏览器下载/关闭/重开恢复、真实招聘、AI、跨浏览器或安装验收；[Chrome 原生恢复缺口](browser-recovery.md) 保持未解决。未逐一验证所有手动操作排列。

## 契约与来源

[契约 0.7.0](../../contracts/v0.7.0/README.md) 在治理提交 `60ab503` 发布，tag `contracts-v0.7.0` 已推送；客户端随后固定副本、生成类型并完成验证。新增能力 `browser-forms-v1`，旧 v1/v2 不改写，旧客户端拒绝 v3；无数据库迁移。详见 [采用记录](contracts-adoption.md)。

浏览器原生交互依据 [Playwright 输入操作](https://playwright.dev/docs/input) 与 [Selenium select 控件](https://www.selenium.dev/documentation/webdriver/support_features/select_lists/)。客户端实现不通过写 DOM 值绕过交互与控件限制。

客户端代码本地提交 `db32229`，未推送公开远程；既有源码公开推送限制不变。详细 Markdown 仅保存在治理仓库，客户端自有 Markdown 仍只有 README/CONTRIBUTING。治理文档的 105 个本地链接、代码块闭合及差异空白检查通过。
