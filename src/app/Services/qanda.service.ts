import { AcquisitionService } from './acquisition.service';
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  Http,
  Response,
  Headers,
  RequestOptions,
  ResponseContentType
} from "@angular/http";
import {
  HttpClient,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType
} from "@angular/common/http";
import { AuthenticationService } from "../Services/authentication.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class QandaService {

  VENDORQA = environment.VENDORQA;
  DOMAIN_URL = environment.DOMAIN_URL
  public idToken: string;
  authenticatedUser = this.auth.getAuthenticatedUser();

  constructor(private http: Http, private auth: AuthenticationService, private ap: AcquisitionService) { 

  }

  getqanda(sol_no){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    console.log(`${this.VENDORQA}?filter[where][vendorSubmitStatus]=Published&filter[where][sol_no]=${sol_no}`);
    return this.http
      .get(`${this.VENDORQA}?filter[where][vendorSubmitStatus]=Published&filter[where][sol_no]=${sol_no}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  patchqanda(sol_no,data){
    this.ap.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.VENDORQA}/${sol_no}`,data,options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



}
