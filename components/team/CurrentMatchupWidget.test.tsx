import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CurrentMatchupWidget from './CurrentMatchupWidget';

describe('CurrentMatchupWidget', () => {
  it('renders without crashing', () => {
    render(<CurrentMatchupWidget />);
    expect(screen.getByTestId('currentmatchupwidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CurrentMatchupWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CurrentMatchupWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
