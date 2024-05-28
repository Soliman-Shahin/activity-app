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
import { Accessibility } from 'accessibility';
import { forkJoin } from 'rxjs';

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

  private labels: any = {};
  private options: any = {};

  constructor(
    private keycloakService: KeycloakService,
    private screen: ScreenService,
    public appInfo: AppInfoService,
    private renderer: Renderer2,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.appInfo.currentLang.subscribe(() => this.updateLanguageSettings());
  }

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() =>
      this.initAccessibility()
    );
    this.initAccessibility();
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

  private async initAccessibility() {
    const keys = [
      'resetTitle',
      'closeTitle',
      'menuTitle',
      'increaseText',
      'decreaseText',
      'increaseTextSpacing',
      'decreaseTextSpacing',
      'increaseLineHeight',
      'decreaseLineHeight',
      'invertColors',
      'grayHues',
      'underlineLinks',
      'bigCursor',
      'readingGuide',
      'textToSpeech',
      'speechToText',
      'disableAnimations',
      'hotkeyPrefix',
    ];

    const translations$ = keys.map((key) =>
      this.translateService.get(`ACCESSIBILITY.${key}`)
    );

    forkJoin(translations$).subscribe((translations) => {
      this.labels = {};
      keys.forEach((key, index) => {
        this.labels[key] = translations[index];
      });

      this.options = {
        labels: this.labels,
        icon: {
          position: {
            bottom: { size: 35, units: 'px' },
            right: { size: 10, units: 'px' },
            type: 'absolute',
          },
          circular: true,
          img: 'accessibility',
        },
        session: {
          persistent: true,
        },
        textToSpeechLang: 'en-US',
        speechToTextLang: 'en-US',
        modules: {
          decreaseText: true,
          increaseText: true,
          invertColors: true,
          increaseTextSpacing: true,
          decreaseTextSpacing: true,
          increaseLineHeight: true,
          decreaseLineHeight: true,
          grayHues: true,
          underlineLinks: true,
          bigCursor: true,
          readingGuide: true,
          textToSpeech: true,
          speechToText: true,
          disableAnimations: true,
        },
      };

      new Accessibility(this.options);
    });
  }

  isAuthenticated() {
    return this.keycloakService.isLoggedIn();
  }
}
