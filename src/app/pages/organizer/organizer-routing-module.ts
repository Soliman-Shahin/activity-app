import { OrganizerAddComponent } from './components/organizer-add/organizer-add.component';
import { OrganizerListComponent } from './components/organizer-list/organizer-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: OrganizerListComponent,
  },
  {
    path: 'addOrganizer',
    component: OrganizerAddComponent,
  },
  {
    path: 'editOrganizer/:id',
    component: OrganizerAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizerRouteingModule {}
