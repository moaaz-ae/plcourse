import { test, expect } from './fixtures/test-utils';
import { setupNewTopic, setupReviewableTopicState } from './helpers/test-data';
import { test as anonTest, expect as anonExpect } from '@playwright/test';

test.describe('Visual Page - Authenticated', () => {
	test.beforeEach(async ({ testUser, db }) => {
		// Set up some topics with different states
		await setupNewTopic(db, testUser.userId, 'sentences');
		await setupReviewableTopicState(db, testUser.userId, 'connectives');
	});

	test('Renders progress map with topic graph @smoke', async ({ page }) => {
		await page.goto('/visual');

		// Check page title and structure
		await expect(page).toHaveTitle(/Progress Map/);

		// Legend should be visible (at least on desktop)
		const legend = page.locator('text=Topic States');
		await expect(legend).toBeVisible();

		// Stats should show total topics
		await expect(page.locator('text=Total Topics')).toBeVisible();

		// Flow controls should be visible
		await expect(page.locator('.svelte-flow__controls')).toBeVisible();
	});

	test('Back to Learn button navigates to dashboard @smoke', async ({ page }) => {
		await page.goto('/visual');

		await page.getByRole('link', { name: /Back to Learn/i }).click();

		await expect(page).toHaveURL('/learn');
	});

	test('Legend shows topic state indicators', async ({ page }) => {
		await page.goto('/visual');

		// Legend should show all state types - use exact matching to avoid substring matches
		await expect(page.getByText('Review', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Learning', { exact: true })).toBeVisible();
		await expect(page.getByText('Relearning', { exact: true })).toBeVisible();
		await expect(page.getByText('New', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Milestone topic')).toBeVisible();
	});

	test('Graph contains topic nodes', async ({ page }) => {
		await page.goto('/visual');

		// Wait for the flow to render
		await page.waitForSelector('.svelte-flow__node', { timeout: 10000 });

		// There should be multiple nodes
		const nodes = page.locator('.svelte-flow__node');
		await expect(nodes.first()).toBeVisible();
		const count = await nodes.count();
		expect(count).toBeGreaterThan(0);
	});

	test('Topic node click shows details tooltip with close button @smoke', async ({ page }) => {
		await page.goto('/visual');

		// Wait for nodes to render
		await page.waitForSelector('.svelte-flow__node', { timeout: 10000 });

		// Click on a node
		const firstNode = page.locator('.svelte-flow__node').first();
		await firstNode.click();

		// Tooltip should appear with topic details
		const tooltip = page.locator('.fixed.z-50.w-72');
		await expect(tooltip).toBeVisible({ timeout: 5000 });

		// Tooltip should have topic title
		await expect(tooltip.locator('h3')).toBeVisible();

		// Close button should work
		const closeButton = tooltip.locator('button[aria-label="Close topic details"]');
		await closeButton.click();

		await expect(tooltip).not.toBeVisible();
	});

	test('Clicking different node updates tooltip content', async ({ page }) => {
		await page.goto('/visual');

		// Wait for nodes to render
		await page.waitForSelector('.svelte-flow__node', { timeout: 10000 });

		const nodes = page.locator('.svelte-flow__node');
		const nodeCount = await nodes.count();

		if (nodeCount >= 2) {
			// Click first node
			await nodes.first().click();
			const tooltip = page.locator('.fixed.z-50.w-72');
			await expect(tooltip).toBeVisible({ timeout: 5000 });

			const firstTitle = await tooltip.locator('h3').textContent();

			// Click second node
			await nodes.nth(1).click();
			await expect(tooltip).toBeVisible();

			const secondTitle = await tooltip.locator('h3').textContent();

			// Titles should be different (different topics)
			expect(firstTitle).not.toBe(secondTitle);
		}
	});
});

anonTest.describe('Visual Page - Anonymous', () => {
	anonTest('Anonymous user sees sign-in prompt @smoke', async ({ page }) => {
		await page.goto('/visual');

		// Should still be on visual page (not redirected)
		await anonExpect(page).toHaveURL('/visual');

		// Should see sign-in prompt
		await anonExpect(page.getByText("You're not signed in")).toBeVisible();
		await anonExpect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
		await anonExpect(page.getByRole('button', { name: /Continue with GitHub/i })).toBeVisible();
	});

	anonTest('Anonymous user can view the graph @smoke', async ({ page }) => {
		await page.goto('/visual');

		// Graph should still render
		await page.waitForSelector('.svelte-flow__controls', { timeout: 10000 });

		// Legend should be visible
		await anonExpect(page.locator('text=Topic States')).toBeVisible();
	});
});
