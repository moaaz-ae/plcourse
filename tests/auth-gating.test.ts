import { test, expect } from './fixtures/test-utils';
import { setupNewTopic } from './helpers/test-data';

test.describe('Auth Gating', () => {
	test('Anonymous user hitting /learn is redirected to /auth with redirectTo @smoke', async ({
		page
	}) => {
		await page.goto('/learn');
		await expect(page).toHaveURL(/\/auth\?redirectTo=%2Flearn$/);
	});

	test('Anonymous user can access /visual @smoke', async ({ page }) => {
		await page.goto('/visual');
		await expect(page).toHaveURL('/visual');
		await expect(page.locator('main')).toBeVisible();
	});

	test('Anonymous user can access /diagnostic @smoke', async ({ page }) => {
		await page.goto('/diagnostic');
		await expect(page).toHaveURL('/diagnostic');
		await expect(page.getByTestId('diagnostic-page')).toBeVisible();
	});

	test('Authenticated user can access /learn and /visual, and /auth redirects to /learn @smoke', async ({
		page,
		testUser,
		db
	}) => {
		await setupNewTopic(db, testUser.userId, 'sentences');

		await page.goto('/learn');
		await expect(page).toHaveURL('/learn');
		await expect(page.locator('main')).toBeVisible();

		await page.goto('/visual');
		await expect(page).toHaveURL('/visual');
		await expect(page.locator('main')).toBeVisible();

		await page.goto('/auth');
		await expect(page).toHaveURL('/learn');
	});
});
