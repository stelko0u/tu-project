import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../pages/Register/Register.jsx";
import * as services from "../services";

// Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Register Component", () => {
  let registerUserSpy;
  let sendVerificationEmailSpy;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Spy on the registerUser and sendVerificationEmail functions
    registerUserSpy = vi
      .spyOn(services, "registerUser")
      .mockImplementation(() => Promise.resolve({ success: true }));
    sendVerificationEmailSpy = vi
      .spyOn(services, "sendVerificationEmail")
      .mockImplementation(() => Promise.resolve({ success: true }));
  });

  afterEach(() => {
    // Restore the original implementation
    registerUserSpy.mockRestore();
    sendVerificationEmailSpy.mockRestore();
  });

  it("renders register form correctly", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your phone number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("allows entering form fields", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const phoneInput = screen.getByPlaceholderText("Enter your phone number");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your password");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

    expect(nameInput.value).toBe("John Doe");
    expect(phoneInput.value).toBe("1234567890");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(confirmPasswordInput.value).toBe("password123");
  });

  it("shows error when passwords do not match", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const phoneInput = screen.getByPlaceholderText("Enter your phone number");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your password");
    const registerButton = screen.getByRole("button", { name: "Register" });

    // Fill all required fields
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } });

    // Submit the form
    fireEvent.click(registerButton);

    // Wait for the error message to appear
    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
  });

  it("shows error when password is too short", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const phoneInput = screen.getByPlaceholderText("Enter your phone number");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your password");
    const registerButton = screen.getByRole("button", { name: "Register" });

    // Fill all required fields
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "123" } });

    // Submit the form
    fireEvent.click(registerButton);

    // Wait for the error message to appear
    expect(
      await screen.findByText("Password must be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  it("shows error message when registration fails", async () => {
    // Mock the registerUser function to return an error
    registerUserSpy.mockResolvedValue({
      success: false,
      error: "Something went wrong! Please try again.",
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const phoneInput = screen.getByPlaceholderText("Enter your phone number");
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your password");
    const registerButton = screen.getByRole("button", { name: "Register" });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    // Wait for the error message to appear
    expect(await screen.findByText("Something went wrong! Please try again.")).toBeInTheDocument();
  });
});
