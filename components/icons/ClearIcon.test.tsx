
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClearIcon from './ClearIcon';

describe('ClearIcon', () => {
  it('renders without crashing', () => {
    render(<ClearIcon />);
    expect(screen.getByTestId('clearicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ClearIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<ClearIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
