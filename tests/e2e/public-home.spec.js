import { expect, test } from '@playwright/test';

test.describe('public Philomena’s Digital Connect experience', () => {
  test('shows public navigation and routes to sign in and registration', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /people who made you/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
    await expect(page.getByRole('link', { name: /join the community/i }).first()).toHaveAttribute('href', '/register');
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: /keep the good people close/i })).toBeVisible();
  });

  test('opens all navigation links from the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/#contact$/);
  });

  test('login and registration routes render their forms', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /join the hallway/i })).toBeVisible();
  });
});
