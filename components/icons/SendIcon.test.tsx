
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SendIcon from './SendIcon';

describe('SendIcon', () => {
  it('renders without crashing', () => {
    render(<SendIcon />);
    expect(screen.getByTestId('sendicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<SendIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<SendIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
