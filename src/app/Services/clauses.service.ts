
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from '../Services/authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { RoleGuard } from './role-guard.service';
import { Cookie } from "ng2-cookies/ng2-cookies";
import {AcquisitionService} from "../Services/acquisition.service"

@Injectable({
  providedIn: 'root'
})
export class ClausesService {
  CLAUSE_URL = "https://f6gya0fk6k.execute-api.us-east-1.amazonaws.com/dev/fetch-index-all";
  CLAUSE_DESC_URL = environment.CLAUSE_DESC_URL;
  CLAUSE_ALL_URL = "https://f6gya0fk6k.execute-api.us-east-1.amazonaws.com/dev/fetch-score-all";

  API_URL = environment.APS_URL;
  DOMAIN_URL = environment.DOMAIN_URL;
  public idToken: string;

  constructor(private http: Http, private auth: AuthenticationService,
    private ap: AcquisitionService) {

  }


  getClauses(sow_text) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    var data = { "contract_purpose1": "CI", "contract_purpose2": "SER", "text": sow_text, }
    let options = new RequestOptions({ headers: headers });
      return this.http.post(`${this.CLAUSE_URL}`, data, options) 
        .map((response: Response) => response.json())
        .catch(this.handleError);
  }

  getClauseDesc(id,alt) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return   this.http.get(`${this.CLAUSE_DESC_URL}${id}?alt=${alt}`,options)
       .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAllClauses() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = { "keywords": [], "text": "Prohibition on Contracting with Inverted Domestic Corporations", }
    return this.http.post(`${this.CLAUSE_ALL_URL}`, data,options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }


  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
