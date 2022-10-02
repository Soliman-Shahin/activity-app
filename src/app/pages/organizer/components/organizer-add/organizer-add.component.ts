import { OrganizerService } from './../../../../shared/services/organizer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-organizer-add',
  templateUrl: './organizer-add.component.html',
  styleUrls: ['./organizer-add.component.scss'],
})
export class OrganizerAddComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  organizerForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    email: new FormControl(),
    email_label: new FormControl(),
    address: new FormControl(),
    address_label: new FormControl(),
    organizationActivity: new FormControl(),
    phone: new FormControl(),
    phone_label: new FormControl(),
    website: new FormControl(),
  });

  editMode: boolean = false;

  organizerId: any;

  organizer: any = [];

  saveOrganizer: any = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private organizerService: OrganizerService,
    private snackBar: MatSnackBar
  ) {
    this.organizerId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.resetForm();
    this.getOrganizer();
  }

  // get organizer data
  getOrganizer() {
    if (this.organizerId != null) {
      this.editMode = true;

      this.organizerService
        .getOrganizerById(this.organizerId)
        .subscribe((res: any) => {
          const data = res.properties;
          this.organizerForm.patchValue({
            id: res.uid,
            name: data['dc:title'],
            description: data['dc:description'],
            organizationActivity: data['organizer:organizationActivity'],
            website: data['organizer:website'],
            email_label: data['organizer:emails'][0].label,
            email: data['organizer:emails'][0].emailAddress,
            phone_label: data['organizer:phones'][0].label,
            phone: data['organizer:phones'][0].phoneNumber,
            address_label: data['organizer:addresses'][0].label,
            address: data['organizer:addresses'][0].address,
          });
        });
    } else {
      this.editMode = false;
    }
  }

  // save organizer
  createOrganizer() {
    this.saveOrganizer = {
      'dc:title': this.organizerForm.controls['name'].value,
      'dc:description': this.organizerForm.controls['description'].value,
      'organizer:name': this.organizerForm.controls['name'].value,
      'organizer:emails': [
        {
          label: this.organizerForm.controls['email_label'].value,
          emailAddress: this.organizerForm.controls['email'].value,
        },
      ],
      'organizer:addresses': [
        {
          label: this.organizerForm.controls['address_label'].value,
          address: this.organizerForm.controls['address'].value,
        },
      ],
      'organizer:organizationActivity':
        this.organizerForm.controls['organizationActivity'].value,
      'organizer:phones': [
        {
          label: this.organizerForm.controls['phone_label'].value,
          phoneNumber: this.organizerForm.controls['phone'].value,
        },
      ],
      'organizer:website': this.organizerForm.controls['website'].value,
    };
    this.organizerService.createOrganizer(this.saveOrganizer).subscribe(
      (res: any) => {
        this.openSnackBar('Data submitted successfully', '✅');
        this.router.navigateByUrl('/organizer');
        console.log('success');
      },
      (error) => {
        this.openSnackBar('Something wrong happen!', '⚠️');
        console.log('error');
      }
    );
  }

  // update organizer
  updateOrganizer() {
    this.saveOrganizer = {
      'dc:title': this.organizerForm.controls['name'].value,
      'dc:description': this.organizerForm.controls['description'].value,
      'organizer:name': this.organizerForm.controls['name'].value,
      'organizer:emails': [
        {
          label: this.organizerForm.controls['email_label'].value,
          emailAddress: this.organizerForm.controls['email'].value,
        },
      ],
      'organizer:addresses': [
        {
          label: this.organizerForm.controls['address_label'].value,
          address: this.organizerForm.controls['address'].value,
        },
      ],
      'organizer:organizationActivity':
        this.organizerForm.controls['organizationActivity'].value,
      'organizer:phones': [
        {
          label: this.organizerForm.controls['phone_label'].value,
          phoneNumber: this.organizerForm.controls['phone'].value,
        },
      ],
      'organizer:website': this.organizerForm.controls['website'].value,
    };
    this.organizerService
      .updateOrganizer(this.saveOrganizer, this.organizerId)
      .subscribe(
        (res: any) => {
          this.openSnackBar('Data submitted successfully', '✅');
          this.router.navigateByUrl('/organizer');
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
    this.organizerForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.required],
      email_label: ['', Validators.required],
      address: ['', Validators.required],
      address_label: ['', Validators.required],
      organizationActivity: ['', Validators.required],
      phone: ['', Validators.required],
      phone_label: ['', Validators.required],
      website: ['', Validators.required],
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
