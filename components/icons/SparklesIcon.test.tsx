
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SparklesIcon from './SparklesIcon';

describe('SparklesIcon', () => {
  it('renders without crashing', () => {
    render(<SparklesIcon />);
    expect(screen.getByTestId('sparklesicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SparklesIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<SparklesIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
