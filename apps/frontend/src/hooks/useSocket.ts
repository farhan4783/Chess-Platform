import { useEffect, useState } from 'react';
import { useUser } from '@repo/store/useUser';

const WS_URL = import.meta.env.VITE_APP_WS_URL ?? 'ws://localhost:8080';

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    // Use username directly instead of token
    const username = user.name || 'Guest';
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(username)}`);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onclose = () => {
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return socket;
};
