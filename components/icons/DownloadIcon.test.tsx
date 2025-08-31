
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadIcon from './DownloadIcon';

describe('DownloadIcon', () => {
  it('renders without crashing', () => {
    render(<DownloadIcon />);
    expect(screen.getByTestId('downloadicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<DownloadIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<DownloadIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
