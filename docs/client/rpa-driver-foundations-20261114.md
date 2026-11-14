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
