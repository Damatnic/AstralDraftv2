
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageIcon from './ImageIcon';

describe('ImageIcon', () => {
  it('renders without crashing', () => {
    render(<ImageIcon />);
    expect(screen.getByTestId('imageicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ImageIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ImageIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
