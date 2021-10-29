import { render, screen, waitFor } from '@testing-library/react';
import { Register } from '../../src/modules/register/components/Register';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';

describe('Register Page', () => {
  beforeEach(() => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Register />
      </QueryClientProvider>
    );
  });

  it('should have username, email, and password input fields and submit button', () => {
    const inputFields = screen.getAllByRole<HTMLInputElement>('textbox');
    const [usernameInput, emailInput] = inputFields;
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const registerButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /register/i,
    });
    const loginLink = screen.getByRole<HTMLAnchorElement>('link', {
      name: /log in/i,
    });

    expect(inputFields).toHaveLength(2);
    expect(usernameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(registerButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });

  it('should show error message if fields are empty and submit button is clicked', async () => {
    const registerButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /register/i,
    });

    userEvent.click(registerButton);

    const errorMessages = await waitFor(() => screen.getAllByText(/required/i));

    expect(errorMessages).toHaveLength(3);
  });

  it('should show error message when email is invalid', async () => {
    const emailInput = screen.getByLabelText<HTMLInputElement>(/email/i);

    userEvent.type(emailInput, 'test');
    userEvent.tab();

    const errorMessage = await waitFor(() =>
      screen.getByText(/invalid email/i)
    );

    expect(errorMessage).toBeInTheDocument();
  });

  it('should show error message when password is less than 4 characters', async () => {
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);

    userEvent.type(passwordInput, 'tes');
    userEvent.tab();

    const errorMessage = await waitFor(() =>
      screen.getByText(/password must be at least 4 characters/i)
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
