/* This store imports a JSON file from assets/languages folder containing translations for different languages.

The "english.json" file is the default language file, and it contains all the keys and their corresponding translations in English.

The translations for other languages are stored in separate JSON files named after the language (e.g., "norwegian.json", "swedish.json", etc.).
The translations are loaded dynamically based on the current language selected by the user.

Language types are in src/renderer/src/types/language-types.ts
*/

import { defineStore } from 'pinia'
import { LanguageType } from '@renderer/types/language-types'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: 'english' as LanguageType,
    availableLanguages: ['english', 'norwegian', 'klingon', 'spanish', 'french', 'shyriiwook'] as LanguageType[],
    fallbackLanguage: 'english' as LanguageType,
    translations: {} as Record<string, string>
  }),
  actions: {
    setCurrentLanguage(lang: LanguageType): boolean {
      if (!this.availableLanguages.includes(lang)) {
        console.warn(`Language ${lang} is not available. Falling back to ${this.fallbackLanguage}.`)
        lang = this.fallbackLanguage
        return false
      }
      if (this.currentLanguage === lang) {
        console.log(`Language ${lang} is already set as the current language.`)
        return false
      }
      this.currentLanguage = lang
      console.log(`Language changed to ${lang}.`)
      return true
    },
    setTranslations(translations: Record<string, string>): void {
      this.translations = translations
    },
    // Debugging function to log the current language
    consoleLogCurrentLanguage(): void {
      console.log(`Current language is: ${this.currentLanguage}`)
    }
  },
  getters: {
    getCurrentLanguage(): LanguageType {
      return this.currentLanguage
    },
    getTranslations(): Record<string, string> {
      return this.translations
    },
    getAvailableLanguages(): LanguageType[] {
      return this.availableLanguages
    },
    getFallbackLanguage(): LanguageType {
      return this.fallbackLanguage
    },
    getLanguageString: (state) => {
      return (key: string): string => {
        return state.translations[key] || 'UNDEFINED_TRANSLATION'
      }
    }
  }
})
