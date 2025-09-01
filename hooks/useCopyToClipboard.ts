
export default function useCopyToClipboard() {
}
  const copy = React.useCallback(async (text: string) => {
}
    if (!navigator?.clipboard) {
}
      console.warn(&apos;Clipboard not supported&apos;);
      return;
    }

    try {
}
      await navigator.clipboard.writeText(text);
    } catch (error) {
}
      console.warn(&apos;Copy failed&apos;, error);
    }
  }, []);

  return { copy };
}
