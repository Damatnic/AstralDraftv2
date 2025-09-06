
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChevronDownIcon from './ChevronDownIcon';

describe('ChevronDownIcon', () => {
  it('renders without crashing', () => {
    render(<ChevronDownIcon />);
    expect(screen.getByTestId('chevrondownicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ChevronDownIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ChevronDownIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
