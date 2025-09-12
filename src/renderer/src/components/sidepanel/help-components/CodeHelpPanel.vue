<template>
  <div class="sidepanel-ui-base sidepanel-padding-margin-base">
    <h2>🚧 Work in progress</h2>
    <h2>Python help and examples</h2>
    <h3>Shortcuts</h3>
    <ul class="shortcuts-list">
      <li>Run Python code in the selected cell: <strong>Ctrl + Enter</strong></li>
    </ul>
    <h3>Available Offline Python Imports</h3>
    <p>
      Python's standard library is available (for example: <code>math</code>, <code>json</code>,
      <code>re</code>, <code>pathlib</code>).
    </p>
    <p>The following imports are also available offline:</p>
    <ul class="imports-list">
      <!-- Core scientific stack -->
      <li><code>import numpy as np # N-dimensional arrays and numerical computing</code></li>
      <li><code>import pandas as pd # data frames and data analysis</code></li>
      <li><code>import scipy # scientific computing (optimize, stats, signal, etc.)</code></li>
      <li><code>import matplotlib as mpl # plotting library core</code></li>
      <li><code>import matplotlib.pyplot as plt # stateful plotting API</code></li>
      <li><code>import pylab as pl # MATLAB-like interface (Matplotlib + NumPy)</code></li>
      <li><code>import sympy as sp # symbolic mathematics</code></li>
      <li><code>import mpmath as mp # arbitrary-precision arithmetic</code></li>
      <li><code>import gmpy2 # high-performance multiple-precision math</code></li>

      <!-- Imaging -->
      <li><code>from PIL import Image # Pillow image processing</code></li>
      <li><code>import pillow_heif # HEIF/HEIC support for Pillow</code></li>

      <!-- Interactive / notebook utilities -->
      <li><code>import IPython # interactive tools and shell utilities</code></li>
      <li><code>from IPython.display import display, Markdown # rich output helpers</code></li>

      <!-- Parsing, packaging, utilities -->
      <li><code>from dateutil import parser as dateparser # robust date/time parsing</code></li>
      <li><code>import packaging # version/specifier parsing utilities</code></li>
      <li><code>import pyparsing # parser combinators</code></li>
      <li><code>import kiwisolver # constraint solver (used by Matplotlib)</code></li>
      <li><code>from cycler import cycler # property cycling for plots</code></li>
      <li><code>import fontTools # font manipulation library</code></li>
      <li><code>import pytz # time zone definitions</code></li>
      <li><code>import tzdata # IANA time zone database</code></li>
      <li><code>import six # Python 2/3 compatibility utilities</code></li>

      <!-- Pyodide-specific bridges -->
      <li><code>import js # access the browser's JS APIs</code></li>
      <li><code>from pyodide.ffi import to_js, create_proxy # JS/Python interop helpers</code></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Side panel placeholder aligned with existing settings layout
</script>

<style scoped>
@import '@renderer/css/sidepanel-base.css';
</style>
