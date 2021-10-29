import { render, screen } from '@testing-library/react';
import { Landing } from '../../src/modules/index/components/Landing';

describe('Home Page', () => {
  beforeEach(() => {
    render(<Landing />);
  });

  it('shows landing page', () => {
    const heading = screen.getByRole<HTMLHeadingElement>('heading', {
      name: 'NextJS/NestJS Template',
    });

    const loginLink = screen.getByRole<HTMLAnchorElement>('link', {
      name: 'Log In',
    });

    const registerLink = screen.getByRole<HTMLAnchorElement>('link', {
      name: 'Register',
    });

    expect(heading).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });
});
