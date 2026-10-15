# 2026-10-15 检查器操作安装核对

依据[操作规范](inspector-actions-design-20261015.md)及Figma补充节点`467:5120`，客户端把检查器的长文案操作改成两列等宽按钮，列/行间距12px，与下方期限区间隔20px。显示“编辑位置 / AI 修改”“表格配置 / 编辑映射”，文件和HTTP按类型显示配置名称。保留40px高度、单套Light/Dark和完整可访问名称；移动、复制、删除、原配置路由与输入守卫保持。

共享`InspectorAction`复用Ant Design Tooltip，支持悬停/聚焦。禁用快捷操作和AI的容器可聚焦查看原因，真实按钮仍禁用；AI未保存的必要提示仍在页面中。标题快捷操作间隔8px，宽度不足时整组换行；内容区不足220px时变为单列。

## 交付来源

- 设计治理[#731](https://github.com/zhongmiao-org/flow-ark/pull/731)，源`e4301cebfa0aeba30dd08e268384e471f4901091`，[最新CI 38692648764](https://github.com/zhongmiao-org/flow-ark/actions/runs/38692648764) Validate/Auto Merge成功，实际合并`ef653ba0e7b5779f6ccc1cd3f6ef7942e8a5d1bd`。
- 客户端[#266](https://github.com/zhongmiao-org/flow-ark-client/pull/266)，源`5d6ab40eaf2e4d7c5d21740593656693c9fb048d`，[最新CI 38692914201](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38692914201) Validate/Auto Merge成功，实际合并`6e2ccdcd69fd75c2146a6bd0f73f58e04d3f6d5d`。客户端采用上述治理基线，契约仍0.17.1，无公共API、IPC或数据库变更。
- 本地类型、构建、改动文件Prettier和diff检查通过；macOS APP/ZIP/DMG成功。保留原有大chunk、默认图标及未签名/公证边界，非正式发版。

## 人工页面与实际安装

临时页面直接使用生产`InspectorAction`、`NodeTiming`、ConfigProvider、字体与共享样式，没有真实IPC操作。Light/Dark实际查看，336px面板两列约137.25px宽、40px高、12px间距；240px面板改为一列约190.5px宽，按钮和面板无横向裁切。Tab聚焦映射按钮显示完整说明；未保存AI按钮仍禁用，容器可通过Tab聚焦显示原因。截图及临时源码保留于`/private/tmp/flowark-inspector-actions-20261015/`，不进入客户端工程。

旧版正常退出并确认零主实例，备份应用与上一批专用虚构资料后串行安装`/Users/mac/Applications/FlowArk.app`。候选与合并main相关源码零差异，安装和候选ASAR均为`0a2427e2049514773e35e84e3dd22be7b8d8c1bf3579d7274d220700b7f58c56`。继续原资料目录，原生列表仍3流程/4运行/0活动。

安装版打开原Excel节点，实际查看两列布局及期限分隔；点击禁用上移的可聚焦容器，显示“已在当前分支首位，无法上移”，没有改变节点位置。点击“编辑位置”打开原步骤工作页并返回；“表格配置”打开原资源配置并返回；“编辑映射”打开原Excel映射页，工作簿名`after-syscall-recovered.xlsx`、工作表Boundary、A/C/E三条映射保持，取消返回同一节点。返回焦点在原映射按钮，Tooltip显示完整说明。没有保存、复制、删除、发起AI或运行，没有改写工作簿。

`native-inspector-dark.png`和`native-inspector-final.png`已实际查看，后者展示安装版焦点Tooltip与操作布局。本轮安装版检查为当前跟随系统的Dark；Light与窄面板来自上述生产组件临时页面，不能混称两主题所有原生页面都已验收。原外观偏好没有改变。

## 保留边界

本轮不新增/运行单元、集成或smoke套件，不计作原186整板完成。Figma补充稿是可编辑设计及交互规范，Tooltip浮层的行为证据来自客户端人工页面和安装版，不把说明文字当作原型已经点通。其他节点的全部配置组合、所有紧凑窗口与键盘/读屏路径继续逐板验收，AI401维持原记录。
