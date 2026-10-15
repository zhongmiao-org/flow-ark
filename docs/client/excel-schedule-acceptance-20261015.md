# 2026-10-15 Excel 五列与计划状态原生闭环

本批接续[四路径与主题安装](native-appearance-acceptance-20261015.md)，继续原 119 Excel、008/034/044 计划及共享编排/按钮主题。实时读取 Figma `23:6516`、`2:3431` 完整上下文和截图；创建成功暂停语义沿用[最终闭环](design-final-closure-20261014.md)与逐板矩阵。没有修改 Figma 节点或新增另一套深色页面。

## 实际缺口与独立交付

| 缺口与修复 | PR / 最新 CI | 实际合并 |
| --- | --- | --- |
| 独立Excel页保存五列后，画布五列但原挂载高级JSON仍四列；仅保存产生实际内容变化时递增编辑修订，同步检查器，纯元数据保存不重置原文 | 客户端 [#255](https://github.com/zhongmiao-org/flow-ark-client/pull/255)，源 `2fdc4d2`；[38675146985](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38675146985) Validate/Auto Merge成功 | `c304c094bbca04fe8138fb35890a738c040ec3e9` |
| 新计划初始暂停，与旧“创建后启用”说明区分；普通与模板入口创建仅固定版本，明确启用后才计时 | 治理 [#723](https://github.com/zhongmiao-org/flow-ark/pull/723)，[38675128300](https://github.com/zhongmiao-org/flow-ark/actions/runs/38675128300) 成功 | `9d1518f7859b94bd09dc43a2e8f91afb4afddd2b` |
| 宿主一次事务创建enabled=false，同步普通/模板创建、保存离开和回执；不靠创建后toggle补偿 | 客户端 [#256](https://github.com/zhongmiao-org/flow-ark-client/pull/256)，源 `fdacc80f988bf0a1c7d1dfe51822469e284926e5`；[38675494200](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38675494200) Validate/Auto Merge成功 | `342bb093220c5567926e6a479296ea01410d77b5` |
| 默认及主色按钮hover/active恢复明亮文字，危险文字使用错误语义；禁用/实心保持 | 客户端 [#257](https://github.com/zhongmiao-org/flow-ark-client/pull/257)，源 `80e45065d421983cf75f28e5b9e133ddc5970fa7`；[38676296086](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38676296086) Validate/Auto Merge成功 | `3cf49f4cf4ec321b870dc2796a97b29afebaf03b` |
| 五列预览可聚焦区域原来不承载横向滚动，方向键不能看到E；使表格最小宽度归该区域并采用语义焦点轮廓 | 客户端 [#258](https://github.com/zhongmiao-org/flow-ark-client/pull/258)，源 `ef5e12b3830d4ae7db4ab0d401e92be9a9a89516`；[38677131634](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38677131634) Validate/Auto Merge成功 | `1a8384fe821487fb45856d2f981985cfc167707e` |

客户端机器元数据采用治理#723合并提交；公共契约0.17.1、IPC字段及Schedule/SQLite结构不变。旧计划不自动迁移、启用或暂停；既有Run、快照和固定版本保持。本轮没有修改模板仓库，也没有新增/运行单元、集成或smoke套件。

## Excel 原生实际操作

在本轮专用原生资料中新建普通流程 `Excel 五列 · 原生核对`（ID `1150e139` 前缀），通过现有高级JSON录入两条虚构记录和四条映射基线，节点 `n_98ced3ab`。输出名 `five-columns.xlsx`、工作表 `Closure`，未绑定目录、不运行Excel节点、不写工作簿。

1. 打开完整映射页，实际添加第5条，来源note、列E、表头备注。预览表实际有A–E列，E显示“第五列A/第五列B”，提示核对2条且未写文件。
2. 取消触发未保存保护，继续编辑保留五条、同一预览和入口；保存映射并返回确实返回同一编排，成功提示明确Excel映射，画布5项；重开仍五条。该主逻辑原来正确，保留。
3. 旧安装版复现陈旧高级JSON四列；#255/#256候选串行安装后，先展开五列JSON，再进独立页把第五列表头改为“备注 · 已同步”，保存返回，高级JSON立即显示E列及新表头，画布一致。
4. HTTP人工核对进一步覆盖四→五列同步，普通保存保留尾部空白；输入未完成`{`后保存阻止且原文保留，恢复有效配置后撤销/重做分别四/五列。此处为构建Renderer+真实Runtime/SQLite，不冒充原生全部输入异常通过。

原生深色截图 `native-excel-five-dark.png` 已查看，五列内容通过实际原生表格AX核对；当前宽度表格允许水平滚动，截图未同时显示全部E列，不声称每列已在单张图内看清。随后核对发现键盘不能横向滚动：外层可聚焦区域754宽/scrollWidth754，实际内层表格内容1000；#258修复后外层754/1000、内层不再横向溢出，HTTP方向键滚动到右端且E列完整可见。最终原生点击预览区域后连续方向键，实际截图 `native-excel-e-visible.png` 明确显示D/E、新表头与第五列A/B，焦点轮廓为主题蓝。之前截图不含E的限制由本条增量补齐。真实工作簿生成、文件占用/重名与复杂数据类型仍待独立执行验收。

## 计划原生实际操作

本轮新计划 `5f3872fd-b979-48e9-9bfa-90c5e6c50af8` 仅绑定此前纯数据流程，固定版本 `840b4c7754267ad39c30c3a73e56655ac18188c4efddcf3d7006978884fa1101`。

- 创建时60分钟、Asia/Shanghai，勾选固定已保存版本后只新增一条暂停行，回执明确已暂停且启用后才执行，列表“暂无下次执行”。
- 编辑90分钟保存后同一行更新，仍暂停；重开显示90分钟，固定版本未改变。改120分钟后取消，明确不保存离开，原行仍90分钟。
- 明确启用后同一行显示已启用、下一次12:50:48；立即暂停同一计划，恢复已暂停/暂无下次执行。没有等待90分钟或触发实际运行，不把此证据算真实计时/休眠恢复验收。
- 只读数量仍3 Run、1 schedule、0 trigger、0 artifact；新计划没有创建运行，既有2取消/1完成Run不变。受保护密钥摘要与首次初始化一致。

原生 `native-plan-paused.png` 已查看。普通创建/更新/取消/启停已实际操作；模板入口复用同一宿主创建路径与回执文案，本批未另建模板实例，不能将其列作模板原生完整通过。

## 按钮交互态与最终安装

原生计划截图发现默认按钮悬浮文字退回偏暗动作蓝。集中补齐Button默认hover/active令牌，以及主色/危险轮廓与文字按钮的hover/active语义选择器；禁用与实心主按钮保持各自角色。HTTP人工通过真实鼠标移动/按下核对默认及primary轮廓按钮，Dark文字/边框均rgb(142,168,255)；在按钮外释放保持计划暂停和输出名不变。客户端#257已自动合并并串行安装，ASAR `ce5e580413f843dc0f2c46fa6b08711fa79b5d4cae8cdf37b10da0aef0909a68`。正常重开计划仍为90分钟暂停，同一五列映射与新表头保留；原生再次切Light、预览E列/两条数据可读，无工作簿写入。最终原生鼠标悬浮截图 `native-plan-hover-final.png` 已查看。

#255/#256组合候选0.3.0 arm64经`pnpm package:mac`成功生成APP/ZIP/DMG；正常退出原实例exit0，确认零主实例、备份应用与本轮资料后安装。ASAR `4376deb788eb5b4d342a1890915c493357922ce6b4c7810b3694a2fb802b149b` 与源一致。安装回执和截图集中在 `/private/tmp/flowark-native-20261015/`，未提交资料、密钥或产物到Git。上述各客户端变更的类型、构建、相关Prettier和diff均通过；未签名/公证，非正式发布。

最终安装#258源，ASAR `4db56185cafdd5caa40e01e795a63006b89382dfd1f4bdcda226cb68df06594c`，APP/ZIP/DMG均打包成功。正常退出exit0、零主实例、备份后串行替换并重开；运行记录仍3，Excel5条及新表头、90分钟暂停计划保留。原生浅色键盘E列已看图；最后恢复默认跟随系统，当前系统深色→Dark生效，未修改OS设置。最终只读2flow/3run/1output/1schedule/3snapshot/1version，0trigger/0artifact；未新增执行或工作簿写入，受保护密钥不变。当前唯一主实例使用本轮隔离资料，临时HTTP页面与服务已关闭。

## 仍待逐板核对

本批增加原119、008/034/044和共享编排的局部证据，186索引不变，不换算为整板完成率。图稿、原型点击、人工HTTP、原生保存和真实副作用分层记录。仍需真实工作簿、模板计划完整入口、复杂并发与失败/迟到、分页和模型/连接对象竞态、全尺寸/Light/Dark及U01–U12完整验收。参数、面包屑、重新检查与连续取消的前批结果保留。
