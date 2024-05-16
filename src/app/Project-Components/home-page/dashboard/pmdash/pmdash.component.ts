import { Headers } from "@angular/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormControl,
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { NgSelectComponent } from "@ng-select/ng-select";
import { environment } from "../../../../../environments/environment";
import { Cookie } from "ng2-cookies/ng2-cookies";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, BaseChartDirective, Label } from "ng2-charts";
import * as pluginAnnotations from "chartjs-plugin-annotation";
declare var $: any;
import * as jwt_decode from "jwt-decode";
import { ConsoleService } from "@ng-select/ng-select/ng-select/console.service";

@Component({
  selector: "app-pmdash",
  templateUrl: "./pmdash.component.html",
  styleUrls: ["./pmdash.component.css"],
})
export class PmdashComponent implements OnInit {
  acqDashArray;

  public lineChartData: ChartDataSets[];
  // public lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartLabels: Label[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    annotation: {},
  };
  public lineChartColors: Color[] = [
    {
      //Acquisitions
      backgroundColor: "rgba(28, 78, 128, 0.288)",
      borderColor: "#1C4E80",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      //solicitations
      backgroundColor: "#0d53af73",
      borderColor: "#0d53af",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      //contracts
      backgroundColor: "#2e74dc71",
      borderColor: "#2e73dc",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    //maintainAspectRatio: false,
    legend: {
      position: "bottom",
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          // const label = ctx.chart.data.labels[ctx.dataIndex];
          const label = ctx.chart.data.labels[""];
          return label;
        },
      },
    },
  };
  public pieChartLabels: Label[] = [
    "Acquisitions",
    "Solicitations",
    "Contracts",
  ];
  public pieChartData;
  public pieChartType: ChartType = "pie";
  public pieChartLegend = false;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ["rgba(28, 78, 128, 0.288)", "#0d53af73", "#2e74dc71"],
    },
  ];

  role = "";
  UNITED_URL = environment.LOGOUT;
  UNITEDs_URL = environment.UNITED_ENV;
  acqcount;
  solcount;
  currentday;
  psc_value;
  message;
  userValue;
  psc;
  today = new Date();
  dd;
  mm; //January is 0!
  yyyy = this.today.getFullYear();
  strDateTime;
  //strDateTime = new Date().getFullYear() + "-" + "0" + (new Date().getMonth() + 1) + "-" + "0" + new Date().getDate();
  //strDateTime =  new Date().getFullYear() + "-" +'0'+(new Date().getMonth()+1) + "-"+new Date().getDate();
  followon: boolean = true;
  newrequirement: boolean = false;
  contractnumbers: boolean = false;
  productorservices: boolean = false;
  catalogues: boolean = false;
  inputservices: boolean = false;
  similarcontracts: boolean = false;
  submit: boolean = false;
  followOnbtn: boolean = false;
  btnNext: boolean = false;
  btnPrev: boolean = false;
  exisitngCon: boolean = false;
  productsb: boolean = false;
  servicesb: boolean = false;
  dateboolean: boolean = false;
  constboolean: boolean = false;
  productsNext: boolean = false;
  inputboolean: boolean = false;
  pandstype: boolean = false;
  btnDate: boolean = false;
  estimatedBudget: boolean = false;
  estimatedBudgets: boolean = false;
  values;
  apdata;
  estimatedkeyBudget;
  poc;
  getattributes;
  username;
  pscResults;
  selectedItem: any = "";
  inputChanged: any = "";
  wikiItems: any[] = [];
  pscname = "";
  userid;

  catalog = [
    "7510 Office Supplies",
    "7520 Office Device and Accessories",
    "7530 Stationary and Record Forms",
    "7540 Stadard Forms",
  ];

  categoryManagement = [
    {
      full: "Aircraft, Ships/Submarines & Land Vehicles",
      Acronym: "Aircraft, Ships/Submarines and Land Vehicles",
    },
    {
      full: "Clothing, Textiles and Subsistence S&E",
      Acronym: "Clothing, Textiles and Subsistence S and E",
    },
    {
      full: "Electronic & Communication Equipment",
      Acronym: "Electronic and Communication Equipment",
    },
    {
      full: "Electronic & Communication Services",
      Acronym: "Electronic and Communication Services",
    },
    {
      full: "Equipment Related Services",
      Acronym: "Equipment Related Services",
    },
    {
      full: "Facilities & Construction",
      Acronym: "Facilities and Construction%20",
    },
    { full: "Human Capital", Acronym: "Human Capital" },
    {
      full: "Industrial Products & Services",
      Acronym: "Industrial Products and Services",
    },
    { full: "Information Technology", Acronym: "IT" },
    { full: "Medical", Acronym: "Medical" },
    { full: "Miscellaneous S&E", Acronym: "Miscellaneous S and E" },
    { full: "Office Management", Acronym: "Office Management" },
    { full: "Professional Services", Acronym: "Professional Services" },
    { full: "Research and Development", Acronym: "Research and Development" },
    { full: "Security and Protection", Acronym: "Security and Protection" },
    { full: "Sustainment S&E", Acronym: "Sustainment S and E" },
    {
      full: "Transportation and Logistics Services",
      Acronym: "Transportation and Logistics Services",
    },
    { full: "Travel & Lodging", Acronym: "Travel and Lodging" },
    { full: "Weapons & Ammunition", Acronym: "Weapons and Ammunition%20" },
  ];

  pscList = [
    { full: "Architect-Engineering", Acronym: "CMLSUP", disabled: "disabled" },
    { full: "Construction", Acronym: "svcU", disabled: "disabled" },
    {
      full: "Combination of Product/Services",
      Acronym: "AEU",
      disabled: "enabled",
    },
    { full: "Communication Services", Acronym: "COMSVC", disabled: "disabled" },
    {
      full: "Dismantling, Demolition or Removal of Improvements",
      Acronym: "CON",
      disabled: "disabled",
    },
    { full: "Facilities", Acronym: "DDR", disabled: "disabled" },
    { full: "Leasing of Motor Vehicles", Acronym: "LMV", disabled: "disabled" },
    { full: "Products", Acronym: "sup" },
    { full: "Research & Development", Acronym: "SVCE", disabled: "disabled" },
    { full: "Services", Acronym: "svc" },
    { full: "Transportation", Acronym: "TRNE", disabled: "disabled" },
    { full: "Utility Services", Acronym: "UTLSVC", disabled: "disabled" },
  ];

  products = ["Supplies/Equipment", "IT Equipment"];
  collaborator = [
    {
      firstName: "Varun Kumar Reddy",
      Address: "Public Health Department, Washington, DC",
      Phone: "+19876543210",
      email: "varun.muppidi@aurotechcorp.com",
    },
  ];
  services = [
    "Research and Development",
    "Non R&D Support Services",
    "Design-Build",
    "Architect Engineer (A&E) Services",
    "Information Technology Support Services",
  ];
  projectGeneral: FormGroup;
  address;
  email;
  phone;
  roleSession;
  contractCount;
  general;
  marketResearch;
  sow;
  reqform;
  eval;
  attachments;
  igce;
  tradeoff;
  estimate;
  competition;
  compatibility;
  constraints;
  errorMessage;
  acqPercentage;
  solPercentage;
  contractPercentage;
  emailUser;
  token;
  username1;
  rUsername;
  solDashArray;
  followons: boolean = true;
  createButton: boolean = false;
  sowArray = [];
  evalArray = [];
  sowArray2 = [];
  evalArray2 = [];

  constructor(
    private acqco: AcquisitionService,
    private router: Router,
    private auth: AuthenticationService,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.router.navigate(["/home"]);
    this.roleSession = sessionStorage.getItem("hhs_role");
    this.token = Cookie.get("hhs-a-token");
    //console.log("Role Session" + this.roleSession);
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
    this.acqco.getUserprofile().subscribe(
      (response) => {
        //console.log(response);
        // this.emailUser = this.email.substring(0, this.email.lastIndexOf("@"));
        // console.log(this.emailUser);
        if (response.roles[0].roleName == "Contracting Officer (CO)") {
          this.role = "Contracting Officer";
        } else if (response.roles[0].roleName == "Program Manager (PM)") {
          this.role = "Program Officer";
          this.createButton = true;
        } else {
          console.log("Error With User");
          setTimeout(() => this.toastr.success("User Doesnot exist"));
          document.location.href = `${this.UNITED_URL}`;
          setTimeout(() => {
            document.location.href = `${this.UNITEDs_URL}/landing`;
          }, 300);
          Cookie.deleteAll();
        }

        var fullName = response.email.split("@")[0].split(".");
        var firstName =
          fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
        var lastName =
          fullName[fullName.length - 1].charAt(0).toUpperCase() +
          fullName[fullName.length - 1].slice(1);
        this.emailUser = firstName;
        console.log(this.emailUser);
        //   this.username = response.firstName + " " +response.lastName;
        this.username1 = response.firstName;
        this.address = response.address;
        this.phone = response.phone;
        this.email = response.email;
        this.userid = response.pkId;
        if (this.username1 == "Not") {
          this.username = this.emailUser;
        } else if (this.username1 != "Not") {
          //  this.rUsername= this.username;
          this.username = response.firstName + " " + response.lastName;
        }
      },
      (error) => {
        setTimeout(() =>
          this.toastr.error(
            "Error occured in user service dashboard component" + error
          )
        );
        console.log(
          "Error occured in user service dashboard component" + error
        );
        //   if (confirm("Session will be logged out in 1min. If you want to continue press Ok")){
        //     this.ap.refreshToken();
        //  }
        //  else
        //  {
        //     console.log("Error occured in dashboard component"+error);
        //     document.location.href = `${this.UNITED_URL}`;
        //      setTimeout(() => {
        //        document.location.href = `${this.UNITEDs_URL}/landing`;
        //      }, 300);
        //     Cookie.deleteAll();
        //   }
        //   console.log(error);
        //   setTimeout(()=>{
        //     document.location.href = `${this.UNITED_URL}`;
        //      setTimeout(() => {
        //        document.location.href = `${this.UNITEDs_URL}/landing`;
        //      }, 300);
        //     Cookie.deleteAll();
        //   }, 60000);
      }
    );
    this.projectGeneral = new FormGroup({
      projectTitle: new FormControl(""),
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
      eightA: new FormControl(false),
      SDVOB: new FormControl(false),
      smallBusiness: new FormControl(false),
      smallBusines: new FormControl(""),
      EDWOSB: new FormControl(false),
      hubzoneSB: new FormControl(false),
      womenSB: new FormControl(false),
      Bundling: new FormControl(""),
      contractVehicle: new FormControl(""),
      contractType: new FormControl(""),
      uniqueSolicitationClauses: new FormControl(""),
      governmentFurnishedProperty: new FormControl(""),
      governmentFurnishedInformation: new FormControl(""),
      //Source: new FormControl(""),
      awardType: new FormControl(""),
      coName: new FormControl(""),
      coAddress: new FormControl(""),
      coPhone: new FormControl(""),
      coEmail: new FormControl(""),
      rName: new FormControl(),
      rAddress: new FormControl(),
      rPhone: new FormControl(),
      rEmail: new FormControl(),
      baName: new FormControl("Mehul"),
      baAddress: new FormControl("Department of Health, Baltimore, MD"),
      baPhone: new FormControl("+19876543210"),
      baEmail: new FormControl("mehul@hhs.gov"),
      is_commercial: new FormControl(false),
      noncomoption2: new FormControl(false),
      noncomoption3: new FormControl(false),
      noncomoption4: new FormControl(false),
      noncomoption5: new FormControl(false),
      noncomoption6: new FormControl(false),
      contractOfficer: new FormControl(""),
      createdDate: new FormControl(new Date()),
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
      subcontractCompetition: new FormControl(""),
      productkind: new FormControl(""),
      servicekind: new FormControl(""),
      similarNumber: new FormControl(""),
      similarContract: new FormControl(""),
      selection1: new FormControl(""),
      itornonit: new FormControl("IT"),
      description: new FormControl(""),
      createdUserid: new FormControl(""),
      status: new FormControl("Draft"),
      productKind: new FormControl(""),
      serviceKind: new FormControl(""),
      createdUsername: new FormControl(""),
      specialcontractingmethod: new FormControl(""),
      idiq: new FormControl(""),
      specialcontractingmethodText: new FormControl(""),
      contractingmethodText: new FormControl(""),
      organizationalConflictText: new FormControl(""),
      organizationalConflict: new FormControl(""),
      collaborators: new FormArray([
        //this.initCollab()
      ]),
      commentMention: new FormArray([
        //this.initCollab()
      ]),
      sharedCollaborators: this.fb.array([]),
      pointsofContact: this.fb.array([]),
      corNominationUsers: this.fb.array([]),
    });

    this.projectGeneral
      .get("estimatedBudgett")
      .valueChanges.subscribe((values) => {
        console.log(values);
        $("#estimatedbudgett").blur(function () {
          $("#estimatedbudgett").val(
            parseFloat(values)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        });
      });
    this.prev();
    this.wish();
    this.acqco.getAcquisitions().subscribe((data) => {
      this.acqcount = data.length;
      this.acqPercentage = this.acqcount * (data.length / 100);
      this.acqco.getSolicitations().subscribe((response) => {
        console.log(response);
        this.solcount = response.length;
        this.solPercentage = this.acqcount * (response.length / 100);
      });
      this.acqco.getContracts().subscribe((response) => {
        this.contractCount = response.length;
        this.contractPercentage = this.acqcount * (response.length / 100);
      });
    });

    //this.searchPsc();

    this.ap.getAcquisitionCount().subscribe((response) => {
      console.log("Acquisition count", response);
      this.acqDashArray = response;
    });

    this.ap.getSolicitationCount().subscribe((response) => {
      console.log("Solicitation Count", response);
      this.solDashArray = response;
    });
  }

  closeModal() {
    var x = document.getElementById("closeModalPmdashboard").click();
    return x;
  }
  // initCollab() {
  //   return new FormGroup({
  //     value: new FormControl(this.username),
  //     Address: new FormControl(this.address),
  //     Phone: new FormControl(this.phone),
  //     email: new FormControl(this.email)
  //   });
  //}

  onSubmit(f) {
    this.projectGeneral.get("createdUserid").setValue(this.userid);
    this.projectGeneral.get("createdUsername").setValue(this.username);
    this.projectGeneral.get("rName").setValue(this.username);
    this.projectGeneral.get("rEmail").setValue(this.email);
    this.projectGeneral.get("rPhone").setValue(this.phone);
    this.projectGeneral
      .get("rAddress")
      .setValue("HHS/OGAPA" + " " + this.address);
    const control = <FormArray>this.projectGeneral.controls["pointsofContact"];
    const control1 = <FormArray>this.projectGeneral.controls["commentMention"];
    const control2 = <FormArray>(
      this.projectGeneral.controls["corNominationUsers"]
    );
    control1.push(
      this.fb.group({
        value: "",
        Address: "",
        Phone: "",
        email: "",
      })
    );
    if (this.username1 == "Not") {
      control1.push(
        this.fb.group({
          value: this.emailUser,
          Address: this.address,
          Phone: this.phone,
          email: this.email,
        })
      );
    } else if (this.username1 != "Not") {
      control1.push(
        this.fb.group({
          value: this.username,
          Address: this.address,
          Phone: this.phone,
          email: this.email,
        })
      );
    }

    control.push(new FormControl(this.userid));
    control.push(new FormControl("1234567890"));

    control2.push(new FormControl(this.userid));
    control2.push(new FormControl("1234567890"));
    console.log(f.value);

    this.ap.postApdapp(f.value).subscribe(
      (response) => {
        if (response) {
          console.log(response);
          //console.log(response.error);
          this.errorMessage = response.error != undefined;
          //console.log(this.errorMessage);
          if (this.errorMessage == false) {
            // setTimeout(() => {
            //   document.getElementById("id1").click();
            // }, 2000);
            // setTimeout(() => {
            //   document.getElementById("id2").click();
            // }, 4000);
            // setTimeout(() => {
            //   document.getElementById("id3").click();
            // }, 6000);
            // setTimeout(() => {
            //   document.getElementById("id4").click();
            // }, 8000);
            this.ap.postComments(response.ap_no, "General").subscribe();
            this.ap.postComments(response.ap_no, "Market Research").subscribe();
            this.ap
              .postComments(response.ap_no, "Statement of Work")
              .subscribe();
            this.ap
              .postComments(response.ap_no, "Requisition Form")
              .subscribe();
            this.ap.postComments(response.ap_no, "Evaluations").subscribe();
            this.ap.postComments(response.ap_no, "Attachments").subscribe();
            this.ap.postComments(response.ap_no, "IGCE").subscribe();

            this.ap.postComments(response.ap_no, "Preview").subscribe();
            this.ap.postComments(response.ap_no, "Resources").subscribe();
            this.ap
              .postComments(response.ap_no, "Points of Contact")
              .subscribe();
            this.ap.postComments(response.ap_no, "Section 508").subscribe();
            this.ap
              .postComments(response.ap_no, "Other Considerations")
              .subscribe();
            this.ap.postComments(response.ap_no, "Security").subscribe();
            this.ap
              .postComments(response.ap_no, "IGCE Description")
              .subscribe();

            // // this.ap.postComments(response.ap_no, "Trade-Offs").subscribe();
            // // this.ap.postComments(response.ap_no, "Estimate").subscribe();
            // // this.ap.postComments(response.ap_no, "Competition").subscribe();
            // // this.ap.postComments(response.ap_no, "Compatibility").subscribe();
            // // this.ap.postComments(response.ap_no, "Constraints").subscribe();
            this.spinner.show();
            this.apdata = response;
            this.ap.putApData(response.apId, f.value).subscribe(response);

            this.ap.getApdata(response.apId).subscribe((response1) => {
              console.log("Ap Data Response", response1);
              console.log("Similar Contracts SimNumber", response1.simNumber);
              this.ap
                .getSowsimilarai(response1.similarNumber)
                .subscribe((response) => {
                  console.log("Similar Contracts", response1.similarNumber);
                  console.log("Response from AI", response);
                  console.log("Response from AI SOW", response.sow);
                  console.log("Response from AI EVAL", response.eval);
                  const sow1 = response.sow;
                  const eval2 = response.eval;
                  // console.log("Response from AI SOW1", sow1);
                  // console.log("Response from AI EVAL1", eval2);
                  for (let val in sow1) {
                    //  console.log("Individual", evalData[val]);
                    const sowValue = {
                      acqNumber: sow1[val],
                      // shortName: sowDesc.shortName,
                      // publicDescription: sowDesc.publicDescription
                    };
                    // console.log(sowValue);
                    this.sowArray.push(sowValue);
                  }

                  this.sowArray.slice(0, 16).forEach((res) => {
                    this.ap
                      .getSowsimilaraidesc(res.acqNumber)
                      .subscribe((acqdesc) => {
                        const sow1Value = {
                          acqNumber: res.acqNumber,
                          publicDescription: acqdesc.publicDescription,
                        };
                        this.sowArray2.push(sow1Value);
                      });
                  });

                  for (let val in eval2) {
                    // console.log("Individual", evalData[val]);
                    const evalValue = {
                      acqNumber: eval2[val],

                      // shortName: evalDesc.shortName,
                      // publicDescription: evalDesc.publicDescription
                    };
                    //  console.log(evalValue);
                    this.evalArray.push(evalValue);
                  }

                  this.evalArray.slice(0, 16).forEach((res) => {
                    this.ap
                      .getSowsimilaraidesc(res.acqNumber)
                      .subscribe((acqdesc) => {
                        const sow1Value = {
                          acqNumber: res.acqNumber,
                          publicDescription: acqdesc.publicDescription,
                        };
                        this.evalArray2.push(sow1Value);
                      });
                  });

                  var data = {
                    ap_no: response1.ap_no,
                    user: this.username,
                    keyword: response1.similarNumber,
                    is_commercial: response1.is_commercial,
                    //estimatedBudget: response1.estimatedBudgett,
                    //contractType: response1.contractType,
                    productService: response1.productService,
                    eval: this.evalArray2,
                    sow: this.sowArray2,
                  };

                  setTimeout(() => {
                    this.toastr.success(
                      "AP Created Successfully",
                      "AP Created",
                      {
                        timeOut: 2000,
                      }
                    );
                    this.ap.postFeedback(data).subscribe((response) => {
                      console.log("Post Keywords", response);
                    });
                  }, 4000);
                });
            });

            this.closeModal();
            this.clearRadio();
            f.reset();
            setTimeout(() => {
              this.spinner.hide();
              this.router.navigate(["/home/" + response.ap_no]);
            }, 5700);
          } else if (this.errorMessage == true) {
            this.closeModal();
            this.clearRadio();
            f.reset();
            this.router.navigate(["/home"]);
            this.toastr.error(
              "Please Contact your Administrator",
              response.error.message,
              {
                timeOut: 2000,
              }
            );
          }
        }
      },
      (error) => {
        //console.log(error);
        this.toastr.error(error);
        this.router.navigate(["/home"]);
      }
    );
  }

  followOn() {
    this.newrequirement = false;
    this.contractnumbers = true;
    this.submit = true;
    this.productorservices = false;
    this.catalogues = false;
    this.inputservices = false;
    this.similarcontracts = false;
    this.followOnbtn = true;
    this.btnNext = false;
    this.btnPrev = false;
    this.constboolean = false;
  }

  followOnn() {
    document.querySelector("#test2").classList.add("override");
    document.querySelector("#test").classList.remove("override");

    this.newrequirement = false;
    this.contractnumbers = true;
    this.submit = true;
    this.productorservices = false;
    this.catalogues = false;
    this.inputservices = false;
    this.similarcontracts = false;
    this.followOnbtn = true;
    this.btnNext = true;
    this.btnPrev = true;
    this.constboolean = false;
  }

  newRequirement() {
    this.contractnumbers = false;
    this.submit = false;
    this.productorservices = false;
    this.exisitngCon = true;
    this.followOnbtn = false;
    this.btnNext = true;
    this.btnPrev = true;
    this.followOnbtn = false;
    this.constboolean = false;
    this.newrequirement = true;
    this.estimatedBudget = false;
  }

  newRequirementt() {
    document.querySelector("#test")
      ? document.querySelector("#test").classList.add("override")
      : "";
    document.querySelector("#test2")
      ? document.querySelector("#test2").classList.remove("override")
      : "";
    this.contractnumbers = false;
    this.newrequirement = true;
    this.submit = false;
    this.productorservices = false;
    this.exisitngCon = true;
    this.followOnbtn = false;
    this.btnNext = true;
    this.btnPrev = true;
    this.followOnbtn = false;
    this.constboolean = false;
    this.estimatedBudget = false;
  }

  yesExisitng() {
    this.contractnumbers = true;
    this.submit = true;
    this.productorservices = false;
    this.catalogues = false;
    this.inputservices = false;
    this.similarcontracts = false;
    this.followOnbtn = true;
    this.btnNext = false;
    this.btnPrev = true;
    this.constboolean = false;
  }

  noExisting() {
    this.contractnumbers = false;
    this.submit = false;
    this.productorservices = true;
    this.exisitngCon = true;
    this.followOnbtn = false;
    this.btnNext = true;
    this.btnPrev = true;
    this.followOnbtn = false;
    this.constboolean = false;
  }

  product() {
    this.productsb = true;
    this.servicesb = false;
    this.catalogues = false;
    this.inputservices = false;
    this.productsNext = false;
    this.submit = false;
    this.btnPrev = true;
    this.btnNext = true;
    this.dateboolean = true;
    this.constboolean = false;
    this.pandstype = false;
  }

  service() {
    this.servicesb = true;
    this.productsb = false;
    this.catalogues = false;
    this.inputservices = true;
    this.submit = false;
    this.btnPrev = true;
    this.pandstype = false;
    this.btnNext = true;
    this.dateboolean = true;
    this.constboolean = false;
  }

  pands() {
    this.productsb = true;
    this.servicesb = true;
    this.catalogues = false;
    this.inputservices = false;
    this.submit = false;
    this.btnPrev = true;
    this.btnNext = false;
    this.dateboolean = true;
    this.constboolean = false;
    this.pandstype = false;
  }

  construction() {
    this.productsb = false;
    this.servicesb = false;
    this.catalogues = false;
    this.inputservices = false;
    this.submit = true;
    this.btnPrev = true;
    this.btnNext = false;
    this.dateboolean = false;
    this.constboolean = true;
    this.pandstype = false;
  }

  productkinds() {
    this.catalogues = true;
    this.inputservices = false;
    this.submit = false;
    this.dateboolean = true;
    this.btnPrev = true;
    this.btnNext = true;
    this.pandstype = true;
  }

  servicekinds() {
    this.catalogues = false;
    this.inputservices = true;
    this.submit = false;
    this.dateboolean = true;
    this.btnPrev = true;
    this.btnNext = false;
    this.pandstype = true;
  }

  productCatalogue() {
    this.btnNext = false;
    this.productsNext = true;
    this.btnPrev = true;
    this.btnDate = true;
  }

  dateSelect() {
    this.btnNext = true;
    this.productsNext = true;
    this.btnPrev = true;
    this.btnDate = true;
  }

  clearRadio() {
    this.followon = true;
    this.newrequirement = true;
    this.contractnumbers = false;
    this.productorservices = false;
    this.catalogues = false;
    this.inputservices = false;
    this.similarcontracts = false;
    this.submit = false;
    this.exisitngCon = false;
  }

  startOver() {
    this.clearRadio();
  }

  wish() {
    this.currentday = new Date().getHours();
    if (this.currentday >= 0 && this.currentday < 12) {
      this.message = "Good Morning,";
    } else if (this.currentday >= 12 && this.currentday < 17) {
      this.message = "Good Afternoon,";
    } else if (this.currentday >= 17 && this.currentday < 24) {
      this.message = "Good Evening,";
    }
  }

  next() {
    $(".nav-tabs > .nav-item > .active")
      .parent()
      .next("li")
      .find("a")
      .trigger("click");
  }

  prev() {
    $(".nav-tabs > .nav-item > .active")
      .parent()
      .prev("li")
      .find("a")
      .trigger("click");
  }

  onKey(event: any) {
    this.values = event.target.value;
  }

  searchAp() {
    this.spinner.show();
    setTimeout(() => {
      document.getElementById("id1").click();
    }, 2000);
    setTimeout(() => {
      document.getElementById("id2").click();
    }, 4000);
    setTimeout(() => {
      document.getElementById("id3").click();
    }, 6000);
    setTimeout(() => {
      document.getElementById("id4").click();
    }, 8000);
    this.ap.getAcqnumber(this.values).subscribe((response) => {
      if (response) {
        setTimeout(() => {
          this.toastr.success(
            "Routing to" + this.values,
            "Acquisition Plan Generated Successfully",
            { timeOut: 2000 }
          );
        }, 8000);
        this.closeModal();
        this.clearRadio();
        setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(["/home/" + response[0].id]);
        }, 10000);
      } else
        setTimeout(() =>
          this.toastr.error(
            "Error occured while creating AP",
            "Error Occured",
            { timeOut: 2000 }
          )
        );
    });
  }

  searchPsc() {
    console.log(this.projectGeneral.get("categoryManagement").value);
    this.ap
      .getPsc(this.projectGeneral.get("categoryManagement").value)
      .subscribe((response) => {
        if (response) {
          this.pscResults = response;
          this.pscResults.map((i) => {
            // i.fullCode = i.psc + " " + i.psc_name;
            i.fullCode = i.full_name;
            return i;
          });
        } else {
        }
      });
  }

  onKeys(event) {
    this.values = event.target.value;
    if (this.values == "") {
      this.inputboolean = false;
    } else {
      this.inputboolean = true;
      this.btnDate = false;
    }
  }

  onKeysss(event) {
    this.values = event.target.value;
    this.projectGeneral
      .get("estimatedBudgett")
      .setValue(parseFloat(this.values));
    //console.log(this.values);
    this.estimatedBudgets = true;
    if (this.values == "") {
      //console.log("value");
      this.estimatedBudgets = false;
    } else {
      this.estimatedBudgets = true;
    }
    // this.estimatedBudget = true;
    // //console.log(this.values);
    // this.estimatedkeyBudget = this.values;
    // //console.log(this.estimatedBudget);
  }

  selectPsc(event) {
    this.pscname = event.target.value;
    //this.searchPsc();
    if (this.pscname == "") {
      this.productsNext = false;
    } else {
      this.productsNext = true;
    }
  }

  getPscname() {
    this.searchPsc();
    this.productsNext = true;
    // //console.log(this.pscname);
  }

  categoryPsc() {
    this.productsNext = true;
    this.searchPsc();
  }

  createAcqplan() {
    setTimeout(() => {
      $('.nav-tabs a[href="#tab1"]').tab("show");
      this.projectGeneral.get("productService").setValue("");
      this.projectGeneral.get("catalogue").setValue("");
      var allRadio = document.getElementsByTagName("input");
      for (var i = 0; i < allRadio.length; i++) {
        if (allRadio[i].type == "radio") {
          allRadio[i].checked = false;
        } else if (allRadio[i].type == "text") {
          allRadio[i].value = "";
        } else if (allRadio[i].type == "date") {
          allRadio[i].value = "";
        }
      }

      this.newrequirement = false;
      this.btnNext = false;
    }, 100);
  }

  // gotoMarketResearch(){
  //   let baseUrl = "https://sandbox.accelerate.hhs.gov/market/?token=";
  //   var tokenInformation = Cookie.get('hhs-a-token');
  //   var decodedValue = this.getDecodedAccessToken(tokenInformation).id;
  //   console.log(decodedValue);
  //   let newurl = `${baseUrl}${decodedValue}`;
  //   console.log(newurl);
  //   window.open(`${baseUrl}${decodedValue}`,"_blank")

  // }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
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

  dateValidation() {
    console.log(this.projectGeneral.get("anticipatedPop").value);
    setTimeout(() => {
      if (this.projectGeneral.get("anticipatedPop").value >= this.strDateTime) {
        console.log(true);
      } else {
        this.projectGeneral.get("anticipatedPop").setValue("");
        this.toastr.error("Please enter valid date");
      }
    }, 2500);
  }
}
