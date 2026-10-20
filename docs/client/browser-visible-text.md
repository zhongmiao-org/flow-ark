# 可见文字候选与隐藏文字叶子

2026-10-20，G1候选。上一目标回合有真实进展：0.47已发布/安装并保留全部记录，真实隐藏非空结果改变了下一步；并非待用户输入或无进展。当前新增设计与格式契约，尚未发布/实现/实站通过，实际打招呼仍0。

## 来源与语义

[真实诊断](browser-hidden-empty-leaf.md)在同一独立JD上证明，两个直属SPAN的innerText为空，textContent却分别为“前”“直聘”。0.47空叶子规则不适用，继续拒绝正确。不能让模板把旧拒绝结果包装成成功，也不能靠站点随机类名忽略内容。

新增显式“只读可见文字”：用同步DOM检查后的innerText候选，独立记录未采用的隐藏文字叶子。仅标准HTML非嵌入/非自定义后代、无子元素和开放影子树、子节点全部文字/注释、display:none或visibility:hidden、前后伪元素无内容、无运行/pending动画、API和样式可核验时排除。子节点消耗原预算，不读取隐藏原文。visibility:hidden只有纯文字叶子才允许，因此不会漏掉子元素的visibility:visible覆盖；opacity零单独情况仍拒绝，因为innerText可能仍包含其文字。目标及祖先不能排除，含子元素/生成内容、content-visibility单独隐藏、visibility:collapse、裁切和未知保持拒绝。不能证明闭合影子树或外部覆盖；不修改网页。

这是按此有限规则得到的可见文字候选，隐藏原文明确未采用；不证明隐藏全文、完整JD或岗位资格。调用者必须看来源与排除计数，再按自身事实/资格规则评估，不能把采集本身当作外发授权。模板/站点选择器、招聘规则、城市和个人事实继续归模板及私有实例；客户端不识别BOSS或随机类名。

## 契约与普通UI

[0.48.0候选](../../contracts/v0.48.0/README.md)追加browser v11及browser-visible-text-v1，renderPolicy=bounded-visible-text-v1，结果version6；沿用selection-text字段配置，每字段必需excludedHiddenTextLeaves。原始或非唯一字段为0，总计最多2000。节点、固定调用、字段顺序/源网址/Unicode和入口自身browser/use资源严格关联；2000元素/6000节点/64祖先、取消/期限/导航代次、祖先空格/装饰、整次128KiB及externalAppearanceVerified=false保持。旧v1–v10和旧结果不改。

作者在原字段配置显式“只读可见文字”，启用后可“恢复严格规则”或“仅跳过空节点”，均通过普通UI切换/保存，不执行。结果和诊断显示隐藏文字叶子排除数及外部覆盖未核验；含子元素或生成内容仍返回null并保留原因。IPC仍version1，仅新policy分支增加必需计数，同一同步检查不读取正文。导出独立能力，旧客户端明确拒绝，不切换策略。冻结Run/已装包不因草稿变化而改变。

## Figma先行

复用现有文字候选页、Input/Button组件和明暗变量。六张1440×1080的整图已查看，108/110个后代、7/8组件实例，无图片填充，字体Noto Sans SC/Inter。示例2处是example.org设计示例，不是实际DOM资格证明。

| 状态 | Light | Dark |
| --- | --- | --- |
| 明确选择、旧规则保持 | [1055:10541](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-10541) | [1055:10650](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-10650) |
| 可见候选、排除说明 | [1055:10759](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-10759) | [1055:10870](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-10870) |
| 非叶子/未知仍拒绝 | [1055:10981](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-10981) | [1055:11090](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1055-11090) |

## 消费及验收

真实PR/tag先行，客户端随后独立固定采用，实现预编译/固定宿主、新结果、内置与所选Chrome同一谓词、普通选择/恢复/计数/诊断/导出；其他浏览器明确阻止。依阶段约定不新增或运行单元测试，类型/格式/构建与实际原生UI/网页分别取证。真实隐藏SPAN是否满足谓词仍须实际核验，不从innerText空或本契约推出。

安装时保留个人档案、Key、登录、历史及固定版本。通过客户端更新三个采集节点及来源守卫、原包导出和独立复导；保留北京/15–20K及本人边界。继续真实匹配、唯一打招呼、回执、冻结候选/续批与实际网站150次打招呼上限弹框，回复后简历附件另计。原完整个人增量/186/Agent等目标不删减。

G1本地核对：治理链接/结构/校验和及diff通过，166个机器文件摘要正确；既有定义仅Node追加新分支。独立TypeScript及37项纯格式、固定来源、能力声明核对通过，包含旧v9/v10保留及拒绝新结果。未运行DOM或单元测试，不能代替真实页面验收。
