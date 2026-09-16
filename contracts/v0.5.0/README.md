# P1 契约 0.5.0：招聘岗位筛选与页面证据

继承 [0.4.0](../v0.4.0/README.md)，流程格式及节点版本不变。RecruitingPolicy 新增可选 jobFilter；RecruitingAction 新增可选 jobSnapshot。旧策略不含 jobFilter 时保持已有关键词、排除公司和允许目标范围，新规则不静默加入旧流程或计划。旧客户端严格 Schema 会拒绝新增字段，不能回退为忽略限制后执行。

RecruitingJobFilter 包含城市 cities、包含公司 includedCompanies、排除职位词 excludedKeywords、工作方式 workModes 和 salary。各组之间取交集，组内取任一；空数组表示不增加该组限制。新文本条件采用 NFKC、去两端空格和大小写归一；城市比较完整名称，不推断城市别名，包含公司和排除职位词用字面量子串。旧关键词/排除公司字段保持原有区分大小写的字面量子串语义。

工作方式为 onsite（现场）、hybrid（混合）、remote（远程），必须来自岗位页面明确标注，不能由城市、公司、职位名或 AI 推断。salary.enabled 控制人民币月薪筛选，minimumMonthly 表示岗位薪资下限不得低于该值，maximumMonthly 表示岗位薪资上限不得高于该值；0 为该方向不限。启用时至少设置一个非零边界，非零上下限不能倒置。按完整区间核对，不以区间相交视为通过。

RecruitingJobSnapshot 记录 title/company、city、workMode、salary、source 和 observedAt。未读取城市/工作方式/薪资用 null，不能用空串或 0 冒充已知；JobSalary 明确 minimum/maximum、币种及 month/year/day/hour。当前筛选只接受明确人民币月薪，不把年薪、日薪、时薪、面议或不同币种自动换算为月薪，不将额外发薪月数加到月薪中。已知区间须为正值且不得倒置；来源非空且观察时间有效。

任何启用的新增筛选都需要来自当前目标详情的岗位快照。列表与详情的职位/公司不一致、所需字段缺失或证据无效时进入人工待办，不调用 AI 或发送。生成草稿前筛选一次，实际提交前重读目标并再次核对岗位证据和规则；即使新岗位信息仍满足范围，已确认内容所绑定的岗位信息变化也使旧确认失效。只有 observedAt 更新不视为内容变化，避免轮询本身令确认永久失效。

本地绑定、默认值、模板更新和验证见 [岗位筛选](../../docs/client/recruiting-filters.md)。JSON 载荷扩展无需 SQLite 表结构迁移；既有历史动作不重写，历史已提交/未知结果仍去重。发布标识 contracts-v0.5.0，以实际远程 tag 为准；生成命令 `python3 contracts/build_contracts.py --version 0.5.0`。
