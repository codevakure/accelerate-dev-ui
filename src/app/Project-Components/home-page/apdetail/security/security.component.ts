import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from "@ng-select/ng-select";
import { IfStmt } from "@angular/compiler";
import { Cookie } from "ng2-cookies/ng2-cookies";
import * as jwt_decode from "jwt-decode";
declare var $: any;

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.css"]
})
export class SecurityComponent implements OnInit {
  security;
  far7105b18 = "Security Considerations*";
  far7105b182 =
    "Contractor Facility Access and Identity Verification Security Considerations";
  securityConsiderationss: boolean = false;
  getapno;
  apdata;
  productService;
  status;
  id;
  userid;
  category;
  userexists;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;

    this.security = new FormGroup({
      securityConsiderations: new FormControl(""),
      securityConsiderationsText: new FormControl(""),
      contractorFacility: new FormControl(""),
      informationSecurity: new FormControl(""),
      informationSecurity1: new FormControl(""),
      informationSecurity2: new FormControl(""),
      informationSecurity3: new FormControl(""),
      informationSecurity4: new FormControl(""),
      classifiedMatters: new FormControl(""),
      informationTechnology: new FormControl(""),
      optionFFP: new FormControl(""),
    });


    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId


    this.getSecurity();
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  securityConsiderationsYes() {
    this.securityConsiderationss = true;
  }

  securityConsiderationsNo() {
    this.securityConsiderationss = false;
  }

  onChange(security) {
    console.log(security.value);
    this.ap.patchSecurity(this.id, security.value).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Error Occured", "Server Error", {
            timeOut: 2000
          })
        );
      } else {
       // console.log("Updated Successfully");
      }
    });
  }
  getSecurity() {
    console.log("apnumber", this.getapno);
    this.ap.getApdappids(this.getapno).subscribe(response1 => {
      console.log("ID", response1)
      this.ap.getApdata(response1.apId).subscribe(response2 => {
        this.apdata = response2;
        this.productService = this.apdata.productService;
        this.category = this.apdata.categoryManagement;
        console.log("apdata", this.apdata);
        this.status = response2.status;
        this.userexists = response2.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status == 'Initiated' || this.status == 'Published') {
          this.security.get("securityConsiderations").disable();
          this.security.get("securityConsiderationsText").disable();
          this.security.get("contractorFacility").disable();
          this.security.get("informationSecurity").disable();
          this.security.get("informationSecurity1").disable();
          this.security.get("informationSecurity2").disable();
          this.security.get("informationSecurity3").disable();
          this.security.get("informationSecurity4").disable();
          this.security.get("classifiedMatters").disable();
          this.security.get("informationTechnology").disable();
          this.security.get("optionFFP").disable();
        }



        this.id = response1.securityId;
        this.ap.getSecurity(this.id).subscribe(response => {
          console.log("IGCE Description", response);
          if((response.informationSecurity || response.informationSecurity1 || response.informationSecurity2 || response.informationSecurity3 || response.informationSecurity4 || response.securityConsiderations) == "Yes"){
            this.securityConsiderationss = true;
          }
  
          if(this.category == 'Medical' && this.productService == 'sup'){
          
            this.security.get("securityConsiderations").setValue(response.securityConsiderations);
            this.security.get("securityConsiderationsText").setValue(response.securityConsiderationsText);
            this.security.get("contractorFacility").setValue("N/A");
        //    this.security.get("contractorFacility").disable();
            this.security.get("informationSecurity").setValue(response.informationSecurity);
            this.security.get("informationSecurity1").setValue(response.informationSecurity1);
            this.security.get("informationSecurity2").setValue(response.informationSecurity2);
            this.security.get("informationSecurity3").setValue(response.informationSecurity3);
            this.security.get("informationSecurity4").setValue(response.informationSecurity4);
            this.security.get("classifiedMatters").setValue(response.classifiedMatters);
            this.security.get("informationTechnology").setValue(response.informationTechnology);
            this.security.get("optionFFP").setValue(response.optionFFP);
          }else if((this.productService != "sup" || this.category != "Medical") && response.contractorFacility == "N/A") {
            this.security.get("securityConsiderations").setValue(response.securityConsiderations);
            this.security.get("securityConsiderationsText").setValue(response.securityConsiderationsText);
            this.security.get("contractorFacility").setValue("");
        //    this.security.get("contractorFacility").disable();
            this.security.get("informationSecurity").setValue(response.informationSecurity);
            this.security.get("informationSecurity1").setValue(response.informationSecurity1);
            this.security.get("informationSecurity2").setValue(response.informationSecurity2);
            this.security.get("informationSecurity3").setValue(response.informationSecurity3);
            this.security.get("informationSecurity4").setValue(response.informationSecurity4);
            this.security.get("classifiedMatters").setValue(response.classifiedMatters);
            this.security.get("informationTechnology").setValue(response.informationTechnology);
            this.security.get("optionFFP").setValue(response.optionFFP);
          } else {
          
            this.security.get("securityConsiderations").setValue(response.securityConsiderations);
            this.security.get("securityConsiderationsText").setValue(response.securityConsiderationsText);
            this.security.get("contractorFacility").setValue(response.contractorFacility);
            this.security.get("informationSecurity").setValue(response.informationSecurity);
            this.security.get("informationSecurity1").setValue(response.informationSecurity1);
            this.security.get("informationSecurity2").setValue(response.informationSecurity2);
            this.security.get("informationSecurity3").setValue(response.informationSecurity3);
            this.security.get("informationSecurity4").setValue(response.informationSecurity4);
            this.security.get("classifiedMatters").setValue(response.classifiedMatters);
            this.security.get("informationTechnology").setValue(response.informationTechnology);
            this.security.get("optionFFP").setValue(response.optionFFP);
          }

        });
      });

    });
  }
}
