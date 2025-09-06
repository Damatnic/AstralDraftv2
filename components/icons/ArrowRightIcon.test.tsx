
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArrowRightIcon from './ArrowRightIcon';

describe('ArrowRightIcon', () => {
  it('renders without crashing', () => {
    render(<ArrowRightIcon />);
    expect(screen.getByTestId('arrowrighticon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ArrowRightIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ArrowRightIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
