// armazenamento local seguro com fallback em memoria para ssr
const memoryStore = new Map<string, any>();

export const mockDb = {
  // inicializacao de chave com valor padrao
  init: (key: string, initialData: any) => {
    if (typeof window === 'undefined') {
      if (!memoryStore.has(key)) {
        memoryStore.set(key, initialData);
      }
      return;
    }

    try {
      const existing = localStorage.getItem(key);
      if (!existing) {
        localStorage.setItem(key, JSON.stringify(initialData));
      }
    } catch {
      if (!memoryStore.has(key)) {
        memoryStore.set(key, initialData);
      }
    }
  },

  // leitura de dados
  get: <T = any>(key: string): T => {
    if (typeof window === 'undefined') {
      return memoryStore.get(key);
    }

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : memoryStore.get(key);
    } catch {
      return memoryStore.get(key);
    }
  },

  // gravacao de dados
  set: (key: string, value: any) => {
    memoryStore.set(key, value);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // fallback em memoria ativo
      }
    }
  }
};
