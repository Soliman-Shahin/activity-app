import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class AppInfoService {
  constructor() {}

  currentLang = new BehaviorSubject('ar');
  currentToken = new BehaviorSubject('');

  public get title() {
    return 'Activity App';
  }

  public get currentYear() {
    return new Date().getFullYear();
  }
}
