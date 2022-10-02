import { OrganizerService } from './../../../../shared/services/organizer.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

export interface Organizer {
  id: string;
  title: string;
  addresses: string;
  emails: string;
  phones: string;
  website: string;
  activity: string;
}

@Component({
  selector: 'app-organizer-list',
  templateUrl: './organizer-list.component.html',
  styleUrls: ['./organizer-list.component.scss'],
})
export class OrganizerListComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedColumns: string[] = [
    'title',
    'addresses',
    'email',
    'phones',
    'website',
    'activity',
    'update',
    'delete',
  ];
  dataSource: MatTableDataSource<Organizer> =
    new MatTableDataSource<Organizer>();

  organizers: any = [];

  constructor(
    private organizerService: OrganizerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
          addresses: data[i].properties['organizer:addresses'],
          emails: data[i].properties['organizer:emails'],
          phones: data[i].properties['organizer:phones'],
          website: data[i].properties['organizer:website'],
          activity: data[i].properties['organizer:organizationActivity'],
        });
      }
      // console.log(data);
      this.dataSource = this.organizers;
    });
  }

  // delete Organizer by id
  deleteOrganizer(id: any) {
    this.organizerService.deleteOrganizer(id).subscribe((res: any) => {
      this.dataSource.data = this.dataSource.data.filter(
        (o: Organizer) => o.id !== id
      );
      this.openSnackBar('Deleted Successfully!', '✅');
      console.log('error');
    });
    this.organizers = [];
    this.getAllOrganizers();
    this.cdr.detectChanges();
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
