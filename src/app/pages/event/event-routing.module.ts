import { EventViewComponent } from './components/event-view/event-view.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventAddComponent } from './components/event-add/event-add.component';

const routes: Routes = [
  {
    path: '',
    component: EventListComponent,
  },
  {
    path: 'addEvent',
    component: EventAddComponent,
  },
  {
    path: 'view/:id',
    component: EventViewComponent,
  },
  {
    path: 'editEvent/:id',
    component: EventAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
