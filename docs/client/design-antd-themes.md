# Ant Design 单套主题与交互闭环设计

2026-10-14。本轮更新原 Figma 文件及治理说明，不修改客户端代码。Ark 65 的 Education 席位已由 View 调整为 Full；连接器重新查询得到 Full，原文件的临时 16×16 空画板经创建、读取、移除完成实际写入验证，未保留测试内容。

## 设计入口与采用顺序

- 参数与来源：[原 018 · 同一画板切换主题](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1398)。
- 配色和实施说明：[同一说明稿切换主题](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=177-2)；外观偏好 [149:4362](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=149-4362)。
- [单套主题画板索引](design-theme-board-map.md)、[机器可读色值](design-antd-tokens.json)、[本轮结构核对](design-antd-audit.json)。

继续采用“雾白工作区、石墨导航、电光蓝主要操作”，品牌主色保持 #315EF5。参考用户指定的 [Ant Design 色彩规范](https://ant.design/docs/spec/colors-cn#data-visualization-color-palette)：产品色彩按品牌、功能和中性颜色组织，图表另用数据可视化色板。该页的旧 AntV 跳转缺少语言路径，本轮使用有效的 [AntV 色板规范](https://antv.antgroup.com/zh/specification/language/palette/)。

设计先行：新版参数内容已并入原 `2:1398`，重跑核对已并入原 `2:3014`，原 186 个节点 ID 保持。083 / 087 的参数候选、数字来源确认及保存回显已补齐；后续客户端实施应采用这些原节点及共享语义变量。设计复核见 [186 项记录](design-board-review-20261014.md)，真实产品验收仍按 [原索引](design-board-coverage.md)推进。

## 外观偏好与保存

默认 `system`，手动选项为 `light` / `dark`，仅本机偏好。使用系统有效外观解析当前主题；system 响应系统变化，手动选择维持用户偏好。启动时先读取偏好及有效主题再绘制，避免闪烁。三个偏好在同一外观页表达，原型浅色 / 深色按钮直接设置变量模式，并用变量保存选中按钮状态和说明。跟随系统用浅色系统示例表达；真实操作系统监听由客户端实现。

切换仅更新外观，保留参数原始草稿、未完成文本、入口选择、焦点、选区、滚动和活动 Run，不触发保存流程或运行。应用页面、浮层、通知、工具提示、表格、滚动条、代码编辑器和网页宿主边界均需适配。网页内容自身遵循站点；本地深色偏好不改写站点 CSS。偏好读写失败保留当前有效外观，并提示显式重试；这项运行行为仍需客户端实施取证。 同一外观页的失败提示与“重试保存外观”通过 `appearance/save-error` 条件显示，默认隐藏；失败示例从产品画板外审稿导航进入。重试成功示例恢复正常页，实际服务仍由客户端核对。

按本轮用户调整，合并为一个 Semantic 集合、两种模式、65 个变量（46 个界面 / 图表颜色、11 个间距、7 个圆角、1 个遮罩透明度）。保留原 Light 变量 ID，新增 Dark mode `199:0`；Light 原有 18 个基础颜色别名继续解析到共享 Primitives。Dark 模式值集中维护在同一变量。旧 Dark 集合仅保留 64 个隐藏归档别名，活动产品颜色检查只引用 Semantic 集合。另有 18 个共享 Primitives，以及独立隐藏的 Prototype 状态变量；Prototype 不是第二套主题。原生节点和文字保留。

**切换方式**：编辑器选中页面 / 画板，设置 `FlowArk / Semantic` 的 Light 或 Dark 模式，子节点自动继承；原型在 [外观页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=149-4362)点击浅色 / 深色。仅网页自身示例固定浅色，以表达站点外观不跟随应用。依据 [Figma 变量模式](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables)和 [原型模式切换](https://help.figma.com/hc/en-us/articles/15253268379799-Variable-modes-in-prototypes)。

## 已解析的界面颜色

以下是 Figma 目标值，不是可以不经校准直接全部放入 Seed 的配置。安装锁定的 Ant Design 6.6.5 与当前客户端 Light theme 已读取；客户端仍未接入本轮 Dark / system 行为。

| 语义角色 | Light | Dark | Ant Design / 消费位置 |
| --- | --- | --- | --- |
| `bg/canvas` | `#F6F7FB` | `#0F141F` | colorBgLayout |
| `bg/surface` | `#FFFFFF` | `#172033` | colorBgContainer |
| `bg/subtle` | `#EFF2F7` | `#202B40` | colorFillQuaternary |
| `bg/nav` | `#121A2A` | `#0B1220` | Menu.darkItemBg / 导航 CSS |
| `text/primary` | `#172033` | `#E9EDF5` | colorText |
| `text/secondary` | `#637089` | `#A8B4CA` | colorTextSecondary / colorTextPlaceholder |
| `text/inverse` | `#FFFFFF` | `#FFFFFF` | colorTextLightSolid |
| `text/nav` | `#A8B4CA` | `#A8B4CA` | Menu.darkItemColor |
| `border/default` | `#DFE4ED` | `#344057` | colorBorderSecondary（卡片 / 分隔） |
| `action/primary` | `#315EF5` | `#2D53D3` | colorPrimary（解析后的 Alias） |
| `action/hover` | `#244BDC` | `#3C64DF` | colorPrimaryHover |
| `action/subtle` | `#EDF2FF` | `#1D2A58` | colorPrimaryBg |
| `status/success` | `#147D61` | `#52B68D` | colorSuccessText |
| `status/success-bg` | `#E8F6EF` | `#14392F` | colorSuccessBg |
| `status/warning` | `#946200` | `#D8A93C` | colorWarningText |
| `status/warning-bg` | `#FFF5DB` | `#3A2E16` | colorWarningBg |
| `status/error` | `#B83B48` | `#E87986` | colorErrorText |
| `status/error-bg` | `#FDEDF0` | `#44232C` | colorErrorBg |
| `action/disabled` | `#B9C3D3` | `#6B7890` | colorTextDisabled |
| `bg/elevated` | `#FFFFFF` | `#202B40` | colorBgElevated |
| `text/link` | `#315EF5` | `#8EA8FF` | colorLink / colorLinkHover |
| `border/control` | `#8390A6` | `#74839C` | colorBorder（输入边界） |
| `action/active` | `#1F42CF` | `#2744A6` | colorPrimaryActive |
| `action/focus` | `#315EF5` | `#8EA8FF` | Input.activeBorderColor / Select.activeBorderColor / controlOutline |
| `status/info` | `#315EF5` | `#8EA8FF` | colorInfoText |
| `status/info-bg` | `#EDF2FF` | `#1D2A58` | colorInfoBg |
| `bg/mask` + `opacity/mask` | `rgba(18,26,42,0.42)` | `rgba(0,0,0,0.60)` | colorBgMask；RGB 与透明度合成 |
| `opacity/mask` | Figma 42% / CSS 0.42 | Figma 60% / CSS 0.60 | 浮层遮罩节点 opacity |
| `status/success-solid` | `#147D61` | `#146D55` | 自有白字状态底 |
| `status/warning-solid` | `#946200` | `#815603` | 自有白字状态底 |
| `status/error-solid` | `#B83B48` | `#9F3540` | 自有白字状态底 |
| `action/danger` | `#B83B48` | `#9F3540` | Button.colorError + dangerColor 反白 |

按 [Ant Design 定制主题](https://ant.design/docs/react/customize-theme-cn)从集中 ThemeConfig 采用 defaultAlgorithm / darkAlgorithm，品牌 Seed 保持 #315EF5；再核对派生 Alias 和组件覆盖后的解析值。不能将已解析的 Dark 主色再次当作品牌 Seed 导致二次变暗。集中维护链接、悬停、按下、状态文本 / 背景与控件边框的覆盖，业务 CSS 只读取同源语义变量。

`border/default` 服务于卡片和分隔；输入 / 选择的可辨边界消费 `border/control`。Input / Select 的 activeBorderColor 和 hoverBorderColor 单独核对。Button 危险实心底消费 `action/danger`，dangerColor 为反白；提示错误文字仍消费 `status/error`。导航选中项的文字和图标都反白。不能把深色成功、警告、错误的明亮文字色直接作为白字实心标签底色。

正文 14/22，操作高度 40 px，控件 / 卡片 / 浮层圆角 8 / 12 / 16 px；中文 Noto Sans SC，英文和数字 Inter。复用 Button、Field、Status，并补 AntInput、AntSelect、AntCheckbox、AntAlert 和组合 ParameterRow；单套 8 组、36 个变体，共用 Light / Dark 模式。ParameterRow 的“固定值类型”与来源的有效类型区分；名称、值、提示用组件属性覆盖，不为每个参数创建基础组件。

2026-10-13 配色校验计算了 28 组界面文字与控件对比度：普通文字目标 4.5:1，控件边界 / 焦点目标 3:1，列出的组合均达到目标。Dark 成功提示已调整为 #52B68D；危险 / 实心状态采用独立底色。这只证明列出的目标值组合，不代表所有历史画板、透明叠加、禁用状态和图表都已通过无障碍验收。

## 数据可视化配色

分类色板沿用 AntV 基础 10 色，同一类别在跨页面、过滤和主题切换时保持同色，不按本次排序重新分配。顺序色板仅用于同一指标由低到高的连续值：Light 从 AntV Geek Blue 选取五级，Dark 按低值暗 / 高值亮适配为 FlowArk 变体。分类色不表达成功、警告或失败；运行状态统计继续使用功能色。

| 图表角色 | Light | Dark |
| --- | --- | --- |
| `chart/category/01` | `#5B8FF9` | `#5B8FF9` |
| `chart/category/02` | `#61DDAA` | `#61DDAA` |
| `chart/category/03` | `#65789B` | `#65789B` |
| `chart/category/04` | `#F6BD16` | `#F6BD16` |
| `chart/category/05` | `#7262FD` | `#7262FD` |
| `chart/category/06` | `#78D3F8` | `#78D3F8` |
| `chart/category/07` | `#9661BC` | `#9661BC` |
| `chart/category/08` | `#F6903D` | `#F6903D` |
| `chart/category/09` | `#008685` | `#008685` |
| `chart/category/10` | `#F08BB4` | `#F08BB4` |
| `chart/sequential/1` | `#B8E1FF` | `#1D2A58` |
| `chart/sequential/2` | `#7DAAFF` | `#2D53D3` |
| `chart/sequential/3` | `#5B8FF9` | `#5B8FF9` |
| `chart/sequential/4` | `#085EC0` | `#9AC5FF` |
| `chart/sequential/5` | `#0047A5` | `#B8E1FF` |

默认克制使用 5–7 类可视区分系列；更多类别需分组、过滤或提供表格。图例和数值使用界面文字色，不把黄色等图表色当正文。浅色背景上的浅填充、深色背景上的暗填充配可辨边界、直接数值标签及图例；使用线型 / 标记形状辅助区分，不能只靠红绿。顺序色带保留方向和刻度，不用彩虹色表达连续大小。每种真实图表上线前仍需独立检查相邻图形、主题背景及色觉差异。

图表主题须单独配置背景、轴、网格、图例和浮层；若未来采用 Ant Design Charts，其 [全局主题入口](https://ant-design-charts.antgroup.com/manual/config-provider)独立于 antd ConfigProvider。本轮补色板资产，不引入图表库或虚构新的仪表盘功能。

## 参数闭环与语义边界

参数来源遵循 [契约 0.17.1](../../contracts/v0.17.1/README.md)。固定值完整保留；来源仅为其他 `params` 的点路径，可选择当前草稿的子字段，禁止当前参数、自身 / 间接循环、步骤输出和循环项。来源语法不执行 JS / 算术 / 函数。清空来源恢复固定值；来源失败没有固定值回退。

| 触发与状态 | 设计规定 |
| --- | --- |
| 文本、数字、布尔、空值、JSON | 数字未完成文本与 JSON 未完成文本保留；空字符串、0、false、null 区分；类型切换明确影响，不静默猜值 |
| 手动来源 / 选择器 | 展示目标参数和 params 路径；确认只回填来源字段，其余未保存输入保持，取消返回原入口 |
| 缺失路径 / 依赖循环 | 原始输入、固定值和来源保留；内联错误、首错定位，阻止保存 / 运行 / 保存离开 |
| 固定值类型与有效类型 | 固定值类型只约束保留的固定值；来源结果按自身 JSON 类型参与消费者校验，不强制转成固定值类型 |
| 草稿计算预览 | 明确标注尚未运行，输入或依赖改变使预览失效；Run 采用不可变已保存快照求值 |
| 改名 | 确认影响；更新结构化来源和步骤引用，不改写脚本字符串、原始文本或外部历史 |
| 删除 | 被引用时阻止，列出引用者及处理入口；不自动删除使用者 |
| 保存 / 保存失败 | 保存中禁止重复提交与离开；失败保留草稿和错误，允许显式重试 |
| 保存成功 / 刷新失败 | 已保存回执保留，只重读，不重复保存或创建 Run |
| 模板只读 | 参数不能直接修改，跳到精确实例 / 入口配置；入口 Schema 和参数来源覆盖说明继续可见 |
| 未保存离开 | 保存、放弃、继续三选一；保存失败留在本页；继续编辑恢复入口焦点 |
| 运行快照 / 重跑 | 旧 Run 与产物保持；明确选择原快照或当前已保存流程，重新预检绑定与权限；人工核对后从头创建新 Run |
| 重跑创建回执 | 排队回执与执行成功分开，新运行详情显示排队 / 0 步，进度仅随真实事件更新 |
| 宽 / 紧凑 | 1440×1080 / 1040×700；紧凑来源列表与详情分开，确认按钮可见，收起导航隐藏文字并需实施键盘提示与可访问名称 |

## 本轮证据与后续验收

原 186 个索引节点全部保留且可见，已逐张导出按画板比例截图（最长边 1440 px）并查看，读取按钮、字段、状态文本与原型去向。首轮 Light 看图覆盖 186 张；同节点 Dark 人工复看覆盖参数、重跑、移除确认、Excel、脚本、MCP 六项及配色说明。不是 186 张 Dark 的逐像素或无障碍完整验收。

本轮修订包括 410 个单行控件复用、危险按钮反白、参数数字来源保存、数组集合候选、输出引用只读、安装 / 人工核对复选门槛、暂停 / 取消 / 恢复 / 单步结果、条件不成立零产物、清理后的列表、已有计划精确编辑、创建计划初始暂停、模板 / 实例身份与资源浮层、Excel 第五映射、脚本签名与结构预览、连接测试与重试、撤销采纳确认和分页加载。共享显示网页改用保留来源页的观察浮层。产品画板中的模拟结果按钮移至外部审稿导航。

最终结构及色值结果见 [审计 JSON](design-antd-audit.json)：原节点没有缺失，可见原型没有缺失 / 隐藏 / 自导航 / 内层画板目标，零 IMAGE 填充，Noto Sans SC / Inter；解析基础别名后，46 个颜色的 Light / Dark 值与 token 清单一致。未绑定的三个色值仅为 macOS 红黄绿窗口控制标记，保持平台外观。

逐板修订和本轮新增节点见 [设计复核](design-board-review-20261014.md)及 [单套画板索引](design-theme-board-map.md)。隐藏归档不作为开发入口。状态目录、配置规格和外部审稿导航是设计资料，不能把规格目录当成产品同时展示的编辑器。

原型采用固定的输入、文件绑定和服务响应示例；本轮读取 / 配置原型连线，没有逐项在交互预览实际点击，也没有执行任意文字输入、真实保存、OS 事件、API、浏览器、Worker、脚本或工作簿操作。单行 Default → Focus 的组件反应、复选门槛及变量模式已配置；键盘、焦点、读屏及异步服务行为需在客户端单独核对。设计稿、客户端代码、安装包和真实业务验收分别记录；原索引的产品验收状态保持不变。当前阶段不新增 / 运行单元测试。


## 2026-10-14 最终逻辑闭环增量

本轮补齐参数来源/取消/清空、精确实例与 Run 返回、Excel 五列映射保存、当前计划更新、确认对象隔离、分页与异步恢复及详情后的操作。原 186 ID 保留，新增 36 个缺失状态共用 Light/Dark。最终看图范围为原 186 × 2，关键实际点击与未复验组合见[最终闭环记录](design-final-closure-20261014.md)；六项交接字段及证据层次见[逐板矩阵](design-final-closure-board-matrix.md)和[审计 JSON](design-final-closure-audit.json)。前文为首轮记录；当前语义变量数为 65（新增遮罩透明度），旧 Dark 别名仍为 64。此增量不改变客户端验收状态。

遮罩颜色变量保存 RGB（alpha=1），FLOAT opacity/mask 显式绑定节点透明度。Figma OPACITY 变量使用百分比，不能把 0.42 当 42%。原型新预览实际核对 Light 遮罩覆盖完整背景，弹窗内容保持不透明；切换模式不重建画板或清空草稿。客户端消费 colorBgMask 使用合成 RGBA，不叠乘两次透明度。


## 2026-10-15 客户端采用与验收边界

客户端 #252 已采用同一组两模式46颜色及 Ant Design别名，增加跟随系统/手动浅深色和本机偏好；原生实际点击两模式与重启保留、HTTP人工媒体变化及草稿/遮罩保持均有独立证据。公共语义层、Monaco和React Flow沿用一套页面；参数布局采用原018最新稿。#253补齐零产物清理禁用、#254修复深色标签页文字，最终版已安装。实现、实际合并、安装和剩余逐板项目见[本轮记录](native-appearance-acceptance-20261015.md)，不修改前文历史设计证据，不将令牌采用等同186板验收。
