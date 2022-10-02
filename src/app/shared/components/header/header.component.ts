import { AppInfoService } from './../../services/app-info.service';
import { KeycloakService } from 'keycloak-angular';
import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

import { AuthService, IUser } from '../../services';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: IUser | null = { email: '' };

  isFullScreen: boolean = false;

  userMenuItems = [
    {
      text: 'Profile',
      icon: 'user',
      // onClick: () => {
      //   this.router.navigate(['/profile']);
      // },
    },

    {
      text: 'Logout',
      icon: 'runner',
      onClick: () => {
        // this.authService.logOut();
        this._keycloakService.logout();
        localStorage.removeItem('token');
      },
    },
  ];

  elem: any;

  constructor(
    // private authService: AuthService,
    private router: Router,
    private _keycloakService: KeycloakService,
    public appInfo: AppInfoService,
    @Inject(DOCUMENT) private document: any
  ) {}

  ngOnInit() {
    this.elem = document.documentElement;

    // this.authService.getUser().then((e) => (this.user = e.data));
  }

  // to change language
  changeLang() {
    const lang = this.appInfo.currentLang.getValue();
    if (lang == 'ar') {
      localStorage.setItem('lang', 'en');
      this.appInfo.currentLang.next('en');
    } else if (lang == 'en') {
      localStorage.setItem('lang', 'ar');
      this.appInfo.currentLang.next('ar');
    }
  }

  // to open and close full screen
  toggleFullScreen() {
    if (this.isFullScreen == false) {
      // to open full screen
      this.isFullScreen = true;
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      // to close full screen
    } else if (this.isFullScreen == true) {
      this.isFullScreen = false;
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  // to open and close sidebar
  toggleMenu = () => {
    this.menuToggle.emit();
  };
}

@NgModule({
  imports: [CommonModule, DxButtonModule, UserPanelModule, DxToolbarModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
