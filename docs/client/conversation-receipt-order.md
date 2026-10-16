# 会话迟到保存回执与输入顺序

2026-10-16，承接[长期计划](guided-skills-boss-plan-20261015.md)S08与[持久会话](guided-conversation.md)。当前快照通过onmessage按sequence归并，但ConversationPanel操作回调在调用归并后，仍单独把conversation.draft返回的draft写进输入框；旧响应即使被快照归并拒绝，也可能覆盖已经接收的较新输入。

先更新原Figma冲突板[505:5761](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5761)与消息恢复板[505:5848](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5848)的四处规则文字：保存回执迟到时保持最新输入，重读不允许旧回执覆盖，保留尚未提交的本地输入。复用原组件、字体与变量，无新画板/组件；两张整板已查看，文字没有新增越界。当前只为先行规格，不计客户端修复通过。

所有会话输入更新必须通过同一已校验快照归并规则。保存正常响应保留本次明确输入；已被较新快照或本地未提交输入取代的旧回执不得另行覆盖。重复、旧、其他会话快照、跳号恢复与重新挂载仍遵循现行身份/序号和完整快照规则，不修改会话协议、数据库、Provider或Key边界。不增加业务提示词或招聘分支。

按阶段约定不新增/运行单元测试。先在使用实际ConversationPanel和契约校验的隔离人工界面，明确控制保存响应、onmessage新快照与旧回执顺序，复现再修复；核对正常保存、旧/重复事件、跳号、其他会话、本地未保存输入及重挂载。受控桥不等于原生IPC或真实模型网络，后者仍独立记录。随后类型/构建、PR/最新CI、最终合并源安装和真实资料保护分别取证。

完整S08的流式网络/取消/重试/重连矩阵、两家真实Key、本人蒸馏与BOSS业务继续，不把这一输入覆盖修复当作全部完成。

## 客户端修复与人工核对

先行治理[PR #781](https://github.com/zhongmiao-org/flow-ark/pull/781)由最新CI 38849766815自动合并为`c1bca8bfe28fc28052c97181a7ed261bff56fa65`。客户端移除操作回调对输入框的第二次赋值，保留既有accept序号、身份及本地编辑检查；没有修改协议、SQLite、适配器或业务模板。

隔离人工界面加载实际ConversationPanel、Ant组件和现行契约校验，只通过可见控制按钮释放受控回执/事件。修复前明确观察：保存快照sequence2→较新快照3→保存回执2，正文先到较新输入，再退回旧输入并误标未保存。相同时序修复后仍为较新输入，已保存状态保持。另逐项核对旧/重复快照、其他会话事件、跳号6/9后的完整快照读回、本地未保存补充在跳号/手动重读后保持、仅正常保存回执及重挂载读回。这些是实际Renderer人工观察，桥接层为虚构控制，不是原生IPC延迟或真实模型网络证据；重挂载不等于应用重启。

客户端[PR #286](https://github.com/zhongmiao-org/flow-ark-client/pull/286)源`4f072f489b5da17168237ac4215bbddc2dfea68a`，最新[CI 38849962870](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38849962870)的Validate/Auto Merge成功，实际合并`801231c489eb8615ce960567d20e84f74a2195fd`并同步main。标签事件取消的旧CI 38849935693不作通过依据。`pnpm typecheck`、`pnpm build`、修改文件Prettier和`git diff --check`均通过，构建保留原大chunk提示；未新增/运行单元测试，无Key或模型消耗。原始DOM及人工控制源只留本机，公开记录不含真实材料。

## 最终安装与资料保留

从已合并main执行`pnpm package:mac`成功，生成macOS arm64 ZIP/DMG；正常退出、核对零主进程并备份私有工作区与旧安装后，串行更新原安装。最终ASAR为`c3f58fe81d4f1e8689f241a04a1f69ea17ff2d33b96e4a552ec4ad94a5503ee3`，与候选逐字节一致。包未签名/公证，不代表正式发布。

安装版正常重开原私有实例，仍只有原1条已完成资料解析记录，0.4.0和已保存README/initial输入保持；访谈仍缺ai/workspace且运行禁用。原生Dark整窗已查看。只读比较更新前后的全部documents、events及受保护数据密钥字节一致，原简历文件不变且源仓库干净，最终一个安装版主进程。没有把人工桥接记录或合成会话写入该工作区。

[结构化记录](conversation-receipt-order-20261016.json)区分受控Renderer时序与安装资料保留。原生IPC迟到时序、实际取消/重试/网络故障/重连、完整S08/186/U01–U12/Agent和真实Key个人蒸馏/BOSS目标继续；没有将安装页可见计为这些业务通过。
