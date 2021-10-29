import { render, screen, waitFor } from '@testing-library/react';
import { Login } from '../../src/modules/login/components/Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';

describe('Login Page', () => {
  beforeEach(() => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
    );
  });

  it('should have email and password input fields and submit button', () => {
    const emailInput = screen.getByRole<HTMLInputElement>('textbox');
    const passwordInput = screen.getByLabelText<HTMLInputElement>(/password/i);
    const logInButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /log in/i,
    });
    const registerLink = screen.getByRole<HTMLAnchorElement>('link', {
      name: /register/i,
    });

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(logInButton).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  it('should show error message if fields are empty and submit button is clicked', async () => {
    const logInButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /log in/i,
    });

    userEvent.click(logInButton);

    const errorMessages = await waitFor(() => screen.getAllByText(/required/i));

    expect(errorMessages).toHaveLength(2);
  });

  it('should show error message when email is invalid', async () => {
    const emailInput = screen.getByRole<HTMLInputElement>('textbox');

    userEvent.type(emailInput, 'test');
    userEvent.tab();

    const errorMessage = await waitFor(() =>
      screen.getByText(/invalid email/i)
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
