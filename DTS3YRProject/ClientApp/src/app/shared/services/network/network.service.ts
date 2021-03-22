import { Injectable } from '@angular/core';
import { LoggerService } from '../logger/logger.service';
import { ILogger } from '../../types/logger-type';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private log: ILogger;
  private baseHref: string;

  OPENVIDU_SERVER_URL = 'https://' + location.hostname + ':4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  constructor(private http: HttpClient, private loggerSrv: LoggerService) {
    this.log = this.loggerSrv.get('NetworkService');
    this.baseHref = '/' + (!!window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] + '/' : '');
  }

  async getToken(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
    if (!!openviduServerUrl && !!openviduSecret) {
      const _sessionId = await this.createSession(sessionId, openviduServerUrl, openviduSecret);
      return await this.createToken(_sessionId, openviduServerUrl, openviduSecret);
    }
    try {
      this.log.d('Getting token from backend');

      //return await this.http.post<any>(this.baseHref + 'api/session', { sessionId }).toPromise();

      return this.createSession(sessionId, openviduServerUrl, openviduSecret).then(
        sessionId => {
          return this.createToken(sessionId, openviduServerUrl, openviduSecret);
        })
    } catch (error) {
      if (error.status === 404) {
        throw { status: error.status, message: 'Cannot connect with backend. ' + error.url + ' not found' };
      }
      throw error;
    }
  }

  //createSession(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
  //  return new Promise((resolve, reject) => {
  //    const body = JSON.stringify({ customSessionId: sessionId });
  //    const options = {
  //      headers: new HttpHeaders({
  //        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
  //        'Content-Type': 'application/json'
  //      })
  //    };
  //    return this.http
  //      .post<any>(openviduServerUrl + '/openvidu/api/sessions', body, options)
  //      .pipe(
  //        catchError(error => {
  //          if (error.status === 409) {
  //            resolve(sessionId);
  //          }
  //          if (error.statusText === 'Unknown Error') {
  //            reject({ status: 401, message: 'ERR_CERT_AUTHORITY_INVALID' });
  //          }
  //          return observableThrowError(error);
  //        })
  //      )
  //      .subscribe(response => {
  //        resolve(response.id);
  //      });
  //  });
  //}

  //createToken(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
  //  return new Promise((resolve, reject) => {
  //    const body = JSON.stringify({});
  //    const options = {
  //      headers: new HttpHeaders({
  //        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
  //        'Content-Type': 'application/json'
  //      })
  //    };
  //    return this.http
  //      .post<any>(openviduServerUrl + '/openvidu/api/sessions/' + sessionId + '/connection', body, options)
  //      .pipe(
  //        catchError(error => {
  //          reject(error);
  //          return observableThrowError(error);
  //        })
  //      )
  //      .subscribe(response => {
  //        this.log.d(response);
  //        resolve(response.token);
  //      });
  //  });
  //}

  createSession(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
    return new Promise((resolve, reject) => {

      const body = JSON.stringify({ customSessionId: sessionId });
      const options = {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json'
        })
      };
      return this.http.post(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions', body, options)
        .pipe(
          catchError(error => {
            if (error.status === 409) {
              resolve(sessionId);
            } else {
              console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + this.OPENVIDU_SERVER_URL);
              if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + this.OPENVIDU_SERVER_URL +
                '\"\n\nClick OK to navigate and accept it. If no certificate warning is shown, then check that your OpenVidu Server' +
                'is up and running at "' + this.OPENVIDU_SERVER_URL + '"')) {
                location.assign(this.OPENVIDU_SERVER_URL + '/accept-certificate');
              }
            }
            return observableThrowError(error);
          })
        )
        .subscribe(response => {
          console.log(response);
          resolve(response['id']);
        });
    });
  }

  createToken(sessionId: string, openviduServerUrl: string, openviduSecret: string): Promise<string> {
    return new Promise((resolve, reject) => {

      const body = {};
      const options = {
        headers: new HttpHeaders({
          'Authorization': 'Basic ' + btoa('OPENVIDUAPP:' + this.OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json'
        })
      };
      return this.http.post(this.OPENVIDU_SERVER_URL + '/openvidu/api/sessions/' + sessionId + '/connection', body, options)
        .pipe(
          catchError(error => {
            reject(error);
            return observableThrowError(error);
          })
        )
        .subscribe(response => {
          console.log(response);
          resolve(response['token']);
        });
    });
  }
}
