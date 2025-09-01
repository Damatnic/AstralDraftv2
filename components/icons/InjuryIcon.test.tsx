
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InjuryIcon from './InjuryIcon';

describe('InjuryIcon', () => {
  it('renders without crashing', () => {
    render(<InjuryIcon />);
    expect(screen.getByTestId('injuryicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<InjuryIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<InjuryIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
