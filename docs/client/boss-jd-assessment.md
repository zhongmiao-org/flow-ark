# BOSS岗位方向评估与三路建议

2026-10-16，承接[资料来源](boss-profile-sources.md)、[独立复用](boss-source-reuse-20261016.md)与长期计划G4。用户暂不登录，真实简历另在私有实例本地解析；本批继续制作JD方向判断的可复用业务入口，不把缺Key、未确认Skill或未登录当作已通过。

## Figma先行与已有能力

原文件sVciNUZHG9yx81gCpYzjH9、页面1:3、Section487:7024追加四张1440×1080原生可编辑状态：

| 状态 | 节点 |
| --- | --- |
| 输入、固定来源与自有Key | [625:6992](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-6992) |
| 明确符合建议 | [625:7094](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7094) |
| 明确不符合建议 / Dark | [625:7196](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7196) |
| 不确定、缺口或冲突转本人 | [625:7298](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7298) |

复用581:6158、AntInput139:2、Button1:146/1:148、单套Semantic Light/Dark与Noto Sans SC/Inter。每张后代36Frame、3Ellipse、33Text、21Vector、8Instance，零图片填充；清除继承无关跳转，导航修正为模板库并查看全部修正后整图。Section扩为4480×53160，原186保持。这是静态业务状态规格，不计可点击原型或客户端运行通过，未新建库组件/主题。

当前通用context、固定Skill、结构化AI、条件、脚本及result/attention已经有可视化节点或SDK，已发布契约足以表达；本批不增加客户端业务节点/分支/提示词，不修改包2.0、SDK1.0或公共契约。AI响应仍经现有宿主能力，不将一次结构化评估当作已验证onmessage完整对话矩阵。

## 制作入口与来源

从准确0.1.4复制制作下一检查点，保留四个旧入口。新增手动、不定时的job-assessment入口，资源仅固定确认profile与用户自己的ai，读取本实例共享求职配置；不要求浏览器，不能把此独立入口当作自动取得真实会话JD。

输入字段为jobTitle、jobDescription、descriptionComplete及可选sourceLabel，公开默认空文本/false。本批明确由调用方选择JD，complete只是本人声明，不是宿主核验的真实站点/账号/会话证据。后续接入登录后的真实会话时必须从该会话读取、核验目标和内容变化，不能用本入口的手填来源、旧摘要或模型自报字段绕过；缺登录校准继续保留。

可视化步骤独立负责：读取固定配置→整理输入/条件缺口→条件成立时读取固定Skill、结构化AI、校验原句与规则引用、按建议分支保存；缺口及review分支登记本人待办。业务小脚本只整理、验证和保存，不包办浏览器、模型、分支或流程定义。业务规程、Schema、提示词映射和来源归模板仓库，作者通过客户端维护后原始导出，不手改流程JSON或ZIP。

所有模型token由明确绑定的用户Key承担，不使用开发者Key或已有其他工作区的服务。不调用AI的整理不能成为模型已成功证据；缺Key或确认Skill时预检阻止，本批实际未配置不能捏造评估。个人资料与模型输入只在私有实例/受保护Run保留，公开包无真实简历、Key、Skill、本机路径或对话。

## 三路建议、证据与后续动作

- match：JD职责/要求与明确目标相符，原句与目标引用有效且无阻断未知或冲突；仅准备后续已授权的草稿路径。
- mismatch：有明确不相容方向及JD原句依据，例如目标前端、正文明确主播；不是只按标题/单词拒绝。仅生成not-interested-proposal，当前不点击站点或发送拒绝。
- review：正文未声明完整、空白/缺材料、共享条件缺口/冲突、相近方向、标题/职责矛盾、模型不确定、引用原句/规则无效或有阻断未知；保留原因并通知本人，不先发简历或自行作承诺。

模型返回有限结构化decision/reason/targetRole/quotes/unknowns/conflicts，不允许模型返回动作授权或伪造宿主来源。下游确定性校验：targetRole必须来自本次明确目标，quote必须是本次原始JD正文中的真实连续片段；缺证据、冲突或未知降为review。模型结论即使通过格式/引用检查也仅是建议，不能据此证明事实或语义判断正确。原始建议与降级原因分开保存。

宿主输入整理计算JD内容摘要，保存本次配置修订和实际读取Skill的固定版本/摘要；模型不能提供这些身份。通知按实例/JD摘要/配置修订/Skill版本去重并保留首次来源/已读；缺口阶段尚未读取Skill时不伪造其身份。公开结果明确accountVerified=false、eligibleForActions=false，nextAction仅draft-only/not-interested-proposal/ask-user。规则变化须重新评估，旧Run不改写。

不感兴趣最终仍是独立站点副作用，需要实际页面入口、deny/confirm/auto配置、当前账号/会话/JD/版本复验、持久去重和回执；简历发送、自我介绍、回复及人工接管也仍须完整实现。暂不登录不删除这些要求，不把本批独立建议入口当作完成自动聊天或拒绝。

## 验收与交付

本批先合并治理与Figma，再通过客户端配置字段、公开提示词、节点与三路分支，明确带回、系统导出原始ZIP，独立模板PR核对公开资产与编译来源。沿用阶段约定不新增/运行单元测试，按需现有validate/build及人工节点、输入引用、预检、缺资源阻止、独立复导和重开验证。模板结果需实际自有Key与确认Skill后才可计模型评估通过；不能用直接调用整理函数或注入provider冒充。

完整验收保留：前端/主播、相近岗位、混合职责、正文缺失/partial、恶意JD要求换规则/读Key、模型伪造引用/无效输出/不确定/鉴权限流取消、同键首次来源、配置或Skill变化、真实会话JD来源与发送前复验、独立消费者重新绑定运行。真实Key个人蒸馏/本人确认、完整BOSS登录/投递/简历/聊天/不感兴趣、G3–G5/186/U01–U12/Agent保持未完整验收。

## 2026-10-16 客户端制作、原始导出与独立复导

先行治理[Figma与规格PR #779](https://github.com/zhongmiao-org/flow-ark/pull/779)经最新CI 38846893346的Validate和Auto Merge成功，实际合并`9a0cc5d55e4be570fb8170119ec1226a97dc244b`。随后在安装版客户端#285中复制准确0.1.4，通过字段、公开提示词映射、动作库及插入位置选择器搭建12步job-assessment。未手写或修改流程JSON/ZIP，未增加客户端业务代码或重新构建客户端。

原始0.1.5导出27347字节、36文件、5入口；ZIP SHA256为`0b333b051c11bb59c6378f43a9c177c27c6d1c476d5be74b1a0f76de1e2ca5f1`，contentDigest为`e1a1f08c31225f5ba1d4f7d293c32d1a5f55227e105409dc20597a1d8eb4ee5f`。四个旧flow逐字节不变，新入口只需profile/ai。12步包括读取配置、整理输入、就绪条件、固定Skill、结构化AI、确定性校验、review条件及待办、match条件及两条保存分支、输入缺口待办。业务源文件、Schema与公开提示词随包在模板仓库单独维护；6个新脚本节点映射到4份TS源文件，validate重新编译核对准确导出字节。

模板[PR #11](https://github.com/zhongmiao-org/flow-ark-templates/pull/11)源`b5cfca3e67640f89c01b90371ab934d0aa18cbec`，最新[CI 38848723553](https://github.com/zhongmiao-org/flow-ark-templates/actions/runs/38848723553)的Validate及Auto Merge成功，实际合并`5479f7656c9e4d293792bfe4c97f4833a979d18a`，模板仓库已快进同步main。本地`pnpm validate`、`pnpm build`、`git diff --check`通过。未新增/运行单元测试，未调用模型或招聘外发。

独立消费者复制件通过原生导入ZIP、来源确认、安装及创建实例`3782b75e-a2ad-4936-98ba-b328dc1860d6`，新实例0项资源：浏览器/资料目录/固定Skill/AI全部未绑定，不继承作者或旧消费者绑定。JD正文/岗位/来源默认空，完整声明false，profile/ai缺失时运行与调试禁用；资料入口只缺目录/Skill，网页入口只缺浏览器，条件入口无需这些资源。正常退出重开后五个版本/五实例并存，新增入口仍缺资源、空输入且没有Run，原10条Run、4条未读保持。关闭后只读核对原10条受保护Run payload、全部旧events与数据密钥字节均保留。原始AX和截图仅留本地，见[结构化证据](boss-jd-assessment-20261016.json)。

最终恢复另行本地绑定真实资料的私有实例，原1条解析Run和README输入保持，访谈仍缺ai/workspace并阻止运行。原简历仓库干净，文件字节/摘要不变；未将私人资料或其本机路径复制到公开包/治理记录。最终仅一个安装版主进程。

当前证据证明可视化结构、原始包来源、独立安装及缺资源阻止；没有实际运行三路AI评估。无效模型结构会失败并保留运行错误，尚未证明所有故障都转换为本人待办。onmessage排序/取消/重连完整矩阵、真实会话JD读取/关联、动作前复验与不感兴趣/投递/简历/消息回执继续开发验收。制作时出现动作列表可见范围/焦点与数字字段原生设置问题，通过实际键盘输入、插入位置和原始包核对完成本批，不将这些交互问题标为修复。
