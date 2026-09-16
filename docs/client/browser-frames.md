# 浏览器框架定位

P1 通用浏览器节点增加 iframe/frame 路径，协议见 [0.6.0](../../contracts/v0.6.0/README.md)。编辑器中的路径每行一个 CSS 选择器，从顶层向内排列；留空表示顶层。浏览器节点仅在用户编辑并保存后使用 v2，原有 v1 流程与计划保留。

Playwright 适配器使用指定本机 Chrome，在每条命令开始时固定当前页面，严格查找各层框架元素并取得该元素的 contentFrame；临时句柄用后释放，框架对象只留在适配器内。固定框架身份使运行中的 iframe 替换明确失败，下条新命令才能解析新实例。参考 [Playwright 元素与框架接口](https://playwright.dev/docs/api/class-elementhandle#element-handle-content-frame)。

Selenium 适配器每条命令先返回 defaultContent，再按唯一元素逐层切入，结束或失败后返回顶层。复位失败使会话失效，后续不能沿用未知框架状态。参考 [Selenium 框架切换](https://www.selenium.dev/documentation/webdriver/interactions/frames/)。此实现不代表 Firefox/Safari 实机通过；原有 Safari 上传和 Selenium 下载限制仍适用，准入时报告不支持的能力。

验证需分别覆盖：顶层与嵌套同名元素隔离；同源/跨源框架读取、填充、点击、上传与下载；延迟框架、缺失/重复/非框架路径拒绝；命令间替换重新定位、命令内移除失败；失败后顶层操作无残留状态；等待和取消不重复提交。真实宿主 → Worker → 会话进程集成验证 framePath 未丢失，旧版顶层节点保持行为。桌面保存重开与模板导入导出验证 v2 与路径保留。

当前实际执行结果统一记入 [验收记录](acceptance.md)，本文件描述语义与验收要求，不以本地测试替代招聘网站或未测试浏览器的兼容验收。

会话清理绑定具体实例；旧命令的延迟失败不能关闭后来创建的会话。同一浏览器绑定启动新会话前等待旧进程退出，关闭中的会话仍参与原 Run 的清理等待。取消信号贯穿等待和启动准入，已取消请求不在等待旧 Profile 释放后再启动浏览器。
