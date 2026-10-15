# 2026-10-15 脚本、流程控制与模板配置完整页面续查

接续[跨页按钮核对](shared-actions-acceptance-20261015.md)，按[完整配置页规范](shared-actions-design-20261015.md#完整配置页续批)走查生产页面。Figma同一[471:5124补充稿](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=471-5124)追加脚本、控制、模板动作布局，复用原Button实例、Noto Sans SC文字样式和Semantic Light/Dark变量。补充稿1040×1092、76个后代（41文字、12布局Frame、23实例），无图片层，结构及截图已查看；原186节点和原型目标保持。此处计数只说明可编辑结构，不是完成率。

## 实际缺口与修复

- 模板数组将完整字段名拼进添加按钮：人工完整页面复现约1632px按钮超出约558px表单。改为160px“添加一项”和40px移除图标，完整标题在图例/条目标签换行，保留完整可访问名称及Tooltip；上限禁用原因可以键盘聚焦查看。
- 脚本依赖使用“核对已绑定”“选择目录／更换目录”“核对目录”等短标签，提示说明包名、用途和禁用原因；操作组12px间距换行，绑定加载保持原标签及160px宽度。脚本编辑器的语法检查、历史预览、保存/取消补提示和稳定布局。
- 流程控制六卡的“添加步骤”“配置子步骤”“应用配置”补全提示，子步骤页的添加动作说明长目标及无效原因；保存期间沿用原禁用、选择及焦点逻辑。移除六卡字段重复整体透明度，由主题提供禁用配色。
- 工作区长流程祖先仍返回原对象，省略显示时支持悬停与键盘聚焦查看完整名称；返回、网页及禁用状态使用共享动作与主题。
- 模板共享配置的保存/取消及其他实例入口补提示、加载及长名称省略；字段值、数组行身份、保存范围、来源核对和离开保护保留。

首次安装#269又发现真实共享CSS冲突：`.template-entry-page .ai-task-actions button`为后代按钮设置180px最小宽度，超出160px Tooltip触发容器，导致保存和取消相互覆盖。独立#270将旧规则限定到直接子按钮，未包装操作保持原宽度，包装动作按容器布局。最终版截图已确认不再重叠，不以#269的CI通过代替该处界面通过。

## 完整生产组件人工页面

资料位于`/private/tmp/flowark-config-pages-20261015/`。临时页直接导入生产ScriptConfigurationWorkspace、ControlWorkspace、TemplateConfiguration、主题和页面CSS；依赖读取/取消及保存延时/失败是明确的人工演示接口，无真实IPC。补充宽度页使用实际ActionButton和模板/AI操作CSS复现上下文。

内嵌浏览器面板初始实际782×526；不能把请求的视口尺寸写成实际尺寸。随后使用源码中明确尺寸的同源iframe，读取真实`innerWidth/innerHeight`核对1040×699和760×526；外层仅等比展示，不改变内层CSS视口。原生窗口截图为常规1440×960，未将人工窄窗当作原生最小窗口验收。

| 观察 | 实际结果 |
| --- | --- |
| 1040px脚本依赖组 | 组宽约346px、scrollWidth同宽，160px动作按12px间距换行；长祖先Toolbar无横向溢出 |
| 760px脚本依赖组 | 组宽约520px、scrollWidth同宽；Dark/Light绑定加载及恢复160×40px稳定，取消提示保留原依赖 |
| 两尺寸ControlWorkspace | Light/Dark保存高度40px不变；全宽按钮分别约843.08/563.38px，保持原选中步骤，保存时输入/动作禁用 |
| 长模板标题 | 1040px表单clientWidth/scrollWidth均693；760px均677，无原添加按钮的横向溢出；正文长标题正常换行 |
| 模板保存/失败恢复 | 760px Light/Dark均160×40px稳定，失败后输入、已选布尔/选项及两条数组仍保留；1040px额外核对Dark保存及添加 |
| 补充共享配置操作组 | 760px Light/Dark保存加载均160×40px，实测相邻按钮间隔约11.995px，取消按钮不被覆盖 |
| 键盘提示 | 达到数组上限的禁用容器可聚焦显示原因，真实按钮保持disabled；长流程祖先聚焦显示完整名称 |

`geometry-1040.json`有6条记录，其中1条绑定动作在采样中切换页面而卸载，connected=false，不作为完整加载通过证据；其余5条稳定。`geometry-760.json`7条及`shared-width-fixed.json`2条均保持连接、宽高稳定。最初模态打开动画中的约37.5px读数未当作稳定尺寸，待页面稳定后才记录约40px。原始记录保留，不隐藏未完成采样。

## 独立PR、CI与安装

| 交付 | 最新CI | 实际自动合并 |
| --- | --- | --- |
| [治理#735](https://github.com/zhongmiao-org/flow-ark/pull/735) | [38699720665](https://github.com/zhongmiao-org/flow-ark/actions/runs/38699720665) Validate/Auto Merge成功 | `77556c395d2ff6159afe21d9c3aaaf474c3993d5` |
| [客户端#269](https://github.com/zhongmiao-org/flow-ark-client/pull/269) | [38701185116](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38701185116) Validate/Auto Merge成功 | `23fe59806ae1e0bb206f6448f3aac21a9d4ec033` |
| [客户端#270](https://github.com/zhongmiao-org/flow-ark-client/pull/270) | [38701912243](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38701912243) Validate/Auto Merge成功 | `b272c21a528981dd91d2c4fe224b921c076696e7` |

各PR均带automerge并已确认MERGED，取消的旧并发CI不计通过。客户端采用治理77556c395，契约0.17.1不变；未修改模板仓库、公共API、宿主执行或数据库。

本地类型、构建、全部改动文件Prettier及diff检查通过；不新增/运行单元、集成或smoke套件。#269生成App/ZIP后DMG在沙盒内报设备未配置，单独使用系统打包权限重试DMG成功；#270最终`pnpm package:mac`完整exit0，App/ZIP/DMG生成。既有chunk提示、开发默认图标、未签名/公证限制保持。

串行正常退出旧实例、确认无旧主进程，分别备份应用和独立资料后安装`/Users/mac/Applications/FlowArk.app`。#269 ASAR为`45322f0476a7c55702f8a290b3f1ba42c47067c4f51c7b6fb050b00bed95117a`；最终#270构建与安装ASAR同为`c7392f24b0eba19e8d02c38c8f9dc291e2d5c84a1fadb202a8bd173dd71a15d5`，源码与对应已合并main一致。0.3.0 arm64、Electron44.4.1、Ant Design6.6.5；用户.idea暂存及未跟踪项保持。

## 原生实际走通

继续原独立`observed-final/records`，未改日常资料。通过客户端创建一条仅核对配置的普通流程，含长名称脚本与循环；通过独立模板现有打包器生成虚构`ui-config-page-review`1.0.0，并经系统ZIP选择器、来源确认、安装及创建一个实例。包摘要`f93f82f3f970c8d75cc7e8257dab3552d2a6049fa51d79ca17a54f05378b2520`，仅一个value入口，无资源/动作授权/第三方依赖/计划，未执行入口。此为本机人工核对资料，不提交模板源码到客户端或治理。

最终安装版实际核对：

1. 脚本与依赖完整六卡打开、依赖面板展开，真实目录选择框Cancel后提示“已取消选择，原有依赖保持不变”。无绑定新增、无依赖安装。
2. 完整编辑器点击语法检查返回通过；打开输入/历史预览显示尚无运行记录，未执行脚本；保存并返回同一脚本配置，再回原流程。
3. 流程控制六卡显示短标签；从循环“配置子步骤”进入条件与串行循环页，保留同一循环、集合[1,2,3]和添加位置。保存后停留本页、显示草稿已保存，再按原返回路径离开。未运行循环。
4. 模板实例`d0232e42-4936-4f12-a371-e4f1b14a2272`共享配置：添加到2/2后禁用，Tab可聚焦上限原因；第二条输入“保留的第二条 · 真实保存核对”，删除第一条后该输入仍属于存活条目并成为第一条。实际保存成功。
5. 正常退出安装#270后重开同一资料，原实例回读唯一条目、布尔true和原长选项。Light及Dark下保存/取消均已查看，最终间距正确、无相互覆盖；恢复原system偏好（系统当前Dark）。

最终截图已查看：`native-script-dark-final.png`、`native-logic-dark-final.png`、`native-control-dark-final.png`、`native-template-light-final.png`、`native-template-dark-final.png`。`native-template-width-overlap-before.png`仅为#269失败证据，不作为最终通过截图。模板来源创建一个实例/一个入口流程，加普通走查流程后共5流程；运行仍4条，无活动运行，不新增Run、AI/MCP调用或计划。AI401记录保持。

## 保留的未验证范围

本批把上一批未走查的脚本、流程控制及模板共享配置补为上述原生局部证据；模板旧式模态、复杂多依赖读取、关联步骤/数据来源长名称、保存失败和完整窄窗状态主要来自生产组件人工页，未全部进行原生故障注入。实际包目录校验/编译、真实AI成功、外部写入、复杂并发/系统权限异常及完整模板资源/授权/入口仍按原记录待验收。

Figma补充稿截图已查看，不代表原型所有Tooltip/状态已点通。截图、源码、人工组件、原生持久化及真实业务分别记录；不新增186整板完成数，完整186视觉/交互和U01–U12仍未完成。
