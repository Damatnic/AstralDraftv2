
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;

interface ReactionPickerProps {
}
  onSelect: (emoji: string) => void;
}

const emojis = [&apos;👍&apos;, &apos;😂&apos;, &apos;🔥&apos;, &apos;🤔&apos;, &apos;😢&apos;, &apos;🤯&apos;];

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onSelect }: any) => {
}
  return (
    <div className="absolute -top-4 right-2 sm:right-auto sm:left-2 flex items-center gap-1 p-1 bg-gray-800/90 border border-white/10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
      {emojis.map((emoji: any) => (
}
        <button
          key={emoji}
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

const ReactionPickerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ReactionPicker {...props} />
  </ErrorBoundary>
);

export default React.memo(ReactionPickerWithErrorBoundary);
