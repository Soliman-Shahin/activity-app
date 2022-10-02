import { ActivityService } from './../../../../shared/services/activity.service';
import { Component, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  // set snackbar position
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  // activities empty array
  activities: any = [];

  constructor(
    private activityService: ActivityService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getActivities();
  }

  // get all activities
  getActivities() {
    this.activityService.getActivities().subscribe((res: any) => {
      const data = res.entries;
      for (let i = 0; i < data.length; i++) {
        this.activities.push({
          uid: data[i].uid,
          title: data[i].title,
          startDate: data[i].properties['activity:startDate'],
          endDate: data[i].properties['activity:endDate'],
          category: data[i].properties['activity:categorization'],
          cover: data[i].properties['activity:coverPicture']?.data,
        });
      }
    });
  }

  // delete activity
  deleteEvent(event: any) {
    const uid = event.uid;
    this.activityService.deleteActivity(uid).subscribe((res: any) => {
      this.openSnackBar('Deleted Successfully!', '✅');
      console.log('error');
    });

    this.activities = [];
    this.getActivities();
  }

  // snackBar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
