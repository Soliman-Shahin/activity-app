import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const Nuxeo = require('nuxeo');

let nuxeo = new Nuxeo({
  baseURL: 'http://35.153.66.52/nuxeo',
  auth: {
    method: 'bearerToken',
    token: localStorage.getItem('token'),
  },
  headers: {
    properties: '*',
  },
});
@Injectable({
  providedIn: 'root',
})
export class OrganizerService {
  constructor() {}

  // get organizers
  getAllOrganizers(): Observable<any> {
    return from(nuxeo.request('/search/pp/PP_Organizar/execute').get()).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // create new organizer
  createOrganizer(organizer: any): Observable<any> {
    return from(
      nuxeo
        .operation('/AC_UA_Organizer_Create')
        .context(organizer)
        .input('/')
        .execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // update new organizer
  updateOrganizer(organizer: any, uid: any): Observable<any> {
    return from(
      nuxeo
        .operation('/AC_UA_Organizer_Update')
        .context(organizer)
        .input(uid)
        .execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // get organizer data
  getOrganizerById(uid: any): Observable<any> {
    return from(nuxeo.request(`/id/${uid}`).get()).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // delete Organizer by id
  deleteOrganizer(uid: any): Observable<any> {
    return from(
      nuxeo.operation('/AC_UA_Organizer_Delete').input(uid).execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
