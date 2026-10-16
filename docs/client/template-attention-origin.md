# 模板提醒的来源运行

2026-10-16，接续[个人蒸馏与BOSS计划](guided-skills-boss-plan-20261015.md)。用户明确暂不登录，继续模板制作；当前不再次请求登录，不将账号、完整JD及外发动作列为已验证。

## 缺口与契约

BOSS 0.1.2真实预检已登记提醒，但模板SDK只保存detail，无法直达来源Run。界面从detail.runId/runIds找关联，模板可提供这些字段，却不能据此证明宿主来源。本批以[0.26.0](../../contracts/v0.26.0/README.md)独立origin固定首次Run/实例/入口，不增加业务节点或请求字段。

新提醒来源只能由宿主注入并严格校验，detail中的同名数据照常保留且不生成来源链接。显式null、数组、标量与对象保留；同实例同key跨Run返回首条，不改已读、时间、内容或来源；另一实例独立。既有无来源记录不回填。查看和返回不创建Run、调用模型或授权外发；Run不在摘要时按原ID读取，读取失败明确显示，不补猜其他记录。其他提醒种类来源规则保持。

## Figma先行

原文件sVciNUZHG9yx81gCpYzjH9，页面1:3，Section487:7024追加三张1440×1080画板：[Light来源与原始内容569:5888](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=569-5888)、[Dark来源569:5974](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=569-5974)、[缺失可信来源569:6060](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=569-6060)。

复用既有提醒画板487:12082、Primary1:146/Secondary1:148组件及Semantic Light/Dark、Noto Sans SC/Inter；保持可编辑原生层，无图片填充。三张最终整图均实际查看，按钮为查看运行详情/查看当前网页/返回待办列表，缺失来源隐藏运行详情按钮。原186画板不改。继承的无关原型跳转已清除，本批为静态状态设计，不计可点击原型或客户端导航通过。

## 实施与验证边界

G1先发布真实契约tag，再由独立客户端固定采用。SQLite表/user_version、SDK1.0、包2.0不变，无数据迁移/清库/来源回填。SDK、Store、Renderer分层改动；来源helper纯数据无IO。原始详情保留，不因关联展示隐藏模板自报字段。

本批24条Schema正反例、记录示例及来源helper格式核对通过，57份机器资料摘要固定；只证明格式，未证明身份、去重、取消或原生导航。UI/UE阶段不新增或运行单元测试。G2须取得真实SDK/Store人工行为核对：首条/跨Run同键/跨实例、任意详情及伪造字段、取消、重开、缺失/非法来源；再从可视化模板新实例运行得到新提醒，核对详情往返和不重复执行。真实Key蒸馏、BOSS账号/JD/聊天/投递及全矩阵仍分别验收。
