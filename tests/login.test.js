// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Login Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("/login");
  });

  test("should display login form elements", async ({ page }) => {
    // Check that the login form elements are present
    await expect(page.locator('h1:has-text("Login")')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();
    await expect(page.locator('input[type="submit"][value="Login"]')).toBeVisible();
  });

  test("should allow entering email and password", async ({ page }) => {
    // Fill in the email and password fields
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("password123");

    // Check that the values are correctly set
    await expect(page.locator('input[placeholder="Enter your email"]')).toHaveValue(
      "test@example.com"
    );
    await expect(page.locator('input[placeholder="Enter your password"]')).toHaveValue(
      "password123"
    );
  });

  test("should show error message for invalid credentials", async ({ page }) => {
    // Mock the login API to return an error
    await page.route("**/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Invalid credentials" }),
      });
    });

    // Fill in the form
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("wrongpassword");

    // Submit the form
    await page.locator('input[type="submit"][value="Login"]').click();

    // Check that the error message is displayed
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toBeVisible();
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toContainText(
      "Something went wrong. Please try again."
    );
  });

  test("should navigate to home page on successful login", async ({ page }) => {
    // Mock the login API to return success
    await page.route("**/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Fill in the form
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("password123");

    // Submit the form
    await page.locator('input[type="submit"][value="Login"]').click();

    // Check that we've navigated to the home page
    await expect(page).toHaveURL("/");
  });
});
