# P1 契约 0.2.0：模板声明实例配置

继承 [0.1.0](../v0.1.0/README.md) 的流程格式 1.0、节点 v1 和业务定义，不改写已发布版本。发布标识 `contracts-v0.2.0`，摘要见 SHA256SUMS。

TemplateManifest 增加可选 `configuration: {adapter, schema}`。配置字段名称、标题、帮助、枚举与验证条件随模板包发布；通用流程编辑器只包含节点、参数和资源绑定，不内置“招聘配置”或 BOSS/智联特定表单。模板实例单独打开通用配置表单。未来商店下载相同包，不需要把业务标签写入客户端编辑器。

`schema` 是受限制的 JSON Schema 2020-12 子集：object/properties/required/additionalProperties、string/number/integer/boolean/array、items、enum、oneOf 中的 const/title、title/description/default/const、minimum/maximum/minLength/maxLength/maxItems。界面只渲染数据，不执行模板代码，不加载远程 `$ref`、HTML 或资源。客户端拒绝不支持的配置适配器与 Schema，不猜测未知格式。

配置实际值属于本地实例绑定，不进入模板包或平台上报。`flow-parameters-v1` 将非敏感配置作为通用流程参数；`recruiting-policy-v1` 由本地业务适配器解释，实例化时以客户端安全默认初始化七类动作，不从包内继承外发权限、账号、真实简历事实或联系方式。获取/导入不执行。

无 configuration 的旧包仍以规范化 `flow` 计算 digest。有 configuration 时，digest 为规范化 `{flow, configuration}` 的 SHA-256，表单定义和流程一起校验。0.1 客户端会因未知字段拒绝新包；0.2 客户端同时接受无配置旧包，旧流程无需格式迁移。消费者先采用本契约，再支持新模板。

SQLite 表结构不变化。客户端可以兼容读取早期本地 policy 字段，并在用户下次保存时转成通用实例配置；不改写正在运行的快照、已发布版本或外发历史。配置变化使未发送的旧确认/草稿失效。

生成：`python3 contracts/build_contracts.py --version 0.2.0`。`--version 0.1.0` 可再现旧 Schema，不能修改远程历史 tag。
