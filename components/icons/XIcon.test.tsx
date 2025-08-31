
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import XIcon from './XIcon';

describe('XIcon', () => {
  it('renders without crashing', () => {
    render(<XIcon />);
    expect(screen.getByTestId('xicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<XIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<XIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
