import { AppInfoService } from './app-info.service';
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
export class ActivityService {
  token: any;

  constructor(private _appInfoService: AppInfoService) {
    this.token = this._appInfoService.currentToken.getValue();
    console.log('token:', this.token);
  }

  // get all activities
  getActivities(): Observable<any> {
    return from(
      nuxeo
        .request('/search/pp/PP_Activity/execute')
        .queryParams({ pageSize: 100 })
        .get()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // get activity data
  getActivityById(uid: any): Observable<any> {
    return from(nuxeo.request(`/id/${uid}`).get()).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // get activity images
  getActivityDetails(uid: any): Observable<any> {
    return from(
      nuxeo
        .request('/search/pp/PP_ActivityDAM/execute')
        .queryParams({ id: uid })
        .get()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // get activity images
  getImages(uid: any): Observable<any> {
    return from(
      nuxeo
        .request('/search/pp/PP_ActivityDAM/execute')
        .queryParams({
          pageProvider: 'PP_ActivityDAM',
          collectionMember_collectionIds: `["${uid}"]`,
          pageSize: 35,
          currentPageIndex: 0,
        })
        .get()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // create new activity
  createActivity(activity: any): Observable<any> {
    return from(
      nuxeo.operation('/AC_UA_Activity_Create').context(activity).execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // upload activity cover picture
  uploadCover(file: any): Observable<any> {
    return from(nuxeo.batchUpload('/upload').upload({ file })).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // update new activity
  updateActivity(activity: any, uid: any): Observable<any> {
    return from(
      nuxeo
        .operation('/AC_UA_Activity_Update')
        .context(activity)
        .input(uid)
        .execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }

  // delete activity by id
  deleteActivity(uid: any): Observable<any> {
    return from(
      nuxeo.operation('/AC_UA_Activity_Delete').input(uid).execute()
    ).pipe(
      catchError((err) => {
        throw err;
      })
    );
  }
}
