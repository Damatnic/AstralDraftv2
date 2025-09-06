
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BellIcon from './BellIcon';

describe('BellIcon', () => {
  it('renders without crashing', () => {
    render(<BellIcon />);
    expect(screen.getByTestId('bellicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<BellIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<BellIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
