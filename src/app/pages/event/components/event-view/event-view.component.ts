import { ActivityService } from './../../../../shared/services/activity.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss'],
})
export class EventViewComponent implements OnInit {
  eventId: any;

  // activity empty array
  activity: any = [];

  // images empty array
  images: any = [];

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {
    this.eventId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getActivity();
    this.getActivityImages();
  }



  // get activity files
  getActivityImages() {
    this.activityService.getImages(this.eventId).subscribe((res: any) => {
      const data = res.entries;
      for (let item of data) {
        this.images.push({
          image: item.properties['file:content'].data,
        });
      }
    });
  }

  // get activity data
  getActivity() {
    this.activityService.getActivityById(this.eventId).subscribe((res: any) => {
      const data = res.properties;
      this.activity.push({
        id: res.uid,
        title: data['dc:title'],
        description: data['dc:description'],
        categorization: data['activity:categorization'],
        organizers: data['activity:organizers'],
        locations: data['activity:locations'].city,
        startDate: data['activity:startDate'],
        endDate: data['activity:endDate'],
        timeFrom: data['activity:timeFrom'],
        timeTo: data['activity:timeTo'],
        created: data['dc:created'],
        creator: data['dc:creator'],
        cover: data['activity:coverPicture']?.data,
      });
    });
  }
}
