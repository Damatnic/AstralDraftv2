
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserIcon from './UserIcon';

describe('UserIcon', () => {
  it('renders without crashing', () => {
    render(<UserIcon />);
    expect(screen.getByTestId('usericon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<UserIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<UserIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
