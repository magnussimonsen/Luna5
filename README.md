
<div align="center">

<img src="src/renderer/src/assets/icons/Luna05-logo-169.png" alt="Luna 0.5 icon" width="auto" height="250px"/>
</div>

# Luna 0.5. ...

📋 **For contributors:** Please read [src/README-BEST-PRACTICE.md](src/README-BEST-PRACTICE.md) for coding guidelines and project structure.

Built using **Electron**, **Vite**, **Vue 3**, **Pinia**, and **TypeScript**, along with other open-source modules.

## 🙏 Acknowledgments

Special thanks to the [electron-vite](https://electron-vite.org/guide/) team for creating the excellent `npm create @quick-start/electron@latest` starter tool that jumpstarted this project.

Thanks as well to the [Pyodide](https://pyodide.org/) project and community for making Python run in the browser. Luna 0.5 vendors Pyodide assets under `public/pyodide` and follows its MPL-2.0 licensing.

## 📚 What is Luna?

**Luna 0.5** is an educational notebook-style application designed to simplify and unify digital workflows for both students and teachers. It brings together essential STEM tools in a clean, pedagogically structured interface, eliminating the need to switch between multiple, complex programs.

Modern classrooms often depend on a mix of disconnected tools (Python editors, GeoGebra, Word, Excel) each with its own interface and file formats. This constant "software jumping" slows learning and creates unnecessary friction. While GeoGebra is an excellent tool, it's not built around a document-based notebook workflow. Luna 0.5 is.

Luna 0.5 offers a streamlined alternative, combining symbolic algebra, geometry, programming, and rich text editing all within one intuitive application.

Built-in flashcard functionality supporting text, images, audio, and IPA (International Phonetic Alphabet) input tools are also planned.

---

## ✨ Key Features

* 📓 Notebook-style interface with a linear, cell-based layout
* 📝 Rich Text and Markdown editing support
* 🐍 Live Python execution powered by Pyodide
* ➗ CAS (Computer Algebra System) with a custom, student-friendly syntax (backed by SymPy)
* 🔒 Ability to hide or lock cells, perfect for creating tests with embedded solutions
* 🧠 Sidebar with table of contents and contextual help (syntax tips and examples)
* 🖨️ Export complete notebooks to PDF, automatically including the student's name and the saved date and time in the header. 
* 🗂️ Flashcards with spaced repetition (for use in language learning), add cards with text, images, and audio

---

## 🥷 For Teachers

* Create both questions and solutions in the same file using **Hide Cell** and **Lock Cell**
* Export test versions that hide answers; students can insert their responses in the same file
* Reuse and adapt notebooks for lessons, homework, or live presentations
* Demonstrate math, code, and concepts interactively in class or via screen sharing

---

## 👨‍🎓 For Students

* Use Luna as an all-in-one notebook: take notes, write Python code, and solve algebraic or geometric problems
* Explore geometrical concepts in a natural, visual way
* Focus on learning, not navigating bloated menus or juggling apps
* Get syntax examples and contextual help via the built-in help sidebar
* Share or export your work easily

---

## 🧰 Tools Included

| Tool                         | Status        |
| ---------------------------- | ------------- |
| Rich Text / Markdown Editor      | 🚧 Planned        |
| Python Environment (Pyodide)	| ✅ Implemented. Core features available. Ongoing improvements and testing |
| CAS (Symbolic Math, via SymPy)   | 🚧 Planned   |
| Graphical Calculator         | 🚧 Planned    |
| Geometry Explorer            | 🚧 Planned    |
| Spreadsheet Tool             | 🚧 Planned    |
| Probability Calculator       | 🚧 Planned    |
| Flashcards (Spaced Repetition) | 🚧 Planned  |

---

##  🐍📦Pyodide packages available in Luna 0.5

These packages can be imported directly in Python cells. Most work fully offline when their wheels are present under `public/pyodide`.

- Core: numpy, scipy, matplotlib (incl. pylab) pandas, sympy, pillow
- Extras: seaborn, networkx
- Units and uncertainties: pint, uncertainties

Notes
- Common dependencies (e.g., python-dateutil, six, contourpy, cycler, kiwisolver, fonttools, packaging, pyparsing, pytz, tzdata, mpmath, gmpy2) are auto-installed when needed.
- If an import fails, add the matching wheel to `public/pyodide`, click Reset on the Python cell toolbar (kills the worker), then re-run.
- Tip: with `uncertainties`, use functions from `uncertainties.umath` (e.g., `umath.sin(x)`) to propagate errors.

---

## 🔧 Open Source Stack

### Core Libraries & Frameworks

* Electron (via Chromium & Node.js)
* Vue 3. MIT License
* Vite. MIT License
* Pinia. MIT License
* TypeScript. MIT License
* Monaco Editor. MIT License
* Pyodide. MPL-2.0 License

### Planned Core Libraries / Components

* Rich-text editor with math input support (considering Tiptap, MathLive, and KaTeX)
* Markdown editor with KaTeX rendering
* Code editor (evaluating **CodeMirror** and **Monaco**)
* Pyodide integration (via a background worker)
* Numerical computation library (either in-house or a vetted JS/TS package)
* Custom tokenizer and parser for Luna’s CAS syntax
  *(considering Moo + Nearley for parsing; powered by SymPy for computation)*

---

## 🅰️ Fonts Used

* **Comic Neue.** SIL Open Font License 1.1
* **Roboto.** Apache License 2.0
* **OpenDyslexic.** SIL Open Font License 1.1
* **Fira Code.** SIL Open Font License 1.1
* **Arimo.** Apache License 2.0

---

## 📜 License

This project is licensed under the **MIT License**.

Third-party components are licensed separately. Notably:
- Pyodide is licensed under the Mozilla Public License 2.0 (MPL-2.0).
  See: https://github.com/pyodide/pyodide/blob/main/LICENSE
- Monaco Editor is licensed under the MIT License.
  See: https://github.com/microsoft/monaco-editor/blob/main/LICENSE

See also: [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for a consolidated list of third-party dependencies and their licenses.

---

## 🖼️ Current UI Progress Snapshots
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-08-2.png" alt="UI improvments" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-08-1.png" alt="UI improvments" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-025-09-07-1.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-06-5.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-06-1.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-06-2.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-06-3.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-06-4.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-7.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-6.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-5.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-4.png" alt="Moving settings from modal to sidebar" width="900" />
</p>

<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-3.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-1.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-05-2.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-04.png" alt="Moving settings from modal to sidebar" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-03.png" alt="Monaco code editor implemented (work in progrss)" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-09-02.png" alt="Python cell framework" width="900" />
</p>

<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-31.png" alt="Save and load file functionality with autosave" width="900" />
</p>

<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-21.png" alt="" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-20.png" alt="Hidden cell functionality added" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-19.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-1.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-2.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-3.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-4.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-5.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-11-130446.png" alt="Current state of the Luna5 UI settings modal" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-8.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-6.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-7.png" alt="Current state of the Luna 0.5 UI" width="900" />
</p>

<div align="center"><em>Current state of the UI (development build, subject to rapid change)</em></div>
