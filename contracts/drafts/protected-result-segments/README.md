# 有限完整值边界核心（未发布）

2026-10-21。依据[先行设计及完整门槛](../../../docs/client/protected-result-segments.md)。本目录只是单个规范JSON值的有限边界草案，不修改0.51.0，不加入当前P1/SDK/IPC，不代表预留、持久化、原生节点或业务保护完成。

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

检查命令（工具取自独立客户端现有安装，不建立根依赖）：

```sh
node --check contracts/drafts/protected-result-segments/schema-bounds.mjs
flow-ark-client/node_modules/.bin/tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 contracts/drafts/protected-result-segments/schema-bounds.d.mts
flow-ark-client/node_modules/.bin/esbuild contracts/drafts/protected-result-segments/schema-bounds.mjs --bundle --platform=node --format=esm --outfile=/private/tmp/flowark-protected-schema-bounds.mjs
```
