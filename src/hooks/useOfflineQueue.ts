import { useState, useEffect, useCallback } from 'react';

interface QueuedAction {
  id: string;
  action: () => Promise<any>;
  timestamp: number;
  retries: number;
}

export const useOfflineQueue = () => {
  const [queue, setQueue] = useState<QueuedAction[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = useCallback((action: () => Promise<any>) => {
    const queuedAction: QueuedAction = {
      id: Date.now().toString(),
      action,
      timestamp: Date.now(),
      retries: 0,
    };

    setQueue(prev => [...prev, queuedAction]);

    if (isOnline) {
      processQueue();
    }
  }, [isOnline]);

  const processQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0) return;

    const actionsToProcess = [...queue];
    setQueue([]);

    for (const queuedAction of actionsToProcess) {
      try {
        await queuedAction.action();
      } catch (error) {
        console.error('Failed to process queued action:', error);

        // Re-queue with increased retry count
        if (queuedAction.retries < 3) {
          setQueue(prev => [...prev, {
            ...queuedAction,
            retries: queuedAction.retries + 1,
          }]);
        }
      }
    }
  }, [isOnline, queue]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline, queue.length, processQueue]);

  return {
    addToQueue,
    queueLength: queue.length,
    isOnline,
  };
};
