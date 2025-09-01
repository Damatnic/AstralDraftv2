
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeartIcon from './HeartIcon';

describe('HeartIcon', () => {
  it('renders without crashing', () => {
    render(<HeartIcon />);
    expect(screen.getByTestId('hearticon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<HeartIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<HeartIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
