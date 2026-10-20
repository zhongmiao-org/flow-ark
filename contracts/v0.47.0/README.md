# P1 0.47.0：隐藏空叶子的独立文字候选

2026-10-20候选，尚未发布。继承0.46.0；追加browser v10/collect、bounded-selection-text-v2及browser-empty-leaf-text-v1，新结果version5及每字段excludedHiddenEmptyLeaves。旧browser v1–v9、结果、SDK1.0、包2.0及数据库不变。[实际证据、先行Figma、规则和验收](../../docs/client/browser-hidden-empty-leaf.md)为规范组成部分。

仅在同次扫描的隐藏后代严格满足[语言无关排除政策](browser-empty-leaf-policy.json)时排除：标准非嵌入HTML叶子，childNodes严格0，无可访问影子树，整节点display:none或opacity数值0，前后伪元素content无内容，无活动/待定动画，相关API完整。目标和祖先、非空/空白子节点、可见/未知影子树、生成内容、单纯visibility/content-visibility隐藏与不确定情况保持原拒绝。不得凭站点类名、正文长度或模型判断排除。闭合影子树不可声称不存在；必须仍有整节点不绘制条件。

字段排除计数与原祖先空格/选区外装饰分开；原始或非唯一字段计数为0，全部字段合计不超过原2000元素预算，节点扫描/期限/取消、整次结果128KiB和不采用部分正文保持。计数由真实同次扫描生成，格式参考不能证明DOM谓词。新结果仍externalAppearanceVerified=false，complete仅表示字段是否满足该有限策略，不表示完整JD、事实或动作资格。

browser-empty-leaf-text.ts只核对格式、固定节点/调用/字段/来源及计数关联；借用原选区格式规则不意味着降低旧节点政策。正式入口和作者声明均要求自身browser/use资源及browser、browser-empty-leaf-text-v1能力。宿主只认固定新节点，不允许Worker把v9结果追加计数、回退或扩大策略。浏览器诊断IPC的显式新policy分支增加相同计数，旧分支不改；不读取正文。

这份协议不代表客户端驱动、普通UI、实际DOM或模板复导已完成。须待真实PR合并/tag固定后，客户端独立采用并打包；随后通过客户端更新模板及实站验证。北京及个人资料只属于私有实例，真实打招呼、回复后简历、跨批与网站150次上限目标保持。
