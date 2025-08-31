import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChampionshipOddsPreview from './ChampionshipOddsPreview';

describe('ChampionshipOddsPreview', () => {
  it('renders without crashing', () => {
    render(<ChampionshipOddsPreview />);
    expect(screen.getByTestId('championshipoddspreview')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChampionshipOddsPreview />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ChampionshipOddsPreview />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
