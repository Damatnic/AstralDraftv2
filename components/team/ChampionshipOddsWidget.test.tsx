import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChampionshipOddsWidget from './ChampionshipOddsWidget';

describe('ChampionshipOddsWidget', () => {
  it('renders without crashing', () => {
    render(<ChampionshipOddsWidget />);
    expect(screen.getByTestId('championshipoddswidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChampionshipOddsWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ChampionshipOddsWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
