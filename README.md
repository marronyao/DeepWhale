# DeepWhale Minimal Theme

A minimal theme plugin for the DeepSeek Harness Web UI. It preserves the default layout, typography, and interactions while adding a restrained deep-blue accent and a compact whale-girl mascot above the account status in the lower-left sidebar without blocking the interface.

## Features

- Automatically follows the Harness light, dark, and system appearance settings
- Uses a pointer-transparent mascot layer that does not interfere with conversations, the composer, or tool panels
- Hides the mascot on narrow screens and scales it down in short windows
- Respects `prefers-reduced-motion`
- Embeds the image during the build, with no remote asset requests at runtime
- Restores the stock interface when the plugin is removed

## Local Development

Node.js 22.18+ or 24+ is required.

```bash
npm install
npm run check
```

Install the local checkout into the DeepSeek Harness Web profile:

```bash
dsh plugin --profile web add .
dsh web
```

## Packaging

```bash
npm pack
```

The generated `.tgz` package can be installed directly for testing:

```bash
dsh plugin --profile web add ./dsh-deepwhale-minimal-theme-0.1.1.tgz
```

## Publishing on GitHub

The repository includes a CI workflow. Run the following checks before pushing to GitHub:

```bash
npm ci
npm run check
npm pack --dry-run
```

Before publishing to npm, replace the package name, repository URL, and author information in `package.json` with your own values, then run `npm publish`.

## Compatibility

This plugin uses the DeepSeek Harness `dsh.client` manifest and `shell.overlay` slot. Harness is still under active development, so future releases may require updates if the slot API changes.

## License

The source code is available under the MIT License. See [NOTICE](./NOTICE) for the artwork notice and attribution requirements. Do not publish the image assets until you have confirmed that you have the right to distribute both the supplied source image and its derivative.
