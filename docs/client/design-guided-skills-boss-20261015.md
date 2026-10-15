# 个人蒸馏与 BOSS 模板设计规格

2026-10-15。按[开发计划](guided-skills-boss-plan-20261015.md)，在[原 Figma 文件的本批区域](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-7024)新增 26 个原生可编辑场景。原186节点全部存在且可见，原验收结论不变。本轮只更新治理与 Figma，不修改客户端或模板实现。

## 设计入口与复用

[流程入口](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-10842)连接个人蒸馏、BOSS 配置、作者制作与导出。新画板位于原产品页的独立 Section，未另建文件或覆盖既有页面。复用原窗口与导航、Button/AntInput 组件、Semantic Light/Dark 和 FlowArk 文字样式，使用 Noto Sans SC / Inter。作者编排预览复用现有步骤、条件菱形和文档节点；不是一个大脚本占位。

异常样例入口放在 Section 的独立设计评审区，不在正常配置页增加“模拟失败”动作。原型为固定资料和固定结果的有限跳转，不能输入真实简历或执行站点动作。

## 场景索引

| 序号 | 页面 | 节点 | 尺寸 |
| --- | --- | --- | --- |
| 01 | [从可复用流程开始](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-10842) | `487:10842` | 1440×1080 |
| 02 | [准备你的个人资料](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-10943) | `487:10943` | 1440×1080 |
| 03 | [核对材料与发送范围](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11049) | `487:11049` | 1440×1080 |
| 04 | [补充你希望怎样求职与沟通](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11139) | `487:11139` | 1440×1080 |
| 05 | [核对蒸馏草稿](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11231) | `487:11231` | 1440×1080 |
| 06 | [先看看回答是否像你](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11327) | `487:11327` | 1440×1080 |
| 07 | [确认你的个人 Skill](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11416) | `487:11416` | 1440×1080 |
| 08 | [个人 Skill · 已确认 v1](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11504) | `487:11504` | 1440×1080 |
| 09 | [编排 · 个人蒸馏流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11604) | `487:11604` | 1440×1080 |
| 10 | [编排 · BOSS 招聘模板](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11707) | `487:11707` | 1440×1080 |
| 11 | [配置 BOSS 直聘模板](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11802) | `487:11802` | 1440×1080 |
| 12 | [回复草稿 · 尚未发送](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11906) | `487:11906` | 1440×1080 |
| 13 | [此会话已交给本人处理](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-11995) | `487:11995` | 1440×1080 |
| 14 | [发送结果待核对](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12082) | `487:12082` | 1440×1080 |
| 15 | [导出与独立复用](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12168) | `487:12168` | 1440×1080 |
| 16 | [对话已保存，AI 请求未完成](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12258) | `487:12258` | 1440×1080 |
| 17 | [保存前先核对版本差异](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12344) | `487:12344` | 1440×1080 |
| 18 | [对话 Skill 当前不可用](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12432) | `487:12432` | 1440×1080 |
| 19 | [这份材料还不能用于蒸馏](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12525) | `487:12525` | 1440×1080 |
| 20 | [配置对话 Skill](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-12611) | `487:12611` | 1040×700 |
| 21 | [先确认 BOSS 登录与账号](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5247) | `490:5247` | 1440×1080 |
| 22 | [核对自动投递条件](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5348) | `490:5348` | 1440×1080 |
| 23 | [主动沟通先看职位介绍](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5450) | `490:5450` | 1440×1080 |
| 24 | [该职位明确不符合你的方向](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5550) | `490:5550` | 1440×1080 |
| 25 | [这个职位需要你来判断](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5637) | `490:5637` | 1440×1080 |
| 26 | [对方索要简历 · 先核对发送内容](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=490-5723) | `490:5723` | 1440×1080 |

## 流程与交互规则

- 独立蒸馏：资料导入/选定工作区 → 本机解析及发送范围核对 → 自有 Key 多轮对话 → 事实/风格/边界编辑 → 试聊纠正 → 用户确认保存 → 版本引用。中断保留回答与草稿，继续不重复问；未确认结果不能供自动回复使用。
- Skill 编辑保留手工内容，展示来源与差异；保存失败或并发/外部修改不覆盖原版本或丢输入。工作区/版本失效明确阻止相关入口，不静默采用其他内容。
- 作者通过客户端编辑步骤、条件、引用、提示词、入口、Schema、资源与动作声明；导出后独立工作区重新导入，不依赖开发环境。本文画的制作页是交互规格，真实拖拽/配置/打包能力仍需开发和验证。
- BOSS 路径从登录及求职者账号核对开始。浏览器登录、AI Key 与模板动作授权分别处理；登录失效暂停，验证码由用户完成。
- 对方主动沟通先读取关联真实 JD，对照用户目标：明确符合 → 按权限简历/介绍/聊天；明确不符 → 独立“不感兴趣”；拿不准或 JD 缺失 → 保留依据并通知本人。求职前端/招聘主播为明确错配示例，不用于推断所有相近岗位。
- 对方索要简历只发送选定确认版本，附件、自我介绍和后续聊天分别核对与去重；错配或待判断的会话不先外发。“不感兴趣”仅使用已校准且已授权的真实入口，缺失或结果未知转人工。
- 草稿、待确认、发送及未知结果分开；发送前新消息、资料/规则版本或账号变化使旧草稿和确认失效。正式题目、未知经历、超范围承诺与身份质疑默认转人工；接管只影响该会话。
- 所有模型调用使用用户自己的 Key，包括蒸馏、试聊、JD 判断、介绍、聊天及生成修改；无绑定不调用，不用开发者共享额度兜底。这里只展示掩码或逻辑资源，不将 Key 写进工作区和 ZIP。
- 1040×700 采用单列资源与状态卡，底部主操作完整可见；1440 场景使用两列内容与常驻来源提示。已修正首版紧凑页卡片宽度和底部溢出。

## 验证证据

[结构审计 JSON](design-guided-skills-boss-audit-20261015.json)记录26场景、2479个后代节点，其中789个文字、132个组件实例，零图片填充节点。全部页面导航为98条，目标覆盖26板，无失效目标；另有33条输入组件变体动作，不计作页面导航。字体家族检查通过。原186节点存在/可见性核对通过，未将新场景数量计入原186完成率。

已查看整组浅色构图及引导对话、作者编排、BOSS配置、JD判断和紧凑页重点截图；BOSS配置和紧凑页切换同一 Semantic 到 Dark 后查看截图，再恢复默认 Light。关键内容区未超出画板，紧凑页修复后保存/返回可见。这是有限设计视觉检查，不声称全部文字逐像素、全部主题组合或WCAG完整通过。

本轮读取并核对原型连线，未实际点击所有路径，也未将结构连通描述为完成多轮对话或网站业务。用户指定的 [BOSS 起始网址](https://www.zhipin.com/chengshi/c101170100/?seoRefer=index)在网页读取工具中不可访问；登录、JD关联、简历索要、“不感兴趣”及实际回执仍需真实网页校准。

## 实施前需继续细化的状态

这26个场景建立主路径和关键恢复边界，不是完整控件/状态矩阵。每批实现之前，继续在同文件补齐对应节点配置控件、逐项事实编辑、实际可编辑对话、字段校验、模型处理中/取消/迟到与限流、未保存离开、键盘焦点、完整多入口作者表单、文件选择及不支持格式、按对象保存/切换、结果确认回执与更多紧凑布局。现有通用画板可复用，新增交互必须先补图再编码。

G1–G5的契约、实现、类型/构建、安装、真实AI与BOSS业务以及独立使用者复用分别取证。本轮不新增/运行单元测试，不执行真实投递/消息/不感兴趣动作。治理检查使用既有命令，PR/CI与实际合并状态见交付消息。
