import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

describe('Counter', () => {
  it('renders without crashing', () => {
    render(<Counter />);
    expect(screen.getByTestId('counter')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Counter />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<Counter />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
