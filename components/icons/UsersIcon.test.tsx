
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersIcon from './UsersIcon';

describe('UsersIcon', () => {
  it('renders without crashing', () => {
    render(<UsersIcon />);
    expect(screen.getByTestId('usersicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<UsersIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<UsersIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
