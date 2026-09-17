# Chrome 上传下载后的恢复缺口

2026-09-16，本机 macOS 27 / Chrome 153.0.8010.48 / playwright-core 1.63.0。此记录是未解决的兼容性缺口，不是恢复验收通过。安装与当前版本结果以 [验收记录](acceptance.md) 为准。

2026-09-17 再次复现原始三轮失败，并在新临时 Profile 验证关闭下载自动弹层、显式 enable-automation 两个独立对照；均未解决，不保留这些实验参数。系统再次记录 Chrome 主进程 EXC_BAD_ACCESS。为推进实际调试，0.1.5 对 macOS Chrome 153.0.8010.48 的自动下载操作在准入和驱动层明确拒绝；不触发点击、不替换驱动、不自动重试。其他操作继续分别验收，不将该限制描述为浏览器崩溃已修复。限制按实际重新探测的浏览器版本判断，既有流程和快照不改写；后续版本须单独验证，不因版本不同直接宣称全部兼容。

## 已取得的证据

完整 `pnpm test:scenario` 在首轮框架上传下载、缺失框架失败、等待取消之后，重开相同专用 Profile 再下载时失败。Chrome 的 SIGSEGV 早于宿主关闭请求；系统崩溃报告为 EXC_BAD_ACCESS/KERN_INVALID_ADDRESS。Run 记录 FAILED，不自动重放。原始记录见 [验收报告](acceptance.md)。

进一步缩减后，取消操作并非复现的必要条件。绕开 FlowArk 执行引擎、宿主、Sessions 和 BrowserDriver，仅用 Playwright 的 `launchPersistentContext`、`frameLocator`、`setInputFiles`、下载保存和关闭，依次执行以下三轮也已复现：

1. 新专用 Profile：跨源嵌套框架上传虚构文件，核对回执，下载并核对内容，然后关闭。
2. 同一 Profile：重新打开，仅只读检查框架内容，然后关闭。
3. 同一 Profile：再次上传、核对回执、下载并关闭。

两种框架定位方式的独立实验都出现关闭挂起，随后重开下载失败。使用 `frameLocator` 时第一轮下载内容已保存但关闭超时；使用显式 `contentFrame` 时也观察到只读重开关闭超时。该结果排除了“必须经过 FlowArk 执行引擎才能触发”，不能据此定位 Chrome 内部缺陷或宣称所有上传场景均不兼容。

后续采样试验还观察到前两轮均正常关闭、第三轮下载仍崩溃：系统报告 `Google Chrome-2026-09-16-192518.ips`，PID 90908，EXC_BAD_ACCESS/SIGSEGV；摘要 `test-results/chrome-clean-close-crash.json`。因此强制回收也不是必要条件。另一轮对挂起 Chrome PID 90974 的线程采样显示主线程在 AppKit/CoreFoundation 事件循环等待；Playwright 日志停在 graceful close start。采样未定位 Chrome 内部根因，不据此推断死锁或采用关闭参数规避。

未上传、只重复下载的对照曾通过；合并超时和取消的另一轮也曾通过，因此不能用偶尔一次成功认定解决。固定下载目录、延长关闭等待、用内存文件替代路径上传以及逐页关闭均未解决，均不保留为产品改动。没有切换浏览器、改动用户 Chrome、清空日常 Profile 或放宽失败断言。

## 可重复命令

客户端提供独立命令：

```sh
FLOWARK_CHROME_PATH='/Applications/Google Chrome.app' pnpm test:browser-recovery
```

该命令不依赖客户端编译产物，使用已选本机 Chrome 和 localhost 虚构数据，每次创建全新的测试 Profile，再在三轮之间复用它。Playwright 子进程不加载 FlowArk 执行代码。每轮最多 30 秒；超过期限只回收本测试拥有的进程树，并将该轮记录为失败，继续下一轮诊断。不会使用现有账号会话或访问招聘网站。

结果写入客户端忽略目录 `test-results/browser-recovery.json`，包括浏览器和依赖版本、每轮已到达阶段、退出码/信号、超时、上传内容与下载内容。只有三轮全部正常退出、两个上传及下载内容均正确时命令才返回成功。测试 Profile 留在系统临时目录用于诊断，不提交到 Git。

后续修复须再次通过原有完整宿主回归；此命令通过也不能替代任务取消、资源回收或真实网站验证。生产 Profile 和未知业务结果不得作为自动重试试验材料。
