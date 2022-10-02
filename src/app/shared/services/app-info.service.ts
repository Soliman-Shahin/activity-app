import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppInfoService {
  constructor() {}

  // set BehaviorSubject current language arabic
  currentLang = new BehaviorSubject('ar');
  // set BehaviorSubject current token empty
  currentToken = new BehaviorSubject('');

  public get title() {
    return 'Activity App';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
