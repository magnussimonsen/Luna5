"""
Matplotlib preamble for Pyodide worker.
Sets Agg backend, applies light/dark theme, and overrides plt.show to capture PNGs to a global list.
Note: This module runs inside Pyodide. Local editors may not have matplotlib installed; we suppress those warnings.
"""

# pyright: reportMissingImports=false

import io
import base64

try:
    import matplotlib  # type: ignore
    matplotlib.use("Agg")  # type: ignore[attr-defined]
    import matplotlib.pyplot as plt  # type: ignore
except Exception:  # pragma: no cover - only for local analysis without packages
    plt = None  # type: ignore

# Global images list reset on each execution by the caller.
if '___luna_images___' not in globals():
    ___luna_images___ = []  # type: ignore

def _luna_apply_theme(is_dark: bool):
    try:
        if plt is not None:
            if is_dark:
                plt.style.use('dark_background')
            else:
                # default style; could use 'default' explicitly
                plt.style.use('default')
    except Exception:
        # If style setting fails, ignore to avoid blocking execution
        pass

def _luna_show_capture(*args, **kwargs):
    buf = io.BytesIO()
    if plt is not None:
        plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    data = base64.b64encode(buf.read()).decode('ascii')
    ___luna_images___.append('data:image/png;base64,' + data)  # type: ignore
    if plt is not None:
        plt.close()

def _luna_install_show_hook():
    if plt is not None:
        plt.show = _luna_show_capture  # type: ignore
