import { useCallback, useEffect, useRef, useState } from "react";

/** Everything the browser can put keyboard focus on inside a dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keyboard/focus behaviour every modal needs: Escape closes, Tab cycles inside
 * the panel, focus lands in the panel on open and returns where it came from on
 * close.
 *
 * Attach the returned ref to the modal's panel element:
 *   const panelRef = useModalA11y(onClose);
 *   <div ref={panelRef} role="dialog" aria-modal="true">…</div>
 */
export function useModalA11y(onClose: () => void) {
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // A callback ref so the effect re-runs when the panel actually mounts —
  // modals that stay mounted while closed attach the ref later than the hook.
  const setRef = useCallback((node: HTMLElement | null) => {
    panelRef.current = node;
    setPanel(node);
  }, []);

  useEffect(() => {
    if (!panel) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

    focusable()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !active || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !active || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [panel]);

  return setRef;
}

export default useModalA11y;
