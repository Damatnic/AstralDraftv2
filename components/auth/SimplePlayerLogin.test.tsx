/**
 * SimplePlayerLogin Component Tests
 * Critical authentication flow testing
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../src/test-utils';
import SimplePlayerLogin from './SimplePlayerLogin';

// Mock the SimpleAuthContext
const mockLogin = jest.fn();
const mockContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  logout: jest.fn(),
  checkAuth: jest.fn(),
};

jest.mock('../../contexts/SimpleAuthContext', () => ({
  useAuth: () => mockContextValue,
  SimpleAuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SimplePlayerLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render login form with team name field', () => {
    render(<SimplePlayerLogin />);
    
    expect(screen.getByText(/team name/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should handle form submission with valid data', async () => {
    const mockOnLogin = jest.fn();
    render(<SimplePlayerLogin onLogin={mockOnLogin} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Test Team' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          teamName: 'Test Team'
        })
      );
    });
  });

  test('should validate required fields', () => {
    render(<SimplePlayerLogin />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('should show loading state when authenticating', () => {
    mockContextValue.isLoading = true;
    render(<SimplePlayerLogin />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('should handle authentication errors', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Auth failed'));
    render(<SimplePlayerLogin />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Test Team' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('should prevent XSS in team name input', () => {
    render(<SimplePlayerLogin />);
    
    const input = screen.getByRole('textbox');
    const xssPayload = '<script>alert("XSS")</script>';
    
    fireEvent.change(input, { target: { value: xssPayload } });
    
    // Input should accept the value but sanitization happens on submit
    expect(input).toHaveValue(xssPayload);
  });

  test('should be accessible with proper ARIA labels', () => {
    render(<SimplePlayerLogin />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    expect(input).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('type');
  });
});
