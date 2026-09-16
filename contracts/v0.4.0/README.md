# P1 契约 0.4.0：固定本地脚本依赖

继承 [0.3.0](../v0.3.0/README.md)。流程格式 1.0、已有节点版本不变；新增可选 `RunSnapshot.scriptBundles`，旧快照仍有效。每条 `ScriptBundle` 包含 nodeId、编译产物 sha256 和实际固定的依赖 name/version 清单，不包含本地安装路径或库源码。

脚本节点已有的 `dependencies: [{name, version}]` 表示显式声明的直接依赖。name 为普通或带 scope 的 npm 包名，version 必须为完整精确版本，不接受 latest、范围、URL 或 Git 地址。同一流程内相同包只能声明同一版本；模板 Manifest.dependencies 必须等于所有脚本直接依赖的去重并集，Manifest.scripts 必须与脚本节点 ID 一致。导入只创建待绑定草稿，不读取依赖、不执行生命周期脚本、不下载或安装。

本地宿主在创建 Run / 固定计划版本之前解析用户绑定的已有包，检查 package.json 的 name/version，打包脚本及实际静态依赖代码与 JSON，并记录直接和传递依赖版本。生成内容寻址的不可变编译文件；运行版本纳入编译摘要。排队、再次编译其他草稿或后来修改本地依赖不能覆盖已有 Run / 计划的编译文件。开始执行前核对快照中的编译文件摘要，缺失或不匹配时停止，不自动重新编译或回退到当前依赖。

计划更新时才采纳新的依赖内容；旧快照没有 scriptBundles 时，允许从其中的无第三方依赖脚本文本编译以兼容 0.3.0。已经固定的包代码不再依赖原目录存在，新建运行仍需本地绑定有效。

此机制固定静态打包输入，不是安全沙箱：可信代码仍有 Node 系统能力。动态 import/require 无法静态解析、原生扩展、运行时相对资源文件等未被打包的依赖必须明确阻止或报告能力缺口，不宣称所有 npm 包均可运行。绑定、文件名、精确支持边界与内部 IPC 见 [客户端本地依赖](../../docs/client/script-dependencies.md)。无 SQLite 表结构迁移，不改变活动 Run 或历史版本。

发布标识 `contracts-v0.4.0`，实际发布以远程 tag 为准。生成：`python3 contracts/build_contracts.py --version 0.4.0`；历史版本生成保持不变。
