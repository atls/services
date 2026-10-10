import { eslintconfig } from '@atls/raijin/eslint'

const [baseConfig, ...rest] = eslintconfig
const { parserOptions } = baseConfig.languageOptions
const { projectService } = parserOptions

export default [
  {
    ...baseConfig,
    languageOptions: {
      ...baseConfig.languageOptions,
      parserOptions: {
        ...parserOptions,
        projectService: {
          ...projectService,
          allowDefaultProject: [
            ...projectService.allowDefaultProject,
            '.pnp-ts.loader.mjs',
            'lint-staged.config.mjs',
          ],
        },
      },
    },
  },
  ...rest,
]
