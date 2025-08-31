
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CrosshairIcon from './CrosshairIcon';

describe('CrosshairIcon', () => {
  it('renders without crashing', () => {
    render(<CrosshairIcon />);
    expect(screen.getByTestId('crosshairicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CrosshairIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CrosshairIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
