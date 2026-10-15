# 个人 Skill 工作区与确认版本

2026-10-15，接续[长期计划](guided-skills-boss-plan-20261015.md)G1/G2。会话确认和资料解析已有独立基础，但尚不能保存/选择个人Skill；本批先定义通用草稿、人工确认、独立版本目录和固定读取，不将求职事实/访谈规则写入客户端。

## Figma先行

在原[本批区域](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=487-7024)新增九个原生可编辑状态，沿用Semantic Light/Dark、Noto Sans SC/Inter、既有Button和AntInput；正文/数据为多行输入表现，不导入整页截图或另建主题。

| 状态 | 原生节点 |
| --- | --- |
| 草稿节点配置 | [514:7031](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7031) |
| 编辑草稿与来源 | [514:7130](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7130) |
| 完整版本与差异 | [514:7229](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7229) |
| 人工确认保存 | [514:7320](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7320) |
| 确认版本与维护 | [514:7410](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7410) |
| 固定读取与资源 | [514:7509](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7509) |
| 并发/外部变化 | [514:7606](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7606) |
| 保存结果未知 | [514:7693](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7693) |
| 紧凑Dark/离开保护 | [514:7780](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=514-7780) |

结构：八个1440×1080及一个1040×700，共313Frame、266Text、45Instance、189Vector、27Ellipse，零图片填充；字体家族核对通过。Section延展为4480×21440，前批画板保留。最终确认页与紧凑深色截图已查看，紧凑首卡已修为完整单列，当前侧栏指向来源页面。编辑区改为多行后另核对截图；静态按钮跳转不等于真实交互、焦点或保存通过。

[结构审计](skill-workspace-design-audit-20261015.json)记录九板、28条跨板导航及各内容区子项边界，未发现内容区越界；这不代替实际点击原型或客户端交互验收。

## 契约与状态

[0.21.0快照](../../contracts/v0.21.0/README.md)定义skill v1的propose/read、skill-v1与只读skill资源，以及草稿/版本/清单/来源/输出。发布须核对真实tag；客户端当前仍采用0.20.0，本批不能称已经支持Skill工作区。

关键边界：

- 流程只创建待确认草稿，保存后释放Run；模型与脚本不能直接发布Skill。
- 用户编辑完整正文/数据并看差异，最终核对后写新的版本目录。SKILL.md、data.json和清单可在所选工作区读取；不覆盖旧版本或手工内容。
- 确认使用修订/内容/目录/基线绑定的短期凭据与幂等操作身份。文件与数据库跨两阶段核对，不能声称一笔文件系统原子事务；unknown只核对原操作，不自动再写。
- 流程资源明确选择准确版本和摘要，Run保存不可变快照；外部变化/缺失或未登记内容阻止读取，不静默采用最新草稿。
- 公开ZIP只声明逻辑资源，个人内容/目录/确认记录留本机。创建草稿的固定个人正文等阻止导出，使用参数或结果引用制作公开流程。
- 资料解析、Skill编辑/保存本身不调用模型；引导、整理与试聊仍使用用户绑定的Key。个人事实Schema、nuwa适配和BOSS业务规程归模板仓库。

格式资料：32个正反例（含4种Skill资源访问形式）及5个示例已用AJV2020核对；这是格式证据，不是确认/摘要/恢复行为验收。没有新增或运行单元测试。治理检查与PR/tag结果在实际取得后记录。

## G2实现和验证要求

采用已发布契约后补通用节点/值引用/资源编辑/模板边界、宿主草稿与版本管理、需要我处理中的编辑/比较/确认/未知核对和来源输出。复用加密存储与既有文件选择，不引入业务节点、服务端或任意目录扫描。

人工核对至少覆盖：不同来源和重复输入、重开继续、未保存离开、失败保留输入、两草稿并发确认、旧核对凭据/重复确认、只写部分文件/写完登记失败/回执丢失、结果未知显式恢复、同名目标不覆盖、目录/文件链接与身份变化、外部编辑/缺失、准确版本绑定/快照与另工作区重新选择、公开ZIP无个人内容。实际文件、Runtime/Worker、原生UI、两家真实模型及完整蒸馏/公开复用分别记录，不以局部通过替代S01–S08或G3–G5。
