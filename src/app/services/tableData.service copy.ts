import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getData<T>(key: string): T | null {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  removeData(key: string) {
    localStorage.removeItem(key);
  }
}
