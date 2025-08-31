import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradeWhispererWidget from './TradeWhispererWidget';

describe('TradeWhispererWidget', () => {
  it('renders without crashing', () => {
    render(<TradeWhispererWidget />);
    expect(screen.getByTestId('tradewhispererwidget')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TradeWhispererWidget />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<TradeWhispererWidget />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
