export function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

export function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}