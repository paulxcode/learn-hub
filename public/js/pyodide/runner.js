const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/';

(async function loadPyodide() {
  const script = document.createElement('script');
  script.src = PYODIDE_CDN + 'pyodide.js';
  document.head.appendChild(script);

  script.onload = async () => {
    window.pyodide = await globalThis.loadPyodide({
      indexURL: PYODIDE_CDN,
    });

    await window.pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);

    // Pre-inject matplotlib helpers
    window.pyodide.runPython(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
import sys
from io import StringIO

_plt_initialized = True
`);

    if (window.onPyodideReady) {
      window.onPyodideReady();
    }
  };
})();

window.runPythonCode = async function(code, outputEl, btnEl) {
  if (!window.pyodide) {
    outputEl.textContent = 'Loading Python runtime...';
    outputEl.classList.add('visible');
    await new Promise(resolve => {
      const check = () => {
        if (window.pyodide) resolve();
        else setTimeout(check, 200);
      };
      check();
    });
  }

  btnEl.disabled = true;
  outputEl.classList.add('visible');
  outputEl.innerHTML = '';

  try {
    // Setup stdout capture + matplotlib inline
    window.pyodide.runPython(`
_stdout = StringIO()
sys.stdout = _stdout
`);

    // Run user code
    window.pyodide.runPython(code);

    // Capture stdout
    window.pyodide.runPython('sys.stdout = sys.__stdout__');
    const textOutput = window.pyodide.runPython('_stdout.getvalue()') || '';

    // Check for matplotlib figures
    let hasFig = false;
    try {
      hasFig = window.pyodide.runPython('len(plt.get_fignums()) > 0');
    } catch(e) {}

    if (hasFig) {
      window.pyodide.runPython(`
_buf = io.BytesIO()
plt.savefig(_buf, format='png', dpi=100, bbox_inches='tight')
_buf.seek(0)
_img_data = base64.b64encode(_buf.read()).decode('utf-8')
plt.close('all')
`);
      const imgData = window.pyodide.runPython('_img_data');

      if (textOutput.trim()) {
        outputEl.textContent = textOutput;
      }
      const img = document.createElement('img');
      img.src = 'data:image/png;base64,' + imgData;
      img.alt = 'Chart output';
      outputEl.appendChild(img);
    } else {
      outputEl.textContent = textOutput || '(no output)';
    }
  } catch (err) {
    outputEl.textContent = 'Error: ' + err.message;
  } finally {
    btnEl.disabled = false;
  }
};
