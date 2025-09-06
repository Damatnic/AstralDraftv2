import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamStoryBuilder from './TeamStoryBuilder';

describe('TeamStoryBuilder', () => {
  it('renders without crashing', () => {
    render(<TeamStoryBuilder />);
    expect(screen.getByTestId('teamstorybuilder')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TeamStoryBuilder />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<TeamStoryBuilder />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
