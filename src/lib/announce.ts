type Listener = (message: string) => void;

const listeners = new Set<Listener>();

export function announce(message: string) {
  for (const l of listeners) l(message);
}

export function subscribeAnnouncements(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
