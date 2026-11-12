# Desktop automation v1（未发布草案）

配套 docs/client/macos-desktop-automation.md。与原desktop-selection-v1并存，不替换旧Run。

- discovery：权限状态及有限应用窗口元数据，不读取正文。
- bind：本人明确选择应用/窗口并批准读取及操作范围，返回私人短期bindingId；公开工程不得携带绑定。
- observe：固定bindingId，返回observationId、控件树、窗口边界和可选PNG；控件引用仅本次观察有效。
- 2026-11-12 焦点快照增量：observe可附带`focus`，仅含当前非受保护焦点的`role`、`subrole`、可读的窗口局部逻辑`bounds`，以及在本次控件树中唯一匹配时的`elementId`。非前台应用、安全输入及无法读取焦点时省略。不新增焦点正文、选中文字或选区范围；缺失表示当前无法提供可靠焦点，不代表网格模式或未编辑。引用随本次observation失效。焦点快照只能让平台Skill核对已实证的控件模式，不能单凭AX角色推断编辑、提交或TSV多格粘贴语义。
- act：bindingId、observationId、唯一actionId、固定动作及参数；缺失/过期观察、身份/焦点/几何改变拒绝。动作执行前占唯一桌面租约，副作用先持久化预留；相同actionId不再执行。
- receipt：not-executed / performed / unknown；performed仅说明原生动作返回，不代表发送/保存成功，业务需独立观察证据。unknown不得重试。
- release：取消、退出、睡眠/锁屏时销毁原生会话及窗口引用。重开不复用旧绑定，不重放动作。

通用能力不提供任意Shell/AppleScript、内部IPC或系统环境访问；AI只能使用正式工具。Windows明确unsupported。权限、截图/模型信息范围与费用确认独立；预算耗尽暂停保留记录。

焦点字段为未发布v1的可选输出增量，既有命令、权限、effect键、Run和数据格式不迁移。Native与Main校验器须同包更新；不得把新增字段的Native单独接入旧严格响应Schema。依赖焦点模式的脚本须检查安装SDK支持及本次`focus`存在，缺失时停止该操作，不伪造默认焦点。原生动作继续校验内部同一AX引用及完整焦点/值/选区摘要；公开快照不替代或放宽该守卫。窗口观察不是原子页面事务，树与焦点无法唯一关联时省略`elementId`，不得猜测引用。

SDK原生子动作必须关联本Run已有正式template-effect预留凭据effectId；原模板action/entry/grant校验保持，默认deny不因窗口绑定放开。desktop-effect仅为原生子动作回执，performed不能代替业务confirmed。readSelection仅复制所选前台窗口当前选区并回读到本地，保护并恢复剪贴板，不隐式交给模型；复制未确认或焦点/来源变化时停止。坐标为窗口逻辑点，截图像素必须按图像/窗口尺寸换算；人工移动鼠标或按住修饰键拒绝提交。

2026-11-12 动作准备顺序修复：首次新`effect.prepare`在返回`execute:true`前，先完成既有入口的运行级scope确认，再完成当前操作准备确认；两者仍独立，权限范围及默认值不变。准备等待结束后和登记submitting的同一事务内，必须重新核对当前配置、资源、权限、固定Run归属及取消状态；变化时不登记可执行凭据。脚本取得准备结果后才fresh observe并act，避免首次运行级人工等待消耗已取得观察的有效期。act保留原有canWrite复验及原生观察时限/焦点守卫，不延长或伪造观察，不提供空操作预授权API。已有effect仍原样返回execute:false，不新增scope确认、不删除或改写unknown；纯observe/readSelection不因此增加写入确认。

2026-11-12 纯桌面与模型凭据分离：打开桌面绑定面板、发现/绑定窗口、冻结本次连接身份及纯observe/readSelection/act，不解密或读取API Key，不为此检查安全存储可用性或创建凭据目录/文件。Main内部只读凭据身份仅允许已验证的供应商或本机凭据ID，返回既有加密文件存在性及其SHA-256修订；configured仅表示密文存在，不证明内容有效或可解密，不返回model、Key尾号或正文。未配置模型凭据仍可绑定并执行已授权的纯桌面流程；只有真正调用decide时才按本人选择服务读取受保护配置和Key，核对与绑定时冻结的连接及密文修订完全相同，缺失/变化则停止，不静默换Key或服务。compatible服务的本机凭据也须在实际解密读取时匹配固定修订；密钥保护不明文降级。

绑定采用Main内部staging→ready：原生窗口确认和宿主预算/连接身份冻结全部成功前，state及运行预览不可取得可执行绑定，command拒绝未就绪绑定。成功后只以准确scopeId/bindingId发布；失败、取消、过期、退出或锁屏释放该次绑定，不让迟到失败释放新的绑定。准备期间阻止并发发现/换绑/权限请求，异步返回须匹配当前绑定尝试；不新增Renderer IPC、动作权限或隐式启动。桌面面板只展示已有非秘密连接说明，不自动解密AI配置来刷新标签。模型调用、截图授权、原生动作及业务回执仍分别核对，用量不因本次重绑清零。

模型审计完整保存，发送模型的上下文按内容摘要复用重复工具文档和递归Schema定义，并显式标注引用策略，不静默裁剪。新增flowark_project_context批量读取公开文件/SDK，最多64KiB源文件，返回遗漏清单；静态读取不调用模型。不因换调试实例或重新绑定清空同一工程活动批次的已用模型次数，桌面效果防重以正式工程归属跨其调试实例保留。

2026-11-09 工程故障接续：project.ai.get可附带本工程最近失败运行的只读恢复摘要及待核对数量；不覆盖本人选择的历史runEvidence。摘要只包含运行/节点身份、状态、脱敏诊断及动作结果，不发送完整业务输出或更改待办。内置协作AI可读取本工程history/status；status投影为相同摘要，不能借状态工具获得运行、重放、确认unknown或读取其他工程的权限。技术诊断允许在已批准节点及相同规划内局部修正；宿主继续拒绝越界和过期确认。

project.ai.start/resume新增可选intent=analyze|plan（省略保持原规划模式）。analyze由宿主只公布只读规范/源码/工程history/status工具，并跳过组装/业务完成判断；模型无法通过措辞绕过阶段限制。get返回的recovery与显式选择的runEvidence分开，含最近检查范围、待办身份与运行摘要；不清除、批准或重放任何记录。

run.detail可返回宿主从固定快照实例引用唯一推导的developmentProject.id，供现有失败页进入原工程AI对话；不存在唯一所属工程时不返回，不依据UI传入路径猜测归属。该引用不授权修改、运行或确认业务结果。

2026-11-10：run.detail的desktopReceipts仅包含文档替换回执，desktopAutomationReceipts包含原生动作记录（runId/actionId/effectId、at/completedAt、performed|not-executed|unknown及原因）。两种回执不能混用，缺少时间不得显示Invalid Date，performed不等于业务成功。内置AI的runtime_instance/preview限定为配置结构、资源ID/授权/绑定状态和准入诊断摘要，不发送资源值、路径、Key、业务输出或隐式批准运行。
