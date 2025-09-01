
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ZapIcon from './ZapIcon';

describe('ZapIcon', () => {
  it('renders without crashing', () => {
    render(<ZapIcon />);
    expect(screen.getByTestId('zapicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ZapIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ZapIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
