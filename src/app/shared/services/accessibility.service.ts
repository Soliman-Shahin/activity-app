import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Accessibility } from 'accessibility';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private labels: Record<string, string> = {};
  private options: any = {};

  constructor(private translateService: TranslateService) {}

  async initAccessibility(): Promise<void> {
    const keys = this.getTranslationKeys();
    const translations = await this.getTranslations(keys);

    this.labels = this.mapTranslations(keys, translations);

    this.options = this.getAccessibilityOptions();

    new Accessibility(this.options);
  }

  private getTranslationKeys(): string[] {
    return [
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
  }

  private getTranslations(keys: string[]): Promise<string[]> {
    const translations$ = keys.map((key) =>
      this.translateService
        .get(`ACCESSIBILITY.${key}`)
        .pipe(map((res) => res as string))
    );

    return forkJoin(translations$).toPromise() as Promise<string[]>;
  }

  private mapTranslations(
    keys: string[],
    translations: string[]
  ): Record<string, string> {
    return keys.reduce((acc, key, index) => {
      acc[key] = translations[index];
      return acc;
    }, {} as Record<string, string>);
  }

  private getAccessibilityOptions(): any {
    return {
      labels: this.labels,
      animations: { buttons: true },
      icon: {
        dimensions: {
          width: { size: 40, units: 'px' },
          height: { size: 40, units: 'px' },
        },
        zIndex: '900',
        backgroundColor: '#ffff',
        color: '#0273ec',
        img: 'accessibility',
        useEmojis: false,
        circular: true,
        circularBorder: false,
        tabIndex: 1,
        fontFaceSrc: [
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/v4-font-face.min.css',
        ],
        position: {
          bottom: { size: 30, units: 'px' },
          right: { size: 10, units: 'px' },
          type: 'absolute',
        },
      },
      hotkeys: {
        enabled: true,
        helpTitles: true,
        keys: {
          hideImages: ['ctrlKey', 'altKey', 72],
        },
      },
      buttons: {
        font: { size: 20, units: 'px' },
      },
      menu: {
        dimensions: {
          width: { size: 400, units: 'px' },
          height: { size: 100, units: '%' },
        },
        fontFamily: 'Noto Kufi Arabic',
      },
      guide: {
        cBorder: '#20ff69',
        cBackground: '#000000',
        height: '25px',
      },
      modules: this.getAccessibilityModules(),
      customFunctions: this.getCustomFunctions(),
      session: {
        persistent: true,
      },
      language: {
        textToSpeechLang: 'en-US',
        speechToTextLang: 'en-US',
      },
    };
  }

  private getAccessibilityModules(): any {
    return {
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
    };
  }

  private getCustomFunctions(): any[] {
    return [
      {
        method: (res: any, state: any) => {
          if (state) {
            this.hideImages();
          } else {
            this.showImages();
          }
        },
        buttonText: this.translateService.instant('ACCESSIBILITY.hideImages'),
        id: 1,
        toggle: true,
        icon: 'image',
      },
    ];
  }

  private hideImages(): void {
    this.toggleImages('none');
  }

  private showImages(): void {
    this.toggleImages('');
  }

  private toggleImages(display: string): void {
    const images = document.querySelectorAll<HTMLImageElement>('img');
    images.forEach((image) => {
      image.style.display = display;
    });

    this.toggleBackgroundImages(display);
  }

  private toggleBackgroundImages(display: string): void {
    const elementsWithInlineBg = document.querySelectorAll<HTMLElement>(
      '[style*="background-image"]'
    );
    elementsWithInlineBg.forEach((element) => {
      if (display === 'none') {
        element.dataset['originalInlineBg'] = element.style.backgroundImage;
      }
      element.style.backgroundImage =
        display === 'none' ? 'none' : element.dataset['originalInlineBg'] || '';
      if (display !== 'none') {
        delete element.dataset['originalInlineBg'];
      }
    });

    const allElements = document.querySelectorAll<HTMLElement>('*');
    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      if (display === 'none' && computedStyle.backgroundImage !== 'none') {
        element.dataset['originalComputedBg'] = computedStyle.backgroundImage;
      }
      element.style.backgroundImage =
        display === 'none'
          ? 'none'
          : element.dataset['originalComputedBg'] || '';
      if (display !== 'none') {
        delete element.dataset['originalComputedBg'];
      }
    });
  }
}
