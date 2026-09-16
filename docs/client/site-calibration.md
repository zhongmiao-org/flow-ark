# 两站公开页面只读校准

2026-09-16，在 0.1.4 已安装、本地编排和模板验证完成后，按目标文件继续真实页面探测。使用本机 Chrome 153.0.8010.48、playwright-core 1.63.0 和新建专用 Profile；未使用日常 Profile，未登录、填写账号或请求验证码，未执行投递、消息、简历发送或联系方式交换。

## 已观察到的入口

| 平台 | 本机页面证据 | 当前边界 |
| --- | --- | --- |
| BOSS | 官方首页可加载，顶部可见登录/注册和求职入口；登录链接指向 `https://www.zhipin.com/web/user/`。公开首页存在 `.header-login-btn`、职位搜索输入框 `input[name="query"]` | 登录路由 HTTP 200，采样时仍显示加载中；没有实际账号身份、简历或会话证据 |
| 智联 | `https://landing.zhaopin.com/` HTTP 200；加载完成后出现求职者手机号、短信验证码、获取验证码与注册/登录表单。可见 `input.zppp-input[placeholder="手机号"]`、`input.zppp-input[placeholder="短信验证码"]`、`button.zppp-submit` | 表单是动态加载，初始 DOM 及较早截图不含表单；输入 ID 动态生成。未登录账号，不能据此确认消息或交换功能 |

这些定位信息只是未登录页面的观察记录，尚未成为可执行的投递或聊天选择器。页面缺失某元素或采样时正在加载，不等于网站永久缺少该功能。智联公开页面的 App 沟通介绍也不证明网页版账号是否具有沟通入口。

公开入口参考：[BOSS 首页](https://www.zhipin.com/)、[智联首页](https://landing.zhaopin.com/)。网页检索结果与本机 Chrome 实测分开；表中结论来自本机实测。

## 证据与下一步

客户端忽略目录保存 `test-results/public-sites.json`、`test-results/login-entries.json` 及两站截图；截图已查看。原始日志为 `/private/tmp/flowark015-public-sites-retry.log` 与 `/private/tmp/flowark015-login-entries.log`。首版临时探测脚本因 TS 函数序列化失败未读到页面内容，修正后重新执行，不将第一次失败计为通过。未将网页全文、Profile 或账号资料提交到仓库。

实际用户目录目前没有专用浏览器 Profile；接下来需要用户本人在专用 Chrome 完成求职者登录，再逐项记录账号身份、简历选择、职位详情、会话、请求/接受和结果读取入口。手机号、验证码等由用户在网站填写，不进入治理记录。

两站生产适配器仍保留未验证阻断；不根据未登录页面或模拟选择器放开外发。J-01/J-02/J-03/J-06/J-08/J-11/J-12 仍未完成。账号校准完成后，真实外发继续以用户对账号、目标、内容和动作范围的明确配置为前提。
