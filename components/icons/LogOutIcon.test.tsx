
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogOutIcon from './LogOutIcon';

describe('LogOutIcon', () => {
  it('renders without crashing', () => {
    render(<LogOutIcon />);
    expect(screen.getByTestId('logouticon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LogOutIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<LogOutIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
