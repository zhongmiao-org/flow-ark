# 0.1.5 逐步调试预览

2026-09-17。当前通用阶段的目标是通过安装版实际调试页面填写、选择、上传和结果核对，再与用户一起录入 BOSS 流程。Codex 配置继续后置，真实招聘外发仍需逐动作配置与授权；不会把本地表单成功当作招聘模板已可用。

## 操作

1. 在编辑器保存流程与本机资源绑定，点击「逐步调试」。系统创建不可变运行快照，在首个节点前暂停。
2. 查看「下一步」位置，点击「执行下一步」。这是实际执行，会调用所选浏览器或文件等能力；单步不是模拟。
3. 在「步骤输出」查看已完成节点的脱敏预览。选择、输入值读取、断言和截图可组合用于定位页面变化。长输出会截断，预览不是全部业务事实。
4. 「继续」连续执行剩余流程；「步骤后暂停」在下一个节点入口停止；「取消」协作停止并回收当前任务的 Worker 和浏览器资源。

条件和循环会逐步进入实际选中的分支及每次迭代；容器收尾的结果记录不额外执行副作用。人工节点进入 WAITING_INPUT，需用户点击「继续」确认；单步不能跳过人工等待。暂停不修改既有快照，修改草稿只影响以后新 Run；失败、取消或重启都不会自动重放先前步骤。

调试信息、历史及输出预览保存在本地受保护存储。输出仍须按用户资料处理，不能把脱敏器当作绝对防泄漏保证。公共流程契约仍为 0.7.0，新增内容是客户端本地运行控制，无 SQLite 结构迁移；请求与兼容边界见 [本地 IPC](local-ipc.md)。

## 浏览器边界

本机 Chrome 153.0.8010.48 的上传/下载后关闭和重开崩溃仍可由独立 Playwright 程序复现。两个额外实验（禁用自动下载弹层、显式自动化启动标识）均失败，未保留实验参数。为推进表单和上传调试，该版本在准入及驱动层拒绝自动 download，包含此节点的流程不创建 Run、不点击下载入口、不切换驱动重试。重新探测当前安装版本后判断，不使用过期绑定中的版本。

这是一项明确的兼容限制，不是修复 Chrome。原始完整上传下载恢复用例仍保留失败状态；上传、表单和取消重开使用单独证据。详见 [恢复缺口](browser-recovery.md)。Firefox/Safari、真实招聘及 Codex 的既有未验收状态不变。

## 开发验证

代码本地提交 `7e97e42`，未推送客户端公开远程。最终 `pnpm check`：类型检查、59 项单元、构建通过；`pnpm test:runtime`：18 项真实进程验证通过。

新增行为覆盖：暂停状态发布时立即响应不会丢失；启动预检期间请求暂停仍在首步前停下；逐步进入条件和循环；调试期间编辑草稿不改变当前快照；拒绝尚未消费的重复继续指令；取消前不执行后续副作用；下一次调试采用新草稿。旧有排队、脚本、计划、故障和恢复用例继续通过。

`pnpm test:debug` 通过真实 Electron → IPC → 宿主 → Worker → 本机 Chrome 验证：首步前无节点执行；单步打开页面、填写名称并读取实际值；界面显示下一个位置与输出；连续运行后逐字段比较本地接收值；取消页面等待后重开、再次上传并核对全部字段；已知下载操作在创建 Run 前拒绝。隔离数据目录、临时浏览器 Profile、虚构文件与空浏览器缓存，退出码 0。已查看截图 `test-results/debug-paused.png`。

完整 `pnpm test:desktop` 与 `pnpm test:forms` 的 9 个场景再次通过。报告：`test-results/debug-desktop.json`、`test-results/form-lab.json`；日志：`/private/tmp/flowark-debug-check-final.log`、`/private/tmp/flowark-debug-runtime-final.log`、`/private/tmp/flowark-debug-desktop.log`、`/private/tmp/flowark-debug-editor.log`、`/private/tmp/flowark-debug-forms.log`。

```sh
pnpm check
pnpm test:runtime
pnpm test:debug
pnpm forms:serve
# 安装包实际调试：
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:debug
```

构建产物、安装后运行和升级保留结果须单独记录，不由上述源码检查推断。
