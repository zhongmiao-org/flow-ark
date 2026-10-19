# 选区文字候选（未发布G0草案）

2026-10-19，接续正式0.44.0，不占用正式版本、不修改其快照，客户端不能提前采用。[设计、实际拒绝和六张先行Figma](../../../docs/client/browser-selection-text.md)定义完整语言无关扫描规则及证明范围。

`wire.schema.json`独立描述拟定browser v9/collect、`selection-text`字段、准确已解析调用和result v4；新政策 `bounded-selection-text-v1`，结果强制 `externalAppearanceVerified=false`。不把可绘制的选区外装饰计为无绘制空格，两种计数严格分开，单字段合计不超过128。不能以本草案的格式通过证明真实文字、DOM绘制、宿主来源或外发许可。

`reference.mjs`只核对格式、Unicode/引用、固定字段/顺序、结果与准确输入、状态/原因/null、字节、计数和独立入口browser/use声明。source中的原文字和null必须逐字相同；只有声明的根/字段定位或属性引用槽可解析，不能插入新期限、operation或字段。nodeInstance末段须对应源节点，实际宿主还须核对该实例正在活动及当前能力/绑定/取消，不由纯参考证明。

使用已有AJV依赖可运行：

```sh
node contracts/drafts/browser-selection-text/check-examples.mjs /absolute/dependency-directory
```

依赖目录只提供AJV2020，不导入应用源码、Store或数据，不构成相邻应用运行时依赖。examples是48项正反协议资料，不是应用单元测试；包括明确来源、引用/固定调用篡改、旧版本/政策混入、外观虚假声明、两个计数、选择内拒绝/缺失/裁切、完整性及字节与声明门槛。真实CSS准入、两驱动、UI、生命周期和完整业务尚未实现。

G1还须纳入完整P1 Node、作者/包能力推导与入口资源关联、固定调用和共享规范，再正式发布不可变版本；G2独立采用并实现驱动/宿主、普通配置/结果/诊断、完整安装及原始ZIP独立复导。旧正文政策/历史及公开0.2.17保持，不把草案当完整JD、个人Skill或150次网站上限验收。
