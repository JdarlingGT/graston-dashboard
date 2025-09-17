// src/hooks/usePusher.js

import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useQueryClient } from '@tanstack/react-query';

// These should be set in a .env file for security (e.g., REACT_APP_PUSHER_KEY)
const PUSHER_KEY = process.env.REACT_APP_PUSHER_KEY || 'your-pusher-key';
const PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_CLUSTER || 'your-pusher-cluster';

const pusher = new Pusher(PUSHER_KEY, {
  cluster: PUSHER_CLUSTER,
});

export const usePusherSubscription = (channelName, eventName, queryKeyToInvalidate) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!channelName || !eventName) return;

    const channel = pusher.subscribe(channelName);

    const callback = (data) => {
      console.log(`Pusher event '${eventName}' received on channel '${channelName}':`, data);

      // When a real-time event comes in, tell TanStack Query to refetch the relevant data.
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
    };

    channel.bind(eventName, callback);

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName, queryKeyToInvalidate, queryClient]);
};
