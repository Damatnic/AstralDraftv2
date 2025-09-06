
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarIcon from './CalendarIcon';

describe('CalendarIcon', () => {
  it('renders without crashing', () => {
    render(<CalendarIcon />);
    expect(screen.getByTestId('calendaricon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<CalendarIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<CalendarIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
