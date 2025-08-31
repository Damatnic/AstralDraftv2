import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModernLoader from './ModernLoader';

describe('ModernLoader', () => {
  it('renders without crashing', () => {
    render(<ModernLoader />);
    expect(screen.getByTestId('modernloader')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ModernLoader />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ModernLoader />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
