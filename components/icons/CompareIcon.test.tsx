
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompareIcon from './CompareIcon';

describe('CompareIcon', () => {
  it('renders without crashing', () => {
    render(<CompareIcon />);
    expect(screen.getByTestId('compareicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CompareIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CompareIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
