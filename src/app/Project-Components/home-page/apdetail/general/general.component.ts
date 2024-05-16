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
import { CurrencyPipe } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

declare var $: any;

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"]
})
export class GeneralComponent implements OnInit {



  FAR7105a1="Statement of Need";
  DOMAIN_URL = environment.DOMAIN_URL;
  FARPart12="Commercial Purchase";
  FARSubpartf="Categories of Contracting";
  FAR7402="";
  far6="Prposed Action";
  far19="Small Business";
  far17="Special Contracting Methods";
  farsubchapterc="Contracting Methods";
  far16="Contract Type";
  far44="Subcontract Competition";
  farsubpart95="Organizational Conflict of Interest";
  far376="Performance-Based";
  far7105a2="Compatibility";
  far7105b5="Lease of Purchase";
  far7105b15="Government-Furnished Property";
  far7105b16="Government-Furnished Information";
  far7105b11="Management Information Requirements";
  far7503="Inherently Governmental Functions";
  yes = true;
  no = false;
  productService;
  today = new Date();
  dd;
  mm; //January is 0!
  yyyy = this.today.getFullYear();
  strDateTime;
  role;
  f;
  apdata;
  id1;
  authenticatedUser;
  timeStamp = new Date();
  paramsSubscription;
  commentResponse;
  performanceBased: boolean = false;
  endDatess: boolean = false;
  ffp:boolean = false;
  id;
  public model: any = { date: { year: 2018, month: 10, day: 9 } };
  status;
  typeofWork = ["Product", "Service", "Construction"];
  sowid;
  tradeoffId;
  securityId;
  considerationId;
  patchSow;
  patchTrade;
  patchSecurity;
  patchConsideration;
  pscList = [
    { full: "Architect-Engineering", Acronym: "CMLSUP", disabled: "disabled" },
    { full: "Construction", Acronym: "CON",disabled: "disabled" },
    { full: "Combination of Product/Services", Acronym: "AEU", disabled: "enabled" },
    { full: "Communication Services", Acronym: "COMSVC", disabled: "disabled" },
    { full: "Dismantling, Demolition or Removal of Improvements", Acronym: "DDRI", disabled: "disabled" },
    { full: "Facilities",Acronym: "FAC", disabled: "disabled"},
    { full: "Leasing of Motor Vehicles", Acronym: "LMV", disabled: "disabled" },
    { full: "Products", Acronym: "sup" },
    { full: "Research & Development", Acronym: "RANDD", disabled: "disabled" },
    { full: "Services", Acronym: "svc"},
    { full: "Transportation", Acronym: "TRNE", disabled: "disabled" },
    { full: "Utility Services", Acronym: "UTLSVC", disabled: "disabled" }
  ];
  categoryManagement = [
    {full:"Aircraft, Ships/Submarines & Land Vehicles", Acronym: "Aircraft, Ships/Submarines and Land Vehicles"},
    {full:"Clothing, Textiles and Subsistence S&E", Acronym: "Clothing, Textiles and Subsistence S and E"},
    {full:"Electronic & Communication Equipment", Acronym: "Electronic and Communication Equipment"},
    {full:"Electronic & Communication Services", Acronym:"Electronic and Communication Services"},
    {full:"Equipment Related Services",Acronym: "Equipment Related Services"},
    {full:"Facilities & Construction",Acronym:"Facilities and Construction%20"},
    {full:"Human Capital",Acronym:"Human Capital"},
    {full:"Industrial Products & Services",Acronym:"Industrial Products and Services"},
    {full:"Information Technology",Acronym:"IT"},
    {full:"Medical",Acronym:"Medical"},
    {full:"Miscellaneous S&E",Acronym:"Miscellaneous S and E"},
    {full:"Office Management",Acronym:"Office Management"},
    {full:"Professional Services",Acronym:"Professional Services"},
    {full:"Research and Development",Acronym:"Research and Development"},
    {full:"Security and Protection",Acronym:"Security and Protection"},
    {full:"Sustainment S&E",Acronym:"Sustainment S and E"},
    {full:"Transportation and Logistics Services",Acronym:"Transportation and Logistics Services"},
    {full:"Travel & Lodging",Acronym:"Travel and Lodging"},
    {full:"Weapons & Ammunition",Acronym:"Weapons and Ammunition%20"},
    ];
  unrestricted: boolean = false;
  partial: boolean = false;
  insertpercentage: boolean = false;
  competetiveYes: boolean = false;
  commercialYes: boolean = false;

  contractingmethod = [
    { full: "Simplified Acquisition Procedures", Acronym: "SAP" },
    { full: "Sealed Bidding", Acronym: "SLDBID" },
    { full: "Contracting by Negotiation", Acronym: "NEGCON" },
  ];
  specialcontractingmethod = [
    { full: "Interagency Acquisitions", Acronym: "IA" },
    { full: "Leader Company Contracting", Acronym: "LOC" },
    { full: "Management and Operating Contracts", Acronym: "MOC" },
    { full: "Multi-year Contracting", Acronym: "MYC" },
    { full: "Options", Acronym: "Options" },
    { full: "N/A", Acronym: "N/A"}
  ];
  contractVehicle = [
    "Purchase Order",
    "BPA",
    "IDIQ",
    "Stand Alone",
    "Task/Delivery Order"
  ];
 


  contractType = [
    { full: "Cost Reimbursement", Acronym: "cr"},
    { full: "Fixed Price", Acronym: "fp" },
    { full: "Labor Hour", Acronym: "tm_lh"},
    { full: "Time and Materials", Acronym: "tm_lh"}
  ];
  awardType = [
    "Base Plus option",
    "Base only",
    "Multi-year(FAR17.1/HHSAR 317.1)"
  ];
  acqMethod = [
    "RFP",
    "RFQ",
  ];

  
  pscname;
  pscResults;
  getapno;
  naicsname = "";
  naicsresults;
  collaborateUsers;
  clickCollabdata;
  data: any[] = [];
  projectGeneral;
  collabadata;
  coFilter;
  userid;
  userexists;
  emailUsers;
  usercommentsname;
  specialcontractingmethodBoolean:boolean = false;
  contractingmethodBoolean:boolean = false;
  // Initialized to specific date (09.10.2018).
  public model1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {

   
    
    if (this.today.getDate() < 10) {
      this.dd = "0" + this.today.getDate();
    } else {
      this.dd = this.today.getDate();
    }
    if (this.today.getMonth() + 1 < 10) {
      this.mm = "0" + (this.today.getMonth() + 1);
    } else {
      this.mm = this.today.getMonth() + 1;
    }
    this.strDateTime = this.yyyy + "-" + this.mm + "-" + this.dd;
    this.getapno = this.route.snapshot.parent.params.apid;
    this.ap.getUserprofile().subscribe(response => {
      ////console.log(response);
      this.authenticatedUser = response.firstName;
      
      var fullName = response.email.split('@')[0].split('.');
      var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
      this.emailUsers = firstName+" "+lastName;
      if(response.firstName == "Not") {
          this.usercommentsname = firstName
      } else {
          this.usercommentsname = response.firstName
      }
      if (response.roles[0].roleName == "Contracting Officer (CO)") {
        this.role = "Contracting Officer";
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
      // solType: new FormControl(""),
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

specialcontractingmethodText: new FormControl(""),
contractingmethodText: new FormControl(""),
organizationalConflictText: new FormControl(""),
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

  

    this.projectGeneral.get("estimatedBudgett").valueChanges.subscribe(values => {
      console.log(values);
     
              
      $("#estimatedbudgett").blur(function() {  

        $("#estimatedbudgett").val(parseFloat(values).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) 

      });
    });
    this.getAp();
    //this.searchPsc();
    this.searchNaics();
    var tokenInformation = Cookie.get("hhs-a-token");
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId;
    this.pageReferesh();
    //setTimeout(() => {this.onChange(this.projectGeneral);},300)
  }

  pageReferesh(){
    this.ap.pageRefresh.subscribe(Response => {
      console.log("Page Refresh",Response);
      this.ngOnInit();
      this.getAp();
    })
  }


  categoryPsc() {
    //this.searchPsc();
      this.projectGeneral.get("catalogue").setValue("");


        if(this.projectGeneral.get("categoryManagement").value == 'Medical' && this.projectGeneral.get('productService').value == 'sup'){
          this.projectGeneral.get('smallBusines').setValue("N/A");
        //  this.projectGeneral.get('smallBusines').disable();
  
          this.projectGeneral.get('acqAlternative').setValue("N/A");
         // this.projectGeneral.get('acqAlternative').disable();
  
          this.projectGeneral.get('specialcontractingmethod').setValue("N/A");
        //  this.projectGeneral.get('specialcontractingmethod').disable();
  
         // this.projectGeneral.get('specialcontractingmethodText').setValue("");
         // this.projectGeneral.get('specialcontractingmethodText').disable();
  
          this.projectGeneral.get('contractingmethodText').setValue("N/A");
        //  this.projectGeneral.get('contractingmethodText').disable();
  
          this.projectGeneral.get('subcontractCompetition').setValue("N/A");
        //  this.projectGeneral.get('subcontractCompetition').disable();
  
  
          this.projectGeneral.get('uniqueSolicitationClauses').setValue("N/A");
         // this.projectGeneral.get('uniqueSolicitationClauses').disable();
  
          this.projectGeneral.get('governmentFurnishedProperty').setValue("N/A");
         // this.projectGeneral.get('governmentFurnishedProperty').disable();
  
  
          this.projectGeneral.get('governmentFurnishedInformation').setValue("N/A");
         // this.projectGeneral.get('governmentFurnishedInformation').disable();
  
          this.projectGeneral.get('managementInformationRequirements').setValue("N/A");
         // this.projectGeneral.get('managementInformationRequirements').disable();
  
          this.projectGeneral.get('leasePurchase').setValue("N/A");
          this.projectGeneral.get('compatibility').setValue("N/A");
          this.projectGeneral.get('constraints').setValue("N/A");
          this.projectGeneral.get('spareParts').setValue("N/A");
         // this.projectGeneral.get('leasePurchase').disable();
         this.patchSow = "N/A";
         this.patchTrade = {
          coastGoals: "N/A",
         }
         this.patchSecurity = {
          contractorFacility: "N/A",
         }
         this.patchConsideration = {
          tradeOff: "N/A",
          majorComponents: "N/A",
          priorities: "N/A",
          makeBuy: "N/A",
          otherConsiderations: "N/A",
          govtPerformance: "N/A"
         }
         setTimeout(() => {this.onChange(this.projectGeneral);},300);

        } 
        if (this.projectGeneral.get('productService').value == 'svc' || (this.projectGeneral.get('productService').value == 'sup' && this.projectGeneral.get("categoryManagement").value != 'Medical')) {
  
          this.projectGeneral.get('smallBusines').setValue("");
         // this.projectGeneral.get('smallBusines').enable();
  
          this.projectGeneral.get('acqAlternative').setValue("");
          this.projectGeneral.get('acqAlternative').enable();
  
          this.projectGeneral.get('specialcontractingmethod').setValue("");
         /// this.projectGeneral.get('specialcontractingmethod').enable();
  
         // this.projectGeneral.get('specialcontractingmethodText').setValue("");
        // this.projectGeneral.get('specialcontractingmethodText').enable();
  
          this.projectGeneral.get('contractingmethodText').setValue("");
        //  this.projectGeneral.get('contractingmethodText').enable();
  
          this.projectGeneral.get('subcontractCompetition').setValue("");
         // this.projectGeneral.get('subcontractCompetition').enable();
  
  
          this.projectGeneral.get('uniqueSolicitationClauses').setValue("");
        //  this.projectGeneral.get('uniqueSolicitationClauses').enable();
  
          this.projectGeneral.get('governmentFurnishedProperty').setValue("");
         // this.projectGeneral.get('governmentFurnishedProperty').enable();
  
  
          this.projectGeneral.get('governmentFurnishedInformation').setValue("");
        //  this.projectGeneral.get('governmentFurnishedInformation').enable();
  
          this.projectGeneral.get('managementInformationRequirements').setValue("");
        //  this.projectGeneral.get('managementInformationRequirements').enable();
  
          this.projectGeneral.get('leasePurchase').setValue("");
          this.projectGeneral.get('compatibility').setValue("");
          this.projectGeneral.get('constraints').setValue("");
          this.projectGeneral.get('spareParts').setValue("");
          this.patchSow = "";
          this.patchTrade = {
            coastGoals: "",
          }
          this.patchSecurity = {
            contractorFacility: "",
          }
          this.patchConsideration = {
            tradeOff: "",
            majorComponents: "",
            priorities: "",
            makeBuy: "",
            otherConsiderations: "",
            govtPerformance: ""
           }
         // this.projectGeneral.get('leasePurchase').enable();
         setTimeout(() => {this.onChange(this.projectGeneral);},300)
        }
  }


  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  keyPercentage($event) {
    console.log("Number", $event.target.value);
    var num = $event.target.value;
    if(num > 100 || num < 1){
      this.toastr.info("Percentage should be beween 1 and 100");
      this.projectGeneral.get('percent').setValue("");

    }
  }
  keyPress(evt: any) {

    var iKeyCode = evt.which ? evt.which : evt.keyCode;
    if (iKeyCode != 46 && iKeyCode > 31 && (iKeyCode < 48 || iKeyCode > 57)) {
      this.toastr.info("Only Numbers");
      return false;
    } else {
      return true;
    }
  }

  textContractingMethods(){
    // if(this.projectGeneral.get('specialcontractingmethod').value == "MYC" || this.projectGeneral.get('specialcontractingmethod').value == "Options") {
    //     this.specialcontractingmethodBoolean = true;
    // } else {
    //   this.specialcontractingmethodBoolean = false;
    // }

    this.specialcontractingmethodBoolean = true;

  }

  textContracting(){
    if(this.projectGeneral.get('contractingmethod').value == "SLDBID" || this.projectGeneral.get('contractingmethod').value == "NEGCON") {
    this.contractingmethodBoolean = true;
  } else {
    this.contractingmethodBoolean = false;
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
    console.log(f.value);
    this.f = f.value;
    console.log("Response from other Content", this.tradeoffId, this.patchTrade);
    console.log("Patch Sow");
    this.ap.patchSow1(this.sowid, this.patchSow).subscribe((response)=>{console.log(response)});
    this.ap.patchTradeoffs(this.tradeoffId, this.patchTrade).subscribe((response)=>{console.log(response)});
    this.ap.patchSecurity(this.securityId, this.patchSecurity).subscribe((response)=>{console.log(response)});
    this.ap.patchOtherConsiderations(this.considerationId, this.patchConsideration).subscribe((response)=>{console.log(response)})
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
    this.ap.getApdappids(this.getapno).subscribe(response1 => {
      console.log("Response from AP DAPP", response1)
      this.ap.getApdata(response1.apId).subscribe(response => {
        //console.log(response);
        this.apdata = response;
        this.productService = this.apdata.productService;

        //console.log("apdata",this.apdata);
        this.status = response.status;
        // //console.log(this.userid);
        this.userexists = response.pointsofContact.includes(this.userid);
        if (
          (this.status == "Shared" && this.userexists == false) ||
          this.status == "Accepted" || this.status == "Initiated" || this.status == "Published" || this.status == "Generated"
        ) {
          this.projectGeneral.disable();
        } else {
          this.projectGeneral.enable();
        }

        if (this.role == "Contracting Officer") {
          this.projectGeneral.get("coName").disable();
          this.projectGeneral.get("coAddress").disable();
          this.projectGeneral.get("coPhone").disable();
          this.projectGeneral.get("coEmail").disable();
          this.projectGeneral.get("baName").disable();
          this.projectGeneral.get("baAddress").disable();
          this.projectGeneral.get("baPhone").disable();
          this.projectGeneral.get("baEmail").disable();
        }
        if (this.role == "Program Officer") {
          this.projectGeneral.get("proposedAction").disable();
          this.projectGeneral.get("unrestricted").disable();
          this.projectGeneral.get("setAside").disable();
          this.projectGeneral.get("noncomoption1").disable();
          this.projectGeneral.get("noncomoption2").disable();
          this.projectGeneral.get("noncomoption3").disable();
          this.projectGeneral.get("noncomoption4").disable();
          this.projectGeneral.get("noncomoption5").disable();
          this.projectGeneral.get("noncomoption6").disable();
          
        }
        //console.log(sresponse.securityConsiderationsText)
        if(response.contractingmethodText != ""){
          this.contractingmethodBoolean = true;
        }
       else {
          this.contractingmethodBoolean = false;
        }

        if(response.contractingmethod == "SAP") {
          this.contractingmethodBoolean = false;}
        
        if(response.specialcontractingmethodText != ""){
          this.specialcontractingmethodBoolean = true;
        } else {
          this.specialcontractingmethodBoolean = false;
        }
        if(response.contractType != ""){
          this.ffp = true;
        } else {
          this.ffp = false;
        }
        if(response.Source == true && this.role == "Contracting Officer"){
          this.commercialYes = true;
        } else {
          this.commercialYes = false;
        }
        this.projectGeneral
          .get("contractingmethod")
          .setValue(response.contractingmethod);
        this.projectGeneral.get("projectTitle").setValue(response.projectTitle);
        this.projectGeneral.get("organizationalConflictText").setValue(response.organizationalConflictText);
        this.projectGeneral.get("specialcontractingmethodText").setValue(response.specialcontractingmethodText);

        this.projectGeneral.get("contractingmethodText").setValue(response.contractingmethodText);
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
        $("#estimatedbudgett").val(parseFloat(response.estimatedBudgett).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) 
        this.projectGeneral.get("naicscode").setValue(response.naicscode);
        this.projectGeneral.get("smallBusines").setValue(response.smallBusines);
        this.projectGeneral.get("acqAlternative").setValue(response.acqAlternative);
        this.projectGeneral.get("catalogue").setValue(response.catalogue);
        this.projectGeneral.get("popstartDate").setValue(response.popstartDate);
        if(response.popstartDate == ''){
          this.endDatess = false;
        } else {
            this.endDatess = true;
        }
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
        this.projectGeneral.get("noncomoption1").setValue(response.noncomoption1);
        this.projectGeneral.get("noncomoption2").setValue(response.noncomoption2);
        this.projectGeneral.get("noncomoption3").setValue(response.noncomoption3);
        this.projectGeneral.get("noncomoption4").setValue(response.noncomoption4);
        this.projectGeneral.get("noncomoption5").setValue(response.noncomoption5);
        this.projectGeneral.get("noncomoption6").setValue(response.noncomoption6);
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



          this.projectGeneral.get("specialcontractingmethod").setValue(response.specialcontractingmethod);
          this.projectGeneral.get("idiq").setValue(response.idiq);
          this.projectGeneral.get("optionFFP").setValue(response.optionFFP);
          this.projectGeneral.get("subcontractCompetition").setValue(response.subcontractCompetition);
          this.projectGeneral.get("uniqueSolicitationClauses").setValue(response.uniqueSolicitationClauses);
          this.projectGeneral.get("organizationalConflict").setValue(response.organizationalConflict);
          this.projectGeneral.get("severability").setValue(response.severability);
          this.projectGeneral.get("performanceBasedAcq").setValue(response.performanceBasedAcq);
          this.projectGeneral.get("performanceBasedTextArea").setValue(response.performanceBasedTextArea);
          this.projectGeneral.get("constraints").setValue(response.constraints);
          this.projectGeneral.get("compatibility").setValue(response.compatibility);
          this.projectGeneral.get("spareParts").setValue(response.spareParts);
          this.projectGeneral.get("leasePurchase").setValue(response.leasePurchase);
          this.projectGeneral.get("governmentFurnishedProperty").setValue(response.governmentFurnishedProperty);
          this.projectGeneral.get("governmentFurnishedInformation").setValue(response.governmentFurnishedInformation);
          this.projectGeneral.get("managementInformationRequirements").setValue(response.managementInformationRequirements);
          this.projectGeneral.get("igce2textarea").setValue(response.igce2textarea);
          this.projectGeneral.get("igce2").setValue(response.igce2);
          this.projectGeneral.get("igce1").setValue(response.igce1);
          this.projectGeneral.get("igce3textarea").setValue(response.igce3textarea);
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
        if(response.corNominationUsers != undefined) {
          response.corNominationUsers.forEach(cor => {
            control4.push(new FormControl(cor));
          });
        }
        if (response.commentMention != undefined) {
          response.commentMention.forEach(co => {
            ////console.log(co);
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
            ////console.log(co);
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
        if (this.apdata.proposedAction == "Competitive") {
          this.insertpercentage = false;
          this.competetiveYes = true;
        } else if (this.apdata.proposedAction == ""){
          this.insertpercentage = false;
          this.competetiveYes = false;
        }
         else  {
          this.insertpercentage = true;
          this.competetiveYes = false;
        }

        

        this.id1 = this.apdata.id;
        this.sowid = response1.sowid;
        this.tradeoffId = response1.tradeoffId;
        this.securityId = response1.securityId;
        this.considerationId = response1.considerationId;
        this.status = this.apdata.status;



        if(response.categoryManagement == 'Medical' && response.productService == 'sup'){
          this.projectGeneral.get('smallBusines').setValue("N/A");
          //this.projectGeneral.get('smallBusines').disable();
  
          this.projectGeneral.get('acqAlternative').setValue("N/A");
        //  this.projectGeneral.get('acqAlternative').disable();
  
          this.projectGeneral.get('specialcontractingmethod').setValue("N/A");
         // this.projectGeneral.get('specialcontractingmethod').disable();
  
         //this.projectGeneral.get('specialcontractingmethodText').setValue("");
         // this.projectGeneral.get('specialcontractingmethodText').disable();
  
          this.projectGeneral.get('contractingmethodText').setValue("N/A");
         // this.projectGeneral.get('contractingmethodText').disable();
  
          this.projectGeneral.get('subcontractCompetition').setValue("N/A");
         // this.projectGeneral.get('subcontractCompetition').disable();
  
  
          this.projectGeneral.get('uniqueSolicitationClauses').setValue("N/A");
         // this.projectGeneral.get('uniqueSolicitationClauses').disable();
  
          this.projectGeneral.get('governmentFurnishedProperty').setValue("N/A");
         // this.projectGeneral.get('governmentFurnishedProperty').disable();
  
  
          this.projectGeneral.get('governmentFurnishedInformation').setValue("N/A");
        //  this.projectGeneral.get('governmentFurnishedInformation').disable();
  
          this.projectGeneral.get('managementInformationRequirements').setValue("N/A");
         // this.projectGeneral.get('managementInformationRequirements').disable();
  
          this.projectGeneral.get('leasePurchase').setValue("N/A");
        //  this.projectGeneral.get('leasePurchase').disable();
        this.projectGeneral.get('compatibility').setValue("N/A");
        this.projectGeneral.get('constraints').setValue("N/A");
        this.projectGeneral.get('spareParts').setValue("N/A");
        this.patchSow = "N/A";
        this.patchTrade = {
         coastGoals: "N/A",
        }
        this.patchSecurity = {
         contractorFacility: "N/A",
        }
        this.patchConsideration = {
         tradeOff: "N/A",
         majorComponents: "N/A",
         priorities: "N/A",
         makeBuy: "N/A",
         otherConsiderations: "N/A",
         govtPerformance: "N/A"
        }
        setTimeout(()=>{this.onChange(this.projectGeneral)},350)
        }

      });
    });

  }

  next() {
    this.router.navigate(["/pm/" + this.id + "/sow"]);
  }
  previous() {
    this.router.navigate(["/pm/" + this.id]);
  }

  competetive() {
    this.insertpercentage = false;
    this.competetiveYes = true;
  }
  noncompetetive() {
    this.competetiveYes = false;
    this.insertpercentage = true;
  }
  commercial(){
    if(this.role == "Contracting Officer"){
      this.commercialYes = true;
    }
 
  }
  nonCommercial(){
    if(this.role == "Contracting Officer"){
      this.commercialYes = false;
    }
  }
  unrestrictedyes() {
    this.partial = true;
  }
  unrestrictedno() {
    this.partial = false;
    this.insertpercentage = false;
  }
  partialyes() {
    this.insertpercentage = true;
  }
  partialno() {
    this.insertpercentage = false;
  }


  
  formatMoney(value) {
    const temp = `${value}`.replace(/\,/g, "");
    var testVar = this.currencyPipe.transform(temp).replace("$", "");
    console.log("Format Money", temp, testVar)
    return this.currencyPipe.transform(temp).replace("$", "");
}

  searchPsc() {
    console.log(this.projectGeneral.get("categoryManagement").value);

    this.ap.getPsc(this.projectGeneral.get("categoryManagement").value).subscribe(response => {
      if (response) {
        this.pscResults = response;
    //    this.ngOnInit();
        this.ap.generalPageEvent.next("Page Refresh");
        this.pscResults.map(i => {
          if(i.psc.length > 2){
          //i.fullCode = i.psc + " " + i.psc_name;
          i.fullCode = i.full_name
          return i;
          }
        });
      } else {
      }
    });
  }

  searchNaics() {
    this.ap.getNaics().subscribe(response => {
      if (response) {
        this.naicsresults = response;
        this.naicsresults.map(i => {
          i.Value = i.naics_code + " " + i.naics_title;
          return i;
        });
      } else {
      }
    });
  }

  updateClick() {
    
    setTimeout(() => {
      this.onChange(this.projectGeneral);
      console.log("General Page Event");
      if(this.projectGeneral.get("categoryManagement").value == 'Medical' && this.projectGeneral.get('productService').value == 'sup'){
        this.projectGeneral.get('smallBusines').setValue("N/A");
      //  this.projectGeneral.get('smallBusines').disable();

        this.projectGeneral.get('acqAlternative').setValue("N/A");
       // this.projectGeneral.get('acqAlternative').disable();

        this.projectGeneral.get('specialcontractingmethod').setValue("N/A");
      //  this.projectGeneral.get('specialcontractingmethod').disable();

      //this.projectGeneral.get('specialcontractingmethodText').setValue("");
      //  this.projectGeneral.get('specialcontractingmethodText').disable();

        this.projectGeneral.get('contractingmethodText').setValue("N/A");
       // this.projectGeneral.get('contractingmethodText').disable();

        this.projectGeneral.get('subcontractCompetition').setValue("N/A");
      //  this.projectGeneral.get('subcontractCompetition').disable();


        this.projectGeneral.get('uniqueSolicitationClauses').setValue("N/A");
       // this.projectGeneral.get('uniqueSolicitationClauses').disable();

        this.projectGeneral.get('governmentFurnishedProperty').setValue("N/A");
       // this.projectGeneral.get('governmentFurnishedProperty').disable();


        this.projectGeneral.get('governmentFurnishedInformation').setValue("N/A");
       // this.projectGeneral.get('governmentFurnishedInformation').disable();

        this.projectGeneral.get('managementInformationRequirements').setValue("N/A");
       // this.projectGeneral.get('managementInformationRequirements').disable();

        this.projectGeneral.get('leasePurchase').setValue("N/A");
       // this.projectGeneral.get('leasePurchase').disable();

       this.projectGeneral.get('compatibility').setValue("N/A");
       this.projectGeneral.get('constraints').setValue("N/A");
       this.projectGeneral.get('spareParts').setValue("N/A");
       this.patchSow = "N/A";
       this.patchTrade = {
        coastGoals: "N/A",
       }
       this.patchSecurity = {
        contractorFacility: "N/A",
       }
       this.patchConsideration = {
        tradeOff: "N/A",
        majorComponents: "N/A",
        priorities: "N/A",
        makeBuy: "N/A",
        otherConsiderations: "N/A",
        govtPerformance: "N/A"
       }
      } 
      if (this.projectGeneral.get('productService').value == 'svc') {

        this.projectGeneral.get('smallBusines').setValue();
      //  this.projectGeneral.get('smallBusines').enable();

        this.projectGeneral.get('acqAlternative').setValue();
        //this.projectGeneral.get('acqAlternative').enable();

        this.projectGeneral.get('specialcontractingmethod').setValue();
       // this.projectGeneral.get('specialcontractingmethod').enable();

      //  this.projectGeneral.get('specialcontractingmethodText').setValue();
      //  this.projectGeneral.get('specialcontractingmethodText').enable();

        this.projectGeneral.get('contractingmethodText').setValue();
       // this.projectGeneral.get('contractingmethodText').enable();

        this.projectGeneral.get('subcontractCompetition').setValue();
      //  this.projectGeneral.get('subcontractCompetition').enable();


        this.projectGeneral.get('uniqueSolicitationClauses').setValue();
      //  this.projectGeneral.get('uniqueSolicitationClauses').enable();

        this.projectGeneral.get('governmentFurnishedProperty').setValue();
      //  this.projectGeneral.get('governmentFurnishedProperty').enable();


        this.projectGeneral.get('governmentFurnishedInformation').setValue();
       // this.projectGeneral.get('governmentFurnishedInformation').enable();

        this.projectGeneral.get('managementInformationRequirements').setValue();
      //  this.projectGeneral.get('managementInformationRequirements').enable();

        this.projectGeneral.get('leasePurchase').setValue();
       // this.projectGeneral.get('leasePurchase').enable();

       this.projectGeneral.get('compatibility').setValue("");
       this.projectGeneral.get('constraints').setValue("");
       this.projectGeneral.get('spareParts').setValue("");
       this.patchSow = "";
       this.patchTrade = {
        coastGoals: "",
       }
       this.patchSecurity = {
        contractorFacility: "",
       }
       this.patchConsideration = {
        tradeOff: "",
        majorComponents: "",
        priorities: "",
        makeBuy: "",
        otherConsiderations: "",
        govtPerformance: ""
       }
      }
      this.ap.generalPageEvent.next("Page Refresh");
    }, 300);
  }

  getUsers() {
    this.ap.getAllusers().subscribe(response => {
      ////console.log(response.list);
      this.collaborateUsers = response.list.filter(user => {
        // //console.log(this.authenticatedUser);

        if(user.firstName == 'Not') {
        return user.firstName! = this.authenticatedUser;
        } else if(user.firstName != 'Not') {
          var fullName = user.email.split('@')[0].split('.');
          var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
          var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
          var emailUser = firstName;
          return emailUser! = this.emailUsers;
        }
      });

      this.collaborateUsers.map(i => {
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
      // //console.log(this.collaborateUsers);
    });
  }

  getCO() {
    this.ap.getAllusers().subscribe(response => {
      this.coFilter = response.list.filter(co => {
        return co.roles.every(
          type => type.roleName == "Contracting Officer (CO)"
        );
      });

      this.coFilter.map(i => {
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
  updatePointsofcontact(item) {
    //console.log(item);
    if(item.firstName == 'Not') {
      this.projectGeneral.get("coName").setValue((item.email.split('@')[0].split('.'))[0].charAt(0).toUpperCase() +  (item.email.split('@')[0].split('.'))[0].slice(1));
    } else if (item.firstName != 'Not') {
      this.projectGeneral.get("coName").setValue(item.firstName+" "+item.lastName);
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
    if(item.firstName == 'Not'){
      this.projectGeneral.get("commentMention").controls[0].patchValue({
        value: (item.email.split('@')[0].split('.'))[0].charAt(0).toUpperCase() +  (item.email.split('@')[0].split('.'))[0].slice(1),
        Address: item.address,
        Phone: item.phone,
        email: item.email
    });
    } else if(item.firstName != 'Not') {
      this.projectGeneral.get("commentMention").controls[0].patchValue({
        value: item.firstName+" "+item.lastName,
        Address: item.address,
        Phone: item.phone,
        email: item.email
    });
    }
    var name;
    var fullName = item.email.split('@')[0].split('.');
    var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
    var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
    this.emailUsers = firstName+" "+lastName;
    if(item.firstName == "Not"){
      name = firstName
    } else {
      name = item.firstName+" "+item.lastName
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
    console.log("Email User",item.email)
    var dataEmail = {
      to: item.email,
      subject: "Point of Contact"+" "+"AP#"+this.getapno,
      body: this.usercommentsname+" "+"added you as Point of Contact for AP#"+this.getapno
    }
    console.log(dataEmail);

    this.ap.postEmail(dataEmail).subscribe(Response => {console.log(Response)});
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
      email: ""
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

    if(this.collabadata.firstName == 'Not'){
    control.push(
      this.fb.group({
        value: new FormControl((this.collabadata.email.split('@')[0].split('.'))[0].charAt(0).toUpperCase() +  (this.collabadata.email.split('@')[0].split('.'))[0].slice(1)),
        Address: new FormControl(this.collabadata.address),
        Phone: new FormControl(this.collabadata.phone),
        email: new FormControl(this.collabadata.email)
      })
    );
    control3.push(
      this.fb.group({
        value: new FormControl((this.collabadata.email.split('@')[0].split('.'))[0].charAt(0).toUpperCase() +  (this.collabadata.email.split('@')[0].split('.'))[0].slice(1)),
        Address: new FormControl(this.collabadata.address),
        Phone: new FormControl(this.collabadata.phone),
        email: new FormControl(this.collabadata.email)
      })
    );
    } else if(this.collabadata.firstName != 'Not') {

      control.push(
        this.fb.group({
          value: new FormControl(this.collabadata.firstName+" "+this.collabadata.lastName),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email)
        })
      );
      control3.push(
        this.fb.group({
          value: new FormControl(this.collabadata.firstName+" "+this.collabadata.lastName),
          Address: new FormControl(this.collabadata.address),
          Phone: new FormControl(this.collabadata.phone),
          email: new FormControl(this.collabadata.email)
        })
      );
  }

  var name;
  var fullName = this.collabadata.email.split('@')[0].split('.');
  var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
  var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
  this.emailUsers = firstName+" "+lastName;
  if(this.collabadata.firstName == "Not"){
    name = this.emailUsers
  } else {
    name = this.collabadata.firstName+" "+this.collabadata.lastName
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

    var dataEmail = {
      to: this.collabadata.email,
      subject: "Shared Acquisition"+" "+"AP#"+this.getapno,
      body: this.usercommentsname+" "+"shared acquisition with you for AP" + " " + "#" + this.getapno
    }
    this.ap.postEmail(dataEmail).subscribe(Response => {console.log(Response)});
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
    let value =event.target.value;
    this.projectGeneral
      .get("estimatedBudgett")
      .setValue(parseFloat(value));
  }

  performanceBasedAcqYes(){
    this.performanceBased = false;
  }

  performanceBasedAcqNo(){
    this.performanceBased = true;
  }


  selectFFP(val) {
    console.log(val);
    this.ffp = true;
  }

  scrollTop() {
    $(window).scrollTop(120);
  }

  scrollTop2() {
    $(window).scrollTop(170);
  }
  scrollTop3() {
    $(window).scrollTop(240);
  }
  scrollTop4() {
    $(window).scrollTop(300);
  }

  startDatess() {
    this.endDatess = true;
    var date = this.projectGeneral.get('popstartDate').value;
    console.log("popstartDate", date);
  }
  


}