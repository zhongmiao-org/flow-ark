# P1 0.44.0：可引用的网页目标

2026-10-19正式候选，尚未发布。继承真实已发布0.43.0，新增browser v8与browser-target-input-v1；发布前客户端不得采用。旧v1–v7、包2.0、SDK1.0及现有数据库/IPC保持。

## 输入与采用

BrowserTargetNode仅支持click/read/wait，selector为1–2000个Unicode标量、trim后非空的CSS字符串或严格单键Value引用。引用根为params/steps/item/index，禁止空段和__proto__/prototype/constructor；index只允许该根本身，params/steps须有子路径。解析后必须是合格字符串，不递归执行数据里的引用，不拼接表达式或猜城市。

framePath为最多8个固定非空白CSS字符串，每层最多2000标量；value固定null。timeoutMs可选100–3600000毫秒，仍受父容器和取消约束。不把本能力用于fill/upload/press等其他动作；旧节点不接受新引用。作者通过既有目标配置明确采用，再使用普通变量选择器并保存，新运行才生效，草稿可撤销。

流程必须声明browser和browser-target-input-v1。正式入口capabilities须包含两者，且声明自己的browser/use资源；作者采用有效能力集合（流程requiredCapabilities与入口额外capabilities的并集），也须由入口resourceIds声明同一资源。click入口另须有至少一个实际声明动作，默认deny与运行时既有写入守卫保持，选变量不是副作用授权。unsupported客户端拒绝，不转换成旧节点或转脚本执行。

## 固定调用关系

BrowserTargetInvocation在准确节点字段外增加nodeInstance，selector须已解析为有限文本。宿主先核对固定源节点的id/type/version/operation/name/timeoutMs/value/framePath，原selector是字面量时还须逐字相同；只有固定源已声明的selector引用槽可以接收解析文本，不新增字段或换动作。nodeInstance须为当前活动Run中真实登记的节点实例，路径末段须为源id；同时核对当前能力、浏览器绑定/入口资源及写入守卫，异步返回前再次核对活动Run与取消。

引用在可信本地Worker的本次不可变作用域解析。固定字段关系校验不声称宿主重建了任意脚本内部上下文；脚本、Renderer、模型不获得直接调用Worker宿主通道的权限。原生执行与内部关联是G2要求，纯参考不证明生产来源。

## 驱动与结果

每次命令在原浏览器和固定framePath逐层唯一绑定框架；唯一绑定一个可见元素，多匹配立即拒绝，未出现可在期限内等待。绑定后、实际派发前目标/文档/框架失效时拒绝，不改用新对象，不切驱动重放。点击派发后的弹层关闭或页面变化不因旧元素消失而自动再点，也不单独证明成功或失败；驱动调用完成仅返回未业务核对的点击结果，调用后传输错误等按未知结果处理。read/wait期间原目标失效不寻找替换节点。单次命令绑定不构成跨节点事务；业务模板仍须在动作前核对实际城市、岗位/账号身份和本次来源。

read返回有效Unicode文本，最多65536 UTF-8字节，超限整次拒绝；wait仅返回true，证明本次唯一目标可见；click返回严格的`{clicked:true,verified:false}`，只证明调用完成，不证明业务受理。点击后取消、超时或传输错误不自动重试，由既有操作账本和模板将未明结果交本人。迟到结果不驱动后续动作；沿用秘密过滤、受保护结果及普通日志边界。

## 参考与消费门槛

p1.schema.json新增节点、解析调用及三种结果定义；browser-target-input.ts只校验格式、引用、固定字段、结果字节及声明，不访问浏览器、Store或网络。browser-target-input.cases.json与browser-target-declarations.cases.json是规范正反资料，不是应用单元测试或可执行业务模板。example.browser-target-input.json只为通用格式示意，不含当前城市或个人数据。

正式发布须核对PR最新head、完整远程内容、实际合并与tag；消费者从准确tag独立采用。G2完成宿主/Worker、严格驱动、普通变量配置和原生受控验证、打包、全UI导出及独立复导后，才在BOSS作者流程接城市选择与投递前复验。没有真实整链投递及网站每日150次限额弹框，仍不计业务验收通过。
