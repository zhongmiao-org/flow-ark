# P1 契约 0.6.0：浏览器框架定位

继承 [0.5.0](../v0.5.0/README.md)，增加 browser v2 节点和 FramePath，流程格式仍为 1.0。browser v1 保持顶层页面语义；旧客户端对 v2 明确拒绝，不忽略框架后在顶层执行。可声明 browser-frames-v1 能力。已保存流程、计划、快照不自动升级，无 SQLite 表结构变化。

v2 与 v1 字段相同，另有必填 framePath：由外到内的 CSS 选择器数组，最多 8 层，每层非空且最多 2000 字符。每层必须在当前父框架中唯一匹配 iframe/frame 元素；不使用易漂移的数字索引、原生对象或跨框架自动搜索。空数组表示顶层。示例见 [嵌套框架流程](example.frames.flow.json)，仅演示格式，不表示 example.com 存在对应页面。

read、click、fill、wait、upload、download 在最终框架内查找 selector。navigate 和 screenshot 仍针对顶层页面，framePath 必须为空；内部驱动的 url 同样只返回顶层 URL。内部 count、attribute 支持同一框架路径。iframe 不改变上传的本地文件绑定与下载的产物目录规则，不暴露浏览器原生对象。

每条命令从顶层重新解析完整路径，在命令内固定找到的框架，不缓存上一次切换状态。路径缺失、重复匹配、非框架元素、框架被移除或超时必须失败，不回退顶层、其他框架或其他驱动。跨源框架通过浏览器自动化接口访问，不注入绕过同源限制的页面脚本。等待路径和元素共用命令超时预算，动作提交失败不自动重放。会话关闭/运行取消仍回收本任务的会话。

发布标识 contracts-v0.6.0，实际发布以远程 tag 为准。生成命令 `python3 contracts/build_contracts.py --version 0.6.0`；规范、示例及摘要随版本固定。实现与分层验收见 [浏览器框架](../../docs/client/browser-frames.md)。
