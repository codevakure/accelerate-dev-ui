

import { acquisition } from './../Models/acquisition.model';


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
import * as jwt_decode from "jwt-decode";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AcquisitionService {
  UNITED_URL = environment.UNITED_ENV;
  DOMAIN_URL = environment.DOMAIN_URL;
  AP_DAPP = environment.AP_DAPP;
  SOL_DAPP = environment.SOL_DAPP;
  AP_URL = environment.APS_URL;
  SOL_URL = environment.SOL_URL;
  NAICS = environment.NAICS;
  SOW = environment.SOW;
  IGCE = environment.IGCE;
  REQUISITION = environment.REQUISITION;
  EVAL_CRITERIA = environment.EVAL_CRITERIA;
  ESTIMATES = environment.ESTIMATES;
  COMATIBILITIES = environment.COMATIBILITIES;
  COMPETETIONS = environment.COMPETETIONS;
  CONSTRAINTS = environment.CONSTRAINTS;
  TRADEOFF = environment.TRADEOFF;
  AI_SVC = environment.AI_SVC;
  ATTACHMENT = environment.ATTACHMENT;
  PSC = environment.PSC;
  PROPOSAL_EVAL = environment.PROPOSAL_EVAL;
  EVALUATOR = environment.EVALUATOR;
  VENDORQA = environment.VENDORQA;
  SECTION508 = environment.SECTION508;
  SECURITY= environment.SECURITY;
  CONSIDERATION= environment.CONSIDERATION;
  AI_FEEDBACK = environment.AI_FEEDBACK;
  EVALUATION_VENDOR = environment.EVALUATION_VENDOR;


  userid;
  tokenRouter;
  public invokeEvent: Subject<any> = new Subject();
  public collabHeader: Subject<any> = new Subject();
  public routeHeader: Subject<any> = new Subject();
  public pageRefresh: Subject<any> = new Subject();
  public preview: Subject<any> = new Subject();
  public generalPageEvent: Subject<any> = new Subject();

  public idToken: string;
  authenticatedUser = this.auth.getAuthenticatedUser();

  constructor(
    private http: Http,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    var cookiesToken = Cookie.getAll();
    var checkToken = Cookie.get("hhs-a-token");
    if (this.route.snapshot.queryParams.token != undefined) {
      if (this.route.snapshot.queryParams.token == checkToken) {
      } else {
        checkToken = this.route.snapshot.queryParams.token;
      }
    }
    if (checkToken == "null" || checkToken == null) {
      this.tokenRouter = this.route.snapshot.queryParams.token;
      Cookie.set("hhs-a-token", this.tokenRouter);
    } else if (checkToken == "undefined" || checkToken == undefined) {
      this.tokenRouter = this.route.snapshot.queryParams.token;

      Cookie.set("hhs-a-token", this.tokenRouter);
    } else {
      Cookie.set("hhs-a-token", checkToken);
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  refreshToken() {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var expiry = decodedValue.exp;
    this.userid = decodedValue.pkId;
    var data = { pkId: this.userid };
    return this.http
      .post(`${this.UNITED_URL}/api/user/getUserByID`, data, options)
      .map((response: Response) => response.json())
      .subscribe(response => {
        //console.log("Response Token", response);
     //  console.log(this.getDecodedAccessToken(response.token))
       var decodedValue = this.getDecodedAccessToken(response.token)
       var current_time = new Date().getTime() / 1000;
      // console.log("Decoded Value",decodedValue);
       if (current_time > decodedValue.exp) { 
         //console.log("Token Expired");
       } else {
         //console.log("Token not expired");
       }
        if (tokenInformation == response.token) {
         // console.log("Same Token");
        } else {
         // console.log("Different Token");
          Cookie.delete("hhs-a-token");
          Cookie.set("hhs-a-token", response.token);
         // console.log(Cookie.get("hhs-a-token"));
        }
      });
  }

  getAcquisitions() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("Access-Control-Allow-Origin", "*");
    // headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // headers.append("Access-Control-Allow-Credentials", "true");
    // headers.append("Accept", "*/*");
    // headers.append("Cache-Control", "no-cache");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var currentuserid = decodedValue.pkId;
    return this.http
      // .get(
      //   `${this.AP_URL}?filter={%22where%22:{%22or%22:[{%22and%22:[{%22status%22:%22Draft%22},{%22createdUserid%22:%22${currentuserid}%22}]},{%22and%22:[{%22status%22:%22Shared%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Accepted%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Shared%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Accepted%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]}]}}`,
      //   options
      // )
            .get(
        `${this.AP_URL}/${currentuserid}/getApsByUserId`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getAPFull(ap_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.DOMAIN_URL}ap-dapp/ap/${ap_no}/apjson`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getTotal(section) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.DOMAIN_URL}${section}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSoldappapno(ap_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.DOMAIN_URL}sol-dapp/${ap_no}/getSolDappByApNo`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postApdapp(objAp) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.AP_DAPP}ap/create`, objAp, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAllusers() {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append(
    //   "Authorization",
    //   `Bearer 5ba97fc954fb5f46e6e57619381f22b0:952f28804c3b97eaac37c986559308f687e334227ffc8dfc`
    // );
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {roleNames:["Contracting Officer (CO)","Program Manager (PM)"]};
    return this.http
      .post(`${this.UNITED_URL}/jwt/user/listByActiveRoles`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getContractingRole() {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append(
    //   "Authorization",
    //   `Bearer 5ba97fc954fb5f46e6e57619381f22b0:952f28804c3b97eaac37c986559308f687e334227ffc8dfc`
    // );
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {roleName: "Contracting Officer (CO)"};
    return this.http
      .post(`${this.UNITED_URL}/jwt/user/listByRole`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getProgrammingRole() {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append(
    //   "Authorization",
    //   `Bearer 5ba97fc954fb5f46e6e57619381f22b0:952f28804c3b97eaac37c986559308f687e334227ffc8dfc`
    // );
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data =  { roleName: "Program Manager (PM)" };
    return this.http
      .post(`${this.UNITED_URL}/jwt/user/listByRole`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  

  getApdappids(sol_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AP_DAPP}${sol_no}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSolicitation(solId) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_URL}/${solId}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getsoldata(solnum) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}${solnum}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getfullsol(solnum) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}sol/${solnum}/soljson`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getfullammend(ammendnum){
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}${ammendnum}/amendmentJson`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);

  }

  publishAmend(ammendnum){
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Credentials", "true");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(`${this.SOL_DAPP}${ammendnum}/publishAmendment`,null ,options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getallNaics() {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.NAICS}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getNaics() {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    //headers.append('Authorization', `${this.jwtToken}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.NAICS}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  // function used to update the status of the soliciation
  patchSol(json, solid) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.SOL_URL}/${solid}`, json, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getsoldappids(ap_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}${ap_no}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getAmendmentdapp(amendment_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}amendmentDapp/${amendment_no}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSolicitations() {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var currentuserid = decodedValue.pkId;
    return this.http
      // .get(
      //   `${this.SOL_URL}?filter={%22where%22:{%22or%22:[{%22and%22:[{%22status%22:%22Published%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Initiated%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Published%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Published%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]}]}}`,
      //   options
      // )
      .get(
        `${this.SOL_URL}?filter={%22where%22:{%22or%22:[{%22and%22:[{%22status%22:%22Published%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Amendment%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Initiated%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Amendment%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Published%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Published%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]}]}}`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getContracts() {
    
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var currentuserid = decodedValue.pkId;
    return this.http
      .get(
        `${this.DOMAIN_URL}contract?filter= {"fields":{"id":"true","contract_no":"true",%20"projectTitle":"true"%20,%20%20"status":"true"%20}}&{%22where%22:{%22or%22:[{%22and%22:[{%22status%22:%22Generated%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Finalized%22},{%22pointsofContact%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Generated%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]},{%22and%22:[{%22status%22:%22Finalized%22},{%22sharedCollaborators%22:{%22inq%22:[%22${currentuserid}%22]}}]}]}}`,
        options
      )
      // .get(
      //   `${this.DOMAIN_URL}contract/${currentuserid}/getContractByUserId`,
      //   options
      // )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAcqnumber(ap_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      // .get(`${this.AP_URL}?filter[where][ap_no]=${ap_no}`, options)
      .get(`${this.AP_URL}/${ap_no}/getByApNo`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getApdata(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AP_URL}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  putApData(id, data) {
    this.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.AP_URL}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  putSolData(id, data) {
    this.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.SOL_URL}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  putContractData(id, data) {
    this.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.DOMAIN_URL}contract/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAcqid(form_id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AP_URL}${form_id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  InitiateAP(ap_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token")
    headers.append("Authorization",`Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    // var data = {
    //   "ap_no": ap_no,
    //   "status": "initiated",
    //   "description": description,
    //   "initaitedBy": "Imneet",
    // }
    return this.http
      .get(`${this.SOL_DAPP}ap/${ap_no}/initiateSol`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  acceptAP(ap_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("Accept", "*/*");
    // headers.append("Access-Control-Allow-Origin", "*");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
   // console.log("Headers for accept AP",headers);
    let options = new RequestOptions({ headers: headers });

    // var data = {
    //   "ap_no": ap_no,
    //   "status": "Accepted",
    //   "description": description,
    //   "initaitedBy": "Imneet",
    // }
    return this.http
      .put(`${this.AP_DAPP}ap/${ap_no}/acceptAp`,null, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  createAmmendment(sol_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
  //  headers.append("Access-Control-Allow-Origin", "*");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOL_DAPP}${sol_no}/createAmmendment`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



  publishAP(sol_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Credentials", "true");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(`${this.SOL_DAPP}${sol_no}/publishSol`,null, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getapdata(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AP_URL}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchSow(id, sow, cap) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: sow,
      description1: cap
    };
    return this.http
      .patch(`${this.SOW}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  patchSow1(id, cap) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description1: cap
    };
    return this.http
      .patch(`${this.SOW}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  patchSection508(id, section508) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: section508,
    };
    return this.http
      .patch(`${this.SECTION508}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSow(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SOW}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getSection508(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SECTION508}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  patchComments(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.DOMAIN_URL}collaborator/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postComments(ap_no, typeSection) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      ap_no: ap_no,
      typeSection: typeSection
    };
    return this.http
      .post(`${this.DOMAIN_URL}collaborator`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getComments(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.DOMAIN_URL}collaborator/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAcqcomments(ap_no, typeSection) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.DOMAIN_URL}collaborator?filter[where][and][0][ap_no]=${ap_no}&filter[where][and][1][typeSection]=${typeSection}`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchRequisition(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.REQUISITION}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getRequisition(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.REQUISITION}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchEvaluations(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.EVAL_CRITERIA}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getEvaluations(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.EVAL_CRITERIA}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchEstimates(id, estimates) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: estimates
    };
    return this.http
      .patch(`${this.ESTIMATES}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getEstimates(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.ESTIMATES}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchMR(id, sow, cap) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: sow,
      description1: cap
    };
    return this.http
      .patch(`${this.COMATIBILITIES}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getMR(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.COMATIBILITIES}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchCompetitions(id, competetion) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: competetion
    };
    return this.http
      .patch(`${this.COMPETETIONS}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getCompetitions(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.COMPETETIONS}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchConstraints(id, constraints) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = {
      description: constraints
    };
    return this.http
      .patch(`${this.CONSTRAINTS}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getConstraints(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.CONSTRAINTS}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchTradeoffs(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.TRADEOFF}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getTradeoffs(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.TRADEOFF}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return throwError(error.json().error || "Server error");
  }

  getSowsimilarai(solid) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
   // var data = { text: solid };
    return this.http
      //.post(`${this.AI_SVC}/searchSolicitations`, data, options)
      .get(`${this.AI_SVC}/searchSolicitations?search_string=${solid}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSowsimilaraidesc(acq_id) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
   // var data = { text: solid };
    return this.http
      //.post(`${this.AI_SVC}/searchSolicitations`, data, options)
      .get(`${this.AI_SVC}/descriptionByAcqId/${acq_id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getSowsimilarcontract(solid) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`)
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AI_SVC}/solicitation/${solid}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postFile(fileToUpload) {
    let headers = new Headers();
    
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Cache-Control", "no-cache");
    headers.append("Accept", "*/*");
    headers.append("Access-Control-Allow-Origin", `*/*`);

    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("params", JSON.stringify({ category: "aurotech" }));
    formData.append("file", fileToUpload);
    return this.http
      .post(`${this.UNITED_URL}/api/file/upload`, formData, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getFile(attachmentno) {
    let headers = new Headers();
    
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    options.responseType = ResponseContentType.Blob;
    var data;

    data = { pkId: attachmentno };

    return this.http.post(
      `${this.UNITED_URL}/api/file/download`,
      data,
      options
    );
    
  }

 

  deleteAttachment(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(`${this.ATTACHMENT}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  deleteQA(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(`${this.VENDORQA}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAttachments(ap_no, type) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.ATTACHMENT}/${ap_no}/${type}/getAttachmentsByApNoAndType`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getPsc(value) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.PSC}?filter[where][psc_notes]=${value}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchProposalevaluation(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.EVALUATION_VENDOR}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getAllpropsalevaluations(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.PROPOSAL_EVAL}/fulljson/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getPropsalevaluation(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.EVALUATION_VENDOR}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchEvaluator(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.EVALUATOR}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getEvaluator(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.EVALUATOR}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getUserprofile() {
    this.refreshToken();
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
  // console.log("Getting Token from the user service"+tokenInformation);
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;
    var data = { pkId: this.userid };
    return this.http
      .post(`${this.UNITED_URL}/api/user/getUserByID`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getrequestedtUser(userid) {
    let headers = new Headers();
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });
    var data = { pkId: `${userid}` };
    return this.http
      .post(`${this.UNITED_URL}/api/user/getUserByID`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchIGCE(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.IGCE}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getIGCE(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.IGCE}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postNotifications(data) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.DOMAIN_URL}notification`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  deleteNotification(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(`${this.DOMAIN_URL}notification/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getNotification(username) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .delete(`${this.DOMAIN_URL}notification/${username}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postAttnotifications(data) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.ATTACHMENT}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  
  postFeedback(data) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.AI_FEEDBACK}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getFeedbackdata(ap_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.AI_FEEDBACK}?filter[where][ap_no]=${ap_no}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  patchFeedback(id,data) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.AI_FEEDBACK}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAttnotifications(username) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.ATTACHMENT}/${username}/getAttachmentsByUserName`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }



  getCommentsDashboard(username) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.ATTACHMENT}?filter={"where":{"or":[{"and":[{"type":"Comment"},{"users":{"inq":["${username}"]}}]}]}}`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  // getProposalEval(sol_no) {
  //   let headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   var token = Cookie.get("hhs-a-token");
  //   headers.append("Authorization", `Bearer ${token}`);
  //   let options = new RequestOptions({ headers: headers });
  //   var data = { solNo: sol_no };
  //   return this.http
  //     .post(
  //       `${this.UNITED_URL}/api/rfis/findSubmittedResponsesBySolNo`,
  //       data,
  //       options
  //     )
  //     .map((response: Response) => response.json())
  //     .catch(this.handleError);
  // }

  getProposalEval(sol_no) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var data = { solNo: sol_no };
    return this.http
      .get(
        `${this.DOMAIN_URL}proposal-eval?filter[where][solNum]=${sol_no}&filter[where][vendorStatus]=Published`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getProposalEvalId(id) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
   // var data = { solNo: sol_no };
    return this.http
      .get(
        `${this.DOMAIN_URL}proposal-eval/${id}`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchProposalEval(id,data){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
   // var data = { solNo: sol_no };
    return this.http
      .patch(
        `${this.DOMAIN_URL}proposal-eval/${id}`,data,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getBlockchainres(dltId) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.DOMAIN_URL}bc-svc/asset/${dltId}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

 

  postAuroProposaleval(data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.PROPOSAL_EVAL}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  getAuroProposaleval(sol_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.PROPOSAL_EVAL}/${sol_no}/getProposalEvalByVendorIdAsSolNo`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAuroProposalevalhome(sol_no) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.PROPOSAL_EVAL}/${sol_no}/getProposalEvalBySolNo`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchAuroProposaleval(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.PROPOSAL_EVAL}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  postAuroVendoreval(data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.EVALUATION_VENDOR}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  getAuroVendoreval(volumeId) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.EVALUATION_VENDOR}/${volumeId}/getEvaluationByVolumeId`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getAuroVendorevalhome(vendorId) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        `${this.EVALUATION_VENDOR}/${vendorId}/getEvaluationByBlockchainIdAsVendorId`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  patchAuroVendoreval(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.EVALUATION_VENDOR}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getVendorqaQuestionsDash(email) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(
        ` ${this.VENDORQA}/${email}/getVendorQAbyEmail`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }


  getAcquisitionCount(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var currentuserid = decodedValue.pkId;
    return this.http
      .get(
        ` ${this.DOMAIN_URL}ap/${currentuserid}/getApMonthlyCountsByUser`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSolicitationCount(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
   
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    var currentuserid = decodedValue.pkId;
    return this.http
      .get(
        ` ${this.DOMAIN_URL}sol/${currentuserid}/getSolMonthlyCountsByUser`,
        options
      )
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }





  patchSecurity(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.SECURITY}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getSecurity(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.SECURITY}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }




  patchOtherConsiderations(id, data) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .patch(`${this.CONSIDERATION}/${id}`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  getOtherConsiderations(id) {
    this.refreshToken();
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .get(`${this.CONSIDERATION}/${id}`, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }




  postEmail(data) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var token = Cookie.get("hhs-a-token");
    headers.append("Authorization", `Bearer ${token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.DOMAIN_URL}notification/sendNotificationEmail`, data, options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
}
