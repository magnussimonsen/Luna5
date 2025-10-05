<script setup lang="ts">
import CloseModalButton from './modalUI/CloseModalButton.vue'
import { reactive } from 'vue'
import { useModalStore } from '@renderer/stores/UI/modalStore'
import { mitLicenseText } from '@renderer/assets/licence-MIT-text'
import pkg from '../../../../../package.json'

type PackageJsonMinimal = {
  name?: string
  officialName?: string
  version?: string
  author?: string
  license?: string
}
const _pkg = pkg as unknown as PackageJsonMinimal

const modalStore = useModalStore()
import LunaSmallIcon from '@renderer/assets/icons/Luna05-logo-169.png'

// Get Electron/Chromium/Node versions from the preload API
const versions = reactive({ ...window.electron.process.versions })
const LunaVersion: string = _pkg.version || '0.5.0'
const licenseType: string = _pkg.license || 'MIT'
const appName: string = _pkg.officialName || 'Luna Stem Notebook'
const appAuthor: string = _pkg.author || ''
// const licenseText: string = 'placeholder for now'
// Example: You can later fill this array with your actual dependencies
const openSourceModules = [
  { name: 'TypeScript', version: '5.x', license: 'MIT' },
  { name: 'Vue.js', version: '3.x', license: 'MIT' },
  { name: 'Vite', version: '4.x', license: 'MIT' },
  { name: 'Pinia', version: '2.x', license: 'MIT' },
  { name: 'Tiptap (editor)', version: '2.x', license: 'MIT' },
  // Python runtime in the browser, vendored under public/pyodide
  { name: 'Pyodide', version: 'vendored (public/pyodide)', license: 'MPL-2.0' }
  // Add more as needed
]

const openSourceFonts = [
  { name: 'Comic Neue', version: '2.3', license: 'SIL Open Font License 1.1' },
  { name: 'Roboto', version: '2.138', license: 'Apache License 2.0' },
  { name: 'OpenDyslexic', version: '2023.05', license: 'SIL Open Font License 1.1' },
  { name: 'Fira Code', version: '6.2', license: 'SIL Open Font License 1.1' },
  { name: 'Arimo', version: '1.1', license: 'Apache License 2.0' }
  // Add more as needed
]
</script>

<template>
  <div class="about-modal">
    <CloseModalButton :on-click="modalStore.closeAboutLunaModal" />
    <!--Logo -->
    <img :src="LunaSmallIcon" alt="Luna" class="brand-icon-about" />
    <h2>About {{ appName }}</h2>
    <p>
      <strong>{{ appName }} version {{ LunaVersion }} ({{ licenseType }})</strong>
      by {{ appAuthor || 'Unknown' }}
    </p>

    <section>
      <h3>Open Source Modules Used</h3>
      <ul>
        <li>Electron v{{ versions.electron }}</li>
        <li>Chromium v{{ versions.chrome }}</li>
        <li>Node v{{ versions.node }}</li>
        <li v-if="openSourceModules.length === 0">
          <em>No modules listed yet.</em>
        </li>
        <li v-for="mod in openSourceModules" :key="mod.name">
          {{ mod.name }} ({{ mod.version }}) - {{ mod.license }}
        </li>
      </ul>
    </section>

    <section>
      <h3>Open Source Fonts Used</h3>
      <ul>
        <li v-if="openSourceFonts.length === 0">
          <em>No fonts listed yet.</em>
        </li>
        <li v-for="font in openSourceFonts" :key="font.name">
          {{ font.name }} ({{ font.version }}) - {{ font.license }}
        </li>
      </ul>
    </section>

    <section>
      <h3>App License</h3>
      <pre class="license">{{ mitLicenseText }}</pre>
    </section>
  </div>
</template>

<style scoped>
.brand-icon-about {
  border: solid 1px transparent;
  border-radius: 10px;
  height: auto;
  width: 16em;
  display: block;
  margin: 0 auto;
  /* Center horizontally */
  margin-bottom: 0.5em;
}
.about-modal {
  position: relative;
  /* Not fixed anymore as parent handles positioning */
  padding: 1em 2em 2em 2em; /* Less padding at top for sticky header */
  max-width: 600px;
  width: 90%;
  /* Responsive width */
  height: auto;
  /* Let content determine height */
  min-height: 400px;
  max-height: 80vh;
  overflow-y: auto;
  background: var(--menu-background, #fff);
  color: var(--text-color, #222);
  border-radius: var(--border-radius, 8px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  /* Enhanced shadow for better visibility */
  z-index: 5000;
  margin: 2rem;
  /* Add some margin for mobile */
}

.about-modal h2 {
  margin-top: 0.5em;
  clear: right; /* Ensure it appears below the float */
}

.license {
  font-size: 0.9em;
  background: var(--menu-background, #fff);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
