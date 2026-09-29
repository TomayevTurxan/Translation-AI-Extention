import { useEffect, useState } from 'react';
import { getAll } from './storage';

export default function useStore() {
  const [data, setData] = useState({ words: [], sentences: [], activity: {} });
  useEffect(() => {
    const load = () => getAll().then(setData);
    load();
    chrome.storage.onChanged.addListener(load);
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);
  return data;
}
