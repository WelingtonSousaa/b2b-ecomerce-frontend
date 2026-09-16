export const mockDb = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  init: (key: string, initialData: any) => {
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  }
};
