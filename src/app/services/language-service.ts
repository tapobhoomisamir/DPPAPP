import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // BehaviorSubject holds the current value and emits it to new subscribers
  private langSubject = new BehaviorSubject<string>('en'); 

  // Public observable for components to subscribe to
  public currentLang$: Observable<string> = this.langSubject.asObservable();

  // Method to update the language and notify all subscribers
  setLanguage(lang: string) {
    this.langSubject.next(lang);
  }
  
  // Method to get the current language value synchronously (if needed)
  getCurrentLanguage(): string {
    return this.langSubject.value;
  }
}