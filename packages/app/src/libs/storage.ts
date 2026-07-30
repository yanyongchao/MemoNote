import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'app-storage' });

export const storage = {
  setItem: <T>(key: string, value: T) => {
    mmkv.set(key, typeof value === 'string' ? value : JSON.stringify(value));
  },
  getItem: <T>(key: string): T | undefined => {
    const raw = mmkv.getString(key);
    if (raw === undefined) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as T;
    }
  },
  removeItem: (key: string) => mmkv.remove(key),
};
