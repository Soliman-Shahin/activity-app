import { AccessibilityService } from './shared/services/accessibility.service';
import { KeycloakService } from 'keycloak-angular';
import {
  Component,
  HostBinding,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { ScreenService, AppInfoService } from './shared/services';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

const LANG_AR = 'ar';
const LANG_EN = 'en';
const LOCAL_STORAGE_LANG_KEY = 'lang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes)
      .filter((cl) => this.screen.sizes[cl])
      .join(' ');
  }

  constructor(
    private keycloakService: KeycloakService,
    private screen: ScreenService,
    public appInfo: AppInfoService,
    private renderer: Renderer2,
    private translateService: TranslateService,
    private accessibilityService: AccessibilityService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.appInfo.currentLang.subscribe(() => this.updateLanguageSettings());
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() =>
      this.accessibilityService.initAccessibility()
    );
    this.accessibilityService.initAccessibility();
  }

  private updateLanguageSettings() {
    const lang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    if (lang === LANG_AR) {
      this.setLanguageDirection('rtl', LANG_AR);
    } else if (lang === LANG_EN) {
      this.setLanguageDirection('ltr', LANG_EN);
    }
  }

  private setLanguageDirection(direction: string, lang: string) {
    const htmlElement = this.document.getElementsByTagName('html')[0];
    if (direction === 'rtl') {
      htmlElement.setAttribute('dir', 'rtl');
      this.renderer.addClass(this.document.body, 'rtl');
      this.renderer.addClass(this.document.body, 'dx-rtl');
    } else {
      htmlElement.removeAttribute('dir');
      this.renderer.removeClass(this.document.body, 'rtl');
      this.renderer.removeClass(this.document.body, 'dx-rtl');
    }
    this.translateService.setDefaultLang(lang);
  }

  isAuthenticated() {
    return this.keycloakService.isLoggedIn();
  }
}
