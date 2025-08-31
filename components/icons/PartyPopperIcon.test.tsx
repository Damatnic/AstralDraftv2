
interface IconProps {
  size?: number | string;
}

  className?: string;
  color?: string;
  'aria-label'?: string;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartyPopperIcon from './PartyPopperIcon';

describe('PartyPopperIcon', () => {
  it('renders without crashing', () => {
    render(<PartyPopperIcon />);
    expect(screen.getByTestId('partypoppericon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PartyPopperIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<PartyPopperIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
