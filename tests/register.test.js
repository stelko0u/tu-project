// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Register Form", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the register page before each test
    await page.goto("/register");
  });

  test("should display register form elements", async ({ page }) => {
    // Check that the register form elements are present
    await expect(page.locator('h1:has-text("Register")')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your phone number"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter your password"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirm your password"]')).toBeVisible();
    await expect(page.locator('input[type="submit"][value="Register"]')).toBeVisible();
  });

  test("should allow entering form fields", async ({ page }) => {
    // Fill in the form fields
    await page.locator('input[placeholder="Enter your name"]').fill("John Doe");
    await page.locator('input[placeholder="Enter your phone number"]').fill("1234567890");
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("password123");
    await page.locator('input[placeholder="Confirm your password"]').fill("password123");

    // Check that the values are correctly set
    await expect(page.locator('input[placeholder="Enter your name"]')).toHaveValue("John Doe");
    await expect(page.locator('input[placeholder="Enter your phone number"]')).toHaveValue(
      "1234567890"
    );
    await expect(page.locator('input[placeholder="Enter your email"]')).toHaveValue(
      "test@example.com"
    );
    await expect(page.locator('input[placeholder="Enter your password"]')).toHaveValue(
      "password123"
    );
    await expect(page.locator('input[placeholder="Confirm your password"]')).toHaveValue(
      "password123"
    );
  });

  test("should show error when passwords do not match", async ({ page }) => {
    // Fill in the form with mismatched passwords
    await page.locator('input[placeholder="Enter your name"]').fill("John Doe");
    await page.locator('input[placeholder="Enter your phone number"]').fill("1234567890");
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("password123");
    await page.locator('input[placeholder="Confirm your password"]').fill("differentpassword");

    // Submit the form
    await page.locator('input[type="submit"][value="Register"]').click();

    // Check that the error message is displayed
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toBeVisible();
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toContainText(
      "Passwords do not match."
    );
  });

  test("should show error when password is too short", async ({ page }) => {
    // Fill in the form with a short password
    await page.locator('input[placeholder="Enter your name"]').fill("John Doe");
    await page.locator('input[placeholder="Enter your phone number"]').fill("1234567890");
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("123");
    await page.locator('input[placeholder="Confirm your password"]').fill("123");

    // Submit the form
    await page.locator('input[type="submit"][value="Register"]').click();

    // Check that the error message is displayed
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toBeVisible();
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toContainText(
      "Password must be at least 8 characters long."
    );
  });

  test("should show error message for registration failure", async ({ page }) => {
    // Mock the register API to return an error
    await page.route("**/register", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Something went wrong. Please try again." }),
      });
    });

    // Fill in the form
    await page.locator('input[placeholder="Enter your name"]').fill("John Doe");
    await page.locator('input[placeholder="Enter your phone number"]').fill("1234567890");
    await page.locator('input[placeholder="Enter your email"]').fill("test@example.com");
    await page.locator('input[placeholder="Enter your password"]').fill("password123");
    await page.locator('input[placeholder="Confirm your password"]').fill("password123");

    // Submit the form
    await page.locator('input[type="submit"][value="Register"]').click();

    // Check that the error message is displayed
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toBeVisible();
    await expect(page.locator(".bg-red-100.border.border-red-400.text-red-700")).toContainText(
      "Something went wrong. Please try again."
    );
  });
});
