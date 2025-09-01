import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LiveDraftRoom from './LiveDraftRoom';

describe('LiveDraftRoom', () => {
  it('renders without crashing', () => {
    render(<LiveDraftRoom />);
    expect(screen.getByTestId('livedraftroom')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LiveDraftRoom />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<LiveDraftRoom />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
