import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Accessibility } from 'accessibility';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  private labels: Record<string, string> = {};
  private options: any = {};
  private accessibilityInstance: Accessibility | null = null;

  alignmentIndex = 0;
  alignments: Array<'right' | 'left' | 'center' | 'justify'> = [
    'right',
    'left',
    'center',
    'justify',
  ];

  constructor(private translateService: TranslateService) {}

  async initAccessibility(): Promise<void> {
    await this.updateTranslations();
    this.options = this.getAccessibilityOptions();
    this.accessibilityInstance = new Accessibility(this.options);
  }

  async reInitAccessibility(): Promise<void> {
    if (this.accessibilityInstance) {
      this.accessibilityInstance.destroy();
    }
    await this.initAccessibility();
  }

  private async updateTranslations(): Promise<void> {
    const keys = this.getTranslationKeys();
    const translations = await this.getTranslations(keys);
    this.labels = this.mapTranslations(keys, translations);
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
    const translationObservables = keys.map((key) =>
      this.translateService.get('ACCESSIBILITY.' + key)
    );

    return forkJoin(translationObservables).toPromise() as Promise<string[]>;
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
        color: 'var(--primaryColor)',
        img: 'accessibility',
        useEmojis: false,
        circular: true,
        circularBorder: false,
        tabIndex: 1,
        fontFaceSrc: [
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/v4-font-face.min.css',
        ],
        position: {
          top: { size: 10, units: 'px' },
          right: {
            size:
              this.translateService.currentLang === 'ar'
                ? 10
                : 'calc(100% - 50px)',
            units: this.translateService.currentLang === 'ar' ? 'px' : '',
          },
          // left: {
          // 	size: this.translateService.currentLang === 'en' ? 10 : '',
          // 	units: this.translateService.currentLang === 'en' ? 'px' : '',
          // },
          type: 'absolute',
        },
      },
      hotkeys: {
        enabled: true,
        helpTitles: true,
      },
      buttons: {
        font: { size: 20, units: 'px' },
      },
      menu: {
        dimensions: {
          width: { size: 400, units: 'px' },
          height: { size: 'max-content', units: '' },
        },
        fontFamily: 'var(--fo-font, sans-serif)',
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
      {
        method: (res: any, state: any) => {
          this.cycleTextAlignment();
        },
        buttonText: this.translateService.instant('ACCESSIBILITY.alignText'),
        id: 2,
        toggle: false,
        icon: 'format_align_right',
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

  cycleTextAlignment(): void {
    const textElements = document.querySelectorAll<HTMLElement>(
      'p, span, h1, h2, h3, h4, h5, h6, small, ul'
    );

    const currentAlignment = this.alignments[this.alignmentIndex];

    textElements.forEach((element) => {
      element.style.textAlign = currentAlignment;
    });

    this.alignmentIndex = (this.alignmentIndex + 1) % this.alignments.length;
  }
}
