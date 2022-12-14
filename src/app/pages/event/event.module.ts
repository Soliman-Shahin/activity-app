import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventAddComponent } from './components/event-add/event-add.component';
import { EventViewComponent } from './components/event-view/event-view.component';

@NgModule({
  declarations: [
    EventComponent,
    EventListComponent,
    EventAddComponent,
    EventViewComponent,
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    // NgModule,
  ],
})
export class EventModule {}
