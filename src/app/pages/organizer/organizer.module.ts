import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizerRouteingModule } from './organizer-routing-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerListComponent } from './components/organizer-list/organizer-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrganizerAddComponent } from './components/organizer-add/organizer-add.component';

@NgModule({
  declarations: [OrganizerListComponent, OrganizerAddComponent],
  imports: [
    CommonModule,
    OrganizerRouteingModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
  ],
})
export class OrganizerModule {}
