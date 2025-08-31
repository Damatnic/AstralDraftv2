
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertTriangleIcon from './AlertTriangleIcon';

describe('AlertTriangleIcon', () => {
  it('renders without crashing', () => {
    render(<AlertTriangleIcon />);
    expect(screen.getByTestId('alerttriangleicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<AlertTriangleIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<AlertTriangleIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
