
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhoneIcon from './PhoneIcon';

describe('PhoneIcon', () => {
  it('renders without crashing', () => {
    render(<PhoneIcon />);
    expect(screen.getByTestId('phoneicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PhoneIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<PhoneIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
