import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WhatsNextWidget from './WhatsNextWidget';

describe('WhatsNextWidget', () => {
  it('renders without crashing', () => {
    render(<WhatsNextWidget />);
    expect(screen.getByTestId('whatsnextwidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<WhatsNextWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<WhatsNextWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
