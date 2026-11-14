# 截图窗口标题的 Chrome 内存提示装饰

2026-11-11，正式 Run cd012022 在首次范围观察截图前失败 capture-window-ambiguous，未投递桌面动作。随后既有系统权限下只读 Swift 元数据 probe：同 Chrome PID、同 frame 的 AX 窗口2个，SC候选2个；目标 AX 同标题唯一，但带内存用量高装饰，与SC标题exact及仅去app后均0匹配。再仅移除精确Chrome内存装饰后SC匹配1个；AX与SC均无zero-width字符。不截图、不输入、不读取页面业务内容，不输出标题/URL。

captureTitle 在先移除准确app后缀后，仅 Google Chrome 应用移除末尾“ - 内存用量高 - 数值 MB”装饰。AX同标题及SC匹配仍必须分别唯一，同PID、几何、绑定对象、foreground与局部截图校验保持。其他字符不清理，其他应用不适用；不以模糊标题或任意唯一窗口代替绑定。不扩大到读取或重放业务unknown。
