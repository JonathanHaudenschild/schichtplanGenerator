import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
    this.init();
  }
  async init() {

  }

  public set(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  }

  public remove(key: string) {
    return localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
