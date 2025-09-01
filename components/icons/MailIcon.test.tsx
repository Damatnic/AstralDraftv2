
interface IconProps {
  size?: number | string;

  className?: string;
  color?: string;
  'aria-label'?: string;

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MailIcon from './MailIcon';

describe('MailIcon', () => {
  it('renders without crashing', () => {
    render(<MailIcon />);
    expect(screen.getByTestId('mailicon')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<MailIcon />);
    // Add specific accessibility tests here
  });

  it('handles loading states correctly', () => {
    render(<MailIcon />);
    // Add loading state tests here
  });

  it('works on mobile devices', () => {
    // Add mobile-specific tests here
  });

  it('handles error states gracefully', () => {
    // Add error handling tests here
  });
});
