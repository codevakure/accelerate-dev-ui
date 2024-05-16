import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../Services/authentication.service';
import 'rxjs/add/operator/do';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { AcquisitionService } from './acquisition.service';


@Injectable({
  providedIn: 'root'
})
export class CorsService {

  API_URL = environment.CORS;
  public idToken: string;

  constructor(private http: Http, 
    private auth: AuthenticationService,
    private ap: AcquisitionService) { }


  getCORSData(cors_id) {
      let headers = new Headers();
      var token = Cookie.get("hhs-a-token")
      headers.append("Authorization",`Bearer ${token}`);
      headers.append('Content-Type', 'application/json');
      //headers.append('Authorization', `${this.jwtToken}`);
      let options = new RequestOptions({ headers: headers });
      //console.log("called getFormData from forms.service",form_id);
      return this.http.get(`${this.API_URL}${cors_id}`, options)
        .map((response: Response) => response.json())
        .catch(this.handleError);
    }

    
  putCORSData(cors_id, data) {   
    this.ap.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('accept','*/*');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${this.API_URL}${cors_id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



    private handleError(error: Response) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
    }

}
