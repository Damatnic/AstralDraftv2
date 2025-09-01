
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Trash2Icon from './Trash2Icon';

describe('Trash2Icon', () => {
  it('renders without crashing', () => {
    render(<Trash2Icon />);
    expect(screen.getByTestId('trash2icon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Trash2Icon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<Trash2Icon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
