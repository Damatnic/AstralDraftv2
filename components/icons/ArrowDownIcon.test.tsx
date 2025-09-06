
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ArrowDownIcon from './ArrowDownIcon';

describe('ArrowDownIcon', () => {
  it('renders without crashing', () => {
    render(<ArrowDownIcon />);
    expect(screen.getByTestId('arrowdownicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ArrowDownIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ArrowDownIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
