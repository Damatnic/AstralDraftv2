
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoonIcon from './MoonIcon';

describe('MoonIcon', () => {
  it('renders without crashing', () => {
    render(<MoonIcon />);
    expect(screen.getByTestId('moonicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MoonIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<MoonIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
