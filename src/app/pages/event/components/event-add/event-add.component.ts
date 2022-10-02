import { OrganizerService } from './../../../../shared/services/organizer.service';
import { ActivityService } from './../../../../shared/services/activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss'],
})
export class EventAddComponent implements OnInit {
  // set snackbar position
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  // activity form
  eventForm = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    categorization: new FormControl(),
    organizers: new FormControl(),
    locations: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    timeFrom: new FormControl(),
    timeTo: new FormControl(),
    coverPicture: new FormControl(),
  });

  eventId: any;

  // set is edit mode default false
  editMode: boolean = false;

  // activity empty array
  activity: any = [];

  // empty array for body content
  saveActivity: any = [];

  // organizers empty array
  organizers: any = [];

  // empty array for activity cover picture
  coverPicture: any = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private activityService: ActivityService,
    private organizerService: OrganizerService,
    private snackBar: MatSnackBar
  ) {
    // get activity id from route params
    this.eventId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.resetForm();
    this.getActivity();
    this.getAllOrganizers();
  }

  // get organizers
  getAllOrganizers() {
    this.organizerService.getAllOrganizers().subscribe((res: any) => {
      const data = res.entries;
      for (let i = 0; i < data.length; i++) {
        this.organizers.push({
          id: data[i].uid,
          title: data[i].title,
        });
      }
    });
  }

  // get activity data
  getActivity() {
    if (this.eventId != null) {
      this.editMode = true;

      this.activityService
        .getActivityById(this.eventId)
        .subscribe((res: any) => {
          const data = res.properties;
          this.eventForm.patchValue({
            id: res.uid,
            title: data['dc:title'],
            description: data['dc:description'],
            categorization: data['activity:categorization'],
            organizers: data['activity:organizers'],
            locations: data['activity:locations'].city,
            startDate: moment(data['activity:startDate']).format('yyy-MM-DD'),
            endDate: moment(data['activity:endDate']).format('yyy-MM-DD'),
            timeFrom: data['activity:timeFrom'],
            timeTo: data['activity:timeTo'],
            category: data['activity:categorization'],
            cover: data['activity:coverPicture']?.data,
          });
        });
    } else {
      this.editMode = false;
    }
  }

  // create new activity
  createActivity() {
    this.saveActivity = {
      activity: {
        'dc:title': this.eventForm.controls['title'].value,
        'dc:description': this.eventForm.controls['description'].value,
        'activity:categorization':
          this.eventForm.controls['categorization'].value,
        'activity:organizers': this.eventForm.controls['organizers'].value,
        'activity:locations': {
          city: this.eventForm.controls['locations'].value,
          geographicLocation: '',
        },
        'activity:startDate': this.eventForm.controls['startDate'].value,
        'activity:endDate': this.eventForm.controls['endDate'].value,
        'activity:timeFrom': this.eventForm.controls['timeFrom'].value,
        'activity:timeTo': this.eventForm.controls['timeTo'].value,
        'activity:coverPicture': {
          'upload-batch': this.coverPicture['upload-batch'],
          'upload-fileId': this.coverPicture['upload-fileId'],
        },
      },
    };
    this.activityService.createActivity(this.saveActivity).subscribe(
      (res: any) => {
        this.openSnackBar('Data submitted successfully', '✅');
        this.router.navigateByUrl('/event');
        console.log('success');
      },
      (error) => {
        this.openSnackBar('Something wrong happen!', '⚠️');
        console.log('error');
      }
    );
  }

  // update activity
  updateActivity() {
    this.saveActivity = {
      activity: {
        'dc:title': this.eventForm.controls['title'].value,
        'dc:description': this.eventForm.controls['description'].value,
        'activity:categorization':
          this.eventForm.controls['categorization'].value,
        'activity:organizers': this.eventForm.controls['organizers'].value,
        'activity:locations': {
          city: this.eventForm.controls['locations'].value,
          geographicLocation: '',
        },
        'activity:startDate': this.eventForm.controls['startDate'].value,
        'activity:endDate': this.eventForm.controls['endDate'].value,
        'activity:timeFrom': this.eventForm.controls['timeFrom'].value,
        'activity:timeTo': this.eventForm.controls['timeTo'].value,
        'activity:coverPicture': {
          'upload-batch': this.coverPicture['upload-batch'],
          'upload-fileId': this.coverPicture['upload-fileId'],
        },
      },
    };
    this.activityService
      .updateActivity(this.saveActivity, this.eventId)
      .subscribe(
        (res: any) => {
          this.openSnackBar('Data submitted successfully', '✅');
          this.router.navigateByUrl('/event');
          console.log('success');
        },
        (error) => {
          this.openSnackBar('Something wrong happen!', '⚠️');
          console.log('error');
        }
      );
  }

  // reset form
  resetForm(): void {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categorization: ['', Validators.required],
      organizers: [''],
      locations: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      timeFrom: [''],
      timeTo: [''],
      coverPicture: [''],
    });
  }

  // on select image
  onAttachFileChange(event: any): void {
    this.eventForm.controls['coverPicture'].setValue(event.target.files[0]);
    const cover = this.eventForm.controls['coverPicture'].setValue(
      event.target.files[0]
    );
    this.activityService.uploadCover(cover).subscribe((res: any) => {
      this.coverPicture = res.blob;
    });
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
