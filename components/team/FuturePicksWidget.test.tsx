import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FuturePicksWidget from './FuturePicksWidget';

describe('FuturePicksWidget', () => {
  it('renders without crashing', () => {
    render(<FuturePicksWidget />);
    expect(screen.getByTestId('futurepickswidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<FuturePicksWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<FuturePicksWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
