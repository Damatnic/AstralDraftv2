
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MenuIcon from './MenuIcon';

describe('MenuIcon', () => {
  it('renders without crashing', () => {
    render(<MenuIcon />);
    expect(screen.getByTestId('menuicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MenuIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<MenuIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
