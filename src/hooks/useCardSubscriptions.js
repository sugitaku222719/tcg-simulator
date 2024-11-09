import { useEffect } from 'react';

const useCardSubscriptions = (
  refs,
  setters
) => {
  useEffect(() => {
    const unsubscribers = Object.entries(refs).map(([key, ref]) => {
      return ref.onSnapshot((doc) => {
        if (doc.exists) {
          setters[key](doc.data().cards || []);
        }
      });
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [refs, setters]);
};

export default useCardSubscriptions;