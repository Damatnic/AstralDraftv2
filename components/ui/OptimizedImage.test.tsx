import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptimizedImage from './OptimizedImage';

describe('OptimizedImage', () => {
  it('renders without crashing', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    expect(screen.getByTestId('optimizedimage')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
