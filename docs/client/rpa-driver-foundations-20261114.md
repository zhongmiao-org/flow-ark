# 通用RPA驱动能力完善（2026-11-14）

用户要求参考现有RPA完善FlowArk的浏览器及桌面执行能力。本批不调用用户API Key，不访问既有被电脑控制工具拒绝的URL，也不借RPA代理绕过限制。工具限制不是FlowArk的产品能力边界；本机驱动回归不代替飞书整表业务验收。

## 官方资料对照

- [UiPath Browser Automation Mode](https://docs.uipath.com/activities/other/latest/ui-automation/browser-automation-mode)：浏览器扩展、WebDriver与Chromium连接是不同的浏览器执行方式；不是统一坐标脚本。
- [UiPath Modern UI Automation](https://docs.uipath.com/activities/other/latest/ui-automation/about-the-ui-automation-next-activities-pack)：严格/模糊选择器、锚点、视觉与图像是不同定位能力，先确定Application/Browser范围。
- [Power Automate UI elements](https://learn.microsoft.com/en-us/power-automate/desktop-flows/ui-elements)及[检查器](https://learn.microsoft.com/en-us/power-automate/desktop-flows/inspect-ui-elements)：网页元素与桌面UIA/MSAA控件分开采集，检查层级/属性/选择器，不能互相冒充。
- [Playwright actionability](https://playwright.dev/docs/actionability)：唯一、可见、稳定、命中、可用、可编辑及非inert分别检查；动作返回与业务回读分别处理。
- [WAI-ARIA disabled](https://www.w3.org/TR/wai-aria/states_and_properties)：aria-disabled应用于控件及其可聚焦后代；readonly不等于所有点击都禁止。
- [Robocorp RPA Framework](https://github.com/robocorp/rpaframework)：Browser、Desktop、Windows和Office采用独立适配能力，不把单站脚本作为通用驱动。

## 分层与当前实证

FlowArk已有独立浏览器DOM/framePath/唯一目标、内置原生输入、macOS明确窗口/AX元素/视觉观察及去重；这些基础不删除，也不因Electron而重构。DOM/AX可读取的控件优先结构化定位；Canvas没有可读DOM时明确报告能力缺口，视觉动作仍需已授权窗口与新鲜观察，不猜选择器、不默默降级坐标。

首先修正动作前置条件：

1. 内置浏览器在输入/首次按下前复核原绑定元素连接、原生禁用、组合祖先aria-disabled及inert；文本/选项修改同时核对原生readonly与支持角色的aria-readonly。开放ShadowRoot跨宿主祖先与slot须按组合树处理。可只读观察禁用/只读控件，不将readonly误当所有点击均禁止。保持原预算和唯一性/几何/命中/可信事件/取消守卫；按下后失败仍unknown，不重按。
2. macOS仅对elementId-backed click/doubleClick，在动作消费及首个原生事件前重新检查AXEnabled；明确false返回target-disabled并沿现有NativeNotExecuted语义上报。属性缺失不能写成已验证可用；不把失败改成坐标降级，不改绑定、焦点、指针、防重或权限。
3. 普通AI开发界面明确“Excel来源表头/统计”与“目标网页结构尚未读取”，不能把来源空表头展示成目标字段识别结果。

不新增公共节点版本或IPC，不扩大权限；此为既有驱动对不可交互目标的正确拒绝，旧Run快照及unknown原样保留。先更新既有Figma再调整来源展示。后续只读结构检查器、AI证据接入和明确驱动能力选择另记实施，不以本批驱动修复声明已完成。

## 验证与交付边界

使用允许访问的独立本机DOM/原生虚构控件，核对禁用/只读/inert输入无派发、普通控件输入提交及回读、组合树和状态变化前置条件。驱动回归、正常AI生成、安装候选和真实平台分别记录。不新增或运行单元测试；既有类型、构建、契约、静态与diff检查按实际执行登记。不得运行旧未知动作或清理当前新验收工程，不创建标签或Release。

## 第一批实证

既有Figma AI开发画板1234:11788先行更新来源/目标说明（文本1234:11862、11868），截图已核对，无新增权限。

源码补齐DOM组合树及框架身份前置检查、支持原生类型的隐式ARIA角色、可用性和可编辑性分开、纯文本光标导航保留；不将select/checkbox上的无效原生readonly属性视为禁用。macOS最窄AXEnabled检查已按现有Swift编译参数通过。

在独立localhost虚构页面，用实际生产EmbeddedPage与真实Electron WebContentsView/CDP运行，15项负向均拒绝且对应点击/文本/变化计数0；覆盖原生/ARIA禁用、disabled按钮后代、inert、开放ShadowRoot、slot组合祖先、原生与显式/隐式ARIA只读、悬停/聚焦后变状态、inert父iframe。正常iframe、首个legend例外、纯文本只读光标导航、普通填充/选择/勾选/点击均通过，0012300前导零保持。该验证是驱动集成回归，不是单元测试，也不是客户端AI生成或飞书实站验收。

初次回归覆盖显式role但独立审阅发现遗漏隐式role，以及无效readonly属性/纯光标导航被过度限制；已修并加入真实控件回归。首轮安装包未安装即被后续修订替代，不以第一轮静态通过掩盖遗漏。原生AX实际控件回执和最终候选安装继续分别记录。

## 安装候选与原生实测回执

运行源码30f2f51e8ad2f7601a697cf7655d9250c95435fc已固定签名打包，并在正常退出、完整备份后安装至原路径。安装ASAR SHA256为6d504d8f5b71205f338bc734aabca08ab45e8ed535b3b3538096ce229ebbcccd，签名核验通过，工作区正常显示，本次启动未出现钥匙串提示。既有类型、构建、契约、静态检查与最新提交CI通过；无新增或运行单元测试。

仅操作自行构造的本机AppKit窗口，以公开工程CLI打开正常UI核对、绑定目标及动作授权，不调用模型。禁用入口Run e95266cc-cb45-492a-8fdc-2865ebdff2f6完成：窗口激活performed，唯一禁用按钮elementId点击返回not-executed/target-disabled，未降级坐标。启用入口Run cfd1d1a0-d846-497a-8e9b-a6bb309a65bc在激活阶段返回unknown/activation-phase:foreground-pid-unconfirmed，尚未提交按钮点击，未重放。后续只读AX核对Enabled click count仍3、Disabled click count仍0。

第一次Run前启用计数已为3（非本次FlowArk Run产生，成因未确认），因此工程在任何Run前采用实际基线N与单次点击后N+1，不重置计数或伪造零基线。禁用回归通过；原生启用点击、窗口激活稳定性仍未通过。不能以负向安全停止或DOM成功宣称原生驱动全部可用。原生工程属于外部作者驱动回归，不冒充客户端模型生成。

本批用户API调用0次，原Excel与真实飞书未写入，既有unknown及安全记录保留。PR继续草稿，不创建标签/Release，不合并仍缺真实业务验收的PR。下一步须先复现并修正准确窗口激活问题，再完成正向原生输入；只读结构检查器、AI证据接入与原Excel真实填写/保存/重开防重仍未完成。

## 2026-11-14 焦点接续修复

助手长期读取NSWorkspace前台应用，Apple说明NSRunningApplication/NSWorkspace变化属性依赖main RunLoop common mode刷新；当前stdin阻塞循环不保证此条件。后续将前台核验统一改为系统辅助功能AXFocusedApplication的即时查询及PID，保留准确AXFocusedWindow、绑定身份、输入前后守卫和1.5秒激活确认期限，不以延长超时或强制激活代替。查询失败仍关闭输入。此为可证实缓存风险的修正，是否解决本机实测需安装正向点击/输入/回读验证，不预先标记通过。

焦点修复源码638f6c6已完成类型/构建/Swift编译/固定签名打包和安装，ASAR为446f8317ff42cc8b5ab7da94d6b96085447fa6acbcab37ae73055f89e7c6e7ae；原凭据文件摘要保持，工作区无钥匙串提示正常载入，最新客户端CI通过。输入诊断改变动作说明，原实例正确拒绝兼容替换，已普通UI确认隔离实例。新Run 3fb80105-5c21-44e5-b443-c7ce03c3ea9f在activate派发之前返回not-executed/user-intervention:pointer-changed;phase=initial;dx=0;dy=6.125，无按钮点击或文本输入；不能据此声称焦点修复已实际通过。已请求确认当前桌面占用，在答复前不继续共用鼠标键盘跑测。fixture在发现时不在运行，重新打开后新进程初始计数0/0，旧进程3/0和Run回执仍完整保留，不将进程重启混写成数据恢复或防重通过。

用户确认当前正在使用桌面，停止所有UI/原生跑测，继续代码。额外复核发现长文本Unicode分块期间仅核对前台窗口，未逐块核对同一输入控件；计划在每块派发前核对AX焦点仍为起始控件且非安全输入。文本和选区允许因本次输入正常变化，不复用旧值摘要作逐块判断；首次派发后发现失焦仍unknown，不自动续写。此为既有焦点守卫补强，不新增权限或公共命令；不以源码完成标记实测通过。

长文本逐块焦点守卫源码4dfec2f已提交，Swift编译与完整构建通过；尚未重新安装，日常安装仍638f6c6，用户使用桌面期间不再退出/安装。原生正向和原Excel业务仍未通过，不调用用户API Key。已准备只操作自建fixture的点击计数N+1、唯一焦点文本框0012300输入/Return/AX回读脚本；须桌面空闲后正常核对，不能替代真实飞书验收。

独立复核发现638f6c6系统AX查询设置的messaging timeout具有进程全局作用（SDK AXUIElement.h明确规定），会无意影响后续控件读预算，不能直接用于后续验收。修正为本助手串行查询时临时设置，查询后显式以0恢复本进程原有默认（其余调用仅对象局部设置，无其他全局设置）；设置/恢复失败均抛错关闭操作，不保留污染预算。日常已安装638f6c6属于未验收候选，用户桌面空闲后须先用修正构建替换再测。
