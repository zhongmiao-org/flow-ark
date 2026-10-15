# 2026-10-15 跨页按钮、状态与安装核对

依据[跨页按钮规范](shared-actions-design-20261015.md)及原Figma文件的[471:5124补充稿](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=471-5124)，继续上一批检查器优化。原186节点、既有参数、保存、返回、Run隔离和执行门槛保留。本批不修改模板、IPC或公共契约；契约仍0.17.1。

## 实施范围

共享ActionButton复用Ant Design Button/Tooltip，支持悬停、键盘聚焦、显式及ConfigProvider继承的禁用原因，并保留原按钮ref、完整可访问名称和加载语义。操作组使用12px间距、宽度不足换行，常用动作预留160px，运行控制保留原120px；文案及加载图标不挤动邻项。CSS仍负责布局及语义适配，文件存在不代表基础UI库未迁移。

| 页面/区域 | 本批调整 | 证据范围 |
| --- | --- | --- |
| 资源配置 | 编辑映射、应用配置，操作分组及提示 | 安装版打开原Excel配置、取消返回同一流程 |
| 脚本配置 | 编辑脚本、历史输出、参数与资源 | 源码与生产组件人工页面，完整脚本配置页未原生走查 |
| 流程控制/步骤位置 | 步骤与期限、配置关联步骤、配置数据、聚焦步骤，保存提示及ref | 源码与生产组件人工页面，完整控制分支未原生走查 |
| 参数与资源 | 保存参数提示及固定组宽，目录完整路径提示和加载保留文案 | 安装版未改值保存成功；最终版系统目录选择后取消并保留原绑定 |
| 更多操作 | 创建副本、流程大纲等短标签与完整说明 | 安装版打开副本核对页，未确认创建，返回原流程 |
| 运行详情/结果 | 控制按钮提示、人工请求、核对重跑 | 安装版旧取消Run详情/结果及来源选择往返，未预览、未创建Run |
| 本地设置 | 流程配置及应用/驱动长路径提示容器 | 安装版查看浏览器绑定页面，未实际选择浏览器/驱动 |
| 模板配置 | 提交加载提示、保持原提交条件和宽度 | 源码及生产组件人工页面，完整模板提交未原生验收 |
| 编排检查器 | 网页配置、AI修改及独立脚本入口的间距/提示 | 源码与既有检查器规范复用，不重复宣称所有节点已走查 |

共享CSS将nav规则收窄到.sidebar，避免影响面包屑和其他导航；选中/aria-pressed规则排除disabled，加载不借用hover/active覆盖；链接使用Light #315EF5 / Dark #8EA8FF语义色。先前排除临时波纹DOM的多行规则保留。修改过的既有TSX中onClick/onChange/onClose/onSubmit回调源码多重集静态一致；这是源码核对，不能代替真实功能验收。

## 双主题人工尺寸与样式核对

临时页面直接导入生产ActionButton、InspectorAction、主题与实际页面CSS，手工点击后由页面采集rAF尺寸；未增加或运行单元、集成、smoke套件，未接IPC。原始资料位于`/private/tmp/flowark-shared-actions-20261015/`。

- 16条记录的高度均稳定约40px；15条宽度稳定。另1条Light检查器记录采样时显式把容器800px缩到300px，宽度394→144px属于响应式操作，不作为状态尺寸通过证据；重新点击窄列后144px保持稳定。
- 保存/加载动作保持160px，运行控制120px，选中按钮87.5px。300px窄列操作换行，无组内横向溢出；比较文字span的clientWidth/scrollWidth确认文案未截断，未以波纹节点造成的临时scrollWidth增大判定溢出。
- 两主题分别比较editor-views、local-browser-choices、template-entry-choices、browser-observation-modes、task-proposal-tabs、task-graph-toolbar、mapping-row七类“选中且禁用”与普通禁用的文字、背景、边框和高度，结果一致。选中ARIA语义保留。
- 悬停/键盘焦点提示可见；继承禁用容器可聚焦显示原因，内部真实按钮保持disabled。两主题链接色与语义变量一致。

继续核对发现参数目录按钮的真实缺口：原实现加载时将长路径替换为“正在选择…”，高度会62.4→40px。补充修复保留路径文本并预留加载图标位置。独立240px人工页面复现旧表现，修复后Dark/Light加载及恢复均62.4px、宽240px稳定。记录位于`/private/tmp/flowark-resource-loading-20261015/geometry.json`；这组数字来自生产组件人工页面，不是原生系统选择框上的连续测量。

## 独立PR与实际CI

| 交付 | 最新CI | 实际合并 |
| --- | --- | --- |
| [治理#733](https://github.com/zhongmiao-org/flow-ark/pull/733)：Figma补充及规范 | [38695108837](https://github.com/zhongmiao-org/flow-ark/actions/runs/38695108837) Validate/Auto Merge成功 | `e27cb42924107c685548133c41f822fea3c9ac4a` |
| [客户端#267](https://github.com/zhongmiao-org/flow-ark-client/pull/267)：跨页动作和共享CSS | [38695772877](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38695772877) Validate/Auto Merge成功 | `0330920640dcd78e88d6f791d29675d30d7cd360` |
| [客户端#268](https://github.com/zhongmiao-org/flow-ark-client/pull/268)：目录加载尺寸 | [38697156965](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38697156965) Validate/Auto Merge成功 | `ad188e90e55b58d8ead0f6b59fd7f1b845db518f` |

各PR带automerge标签，均确认MERGED；并发旧CI被取消，不沿用旧结果。客户端采用治理基线e27cb429。两批本地`pnpm typecheck`、`pnpm build`、全部改动文件Prettier及`git diff --check`通过，`pnpm package:mac`均exit0。未新增/运行单元、集成或smoke套件。

## 打包、安装与原生页面

macOS arm64 0.3.0，Electron44.4.1、Ant Design6.6.5、React19.3。生成App/ZIP/DMG；既有构建chunk提示、开发默认图标及未签名/公证限制保持。串行正常退出旧实例、确认无旧主进程，备份应用和独立资料后安装到`/Users/mac/Applications/FlowArk.app`。构建源码与各自已合并main一致；用户.idea暂存/未跟踪文件原样保留。

#267安装ASAR `f9149b15d6251b70fb4245d17aad64ed00d693bdc3a68292e3ed768a782474d8`；#268最终安装与构建产物ASAR均为`be4b8149a51976223601358caeb03c6b42edbfb8f08011969243d0659204f2e4`。未读写日常工作数据；继续使用原独立`observed-final/records`资料。

原生人工核对：

1. 原Excel流程的“编辑映射”打开已有文件after-syscall-recovered.xlsx、Boundary工作表和A/C/E三条映射，取消返回原节点，未写工作簿。
2. 参数页不改值保存成功并停留本页，返回同一编排；更多操作显示短标签，创建副本仅进入核对页面，未勾确认或创建。
3. 查看旧取消Run `ae95619c-e70b-4324-baf7-af81e6e3d31b`及结果，“核对重跑”进入来源选择，原快照为默认；取消回原结果，焦点与Tooltip恢复。未触发预览、执行或新增Run。
4. 在本地设置临时切换Dark/Light查看原生页面，最终恢复原system偏好（当前Dark）。未改AI凭据、浏览器或驱动配置。
5. 最终#268安装版实际打开系统目录选择框并点Cancel，回参数页后仍显示原目录和“已取消选择，保留原目录和其他未保存更改。”；完整路径Tooltip可见，没有选择或保存新绑定。系统对话框覆盖期间未做原生连续尺寸测量。

#267截图已查看：`native-resource-actions.png`、`native-parameters-dark.png`、`native-more-dark.png`、`native-rerun-light.png`、`native-output-light.png`，位于第一资料目录。最终版截图`native-directory-cancel-stable.png`已查看，位于第二资料目录。两目录还保存构建/打包日志、人工页源和应用/资料备份。原3个流程、4条历史Run不变，未启动流程、AI、MCP或计划；AI401沿用既有记录。

## 仍待验收

Figma补充稿复用原Button组件、文字样式及Semantic Light/Dark变量，截图已查看；补充稿的提示说明不算实际原型Tooltip行为已点通。源码、人工生产组件页面、原生安装和真实外部业务分别记录。

本批仅覆盖上述跨页操作区域、共享CSS和代表性状态；脚本/控制/模板完整页面、更多窄窗/长业务文案及所有故障路径仍需逐板继续。没有以组件状态数量或局部原生通过增加186整板完成数；完整186视觉、交互和U01–U12仍未完成，真实AI成功响应亦未验收。
