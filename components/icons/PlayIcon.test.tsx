
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayIcon from './PlayIcon';

describe('PlayIcon', () => {
  it('renders without crashing', () => {
    render(<PlayIcon />);
    expect(screen.getByTestId('playicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PlayIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<PlayIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
