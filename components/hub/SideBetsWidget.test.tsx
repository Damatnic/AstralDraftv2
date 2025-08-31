import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideBetsWidget from './SideBetsWidget';

describe('SideBetsWidget', () => {
  it('renders without crashing', () => {
    render(<SideBetsWidget />);
    expect(screen.getByTestId('sidebetswidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SideBetsWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<SideBetsWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
