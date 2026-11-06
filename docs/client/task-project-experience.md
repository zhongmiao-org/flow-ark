# 任务实例与工程编辑（2026-11-06）

用户批准：普通任务按实例聚合；开发实例独立展示；现有Monaco补齐文件模型、SDK/JSON提示、Mermaid及诊断定位。保留所有入口ID、Run、Skill、凭据与效果历史，不新增外发或模型调用。先设计，再客户端，最后原生验收与PR；不创建Release。

## 展示与本地元数据契约

一个模板实例一张任务卡片，手工流程各一张。按instanceId及entryFlows双向核对归属；失配记录显示需检查，不隐藏。搜索实例及入口；任务数量按当前视图聚合，今日运行仍按Run。状态取实例所有入口的真实活动/最近Run；结果打开准确Run。

TemplateInstance新增可选usage：task或development。缺省时只通过正式local-project.instances关联识别development，否则task；本人显式选择优先，非破坏性懒读取、不回写历史。新增template.usage接口：id、预期usage（可空）、usage，CAS核对保存；仅改展示用途，不影响权限或执行。公开包不含用途。工程新建实例写development；既有工程重建保留用途。Bootstrap只补充本地projectInstanceIds，旧调用方缺省空。新旧实例与所有流程标识保持。

Figma先行状态：任务聚合1223:11639/11829、开发调试1223:12019/12209、工程编辑1223:12399/12500，沿用既有Noto Sans SC、Inter、组件及明暗主题；设计不等于实现验收。

用户接续明确左侧增加“流程编辑器”，位于我的流程下方，直接进入已连接工程列表/打开/新建；模板库原入口转到相同工作区，不复制编辑器。离开侧栏与返回均核对未保存编辑，关闭后释放模型。

## 编辑器

每工程每文件稳定虚拟URI；保留撤销/光标/未保存编辑，关闭工程释放模型和监听。JSON Schema与本地SDK类型声明按工程隔离注册；Mermaid着色，正式编译器为执行格式唯一来源。问题保留文件/入口/区块/字段和真实行列，缺坐标不猜测。原修订CAS和三方差异、运行快照保持。

新增project.diagnose只读接口：id、revision、changes（最多100份）；在内存候选上调用既有compileProject，不写文件/不执行脚本。返回valid、revision、draft与diagnostics；诊断字段code/message/file/field/entryId/line/column，缺坐标保持空。修订冲突拒绝；不作为运行准入替代。

## 检查与交付

不新增/运行单元测试。类型、构建、治理、静态编译、原生任务聚合/模型切换与冲突、安装包离线运行/打包/复导分别记录。开发中不登记通过。客户端与治理独立PR、正常CI自动压缩合并及源分支删除核对；模板代码未改不重发ZIP。

## macOS 原生验收（2026-11-06）

使用安装候选和独立空白数据目录；没有清空正式工作区、导入旧防重、绑定BOSS账号或Key。先前95条底层流程投影为12个任务对象：6普通、6正式工程关联开发实例；后将一个明确的空白rc.21复导验收实例通过UI移到开发分类，普通5/开发7。不能将既有多个独立实例误说成新用户首次导入产生的副本；没有按名称自动合并或删除。

- 空白工作区只安装BOSS ZIP时零任务；创建一个BOSS实例时1卡片、17内部入口，加个人蒸馏后2卡片（17+4入口）。同版本再建一个BOSS显示3个普通任务，显式移开发后回到2个普通/2个开发；没有授予动作、登录或调用模型。
- 主工作区分类操作不删除底层流程；15份正式BOSS沟通缓存逐文件SHA256保持。本人新Skill、保护Key、登录和Run记录未清理。
- 左侧流程编辑器可打开已连接工程、选择目录和新建工程；模板库原入口进入相同工作区。Mermaid第8行草稿错误准确定位；JSON类型错误同时获得Schema行列提示与正式编译器诊断。错误草稿不写盘，运行/打包保持禁用。
- SDK声明识别noSuchMethod不存在；本地Node类型资料随包提供，timers/promises不再误报缺模块。切文件后撤销恢复原修订a6ffa51241001f713ab84f4257fb6c708a4ca441ddde02a7abc70be16cdeca13与零问题；未保存离开出现保留提醒。
- Mermaid capture定位可视化区块，区块按钮定位节点/编排/脚本。独立样例同一TS文件外部修改后保存禁用，三方差异准确显示原/本地/磁盘；返回不改磁盘，显式采用新修订再保存才写入，最终982193787d7f开头修订保留本人选择的本地草稿。
- 无资源/无动作样例Run `b41598a0-bf78-46c4-a175-8af135b137cb` 已完成（12秒）。开发分类卡片打开最近结果仍指向此Run。未执行BOSS或付费AI。
- 原生工程导出完整ZIP，安装包CLI正式from-zip恢复源码修订a6ffa51241001f713ab84f4257fb6c708a4ca441ddde02a7abc70be16cdeca13，与导出源一致。复导不带私人绑定、Key或历史。

本地类型、构建、changelog、差异检查与macOS arm64打包分开通过；未新增或运行单元测试。其他平台、所有异常矩阵、BOSS新原生分支和20分钟首次配置目标未由此证明。Figma与安装候选截图保留在本机验收资料，不发布个人数据。BOSS业务模板未改，沿用rc.21原字节ZIP，避免无意义重发版本。

## 实际交付

治理[#1161](https://github.com/zhongmiao-org/flow-ark/pull/1161)压缩合并 `20c117669520082c372ee6106c621ccf62ee3b1b`，[CI成功](https://github.com/zhongmiao-org/flow-ark/actions/runs/42172018854)。客户端[#405](https://github.com/zhongmiao-org/flow-ark-client/pull/405)准确源 `efcae402f666fae6efa7ab46995cb235c3e8e172`，压缩合并 `af37e24dc7e576d0fcbe11ea9d61bdc178ef8968`，[CI成功](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/42174314554)、[Changelog成功](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/42174314505)。两仓远端源分支已核对不存在；客户端main与origin/main一致、工作区干净，合并前后tree同为`aa6de7964adeb47ad06c6c7b27ecd6bc026cbfbb`。无计费例外或手动绕过检查。

本地交付目录 `~/FlowArk/交付/20261106-task-project-experience`：最新macOS arm64 DMG/ZIP、BOSS rc.21原包与README/公开资源、客户端README、无敏感配置样例工程及原生导出ZIP、两卡片截图、manifest与SHA256SUMS，23项摘要读回一致。候选仍使用0.3.1开发版本，不混作已公开v0.3.1；正式发布由本人准备新版本并手动发布，未创建tag/Release。

- DMG SHA256 `30650241611c9c63bd9a54558cd60b021e24158f2be7d5613ac7d05c2523412b`。
- 客户端ZIP SHA256 `87956d1ae9c5086b49aa47f9d600f45189d066f3b55916700e5ee450a3d996b0`。
- BOSS ZIP SHA256 `593e0c91982e63a6b198eb93af91263bbca0862271a973f1bfae7b2cfbf938c5`，本轮业务包不变。
- 从最终DMG安装到隔离验收应用，app.asar与镜像原件一致：`b933ef929483c7e21cbfda4d296d93a4bedceab6cee904f2eab5a35df973e024`。正式工作区当前窗口不强制关闭或覆盖未保存草稿；本人保存后使用新DMG更新。

## 2026-11-06 独立编排副本分类补充

本人要求普通列表只保留正式BOSS和个人蒸馏。独立手工流程也新增可选usage（task/development）及相同分类按钮，默认task；flow.usage接口包含id、预期usage（可空）和目标usage，事务CAS只更新展示元数据。绑定模板的底层入口拒绝此接口，须按所属实例分类；流程保存保留usage，历史版本、运行快照、参数、权限、时间及防重不因分类改变。未知归属仍在需检查视图保留，不自动迁移或删除。

既有Figma任务/开发分类状态沿用，分类按钮适用于实例卡片及手工独立卡片。仅为完成用户明确的副本归类补齐通用能力；本机通过普通UI迁移已确认试验副本，正式BOSS由六项绑定及原完成回执核准，个人蒸馏保持。治理/客户端分别PR，最新macOS候选正常安装，不创建Release。
