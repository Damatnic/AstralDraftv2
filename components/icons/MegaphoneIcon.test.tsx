
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MegaphoneIcon from './MegaphoneIcon';

describe('MegaphoneIcon', () => {
  it('renders without crashing', () => {
    render(<MegaphoneIcon />);
    expect(screen.getByTestId('megaphoneicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MegaphoneIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<MegaphoneIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
