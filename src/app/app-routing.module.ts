import { TranslateModule } from '@ngx-translate/core';
import { KeycloakGuard } from './keycloak.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
} from './shared/components';
import { AuthGuardService } from './shared/services';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';

const routes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'login-form',
    component: LoginFormComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordFormComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'create-account',
    component: CreateAccountFormComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'change-password/:recoveryCode',
    component: ChangePasswordFormComponent,
    canActivate: [KeycloakGuard],
  },
  {
    path: 'event',
    loadChildren: () =>
      import('./pages/event/event.module').then((m) => m.EventModule),
    canActivate: [KeycloakGuard],
  },
  {
    path: 'organizer',
    loadChildren: () =>
      import('./pages/organizer/organizer.module').then(
        (m) => m.OrganizerModule
      ),
    canActivate: [KeycloakGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    TranslateModule.forChild(),
    DxDataGridModule,
    DxFormModule,
  ],
  providers: [KeycloakGuard],
  exports: [RouterModule],
  declarations: [HomeComponent, ProfileComponent, TasksComponent],
})
export class AppRoutingModule {}
