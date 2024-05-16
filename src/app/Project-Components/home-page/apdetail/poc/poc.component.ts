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
import { environment } from "../../../../../environments/environment";
declare var $: any;

@Component({
  selector: "app-poc",
  templateUrl: "./poc.component.html",
  styleUrls: ["../general/general.component.css"]
})
export class PocComponent implements OnInit {
  emailUsers;
  getapno;
  authenticatedUser;
  usercommentsname;
  role;
  projectGeneral;
  DOMAIN_URL = environment.UNITED_ENV;
  data: any[] = [];
  userid;
  f;
  id1;
  apdata;
  status;
  productService;
  userexists;
  ffp;
  collabadata;
  collaborateUsers;
  coFilter;
  firstname;

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
    console.log(this.getapno);
    this.ap.getUserprofile().subscribe(response => {
      ////console.log(response);
      this.authenticatedUser = response.firstName;
      console.log("First Name of the user", this.authenticatedUser);
      var fullName = response.email.split("@  ")[0].split(".");
      var firstName =
        fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName =
        fullName[fullName.length - 1].charAt(0).toUpperCase() +
        fullName[fullName.length - 1].slice(1);
      this.emailUsers = firstName + " " + lastName;
      if (response.firstName == "Not") {
        this.usercommentsname = firstName;
      } else {
        this.usercommentsname = response.firstName;
      }
      // this.userid = response.pkId;
      if (response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer";
        //console.log("Logged in as CO");
      } else if (response.roles[0].roleName == "Program Manager (PM)") {
        this.role = "Program Officer";
        //console.log("Logged in as PM");
      }
    });

    this.projectGeneral = new FormGroup({
      contractingmethod: new FormControl(""),
      projectTitle: new FormControl(""),
      technicalHistory: new FormControl(""),
      statementofNeed: new FormControl(""),
      backgroundStatement: new FormControl(""),
      productService: new FormControl(""),
      serverable: new FormControl(""),
      categoryManagement: new FormControl(""),
      estimatedBudgett: new FormControl(""),
      naicscode: new FormControl(""),
      catalogue: new FormControl(""),
      popstartDate: new FormControl(""),
      popendDate: new FormControl(""),
      anticipatedPop: new FormControl(""),
      method_of_solicitation: new FormControl(""),
      proposedAction: new FormControl(""),
      unrestricted: new FormControl(""),
      setAside: new FormControl(""),
      percent: new FormControl(""),
      eightA: new FormControl(""),
      SDVOB: new FormControl(""),
      smallBusiness: new FormControl(""),
      EDWOSB: new FormControl(""),
      hubzoneSB: new FormControl(""),
      womenSB: new FormControl(""),
      noncomoption1: new FormControl(""),
      noncomoption2: new FormControl(""),
      noncomoption3: new FormControl(""),
      noncomoption4: new FormControl(""),
      noncomoption5: new FormControl(""),
      noncomoption6: new FormControl(""),
      acqAlternative: new FormControl(""),
      smallBusines: new FormControl(""),
      Bundling: new FormControl(""),
      contractVehicle: new FormControl(""),
      contractType: new FormControl(""),
      awardType: new FormControl(""),
      coName: new FormControl(""),
      coAddress: new FormControl(""),
      coPhone: new FormControl(""),
      coEmail: new FormControl(""),
      coOfficecode: new FormControl(""),
      coOfficeName: new FormControl(""),
      rName: new FormControl(""),
      rAddress: new FormControl(""),
      rPhone: new FormControl(""),
      rEmail: new FormControl(""),
      baName: new FormControl(""),
      baAddress: new FormControl(""),
      baPhone: new FormControl(""),
      baEmail: new FormControl(""),
      contractOfficer: new FormControl(""),
      dateModified: new FormControl(""),
      userModified: new FormControl(""),
      selection: new FormControl(""),
      contractNumber: new FormControl(""),
      productorService: new FormControl(""),
      existingContract: new FormControl(""),
      inputService: new FormControl(""),
      typeofWork: new FormControl(""),
      requirementsType: new FormControl(""),
      acqConsideration: new FormControl(""),
      capabilityPerformance: new FormControl(""),
      acqMethod: new FormControl(""),
      performanceApproach: new FormControl(""),
      bundlingDetermination: new FormControl(""),
      productkind: new FormControl(""),
      servicekind: new FormControl(""),
      similarNumber: new FormControl(""),
      similarContract: new FormControl(""),
      selection1: new FormControl(""),
      itornonit: new FormControl("IT"),
      description: new FormControl(""),
      createdUser: new FormControl(""),
      status: new FormControl(""),
      productKind: new FormControl(""),
      serviceKind: new FormControl(""),
      Source: new FormControl(""),
      SimplifiedAcquisition: new FormControl(""),
      performanceBased: new FormControl(""),
      clearValue: new FormControl(""),

      specialcontractingmethod: new FormControl(""),
      idiq: new FormControl(""),
      optionFFP: new FormControl(""),
      subcontractCompetition: new FormControl(""),
      uniqueSolicitationClauses: new FormControl(""),
      organizationalConflict: new FormControl(""),
      severability: new FormControl(""),
      performanceBasedAcq: new FormControl(""),
      performanceBasedTextArea: new FormControl(""),
      constraints: new FormControl(""),
      compatibility: new FormControl(""),
      spareParts: new FormControl(""),
      leasePurchase: new FormControl(""),
      governmentFurnishedProperty: new FormControl(""),
      governmentFurnishedInformation: new FormControl(""),
      managementInformationRequirements: new FormControl(""),
      igce2textarea: new FormControl(""),
      igce2: new FormControl(""),
      igce1: new FormControl(""),
      igce3textarea: new FormControl(""),
      igce3: new FormControl(""),
      securityConsiderationsText: new FormControl(""),
      sharedCollaborators: this.fb.array([]),
      corNominationUsers: this.fb.array([]),
      pointsofContact: this.fb.array([]),
      collaborators: new FormArray([
      
      ]),
      commentMention: new FormArray([
        
      ])
    });

    this.projectGeneral.get("commentMention").valueChanges.subscribe(values => {
      // //console.log(values);
      this.data = values;
      ////console.log(this.data)
      this.ap.invokeEvent.next(this.data);
    });

    this.getAp();
    this.getCO();
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  initCollab() {
    return new FormGroup({
      value: new FormControl("", Validators.required),
      Address: new FormControl("", Validators.required),
      Phone: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required)
    });
  }

  getCollaborators(form) {
    return form.controls.collaborators.controls;
  }

  addCollaborators(item) {
    //console.log(item);
    this.collabadata = item;
    // //console.log(this.collabadata.pkId);
  }

  removeCollaborators(i) {
    const control = <FormArray>this.projectGeneral.get("collaborators");
    const control1 = <FormArray>this.projectGeneral.get("sharedCollaborators");
    const control2 = <FormArray>this.projectGeneral.get("commentMention");
    control1.removeAt(i + 2);
    control2.removeAt(i + 2);
    control.removeAt(i);
    this.onChange(this.projectGeneral);
  }

  onChange(f) {
    //console.log(f.value);
    this.f = f.value;
    this.ap.putApData(this.id1, f.value).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success(
            "General information updated successfully",
            "Updated Successfully",
            { timeOut: 2000 }
          )
        );
        ////console.log(response);
      } else {
        //console.log("Updated");
      
      }
    });
  }

  getAp() {
    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.ap.getApdata(response.apId).subscribe(response => {
        //console.log(response);
        this.apdata = response;
        this.productService = this.apdata.productService;
        console.log("apdata", this.apdata);
        this.status = response.status;
        // //console.log(this.userid);
        this.userexists = response.pointsofContact.includes(this.userid);
        if (
          (this.status == "Shared" && this.userexists == false) ||
          this.status == "Accepted" ||
          this.status == "Initiated" ||
          this.status == "Published" ||
          this.status == "Generated"
        ) {
          this.projectGeneral.disable();
        } else {
          this.projectGeneral.enable();
        }

        this.projectGeneral
          .get("contractingmethod")
          .setValue(response.contractingmethod);
        this.projectGeneral.get("projectTitle").setValue(response.projectTitle);
        this.projectGeneral
          .get("statementofNeed")
          .setValue(response.statementofNeed);
        this.projectGeneral
          .get("technicalHistory")
          .setValue(response.technicalHistory);
        this.projectGeneral
          .get("productService")
          .setValue(response.productService);
        this.projectGeneral.get("serverable").setValue(response.serverable);
        this.projectGeneral
          .get("categoryManagement")
          .setValue(response.categoryManagement);
        this.projectGeneral
          .get("estimatedBudgett")
          .setValue(response.estimatedBudgett);
        this.projectGeneral.get("naicscode").setValue(response.naicscode);
        this.projectGeneral.get("smallBusines").setValue(response.smallBusines);
        this.projectGeneral
          .get("acqAlternative")
          .setValue(response.acqAlternative);
        this.projectGeneral.get("catalogue").setValue(response.catalogue);
        this.projectGeneral.get("popstartDate").setValue(response.popstartDate);
        this.projectGeneral.get("popendDate").setValue(response.popendDate);
        this.projectGeneral
          .get("anticipatedPop")
          .setValue(response.anticipatedPop);
        this.projectGeneral
          .get("method_of_solicitation")
          .setValue(response.method_of_solicitation);
        this.projectGeneral
          .get("proposedAction")
          .setValue(response.proposedAction);
        this.projectGeneral.get("unrestricted").setValue(response.unrestricted);
        this.projectGeneral.get("setAside").setValue(response.setAside);
        this.projectGeneral.get("percent").setValue(response.percent);
        this.projectGeneral.get("eightA").setValue(response.eightA);
        this.projectGeneral.get("SDVOB").setValue(response.SDVOB);

        this.projectGeneral
          .get("securityConsiderationsText")
          .setValue(response.securityConsiderationsText);
        this.projectGeneral
          .get("smallBusiness")
          .setValue(response.smallBusiness);
        this.projectGeneral.get("EDWOSB").setValue(response.EDWOSB);
        this.projectGeneral.get("hubzoneSB").setValue(response.hubzoneSB);
        this.projectGeneral.get("womenSB").setValue(response.womenSB);
        this.projectGeneral
          .get("noncomoption1")
          .setValue(response.noncomoption1);
        this.projectGeneral
          .get("noncomoption2")
          .setValue(response.noncomoption2);
        this.projectGeneral
          .get("noncomoption3")
          .setValue(response.noncomoption3);
        this.projectGeneral
          .get("noncomoption4")
          .setValue(response.noncomoption4);
        this.projectGeneral
          .get("noncomoption5")
          .setValue(response.noncomoption5);
        this.projectGeneral
          .get("noncomoption6")
          .setValue(response.noncomoption6);
        this.projectGeneral.get("Bundling").setValue(response.Bundling);
        this.projectGeneral
          .get("contractVehicle")
          .setValue(response.contractVehicle);

        this.projectGeneral.get("contractType").setValue(response.contractType);
        this.projectGeneral.get("awardType").setValue(response.awardType);
        this.projectGeneral.get("coName").setValue(response.coName);
        this.projectGeneral.get("coAddress").setValue(response.coAddress);
        this.projectGeneral.get("coPhone").setValue(response.coPhone);
        this.projectGeneral.get("coEmail").setValue(response.coEmail);

        this.projectGeneral.get("coOfficecode").setValue(response.coOfficecode);
        this.projectGeneral.get("coOfficeName").setValue(response.coOfficeName);
        this.projectGeneral.get("rName").setValue(response.rName);
        this.projectGeneral.get("rAddress").setValue(response.rAddress);
        this.projectGeneral.get("rPhone").setValue(response.rPhone);
        this.projectGeneral.get("rEmail").setValue(response.rEmail);
        this.projectGeneral.get("baName").setValue(response.baName);
        this.projectGeneral.get("baAddress").setValue(response.baAddress);
        this.projectGeneral.get("baPhone").setValue(response.baPhone);
        this.projectGeneral.get("baEmail").setValue(response.baEmail);
        this.projectGeneral
          .get("contractOfficer")
          .setValue(response.contractOfficer);
        this.projectGeneral.get("dateModified").setValue(new Date());
        this.projectGeneral
          .get("userModified")
          .setValue(this.authenticatedUser);
        this.projectGeneral.get("selection").setValue(response.selection);
        this.projectGeneral
          .get("contractNumber")
          .setValue(response.contractNumber);
        this.projectGeneral
          .get("productorService")
          .setValue(response.productorService);
        this.projectGeneral
          .get("existingContract")
          .setValue(response.existingContract);
        this.projectGeneral.get("inputService").setValue(response.inputService);
        this.projectGeneral.get("typeofWork").setValue(response.typeofWork);
        this.projectGeneral
          .get("requirementsType")
          .setValue(response.requirementsType);
        this.projectGeneral
          .get("acqConsideration")
          .setValue(response.acqConsideration);
        this.projectGeneral
          .get("capabilityPerformance")
          .setValue(response.capabilityPerformance);
        this.projectGeneral.get("acqMethod").setValue(response.acqMethod);
        this.projectGeneral
          .get("performanceApproach")
          .setValue(response.performanceApproach);
        this.projectGeneral
          .get("bundlingDetermination")
          .setValue(response.bundlingDetermination);
        this.projectGeneral.get("productkind").setValue(response.productkind);
        this.projectGeneral.get("servicekind").setValue(response.servicekind);
        this.projectGeneral
          .get("similarNumber")
          .setValue(response.similarNumber);
        this.projectGeneral
          .get("similarContract")
          .setValue(response.similarContract);
        this.projectGeneral.get("selection1").setValue(response.selection1);
        this.projectGeneral.get("itornonit").setValue(response.itornonit);
        this.projectGeneral.get("description").setValue(response.description);
        this.projectGeneral.get("createdUser").setValue(response.createdUser);
        this.projectGeneral.get("status").setValue(response.status);
        this.projectGeneral.get("productKind").setValue(response.productKind);
        this.projectGeneral.get("serviceKind").setValue(response.serviceKind);
        this.projectGeneral.get("Source").setValue(response.Source);
        this.projectGeneral
          .get("SimplifiedAcquisition")
          .setValue(response.SimplifiedAcquisition);
        this.projectGeneral
          .get("performanceBased")
          .setValue(response.performanceBased);

        this.projectGeneral
          .get("specialcontractingmethod")
          .setValue(response.specialcontractingmethod);
        this.projectGeneral.get("idiq").setValue(response.idiq);
        this.projectGeneral.get("optionFFP").setValue(response.optionFFP);
        this.projectGeneral
          .get("subcontractCompetition")
          .setValue(response.subcontractCompetition);
        this.projectGeneral
          .get("uniqueSolicitationClauses")
          .setValue(response.uniqueSolicitationClauses);
        this.projectGeneral
          .get("organizationalConflict")
          .setValue(response.organizationalConflict);
        this.projectGeneral.get("severability").setValue(response.severability);
        this.projectGeneral
          .get("performanceBasedAcq")
          .setValue(response.performanceBasedAcq);
        this.projectGeneral
          .get("performanceBasedTextArea")
          .setValue(response.performanceBasedTextArea);
        this.projectGeneral.get("constraints").setValue(response.constraints);
        this.projectGeneral
          .get("compatibility")
          .setValue(response.compatibility);
        this.projectGeneral.get("spareParts").setValue(response.spareParts);
        this.projectGeneral
          .get("leasePurchase")
          .setValue(response.leasePurchase);
        this.projectGeneral
          .get("governmentFurnishedProperty")
          .setValue(response.governmentFurnishedProperty);
        this.projectGeneral
          .get("governmentFurnishedInformation")
          .setValue(response.governmentFurnishedInformation);
        this.projectGeneral
          .get("managementInformationRequirements")
          .setValue(response.managementInformationRequirements);
        this.projectGeneral
          .get("igce2textarea")
          .setValue(response.igce2textarea);
        this.projectGeneral.get("igce2").setValue(response.igce2);
        this.projectGeneral.get("igce1").setValue(response.igce1);
        this.projectGeneral
          .get("igce3textarea")
          .setValue(response.igce3textarea);
        this.projectGeneral.get("igce3").setValue(response.igce3);

        
        let control = <FormArray>this.projectGeneral.controls.collaborators;
        const control1 = <FormArray>(
          this.projectGeneral.controls.sharedCollaborators
        );
        const control2 = <FormArray>(
          this.projectGeneral.controls.pointsofContact
        );

        const control3 = <FormArray>this.projectGeneral.controls.commentMention;
        const control4 = <FormArray>(
          this.projectGeneral.controls.corNominationUsers
        );

        if (response.sharedCollaborators != undefined) {
          response.sharedCollaborators.forEach(shared => {
            control1.push(new FormControl(shared));
          });
        }
        if (response.pointsofContact != undefined) {
          response.pointsofContact.forEach(poc => {
            control2.push(new FormControl(poc));
          });
        }
        if (response.corNominationUsers != undefined) {
          response.corNominationUsers.forEach(cor => {
            control4.push(new FormControl(cor));
          });
        }
        if (response.commentMention != undefined) {
          response.commentMention.forEach(co => {
            console.log(co);
            control3.push(
              this.fb.group({
                value: co.value,
                Address: co.Address,
                Phone: co.Phone,
                email: co.email
              })
            );
          });
        }
        if (response.collaborators != undefined) {
          response.collaborators.forEach(co => {
            console.log(co);
            control.push(
              this.fb.group({
                value: co.value,
                Address: co.Address,
                Phone: co.Phone,
                email: co.email
              })
            );
          });
        }

        this.id1 = this.apdata.id;
        this.status = this.apdata.status;
      });
    });
  }
  getUsers() {
    this.ap.getAllusers().subscribe(response => {
      console.log("Programing Contracting All users",response);
      this.collaborateUsers = response.results.filter(user => {
        if(user.firstName != 'Not'){
          return user.firstName != this.authenticatedUser && (user.firstName + " " + user.lastName) != this.projectGeneral
            .get("coName").value;
        } else if (user.firstName == 'Not') {
                    var fullName = user.email.split("@")[0].split(".");
          var firstName =
            fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName =
            fullName[fullName.length - 1].charAt(0).toUpperCase() +
            fullName[fullName.length - 1].slice(1);
          var emailUser = firstName;
          return emailUser! = this.emailUsers && emailUser != this.projectGeneral
          .get("coName").value;
        }
        
      });
    
      console.log("Collaborator Users", this.collaborateUsers);
      this.collaborateUsers.map(i => {
        if (i.firstName == "Not") {
          var fullName = i.email.split("@")[0].split(".");
          var firstName =
            fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName =
            fullName[fullName.length - 1].charAt(0).toUpperCase() +
            fullName[fullName.length - 1].slice(1);
          var emailUser = firstName;
          i.fullCode = emailUser;
          return i;
        } else if (i.firstName != "Not")
          i.fullCode = i.firstName + " " + i.lastName;
        return i;
      });
      
    });
  }

  getCO() {
    this.ap.getContractingRole().subscribe(res=>{    
        

      // console.log("Contracting Officers", res);
      this.coFilter = res.results;

      this.coFilter.map(i => {
        if (i.firstName == "Not") {
          var fullName = i.email.split("@")[0].split(".");
          var firstName =
            fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName =
            fullName[fullName.length - 1].charAt(0).toUpperCase() +
            fullName[fullName.length - 1].slice(1);
          var emailUser = firstName;
          i.fullCode = emailUser;
          return i;
        } else if (i.firstName != "Not")
          i.fullCode = i.firstName + " " + i.lastName;
        return i;
      });
    });
  }

  updatePointsofcontact(item) {
    console.log(item);
    if (item.firstName == "Not") {
      this.projectGeneral.get("coName").setValue(
        item.email
          .split("@")[0]
          .split(".")[0]
          .charAt(0)
          .toUpperCase() +
          item.email
            .split("@")[0]
            .split(".")[0]
            .slice(1)
      );
      
    } else if (item.firstName != "Not") {
      this.projectGeneral
        .get("coName")
        .setValue(item.firstName + " " + item.lastName);
    }
    this.projectGeneral.get("coAddress").setValue(item.address);
    this.projectGeneral.get("coPhone").setValue(item.phone);
    this.projectGeneral.get("coEmail").setValue(item.email);
    this.projectGeneral.get("coOfficecode").setValue(item.officeCode);
    this.projectGeneral.get("coOfficeName").setValue("HHS/OGAPA");
    this.projectGeneral
      .get("pointsofContact")
      .controls[1].patchValue(item.pkId);
    this.projectGeneral
      .get("corNominationUsers")
      .controls[1].patchValue(item.pkId);
    this.projectGeneral.get("status").setValue("Shared");
    if (item.firstName == "Not") {
      this.projectGeneral.get("commentMention").controls[0].patchValue({
        value:
          item.email
            .split("@")[0]
            .split(".")[0]
            .charAt(0)
            .toUpperCase() +
          item.email
            .split("@")[0]
            .split(".")[0]
            .slice(1),
        Address: item.address,
        Phone: item.phone,
        email: item.email,
        role: item.roles[0].roleName
      });
    } else if (item.firstName != "Not") {
      this.projectGeneral.get("commentMention").controls[0].patchValue({
        value: item.firstName + " " + item.lastName,
        Address: item.address,
        Phone: item.phone,
        email: item.email,
        role: item.roles[0].roleName
      });
    }
    var name;
    var fullName = item.email.split("@")[0].split(".");
    var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
    var lastName =
      fullName[fullName.length - 1].charAt(0).toUpperCase() +
      fullName[fullName.length - 1].slice(1);
    this.emailUsers = firstName + " " + lastName;
    if (item.firstName == "Not") {
      name = firstName;
    } else {
      name = item.firstName + " " + item.lastName;
    }
    var data = {
      ap_no: this.getapno,
      users: [name],
      textUser: this.usercommentsname,
      text: "added you as Points of Contact",
      iconstyle: "fa-user-plus",
      message: "for AP" + " " + "#" + this.getapno,
      date: new Date(),
      type: "PointoFContact"
    };
    this.ap.postAttnotifications(data).subscribe(Response => {
      ////console.log(Response);
      //console.log("Added as Points of Contact");
    });
    var title = this.projectGeneral.get("projectTitle").value;
    var dataEmail = {
      to: [item.email],
      subject: this.usercommentsname + " " + "added you as Point of Contact",
      body: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      
      <div style="background:#FFFFFF; border: 2px solid #F6F2F2;  padding: 30px; text-align:center">
      <img src="https://sandbox.accelerate.hhs.gov/landing/assets/logo/product-logo.png" height="35">
      <div style="background:#F6F2F2; padding: 20px; margin-top: 30px">
      <div style="color: #2E73DC; font-size:16px; font-weight: 600;">New Activity<div>
      <hr style="border: 2px solid #22E73DC">
      <div style="color:#000000; font-size: 14px; font-weight: 400; padding: 20px; text-align: left">
      <span style="color:#2E73DC; font-weight: 600">${this.usercommentsname}</span> added you as Point of Contact for <span style="color:#2E73DC; font-weight: 600">${title}</span> <span style="color:#2E73DC; font-weight: 600">AP#${this.getapno}</span> 
      </div>
        <a href="${this.DOMAIN_URL}/#/home/${this.getapno}" style="background-color:#2E73DC;border:1px solid #2E73DC;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:14px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all; margin-top: 20px">View Update &rarr;</a>
        </div>
      </div>
    
    </td>
  </tr>
</table>
      `
    };
    console.log(dataEmail);

    this.ap.postEmail(dataEmail).subscribe(Response => {
      console.log(Response);
    });
    this.onChange(this.projectGeneral);
  }

  removeCo() {
    this.projectGeneral.get("coName").setValue("");
    this.projectGeneral.get("coAddress").setValue("");
    this.projectGeneral.get("coPhone").setValue("");
    this.projectGeneral.get("coEmail").setValue("");
    this.projectGeneral.get("coOfficeName").setValue("");
    this.projectGeneral.get("status").setValue("Draft");
    this.projectGeneral
      .get("pointsofContact")
      .controls[1].patchValue("1234567890");
    this.projectGeneral
      .get("corNominationUsers")
      .controls[1].patchValue("1234567890");
    this.projectGeneral.get("commentMention").controls[0].patchValue({
      value: "",
      Address: "",
      Phone: "",
      email: "",
      role: "",
    });
    this.onChange(this.projectGeneral);
  }
  loadData() {
    this.getUsers();
  }

  pushData() {
    const control = <FormArray>this.projectGeneral.get("collaborators");
    const control1 = <FormArray>(
      this.projectGeneral.controls["sharedCollaborators"]
    );
    const control3 = <FormArray>this.projectGeneral.controls["commentMention"];
    //console.log(this.collabadata);
    control1.push(new FormControl(this.collabadata.pkId));

    if (this.collabadata.firstName == "Not") {
      control.push(
        this.fb.group({
          value: new FormControl(
            this.collabadata.email
              .split("@")[0]
              .split(".")[0]
              .charAt(0)
              .toUpperCase() +
              this.collabadata.email
                .split("@")[0]
                .split(".")[0]
                .slice(1)
          ),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email),
          role: new FormControl(this.collabadata.roles[0].roleName)
        })
      );
      control3.push(
        this.fb.group({
          value: new FormControl(
            this.collabadata.email
              .split("@")[0]
              .split(".")[0]
              .charAt(0)
              .toUpperCase() +
              this.collabadata.email
                .split("@")[0]
                .split(".")[0]
                .slice(1)
          ),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email),
          role: new FormControl(this.collabadata.roles[0].roleName)
        })
      );
    } else if (this.collabadata.firstName != "Not") {
      control.push(
        this.fb.group({
          value: new FormControl(
            this.collabadata.firstName + " " + this.collabadata.lastName
          ),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email),
          role: new FormControl(this.collabadata.roles[0].roleName)
        })
      );
      control3.push(
        this.fb.group({
          value: new FormControl(
            this.collabadata.firstName + " " + this.collabadata.lastName
          ),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email),
          role: new FormControl(this.collabadata.roles[0].roleName)
        })
      );
    }

    var name;
    var fullName = this.collabadata.email.split("@")[0].split(".");
    var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
    var lastName =
      fullName[fullName.length - 1].charAt(0).toUpperCase() +
      fullName[fullName.length - 1].slice(1);
    this.emailUsers = firstName + " " + lastName;
    if (this.collabadata.firstName == "Not") {
      name = this.emailUsers;
    } else {
      name = this.collabadata.firstName + " " + this.collabadata.lastName;
    }
    var data = {
      ap_no: this.getapno,
      users: [name],
      textUser: this.usercommentsname,
      text: "shared acquisition with you",
      iconstyle: "fa-share",
      message: "for AP" + " " + "#" + this.getapno,
      date: new Date(),
      type: "Share"
    };
    this.ap.postAttnotifications(data).subscribe(Response => {
      ////console.log(Response);
      //console.log("Shared Acquisition");
    });
    var title = this.projectGeneral.get("projectTitle").value;

    var dataEmail = {
      to: [this.collabadata.email],
      subject: this.usercommentsname + " " + "shared AP with you",
      body: `
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      
      <div style="background:#FFFFFF; border: 2px solid #F6F2F2;  padding: 30px; text-align:center">
      <img src="https://sandbox.accelerate.hhs.gov/landing/assets/logo/product-logo.png" height="35">
      <div style="background:#F6F2F2; padding: 20px; margin-top: 30px">
      <div style="color: #2E73DC; font-size:16px; font-weight: 600;">New Activity<div>
      <hr style="border: 2px solid #22E73DC">
      <div style="color:#000000; font-size: 14px; font-weight: 400; padding: 20px; text-align: left">
      <span style="color:#2E73DC; font-weight: 600">${this.usercommentsname}</span> shared acquisition with you for <span style="color:#2E73DC; font-weight: 600">${title}</span> <span style="color:#2E73DC; font-weight: 600">AP#${this.getapno}</span> 
      </div>
        <a href="${this.DOMAIN_URL}/#/home/${this.getapno}" style="background-color:#2E73DC;border:1px solid #2E73DC;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:14px;line-height:30px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all; margin-top: 20px">View Update &rarr;</a>
        </div>
      </div>
    
    </td>
  </tr>
</table>
      `
    };
    this.ap.postEmail(dataEmail).subscribe(Response => {
      console.log(Response);
    });
    ////console.log(data);
    this.projectGeneral.get("status").setValue("Shared");
    this.projectGeneral.get("clearValue").setValue("");
    setTimeout(() => {
      this.onChange(this.projectGeneral);
      this.collabadata = "";
    }, 300);

    
    let element: HTMLElement = document.getElementsByClassName(
      "close"
    )[0] as HTMLElement;
    return element.click();
  }

  onKeysss(event) {
    let value = event.target.value;
    if (value == "") {
    } else {
      value.indexOf(".") == -1
        ? this.projectGeneral.get("estimatedBudgett").setValue(value + ".00")
        : "";
      //Scrip to seperate the decimal and the whole values
      let splitvalue = event.target.value.split(".");
      let dollars = splitvalue[0] + ".";
      let decimals = splitvalue[1].toString().substr(0, 2);
      decimals = decimals.length == "1" ? decimals + "0" : decimals;
      this.projectGeneral
        .get("estimatedBudgett")
        .setValue(`${dollars}${decimals}`);
    }
  }
}
