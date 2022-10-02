import { KeycloakService } from 'keycloak-angular';
import { Component, HostBinding, Inject, Renderer2 } from '@angular/core';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class') get getClass() {
    return Object.keys(this.screen.sizes)
      .filter((cl) => this.screen.sizes[cl])
      .join(' ');
  }

  constructor(
    // private authService: AuthService,
    private _keycloakService: KeycloakService,
    private screen: ScreenService,
    public appInfo: AppInfoService,
    private renderer: Renderer2,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.appInfo.currentLang.subscribe(() => {
      // const lang = this.appInfo.currentLang.getValue();
      const lang = localStorage.getItem('lang');
      if (lang == 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
        this.renderer.addClass(this.document.body, 'rtl');
        this.renderer.addClass(this.document.body, 'dx-rtl');
        translateService.setDefaultLang('ar');
      } else if (lang == 'en') {
        document.getElementsByTagName('html')[0].removeAttribute('dir');
        this.renderer.removeClass(this.document.body, 'rtl');
        this.renderer.removeClass(this.document.body, 'dx-rtl');
        translateService.setDefaultLang('en');
      }
    });
  }

  isAuthenticated() {
    // return this.authService.loggedIn;
    return this._keycloakService.isLoggedIn();
  }
}
