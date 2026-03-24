import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'tests',

	fullyParallel: true,

	retries: process.env.CI ? 1 : 0,

	workers: process.env.CI ? '50%' : undefined,

	timeout: 30000,

	reporter: process.env.CI ? 'line' : 'html',

	use: {
		baseURL: 'http://localhost:4173',

		trace: 'on-first-retry',

		screenshot: 'only-on-failure'
	},

	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				contextOptions: {
					reducedMotion: 'reduce'
				},
				launchOptions: {
					args: ['--force-prefers-reduced-motion']
				}
			}
		}
	],

	webServer: {
		command: 'pnpm run preview',
		port: 4173,

		timeout: 420000,

		reuseExistingServer: !process.env.CI
	}
});
