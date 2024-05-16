import { AcquisitionService } from './acquisition.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../Services/authentication.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  API_URL = environment.SECTIONS_URL;
  DOMAIN_URL = environment.DOMAIN_URL;
  public idToken: string;


  constructor(private http: Http, private auth: AuthenticationService, private ap: AcquisitionService) {

  }

  getSectionData(section_id){
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
      return this.http.get(`${this.API_URL}${section_id}`, options)    
      .map((response: Response) => response.json())
      .catch(this.handleError);
    }

  updateSectionData(section_id,section_data){
    this.ap.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    var data = {"SectionText": section_data}
    return this.http.patch(`${this.API_URL}${section_id}`,data, options) 
    .map((response: Response) => response.json())
    .catch(this.handleError);
  }


  
  patchSections(id,sectionname,sectiondata) {
    this.ap.refreshToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      "description": sectiondata,
    }
    return this.http.patch(`${this.DOMAIN_URL}${sectionname}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchSectionsChanges(id,sectionname,sectiondata) {
    this.ap.refreshToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${this.DOMAIN_URL}${sectionname}/${id}`, sectiondata, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchclauses(id,sectionname,data) {
    this.ap.refreshToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${this.DOMAIN_URL}${sectionname}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



  
  getSections(id,sectionname) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    //console.log(sectionname);
    return this.http.get(`${this.DOMAIN_URL}${sectionname}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
