# 可选内置浏览器

2026-09-18：0.1.6 的独立网页窗口已通过复杂表单与安装验证，但实际显示入口仍有会话退出问题。用户进一步明确：所有测试使用内置浏览器，先不测试 BOSS；网页必须通过右上角按钮显示在主窗口右侧面板。以下设计替代 0.1.6 的独立窗口方案，新的面板实现待验收。

## 模式与隔离

本机 Chrome/Firefox/Safari 保持原驱动和绑定，当前不执行兼容测试。内置模式仍使用固定 ID `embedded`，但由主窗口持有独立 `WebContentsView`，网站运行在隔离 Renderer 中。宿主经受控系统能力接口管理租约；通用流程和 Worker 不接触 Electron 对象。原实验性 Playwright Electron 子应用移除，避免另开网页窗口和单独应用的生命周期问题。

自动化使用该网页 WebContents 的 `debugger` 传输和固定 BrowserDriver 命令，不开放网络调试端口、不控制工作台页面。定位与表单逻辑放在浏览器适配器，不进入 Main 的业务编排。后台禁用页面节流；窗口隐藏与恢复不销毁页面。新页面留在受控面板中，不能弹出外部浏览器。

远程页启用 sandbox、contextIsolation、webSecurity，禁用 Node、webview，且无 preload；不给网站提供工作台 IPC。专用 Profile 保存登录态，不复制用户日常浏览器资料。网页导航只允许 HTTP(S)，阻止本地文件、应用协议及外部程序唤起；新窗口仍用同一受控安全配置。自动下载必须有当前下载命令，下载文件归对应 Run。

## 生命周期

窗口最小化或收起时关闭页面后台节流，并隐藏原生网页视图；显示面板由用户主动操作，不因下一步运行抢焦点。页面等待登录或验证码用原有等待人工节点与待办，用户完成后继续。一个会话同一时刻只租给一个 Run；显示/收起不改变租约、重开页面或重放动作。

取消、超时、会话丢失、显式退出销毁对应网页 WebContents 并拒绝未完成命令；外部浏览器仍回收受控进程树。网页失效必须通知宿主并建立待办，不能保留看似可继续的人工等待。应用正常驻留可继续执行，显式退出后不能运行。系统休眠会中断执行条件，不能承诺合盖或休眠仍工作；收到 suspend 事件应停止当前 Run，恢复后核对结果并由用户发起新 Run，不自动重放。不自动启用阻止休眠或开机启动。

## 本地 IPC 与兼容

公共流程仍用契约 0.7.0 和 browser v1/v2/v3，无节点语义变化。只新增本地 IPC `browser.embedded.enable`（无参）、`browser.embedded.visibility`（visible 布尔）、`browser.embedded.status`（无参）；系统窗口事件使用宿主内部接口。启用只创建本地绑定；打开面板可创建空白网页，不自动运行流程。新增 `browser.embedded.viewport` 仅接收主窗口内的整数矩形与 visible，Main 限定边界；`browser.embedded.navigate` 仅接收 HTTP(S) URL，活动执行期间禁止工具栏导航（暂停/等待人工可手动接管）。内部创建、执行、关闭和会话丢失方法不进入 Renderer 白名单。状态只返回已启动、显示状态、当前页面 URL；不返回 Profile 路径、Cookie、凭据。绑定使用现有浏览器存储，无表结构迁移；0.1.6 专用 Profile 与新面板 Session 分开保留，不在未经验证时拷贝 Cookie 或声明登录继承；旧客户端不认识 embedded 时拒绝执行，不转换成本机浏览器。

## 验证关口

- 完整复杂表单：input、radio、checkbox、原生/自定义 select、多选、日期、按键、延迟控件、上传字节与服务端回执。
- 最小化与隐藏窗口时连续执行、定时页面更新和下载，核对无新窗口抢焦点。
- 调试暂停、单步、取消、销毁后重开、Profile 登录态保留、旧 Chrome 绑定兼容。
- 远程页无 Node/FlowArk 桥；新窗口、非 HTTP(S) 导航和无命令下载的隔离。
- suspend 通知与退出停止任务，不继续后续提交；实际电脑睡眠另列，不将模拟系统事件称为硬件验收。
- 打包、从 DMG 安装、安装版同一回归；BOSS 登录和实际招聘行为另验。

参考：[Playwright Electron](https://playwright.dev/docs/api/class-electron)、[Electron WebPreferences](https://www.electronjs.org/docs/latest/api/structures/web-preferences)、[Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)。

2026-09-18 验证范围修订：默认浏览器、复杂表单、调试、恢复及安装测试统一走内置面板；原本机兼容脚本仅允许显式手动选择。BOSS/智联校准暂停，不能在测试期间自动打开。
