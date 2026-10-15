# 会话来源与草稿试聊

2026-10-15，接续[个人蒸馏制作](personal-distillation-authoring.md)实际缺口。先更新Figma及[0.24.0契约](../../contracts/v0.24.0/README.md)，再实现客户端；当前不代表客户端或真实Key通过。

## 设计与交互

复用原文件单套Semantic Light/Dark、Noto Sans SC/Inter、Button/Input/Select/Checkbox及主导航，无新主题/字体，原186及已有检查点保持。

| 状态 | Figma节点 |
| --- | --- |
| 已确认会话来源 | [541:5645](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-5645) |
| 来源不匹配与保留输入 | [541:5743](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-5743) |
| 固定草稿与自有模型选择 | [541:5841](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-5841) |
| 内部试聊与逐轮费用核对 | [541:5955](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-5955) |
| 草稿改变与旧历史 | [541:6053](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-6053) |
| 紧凑Dark Key不可用 | [541:6151](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=541-6151) |

五张1440×1080及一张1040×700。最终结构215Frame/191Text/127Vector/40Instance/18Ellipse/1Rectangle，零图像填充且字体通过。22条实际跨画板导航、12条原组件变体导航，无失效目标，内容/底部无越界。准备、补控件后的内部试聊及紧凑Dark截图已查看；费用未勾选时发送使用原Disabled变体。没有据此声称全部原型或原生UI已通过。

普通会话确认后在结果显示真实sequence/evidence。草稿来源核对不接受模型编造摘要；试聊不能自动作为本人事实。编辑后先明确保存，再核对全文/父版本/服务模型/补充要求；建立会话不调用模型，逐轮费用、顺序、取消及恢复复用已有面板。

## 实施与验收顺序

G1本地验证：现有依赖环境的独立临时规范副本执行206条格式资料、26条关联资料核对，通过；新增规范TypeScript及其依赖的独立类型检查通过。`python3 .github/check-governance.py`和`git diff --check`通过。没有新增/运行单元测试，规范副本未作为客户端采用或Runtime证据。

1. 治理发布、固定tag/摘要，客户端独立采用并生成类型与校验器。
2. 宿主输出普通已确认来源，Skill保存及确认核对真实记录；完整类型结果与变量选择器可引用。
3. 宿主固定草稿预览、同事务建立试聊/幂等回执、网络前再次核对；UI补准备、内部会话、来源变化和Key错误状态。
4. 人工取得Runtime/Worker、并发修改/取消/恢复/重开及原生证据。真实自有Key单列，缺失不伪造。
5. 继续客户端搭建访谈/草稿/试聊/局部更新，导出公开包并独立工作区复导，再推进BOSS/G4–G5，不手改导出JSON补业务。

本批G3仍制作中，完整蒸馏、两家真实API及BOSS未通过。结构化草稿正常字段编辑继续列后续，不因本批设计记为完成。
