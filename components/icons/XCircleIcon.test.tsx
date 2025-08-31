
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import XCircleIcon from './XCircleIcon';

describe('XCircleIcon', () => {
  it('renders without crashing', () => {
    render(<XCircleIcon />);
    expect(screen.getByTestId('xcircleicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<XCircleIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<XCircleIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
