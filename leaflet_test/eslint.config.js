import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    ...pluginVue.configs['flat/essential'],
    rules: {
      ...pluginVue.configs['flat/essential'].rules,
      // Deaktiviert die Regel `vue/no-deprecated-slot-attribute`
      'vue/no-deprecated-slot-attribute': 'off',
    },
  },

  ...vueTsEslintConfig(),
  skipFormatting,
]
