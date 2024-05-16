import { AcquisitionService } from './acquisition.service';
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

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  API_URL = environment.FORMS_URL;
  public idToken: string;

 

  constructor(private http: Http, 
    private auth: AuthenticationService, 
    private ap: AcquisitionService) {

  }

  getFormData(form_id) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    //console.log("called getFormData from forms.service",form_id);
    console.warn(`${this.API_URL}${form_id}`)
    return this.http.get(`${this.API_URL}${form_id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  putFormData(form_id, data) {   
   // this.ap.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('accept','*/*');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${this.API_URL}${form_id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  
  // Syntax: updatesection(String: htmlobjectid/jsonkeyid , JSON: form)
  // htmlobjectid names must match the jsonkeyid
  updatesection(section,soldata) {
   
    //console.log(soldata);
   // this.ap.refreshToken();
    // iterate over all the keys to locate the parsed section id
    $.each(soldata,function(index){
      //get data for each overview section
      var parent = eval('this.'+section);
      var parentid=parent.parentid;
      if(section =='sc_dropdown' ){
      console.log(parentid,parent)
      }
      var parentelem=$(parent.elem);
      var style = parent.style;
      var parClass= parent.class;
      parentelem.attr({"style":style,"id":parentid,"class":parClass});
      //Script to pull the insert elements
      $.each(parent.insert,function(index){
        //  //console.log(parent.insert[index]);
          
          //Script to verify if the element has objects to insert
          if(this.insert){
            var elemid=this.id;
            var child = $(this.elem);
            var style= this.style;
            var elemclass = this.class;
            child.attr({"id":elemid,"style":style,"class":elemclass});
            //console.log(child);
              $.each(this.insert,function(index){
                var elemid=this.id;
                var elem = $(this.elem);
                var style= this.style;
                var elemclass = this.class;
                elem.attr({"id":elemid,"style":style,"class":elemclass});
                child.append(elem);
                if(this.click){
                  // elem.addEventListener("click",this.click)
                  // elem.attr('(click)',this.click);
                 }
              });
            
            parentelem.append(child); 
          }else{
          var elemid=this.id;
          var elem = $(this.elem);
          var style= this.style;
          var elemclass = this.class;
          elem.attr({"id":elemid,"style":style,"class":elemclass});
          if(this.click){
           // elem.addEventListener("click",this.click)
           //elem.attr('onclick',this.click);
           elem.get(0).onclick = function(){
             eval(this.click)
           }
         // elem.on('click',eval(this.click))

          }
          parentelem.append(elem);
          }
          
  
      });
      $("#"+section).append(parentelem);
    })
  }

  updatepdff(variable) {
    //this.ap.refreshToken();
   // return variable
      eval('this.'+variable);
      return eval('this.'+variable) ;
  }

  change(variable,value) {
    eval('this.'+variable +"="+value) ;
  }

  patchform(formurl, data) {
    this.ap.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    headers.append('Content-Type', 'application/json');
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(formurl, data,options)
      .map((response: Response) => alert(response.json())
      
      ).catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
