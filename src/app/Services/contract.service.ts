import { AcquisitionService } from './acquisition.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../Services/authentication.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Cookie } from 'ng2-cookies/ng2-cookies';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  CONTRACT_APP_URL = environment.CONTRACT_DAPP;
  CONTRACT = environment.CONTRACT;
  public idToken: string;
 
  constructor(private http: Http, private auth: AuthenticationService, private ap: AcquisitionService) {
  }


  generateContract(con_no) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    //console.log("Generated Contract");
    return this.http.get(`${this.CONTRACT_APP_URL}${con_no}/generateContract`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getfullContract(con_no){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    //console.log("Generated Contract");
    return this.http.get(`${this.CONTRACT_APP_URL}${con_no}/getFullContract`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getcontract(cont_id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    //console.log("Found Contract");
    return this.http.get(`${this.CONTRACT}${cont_id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchcontract(cont_id,data){
    this.ap.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    //console.log("Found Contract");
    return this.http.patch(`${this.CONTRACT}${cont_id}`, data,options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || "Server error");
  }
}
