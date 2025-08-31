
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckIcon from './CheckIcon';

describe('CheckIcon', () => {
  it('renders without crashing', () => {
    render(<CheckIcon />);
    expect(screen.getByTestId('checkicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CheckIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CheckIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
