# Run Luna AppImage (Ubuntu) — Quick Start

1) Make the AppImage executable
```bash
chmod +x ~/Downloads/luna-stem-notebook-*.AppImage
```

2) Run with no-sandbox (recommended for AppImage)
```bash
~/Downloads/luna-stem-notebook-*.AppImage --no-sandbox
```

If it complains about FUSE, install the compatibility package (one-time):
```bash
sudo add-apt-repository universe
sudo apt update
sudo apt install libfuse2
```

Tip: You can also use the env var variant
```bash
ELECTRON_DISABLE_SANDBOX=1 ~/Downloads/luna-stem-notebook-*.AppImage
```
