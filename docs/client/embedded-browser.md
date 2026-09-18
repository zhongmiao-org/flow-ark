# 可选内置浏览器

2026-09-18，用户明确需要内置浏览器及最小化自动操作。本页记录设计与验证要求，尚不代表已安装或招聘业务通过。

## 模式与隔离

本机 Chrome/Firefox/Safari 保持原驱动和绑定。新增 `product: embedded`、固定 ID `embedded` 的本地绑定，版本记录应用随附的 Electron 内核；路径不由 Renderer 提供。内置会话由宿主监督的浏览器 Worker 启动独立 Electron 子进程，显示 FlowArk 专用网页窗口；不创建第二个工作台或读取工作台凭据。已有流程与计划不自动改绑。

采用 Playwright Electron 适配器，共享现有 BrowserDriver 操作实现，供应商 Page 不进入通用核心。Playwright 的 Electron 支持属实验性接口，需固定版本并在升级时执行实际桌面回归。内置 Chromium 与系统 Chrome 分别记录结果；旧 Chrome 下载限制保留。不安装第二套 Chromium、不访问 Playwright 缓存，不在失败后切换模式重放。

远程页启用 sandbox、contextIsolation、webSecurity，禁用 Node、webview，且无 preload；不给网站提供工作台 IPC。专用 Profile 保存登录态，不复制用户日常浏览器资料。网页导航只允许 HTTP(S)，阻止本地文件、应用协议及外部程序唤起；新窗口仍用同一受控安全配置。自动下载必须有当前下载命令，下载文件归对应 Run。

## 生命周期

窗口最小化或收起时关闭页面后台节流，并收起内置网页窗口；显示网页由用户主动操作，不因下一步运行抢焦点。页面等待登录或验证码用原有等待人工节点与待办，用户完成后继续。一个会话同一时刻只租给一个 Run；显示/收起不改变租约、重开页面或重放动作。

取消、超时、会话丢失、显式退出均按现有会话回收规则停止受控进程树。应用正常驻留可继续执行，显式退出后不能运行。系统休眠会中断执行条件，不能承诺合盖或休眠仍工作；收到 suspend 事件应停止当前 Run，恢复后核对结果并由用户发起新 Run，不自动重放。不自动启用阻止休眠或开机启动。

## 本地 IPC 与兼容

公共流程仍用契约 0.7.0 和 browser v1/v2/v3，无节点语义变化。只新增本地 IPC `browser.embedded.enable`（无参）、`browser.embedded.visibility`（visible 布尔）、`browser.embedded.status`（无参）；系统窗口事件使用宿主内部接口。启用只创建本地绑定，不自动打开网站或运行流程。状态只返回已启动、显示状态、当前页面 URL；不返回 Profile 路径、Cookie、凭据。绑定使用现有浏览器存储，无表结构迁移；旧客户端不认识 embedded 时拒绝执行，不转换成本机浏览器。

## 验证关口

- 完整复杂表单：input、radio、checkbox、原生/自定义 select、多选、日期、按键、延迟控件、上传字节与服务端回执。
- 最小化与隐藏窗口时连续执行、定时页面更新和下载，核对无新窗口抢焦点。
- 调试暂停、单步、取消、销毁后重开、Profile 登录态保留、旧 Chrome 绑定兼容。
- 远程页无 Node/FlowArk 桥；新窗口、非 HTTP(S) 导航和无命令下载的隔离。
- suspend 通知与退出停止任务，不继续后续提交；实际电脑睡眠另列，不将模拟系统事件称为硬件验收。
- 打包、从 DMG 安装、安装版同一回归；BOSS 登录和实际招聘行为另验。

参考：[Playwright Electron](https://playwright.dev/docs/api/class-electron)、[Electron WebPreferences](https://www.electronjs.org/docs/latest/api/structures/web-preferences)、[Electron 安全指南](https://www.electronjs.org/docs/latest/tutorial/security)。
