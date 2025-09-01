
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StopIcon from './StopIcon';

describe('StopIcon', () => {
  it('renders without crashing', () => {
    render(<StopIcon />);
    expect(screen.getByTestId('stopicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<StopIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<StopIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
