
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TelescopeIcon from './TelescopeIcon';

describe('TelescopeIcon', () => {
  it('renders without crashing', () => {
    render(<TelescopeIcon />);
    expect(screen.getByTestId('telescopeicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<TelescopeIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<TelescopeIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
