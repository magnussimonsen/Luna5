# Luna5

> 📋 **For contributors:** Please read [src/README-BEST-PRACTICE.md](src/README-BEST-PRACTICE.md) for coding guidelines and project structure.

Built using **Electron**, **Vite**, **Vue 3**, **Pinia**, and **TypeScript**, along with other open-source modules.

## 🙏 Acknowledgments

Special thanks to the [electron-vite](https://electron-vite.org/guide/) team for creating the excellent `npm create @quick-start/electron@latest` starter tool that jumpstarted this project.

## 📚 What is Luna?

**Luna5** is an educational notebook-style application designed to simplify and unify digital workflows for both students and teachers. It brings together essential STEM tools in a clean, pedagogically structured interface — eliminating the need to switch between multiple, complex programs.

As an educational app, Luna5 will also include spaced-repetition flashcards—with support for text, images, audio and IPA (International Phonetic Alphabet) input tools.

Modern classrooms often depend on a mix of disconnected tools — Python editors, GeoGebra, Word, Excel — each with its own interface and file formats. This constant "software jumping" slows learning and creates unnecessary friction. While GeoGebra is an excellent tool, it's not built around a document-based notebook workflow. Luna5 is.

Luna5 offers a streamlined alternative, combining symbolic algebra, geometry, programming, and rich text editing — all within one intuitive application.

---

## ✨ Key Features

* 📓 Notebook-style interface with a linear, cell-based layout
* 📝 Rich Text and Markdown editing support
* 🐍 Live Python execution powered by Pyodide
* ➗ CAS (Computer Algebra System) with a custom, student-friendly syntax (backed by SymPy)
* 🔒 Ability to hide or lock cells — perfect for creating tests with embedded solutions
* 🧠 Sidebar with table of contents and contextual help (syntax tips and examples)
* 🖨️ Export full notebooks to PDF
* 🗂️ Flashcards with spaced repetition (planned) — add cards with text, images, and audio

---

## 👩‍🏫 For Teachers

* Create both questions and solutions in the same file using **Hide Cell** and **Lock Cell**
* Export test versions that hide answers; students can insert their responses in the same file
* Reuse and adapt notebooks for lessons, homework, or live presentations
* Demonstrate math, code, and concepts interactively in class or via screen sharing

---

## 👨‍🎓 For Students

* Use Luna as an all-in-one notebook: take notes, write Python code, and solve algebraic or geometric problems
* Explore geometrical concepts in a natural, visual way
* Focus on learning — not navigating bloated menus or juggling apps
* Get syntax examples and contextual help via the built-in help sidebar
* Share or export your work easily

---

## 🧰 Tools Included

| Tool                         | Status        |
| ---------------------------- | ------------- |
| Rich Text / Markdown Editor  | 🚧 Planned    |
| Python Environment (Pyodide) | 🚧 Planned    |
| CAS (Symbolic Math)          | 🚧 Planned    |
| Graphical Calculator         | 🚧 Planned    |
| Geometry Explorer            | 🚧 Planned    |
| Spreadsheet Tool             | 🚧 Planned    |
| Probability Calculator       | 🚧 Planned    |
| Flashcards (Spaced Repetition) | 🚧 Planned  |

---

## 🔧 Open Source Stack

### Core Libraries & Frameworks

* Electron (via Chromium & Node.js)
* Vue 3 – MIT License
* Vite – MIT License
* Pinia – MIT License
* TypeScript – MIT License

### Planned Core Libraries / Components

* Rich Text editor with math input support (Vue component)
* Markdown editor with KaTeX rendering
* Code editor (evaluating **CodeMirror** and **Monaco**)
* Pyodide integration (via a background worker)
* Numerical math library (TBD)
* Custom tokenizer and parser for Luna’s CAS syntax
  *(considering Moo + Nearley for parsing; powered by SymPy for computation)*

---

## 🅰️ Fonts Used

* **Comic Neue** – SIL Open Font License 1.1
* **Roboto** – Apache License 2.0
* **OpenDyslexic** – SIL Open Font License 1.1
* **Fira Code** – SIL Open Font License 1.1
* **Arimo** – Apache License 2.0

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🖼️ Current UI Snapshot

<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-1.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-2.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-3.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-4.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-5.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-11-130446.png" alt="Current state of the Luna5 UI settings modal" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-8.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-6.png" alt="Current state of the Luna5 UI" width="900" />
</p>
<p align="center">
  <img src="./src/development-screenshots/Luna5-2025-08-17-7.png" alt="Current state of the Luna5 UI" width="900" />
</p>

<div align="center"><em>Current state of the UI (development build, subject to rapid change)</em></div>
