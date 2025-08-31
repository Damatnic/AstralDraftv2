import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProposeSideBetModal from './ProposeSideBetModal';

describe('ProposeSideBetModal', () => {
  it('renders without crashing', () => {
    render(<ProposeSideBetModal />);
    expect(screen.getByTestId('proposesidebetmodal')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ProposeSideBetModal />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ProposeSideBetModal />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
