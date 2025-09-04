import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeagueCard from './LeagueCard';

describe('LeagueCard', () => {
  const mockLeague = {
    name: 'Test League',
    status: 'PRE_DRAFT',
    settings: {
      teamCount: 12,
      draftFormat: 'Snake'
    }
  };

  it('renders without crashing', () => {
    render(<LeagueCard league={mockLeague} onJoin={() => {}} />);
    expect(screen.getByTestId('leaguecard')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LeagueCard league={mockLeague} onJoin={() => {}} />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<LeagueCard league={mockLeague} onJoin={() => {}} />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
