// src/hooks/useDisclosure.js
import { useCallback, useState } from 'react';

/** Shared open/close state for modals, drawers and menus — one tiny hook instead of repeating useState(false) everywhere. */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}
