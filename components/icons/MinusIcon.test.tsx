
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MinusIcon from './MinusIcon';

describe('MinusIcon', () => {
  it('renders without crashing', () => {
    render(<MinusIcon />);
    expect(screen.getByTestId('minusicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MinusIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<MinusIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
