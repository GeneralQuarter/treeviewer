import { useEffect, useState } from 'react';

export type UseMarked = [
  marked: string[],
  toggleMarked: (plantId: string) => void
]

export function useMarked(): UseMarked {
  const [marked, setMarked] = useState<string[]>([]);
  const cacheKey = 'treeview-marked-v1';

  useEffect(() => {
    const json = localStorage.getItem(cacheKey);

    if (!json) {
      return;
    }

    try {
      setMarked(JSON.parse(json));
    } catch (e) {}
  }, []);

  const toggleMarked = (plantId: string) => {
    const newMarked = [...marked];

    const index = newMarked.findIndex(p => p === plantId);

    if (index !== -1) {
      newMarked.splice(index, 1);
    } else {
      newMarked.push(plantId);
    }

    setMarked(newMarked);
    localStorage.setItem(cacheKey, JSON.stringify(newMarked));
  }

  return [marked, toggleMarked];
}