# 有限完整值边界核心（未发布）

2026-10-21输入域接续：[独立正文与管理字段](input-domains.md)统一完整计划、生产者结构集合、实际副本和复合提案的捕获；不把外层字段额外计入独立正文深度/工作。新增未发布scoped读写参考，联合预算按同一语义核对，准备总量另设限额；0.51.0及安装版保持。

2026-10-21接续：[完整目录与运行输出联合预算候选](joint-budget.md)增加storage-envelope、joint-budget及独立预算格式；原目录/实际副本、所有未消费清单、完整流程汇总和额外索引共同计量。此处没有Store持有/许可、生产来源完整性或原子消费证明，完整G1和客户端采用仍待完成。

2026-10-21。依据[先行设计及完整门槛](../../../docs/client/protected-result-segments.md)。本目录包括单个规范JSON值及结构化完整运行汇总的有限边界草案，不修改0.51.0，不加入当前P1/SDK/IPC，不代表预留、持久化、原生节点或业务保护完成。

`compileBoundary(schema)`接受下述封闭JSON Schema子集，返回恰有`version,policy,schemaSha256,canonicalBytes,valueNodes,depth,workBytes`的证书。规范序列化/摘要复用准确0.51.0。证书须重新从完整Schema计算比对；客户端不能信任调用方填写的字节数。实际数据仍先由同一固定Schema的验证器完整验证，随后再核对规范字节/访问数/深度及序列化工作。`verifyMeasuredBoundary`仅核对证书及计量，不替代Schema数据验证，也不授予保存/执行权。

## 形式与确定性上界

- `const`按完整值准确计量；非空`enum`取所有值各计量维度最大值。数值必须为有限JSON Number。
- 文本必须有非负整数`maxLength`，JSON Schema按Unicode代码点计长。规范字节保守取`2 + 6 * maxLength`，包含引号及最坏JSON转义；不按UTF-16长度误算非BMP字符。`minLength`、`pattern`和`format`不增加上界，但实际验证仍执行它们。
- Number/integer保守取32个ASCII字节，布尔5、null4。32是本草案的保守上界，不是声称ECMAScript精确最长值；实际计量仍按规范序列化。依据[Number::toString](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-tostring)的十进制格式及[JSON字符串转义](https://tc39.es/ecma262/multipage/structured-data.html#sec-quotejsonstring)，不得用界面格式化数字代替。
- 数组须有非负整数`maxItems`（最多1000）及一个有限`items`结构；字节为括号2、所有最大条目的字节及逗号。0项数组允许`items:false`。访问次数包含容器及全部最大条目，非空数组深度为子结构加1。
- 对象须`additionalProperties:false`，只接受有限`properties`。每个键按其真实规范转义字节计入，另加冒号/逗号/子结构及括号；可选字段也按可能出现计入。required必须唯一且都在properties中；不按原型链查找键。
- 非空`anyOf`/`oneOf`对各分支分别编译，逐维取最大上界，不把其中一个分支的最小值冒充整体。类型数组等价于有限类型分支。只支持同一完整Schema内的规范JSON Pointer `$ref`，按自有成员解析；外部引用、循环和未声明的关键词均拒绝。`$ref`不能混用另一个结构形状，以免不同Schema草案的兄弟属性语义产生歧义。
- 编译最多4096次Schema访问；Schema和常量必须符合0.51.0的普通、稠密、无访问器JSON规则。计算出的单值上界不得超过8MiB、262144个值访问及深度64；运算须为安全非负整数，算术溢出整次拒绝。常量与schema序列化工作另受现有128MiB限制约束。

序列化工作上界独立累计每个完整子值的规范字节：标量等于自身字节；容器等于自身规范字节加全部子值工作。数组按最大条数相乘，对象包含全部可能字段；分支逐维取最大。`workBytes`不得超过128MiB，避免只有根字节符合8MiB却在深层嵌套重复展开时超出工作限额。

此上界不估算内容复用收益，不能遗漏目录、分块/引用、原值回执副本、索引和整体聚合输出，也不表示已经为它们取得空间。证书本身没有Run、持有人、准入/消费或过期语义。完整受保护段契约和生产实现继续；纯内存格式例不能替代外发前保护或真实150次业务验收。

## 本次检查与已发现的消费差异

Node语法、声明文件的隔离NodeNext类型检查和ESM打包通过。一个独立纯格式例使用现有AJV验证固定Schema与数据，再核对证书Schema和实际计量：含本地引用、string/null类型分支、最多5项枚举列表、有限小数、控制字符/中文/非BMP/单独代理项和完整const对象。计算上界为573字节、13次值访问、深度2、1178工作字节；实际为167字节、10次值访问、深度2、330工作字节。该例只证明此份数据的格式关系，没有新增或运行应用单元测试，也不计宿主事务、实际生产者或动作保护通过。

首次例把`__proto__`声明为封闭对象的properties字段，现有AJV生成器会过滤此键，因而实际Schema验证拒绝；该例没有通过。随后通过的例将它保留在const对象中，验证原值计量不丢失此键，不能据此宣称properties兼容问题已经修复。G1须明确固定验证器能够采用的Schema：不支持的属性定义在外发前拒绝，或实现并验证等价的完整校验；不得删除实际字段或用边界计量代替数据验证。

本核心允许的约束关键词不表示核心执行所有Schema有效性/数据验证；`pattern`、`format`、数值约束、类型与const交集以及未使用定义仍由固定Schema验证器负责。正式采用时应先完成Schema元验证和验证器编译，再编译边界；返回值必须先做完整数据验证，失败不得登记为可采用结果。以上验证器差异、整段图编译、保存联合预算和原生UI均仍未完成。

## 固定生产者输出校验候选

`output-validation.mjs`增加独立未发布的`compileOutputValidation(schema)`，配置名为`ajv-draft07-data-only-v1`。它使用消费者自己的准确AJV 8.20.0（当前客户端已锁定的版本），不在治理根安装依赖、不从客户端导入实现、不由Renderer动态生成代码。本目录仍不是客户端已采用的能力或正式G1发布；已有单值/汇总证书格式及0.51.0均保持。

准入先按现有规范JSON规则取得独立Schema副本，再逐层检查所有结构位置、未使用的`$defs`与本地引用。关键词来源复用`schema-bounds.mjs`的`BOUND_SCHEMA_KEYWORDS`，包含元格式验证、正则语法和固定草案版本；最多4096个结构定义，包含引用的最长展开路径最多256条边（独立于Schema字面JSON和数据的64层），递归引用拒绝。已访问结构的缓存保留其完整后继高度，不因先从较短路径访问而漏算更深的引用路径。未使用定义中的非法类型、外部引用、未知关键词和未注册命名格式也不静默略过。

配置固定启用Schema元验证、严格关键词/有限数字、Unicode正则和自有属性检查，关闭类型转换、默认补值及删除多余字段；不开放远程Schema加载、异步Schema或自定义关键词。选项语义依据[AJV官方选项](https://ajv.js.org/options.html)与[元格式验证接口](https://ajv.js.org/api.html#ajv-validateschema-schema-object-boolean-boolean)。该配置没有注册命名格式插件，故所有`format`在准入时明确拒绝，不把日期/邮箱等要求降成注释；将来支持须固定实际实现和版本，再更新契约及普通字段表单。现有边界算术对`format`不增加上界仍保留，不能据此声称生产者配置已接受该要求。

已知AJV会忽略`properties.__proto__`，本配置在取得任何准入前明确拒绝这类字段定义，不删除实际字段或假装校验成功。完整`const`值中的同名普通JSON字段保持，成功格式例已分别核对其保留；这是两种不同位置。实际使用仍须先满足整个有限结构语法及同一配置的编译。

返回的本地校验对象固定完整Schema与其边界证书，外部后续修改原Schema不能改变它。`verify(value)`先取得完整普通JSON副本，在该副本上执行同一份固定Schema验证，再重新核对证书和四个实际计量维度；只在全部成功后返回包含同一完整副本、摘要和计量的深度冻结对象。后续持久化必须使用此副本，不能验证副本后却保存调用方可变的原对象。失败不返回裁剪值、转换值或AJV原始诊断/原始资料。该对象只是进程内校验结果，没有Run来源、权限、租约或可跨进程信任的许可语义。

当前只给出静态格式例及语法/声明/ESM检查，不把它当作生产Worker、目录/原值联合预算或真实外发验收。Schema编译和数据验证含代码生成与正则运算，未来G2必须在可取消、有限期限、宿主监督的环境中完成，失败/超时在外发前阻断；它不是安全沙箱或已证明的CPU预算。返回副本/验证临时工作、生产者家族、全图完成观察、独立回执、事务预留和释放仍须联合接通，不能提前启用此候选来恢复招聘外发。

## 完整运行汇总边界

`completion-bounds.mjs`接收完整固定的`FlowDefinition`和按步骤身份绑定的有限生产者Schema，返回`completion-certificate.schema.json`规定的独立证书；不接收调用方提供的字节数、循环次数覆盖或裁剪后的步骤段。输入须先由固定P1格式及同一数据验证器完整校验，生产者Schema还须在实际返回时执行；本函数只做完整汇总的静态上界推导。它不证明输入确属某个已准备Run，也不自动接入当前执行器。

推导对应现行`execute()`的完整返回形状：每个块为以步骤身份作键的对象，条件返回选中分支对象，循环返回每次块对象组成的数组。两分支逐计量维度取最大；循环按字面数组实际长度、或动态引用所受执行器1000项硬上限计量，不能使用界面上自行填的小数。空数组循环也完整检查其体内结构，避免隐藏未知生产者。每层容器的键、逗号、括号、全部子值访问和重复序列化工作均计入，不能只把叶结果字节相加。由此也保守覆盖块前缀和循环已完成前缀的同形值，但不声称现行执行器会在失败时保存这样的部分输出。

固定`value`按完整字面原值计量；含变量引用的值及其他叶生产者必须提供有限Schema，断言成功返回由执行器固定为`{verified:true}`。Schema输出另与`null`逐维取最大，覆盖执行器的空返回规范化；本地Schema引用始终在原完整Schema中编译，不将它原样嵌入新汇总Schema而改变引用根。未知节点、身份重复/不安全、未绑定或多余Schema、无界输出及可能超过10000次节点执行的路径均拒绝。即使条件看似恒真也覆盖两个分支；不依赖模型判断跳过另一条路径。证书同时固定完整流程和全部生产者结构摘要，校验时完整重新编译，不能只信任证书字段。

`maxNodeExecutions`和`maxLeafReturns`是完整路径的保守次数，不是已经保存的目录条目数。不同能力还可能产生独立操作/AI/文档等回执；目录索引、原值副本、秘密投影及原子事务预算均不由这两个数字证明。段选择/作用域、可信生产者家族、每节点完成观察、取消/失败/unknown的独立回执边界、所有未消费预留与最终输出的联合空间仍须在完整G1/G2补齐。此处没有新增外发许可或启用客户端能力，也不改变旧快照。

本机静态格式例经准确0.51.0的AJV2020流程格式及独立draft-07证书格式校验通过：固定值、包含动态叶输出的两分支条件及两项字面循环共同得到完整汇总上界355字节/11次值访问/深度3/1235工作字节，最多6次节点执行和4次叶返回；同形静态完整值为121字节/11次/深度3/299工作字节。首次格式命令误用draft-07验证器读取2020-12的P1元格式而拒绝，第二次因例中脚本漏写必填`dependencies`未通过；修正例后才取得上述通过结果，没有据此放松P1验证。该例未执行任何节点/Worker、未新增或运行应用单元测试，不构成生产执行、预留或业务验收。

检查命令（工具取自独立客户端现有安装，不建立根依赖）：

```sh
node --check contracts/drafts/protected-result-segments/schema-bounds.mjs
flow-ark-client/node_modules/.bin/tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 contracts/drafts/protected-result-segments/schema-bounds.d.mts
flow-ark-client/node_modules/.bin/esbuild contracts/drafts/protected-result-segments/schema-bounds.mjs --bundle --platform=node --format=esm --outfile=/private/tmp/flowark-protected-schema-bounds.mjs
node --check contracts/drafts/protected-result-segments/completion-bounds.mjs
flow-ark-client/node_modules/.bin/tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 contracts/drafts/protected-result-segments/completion-bounds.d.mts
flow-ark-client/node_modules/.bin/esbuild contracts/drafts/protected-result-segments/completion-bounds.mjs --bundle --platform=node --format=esm --outfile=/private/tmp/flowark-protected-completion-bounds.mjs
node --check contracts/drafts/protected-result-segments/output-validation.mjs
flow-ark-client/node_modules/.bin/tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 contracts/drafts/protected-result-segments/output-validation.d.mts
NODE_PATH="$PWD/flow-ark-client/node_modules" flow-ark-client/node_modules/.bin/esbuild contracts/drafts/protected-result-segments/output-validation.mjs --bundle --platform=node --format=esm --outfile=/private/tmp/flowark-protected-output-validation.mjs
node --check contracts/drafts/protected-result-segments/storage-envelope.mjs
node --check contracts/drafts/protected-result-segments/joint-budget.mjs
flow-ark-client/node_modules/.bin/tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 contracts/drafts/protected-result-segments/storage-envelope.d.mts contracts/drafts/protected-result-segments/joint-budget.d.mts
NODE_PATH="$PWD/flow-ark-client/node_modules" flow-ark-client/node_modules/.bin/esbuild contracts/drafts/protected-result-segments/joint-budget.mjs --bundle --platform=node --format=esm --outfile=/private/tmp/flowark-protected-joint-budget.mjs
```
