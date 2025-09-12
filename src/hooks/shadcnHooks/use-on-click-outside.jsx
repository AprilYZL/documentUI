"use client";;
import { useEventListener } from './use-event-listener';

export function useOnClickOutside(ref, handler, eventType = 'mousedown', eventListenerOptions = {}) {
  useEventListener(eventType, event => {
    const target = event.target;

    // Do nothing if the target is not connected element with document
    if (!target || !target.isConnected) {
      return;
    }

    const isOutside = Array.isArray(ref)
      ? ref
          .filter(r => Boolean(r.current))
          .every(r => r.current && !r.current.contains(target))
      : ref.current && !ref.current.contains(target);

    if (isOutside) {
      handler(event);
    }
  }, undefined, eventListenerOptions);
}