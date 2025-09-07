# Build Luna on Ubuntu (from source)

This guide shows how to build and run Luna from source on Ubuntu 22.04/24.04.

## 1) Prerequisites

Install system packages:

```bash
sudo apt update
sudo apt install -y curl git build-essential python3 make g++
```

Install Node.js (LTS recommended) using nvm:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
```

Verify:

```bash
node -v
npm -v
```

## 2) Clone the repo

```bash
git clone https://github.com/magnussimonsen/Luna5.git
cd Luna5
```

## 3) Install dependencies

```bash
npm install
```

If you hit a postinstall permission error with electron-builder, ensure node_modules bin permissions:

```bash
chmod -R u+x node_modules/.bin
npm install --force
```

## 4) Run in development

```bash
npm run dev
```

This starts Electron with hot reload for main, preload, and renderer.

## 5) Type-check and build

```bash
npm run typecheck
npm run build
```

## 6) Package for Linux

```bash
npm run build:linux
```

Artifacts are written to `dist/`:
- `dist/linux-unpacked/` (unpacked folder)
- `dist/luna-<version>.AppImage`
- `dist/luna_<version>_amd64.deb`
- `dist/luna_<version>_amd64.snap`

## 7) Run packaged app

Unpacked (fastest):

```bash
cd dist/linux-unpacked
chmod +x luna
./luna
```

AppImage:

```bash
chmod +x dist/luna-*.AppImage
./dist/luna-*.AppImage
```

If AppImage complains about FUSE:

```bash
sudo apt install -y libfuse2   # Ubuntu 22.04
# or
sudo apt install -y libfuse2t64  # Ubuntu 24.04
```

Deb package (adds launcher + PATH):

```bash
sudo apt install ./dist/luna_*_amd64.deb
# uninstall
sudo apt remove luna
```

Snap (optional):

```bash
sudo snap install --dangerous dist/luna_*_amd64.snap
snap run luna
# uninstall
sudo snap remove luna
```

## 8) Troubleshooting

- If double-clicking doesn’t launch, run from a terminal to see logs:

```bash
ELECTRON_ENABLE_LOGGING=1 ./dist/linux-unpacked/luna
```

- If you see sandbox issues in some environments:

```bash
ELECTRON_DISABLE_SANDBOX=1 ./dist/linux-unpacked/luna
# or
./dist/linux-unpacked/luna --no-sandbox
```

- PostCSS warning “@import must precede all other statements”: ensure CSS `@import` lines are at the very top of `<style>` blocks.

---

If anything fails, capture the terminal output and open an issue or share the logs.
