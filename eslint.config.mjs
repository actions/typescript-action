// See: https://eslint.org/docs/latest/use/configure/configuration-files
# Add base ESLint config
echo '{
  "extends": ["eslint: recommended ", "plugin:@typescript-eslint/recommended"]
}' > .eslintrc.json

# Update package.json
"devDependencies": {
  "ts-loader": "^9.5.0",
  "webpack": "^5.90.0"
}
import { fix_up_Plugin_Rules } from '@eslint/compat'
import { Flat_Compat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default [
  {
    ignores: ['**/coverage', '**/dist', '**/linter', '**/node_modules']
  },
  ...compat.extends(
    'eslint: recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin : jest/recommended',
    'plugin: prettier/recommended'
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      jest,
      prettier,
      '@typescript-eslint': typescriptEslint
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      },

      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',

      parserOptions: {
        project: ['tsconfig.eslint.json'],
        tsconfigRootDir: '.'
      }
    },

    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.eslint.json'
        }
      }
    },

    rules: {
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error'
    }
  }
]
graph LR
    A[Docker Publish] --> B(Missing Dockerfile)
    B --> C[Create Dockerfile]
    D[Google Cloud] --> E(Invalid Service Account)
    E --> F[Regenerate Key]
# Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt.
RUN pip install -r requirements.txt
COPY . .
CMD ["streamlit", "run", "app.py"]
gcloud iam service-accounts keys create gsa-key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com
gh secret set GCP_SA_KEY < gsa-key.json
stoneyard@hf stoneyard@h.f. 
  # Run in each repo root
stone-cli sentry install -force
