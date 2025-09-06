
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckCircleIcon from './CheckCircleIcon';

describe('CheckCircleIcon', () => {
  it('renders without crashing', () => {
    render(<CheckCircleIcon />);
    expect(screen.getByTestId('checkcircleicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CheckCircleIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CheckCircleIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
