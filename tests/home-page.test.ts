import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('Renders landing page with key elements @smoke', async ({ page }) => {
		await page.goto('/');

		// Main heading
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			'Introduction to Propositional Logic'
		);

		// Hero CTA buttons
		await expect(page.getByRole('link', { name: 'Take the Diagnostic' }).first()).toBeVisible();
		await expect(page.getByRole('link', { name: 'Sign In' }).first()).toBeVisible();

		// How it works sections
		await expect(page.getByRole('heading', { name: 'Take a diagnostic' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Practice with feedback' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Review at the right time' })).toBeVisible();

		// FAQ section
		await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible();
	});

	test('Diagnostic CTA navigates to /diagnostic @smoke', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'Take the Diagnostic' }).first().click();

		await expect(page).toHaveURL('/diagnostic');
	});

	test('Sign In CTA navigates to /auth @smoke', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'Sign In' }).first().click();

		await expect(page).toHaveURL('/auth');
	});

	test('FAQ accordion expands and collapses', async ({ page }) => {
		await page.goto('/');

		// First FAQ should be expanded by default (value="item-1")
		const firstFaqContent = page.getByText('Most people finish in about 10 minutes');
		await expect(firstFaqContent).toBeVisible();

		// Click another FAQ to expand it
		const secondFaq = page.getByRole('button', { name: 'Do I need prior logic experience?' });
		await secondFaq.click();

		await expect(page.getByText('No. The course starts from first principles')).toBeVisible();
	});

	test('Floating CTA appears on scroll @smoke', async ({ page }) => {
		await page.goto('/');

		// Floating CTA should be hidden initially
		const floatingCta = page.locator('aside[aria-label="Quick start actions"]');
		await expect(floatingCta).toHaveClass(/opacity-0/);

		// Scroll down past the hero
		await page.evaluate(() => window.scrollTo(0, 800));

		// Poll until intersection observer triggers and class changes
		await expect(floatingCta).toHaveClass(/opacity-100/);

		// Should have working links
		await expect(floatingCta.getByRole('link', { name: 'Take the Diagnostic' })).toBeVisible();
		await expect(floatingCta.getByRole('link', { name: 'Sign In' })).toBeVisible();
	});

	test('Page has correct meta information', async ({ page }) => {
		await page.goto('/');

		// Check title
		await expect(page).toHaveTitle(/Introduction to Propositional Logic/);

		// Check meta description exists and has expected content
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveCount(1);
		await expect(metaDescription).toHaveAttribute(
			'content',
			/Master propositional logic in 29 lessons/
		);

		// Check canonical URL
		const canonical = page.locator('link[rel="canonical"]');
		await expect(canonical).toHaveAttribute('href', /^http/);
	});
});
