import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamChemistryWidget from './TeamChemistryWidget';

describe('TeamChemistryWidget', () => {
  it('renders without crashing', () => {
    render(<TeamChemistryWidget />);
    expect(screen.getByTestId('teamchemistrywidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TeamChemistryWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<TeamChemistryWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
