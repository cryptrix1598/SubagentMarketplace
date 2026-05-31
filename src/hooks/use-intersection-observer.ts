import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
) {
  const { threshold = 0, root = null, rootMargin = "0px", triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      cleanup();
      elementRef.current = node;

      if (!node) return;
      if (triggerOnce && hasTriggeredRef.current) return;

      const observer = new IntersectionObserver(
        ([observerEntry]) => {
          if (!observerEntry) return;
          setIsIntersecting(observerEntry.isIntersecting);
          setEntry(observerEntry);

          if (observerEntry.isIntersecting && triggerOnce) {
            hasTriggeredRef.current = true;
            cleanup();
          }
        },
        { threshold, root, rootMargin },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, root, rootMargin, triggerOnce, cleanup],
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { ref, isIntersecting, entry };
}

export function useInfiniteScroll(callback: () => void, options: UseIntersectionObserverOptions = {}) {
  const { isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "200px",
    triggerOnce: false,
    ...options,
  });

  useEffect(() => {
    if (isIntersecting) {
      callback();
    }
  }, [isIntersecting, callback]);

  return { isIntersecting };
}