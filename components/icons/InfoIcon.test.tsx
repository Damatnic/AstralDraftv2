
interface IconProps {
}
  size?: number | string;
}

  className?: string;
  color?: string;
  &apos;aria-label&apos;?: string;

import { render, screen } from &apos;@testing-library/react&apos;;
import &apos;@testing-library/jest-dom&apos;;
import InfoIcon from &apos;./InfoIcon&apos;;

describe(&apos;InfoIcon&apos;, () => {
}
  it(&apos;renders without crashing&apos;, () => {
}
    render(<InfoIcon />);
    expect(screen.getByTestId(&apos;infoicon&apos;)).toBeInTheDocument();
  });

  it(&apos;has proper accessibility attributes&apos;, () => {
}
    render(<InfoIcon />);
    // Add specific accessibility tests here
  });

  it(&apos;handles loading states correctly&apos;, () => {
}
    render(<InfoIcon />);
    // Add loading state tests here
  });

  it(&apos;works on mobile devices&apos;, () => {
}
    // Add mobile-specific tests here
  });

  it(&apos;handles error states gracefully&apos;, () => {
}
    // Add error handling tests here
  });
});
