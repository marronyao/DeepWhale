# DeepWhale Minimal Theme

一个简约的 DeepSeek Harness Web 主题插件。它保留默认布局、字体与交互，只加入少量深海蓝强调色，以及一张不会遮挡操作的右下角鲸鱼娘装饰图。

## 特点

- 自动跟随 Harness 的亮色、暗色和系统外观设置
- 角色层不接收鼠标事件，不影响聊天、输入框或工具面板
- 窄屏自动隐藏，低高度窗口自动缩小
- 遵循 `prefers-reduced-motion`
- 图片在构建时内嵌，运行时不访问远程资源
- 卸载插件后恢复默认界面

## 本地开发

需要 Node.js 22.18+ 或 24+。

```bash
npm install
npm run check
```

安装到本机 DeepSeek Harness 的 Web profile：

```bash
dsh plugin --profile web add .
dsh web
```

## 打包

```bash
npm pack
```

生成的 `.tgz` 可直接测试：

```bash
dsh plugin --profile web add ./dsh-deepwhale-minimal-theme-0.1.0.tgz
```

## GitHub 发布

仓库已包含 CI。推送到 GitHub 前建议运行：

```bash
npm ci
npm run check
npm pack --dry-run
```

若要发布到 npm，请先把 `package.json` 中的包名、仓库地址和作者信息改成自己的值，再执行 `npm publish`。

## 兼容性

本插件使用 DeepSeek Harness 的 `dsh.client` 清单和 `shell.overlay` 插槽。Harness 仍处于开发阶段，升级后若插槽 API 发生变化，可能需要同步调整。

## 许可

代码使用 MIT License。角色图片的许可与署名见 [NOTICE](./NOTICE)。在确认你拥有原始附件与衍生图片的分发权前，请不要公开发布图片资源。
