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
  selector: 'app-other-considerations',
  templateUrl: './other-considerations.component.html',
  styleUrls: ['./other-considerations.component.css']
})
export class OtherConsiderationsComponent implements OnInit {

  otherConsiderations;
  getapno;
  id;
  apdata;
  productService;
  status;
  pmFilter;
  category;
  far7105b19="Contract Administration";
  specialcontractingmethod = [
    { full: "Interagency Acquisitions", Acronym: "IA" },
    { full: "Leader Company Contracting", Acronym: "LOC" },
    { full: "Management and Operating Contracts", Acronym: "MOC" },
    { full: "Multi-year Contracting", Acronym: "MYC" },
    { full: "Options", Acronym: "Options" },
  ];
  far7105a6="Trade-Offs";
  far7105b211="Major Components or Subsystems Competition";
  far7105b9="Contractor versus Government Performance Consideration ";
  far7105b12="Make or Buy";
  far7105b20="Other Considerations";
  far7105b17="Other Considerations";
  far7105b144="";
  far7105b142="";
  far7105b141="";
  userid;
  userexists;
  apid;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    this.getCO();
    this.getapno = this.route.snapshot.parent.params.apid;

    this.otherConsiderations = new FormGroup({
      proposedCOR: new FormControl(""),
      tradeOff: new FormControl(""),
      majorComponents: new FormControl(""),
      govtPerformance: new FormControl(""),
      makeBuy: new FormControl(""),
      priorities: new FormControl(""),
      testEvaluation: new FormControl(""),
      contractorData: new FormControl(""),
      contractorAgency: new FormControl(""),
      assuranceRequirements: new FormControl(""),
      standardizationConcepts: new FormControl(""),
      conservationObjectives: new FormControl(""),
      otherConsiderations: new FormControl(""),
    });

    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId

    this.getOther();
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }


  onChange(other) {
    console.log(other.value);
    this.ap.patchOtherConsiderations(this.id, other.value).subscribe(response => {
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

  getOther(){
    console.log("apnumber", this.getapno);
    this.ap.getApdappids(this.getapno).subscribe(response1 => {
      console.log("ID", response1)
      this.apid = response1.apId;
      this.ap.getApdata(response1.apId).subscribe(response2 => {
        this.apdata = response2;
        this.productService = this.apdata.productService;
        this.category = this.apdata.categoryManagement;
        console.log("apdata", this.apdata);
        this.status = response2.status;
        this.userexists = response2.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status == 'Initiated' || this.status == 'Published') {
          this.otherConsiderations.get("proposedCOR").disable();
          this.otherConsiderations.get("tradeOff").disable();
          this.otherConsiderations.get("majorComponents").disable();
          this.otherConsiderations.get("govtPerformance").disable();
          this.otherConsiderations.get("makeBuy").disable();
          this.otherConsiderations.get("priorities").disable();
          this.otherConsiderations.get("testEvaluation").disable();
          this.otherConsiderations.get("contractorData").disable();
          this.otherConsiderations.get("contractorAgency").disable();
          this.otherConsiderations.get("assuranceRequirements").disable();
          this.otherConsiderations.get("standardizationConcepts").disable();
          this.otherConsiderations.get("conservationObjectives").disable();
          this.otherConsiderations.get("otherConsiderations").disable();
        }


        this.id = response1.considerationId;
      this.ap.getOtherConsiderations(this.id).subscribe(response => {
        console.log("Other Considerations", response);

        if(this.category == 'Medical' && this.productService == 'sup'){
          this.otherConsiderations.get("proposedCOR").setValue(response.proposedCOR);
          this.otherConsiderations.get("tradeOff").setValue("N/A");
         // this.otherConsiderations.get("tradeOff").disable();
          this.otherConsiderations.get("majorComponents").setValue("N/A");
        //  this.otherConsiderations.get("majorComponents").disable();
          this.otherConsiderations.get("priorities").setValue("N/A");
        //  this.otherConsiderations.get("priorities").disable();
          this.otherConsiderations.get("makeBuy").setValue("N/A");
         // this.otherConsiderations.get("makeBuy").disable();
          this.otherConsiderations.get("otherConsiderations").setValue("N/A");
        //  this.otherConsiderations.get("otherConsiderations").disable();
          this.otherConsiderations.get("govtPerformance").setValue("N/A");
         // this.otherConsiderations.get("govtPerformance").disable();
 
          this.otherConsiderations.get("testEvaluation").setValue("N/A");
          this.otherConsiderations.get("contractorData").setValue("N/A");
          this.otherConsiderations.get("contractorAgency").setValue("N/A");
          this.otherConsiderations.get("assuranceRequirements").setValue("N/A");
          this.otherConsiderations.get("standardizationConcepts").setValue("N/A");
          this.otherConsiderations.get("conservationObjectives").setValue("N/A");

        } else if((this.productService != "sup" || this.category != "Medical") && response.tradeOff == "N/A"){
          this.otherConsiderations.get("proposedCOR").setValue(response.proposedCOR);
          this.otherConsiderations.get("tradeOff").setValue("");
         // this.otherConsiderations.get("tradeOff").disable();
          this.otherConsiderations.get("majorComponents").setValue("");
        //  this.otherConsiderations.get("majorComponents").disable();
          this.otherConsiderations.get("priorities").setValue("");
        //  this.otherConsiderations.get("priorities").disable();
          this.otherConsiderations.get("makeBuy").setValue("");
         // this.otherConsiderations.get("makeBuy").disable();
          this.otherConsiderations.get("otherConsiderations").setValue("");
        //  this.otherConsiderations.get("otherConsiderations").disable();
          this.otherConsiderations.get("govtPerformance").setValue("");
         // this.otherConsiderations.get("govtPerformance").disable();
 
          this.otherConsiderations.get("testEvaluation").setValue("");
          this.otherConsiderations.get("contractorData").setValue("");
          this.otherConsiderations.get("contractorAgency").setValue("");
          this.otherConsiderations.get("assuranceRequirements").setValue("");
          this.otherConsiderations.get("standardizationConcepts").setValue("");
          this.otherConsiderations.get("conservationObjectives").setValue("");
        } else {
          this.otherConsiderations.get("proposedCOR").setValue(response.proposedCOR);
          this.otherConsiderations.get("tradeOff").setValue(response.tradeOff);
          this.otherConsiderations.get("majorComponents").setValue(response.majorComponents);
          this.otherConsiderations.get("govtPerformance").setValue(response.govtPerformance);
          this.otherConsiderations.get("makeBuy").setValue(response.makeBuy);
          this.otherConsiderations.get("priorities").setValue(response.priorities);
          this.otherConsiderations.get("testEvaluation").setValue(response.testEvaluation);
          this.otherConsiderations.get("contractorData").setValue(response.contractorData);
          this.otherConsiderations.get("contractorAgency").setValue(response.contractorAgency);
          this.otherConsiderations.get("assuranceRequirements").setValue(response.assuranceRequirements);
          this.otherConsiderations.get("standardizationConcepts").setValue(response.standardizationConcepts);
          this.otherConsiderations.get("conservationObjectives").setValue(response.conservationObjectives);
          this.otherConsiderations.get("otherConsiderations").setValue(response.otherConsiderations);
        }


      });

      });

    });



  }


  getCO() {
    this.ap.getProgrammingRole().subscribe(response => {
      this.pmFilter = response.results;

      this.pmFilter.map(i => {
        if(i.firstName == 'Not') {
          var fullName = i.email.split('@')[0].split('.');
          var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
          var emailUser = firstName;
          i.fullCode = emailUser;
          return i;
        } else if(i.firstName != 'Not')
          i.fullCode = i.firstName + " " + i.lastName;
          return i;
      });
      ////console.log(this.coFilter);
    });
  }

  updateClick() {
    console.log(this.otherConsiderations.get("proposedCOR").value);
    var data = {
      similarContract: this.otherConsiderations.get("proposedCOR").value
    }
    this.ap.putApData(this.apid, data).subscribe(response => {
      console.log("Updated");
    });
    setTimeout(() => {
      this.onChange(this.otherConsiderations);
    }, 300);
  }
}
