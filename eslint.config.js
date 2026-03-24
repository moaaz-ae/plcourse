import storybook from 'eslint-plugin-storybook';

import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import eslintPluginYml from 'eslint-plugin-yml';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['!.storybook']
	},

	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	...storybook.configs['flat/recommended'],
	...eslintPluginYml.configs['flat/standard'],
	{
		files: ['**/*.yaml', '**/*.yml'],
		rules: {
			'yml/block-sequence': ['error', 'always'],
			'yml/block-mapping': ['error', 'always'],
			'yml/indent': ['error', 2],
			'yml/no-empty-mapping-value': 'error',
			'yml/quotes': [
				'error',
				{
					prefer: 'single',
					avoidEscape: true
				}
			]
		}
	},

	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {
			'no-undef': 'off',
			'no-unreachable': 'error',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
