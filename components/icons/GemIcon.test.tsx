
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GemIcon from './GemIcon';

describe('GemIcon', () => {
  it('renders without crashing', () => {
    render(<GemIcon />);
    expect(screen.getByTestId('gemicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<GemIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<GemIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
