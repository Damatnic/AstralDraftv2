
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChevronLeftIcon from './ChevronLeftIcon';

describe('ChevronLeftIcon', () => {
  it('renders without crashing', () => {
    render(<ChevronLeftIcon />);
    expect(screen.getByTestId('chevronlefticon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChevronLeftIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ChevronLeftIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
