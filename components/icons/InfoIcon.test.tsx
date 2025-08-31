
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoIcon from './InfoIcon';

describe('InfoIcon', () => {
  it('renders without crashing', () => {
    render(<InfoIcon />);
    expect(screen.getByTestId('infoicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<InfoIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<InfoIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
