import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamComparisonCard from './TeamComparisonCard';

describe('TeamComparisonCard', () => {
  it('renders without crashing', () => {
    render(<TeamComparisonCard />);
    expect(screen.getByTestId('teamcomparisoncard')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TeamComparisonCard />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<TeamComparisonCard />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
