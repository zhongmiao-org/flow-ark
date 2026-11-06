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
