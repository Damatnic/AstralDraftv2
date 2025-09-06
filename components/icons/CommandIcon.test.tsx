
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommandIcon from './CommandIcon';

describe('CommandIcon', () => {
  it('renders without crashing', () => {
    render(<CommandIcon />);
    expect(screen.getByTestId('commandicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CommandIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CommandIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
