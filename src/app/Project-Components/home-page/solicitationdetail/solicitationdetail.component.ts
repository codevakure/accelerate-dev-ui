import { SectionsService } from "./../../../Services/sections.service";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { FormsService } from "../../../Services/forms.service";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { AuthenticationService } from "../../../Services/authentication.service";
import { acquisition } from "../../../Models/acquisition.model";
import { ClausesService } from "./../../../Services/clauses.service";
import { formModel } from "../../../Models/forms.model";
declare var $: any;
import { Observable, of, timer } from "rxjs";

@Component({
  selector: "app-solicitationdetail",
  templateUrl: "./solicitationdetail.component.html",
  styleUrls: ["./solicitationdetail.component.css"],
})
export class SolicitationdetailComponent implements OnInit {
  inputValue: string;
  formData: any;
  acqDetails: acquisition[];
  accuracy;
  sectionData;
  sectionData1;
  picture;
  role;
  name;
  hide: boolean = true;
  solno;
  routeHeader;
  navtabdata;
  sectionHeader;
  status;
  previewState;
  solType1: boolean = false;
  solType2: boolean = false;
  ap_no;
  @Input() data: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService,
    private clauseService: ClausesService,
    private acqService: AcquisitionService,
    private auth: AuthenticationService,
    private sectionService: SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.params.sid;
    console.log(document.getElementById('solicitationnav'))
    this.previewState = 'Solicitation';
    this.route.url.subscribe((event) => {
      ////console.log(event);
      //console.log(this.route.snapshot["_routerState"].url.split("/home/sol/"+this.solno+"/")[1]);
      this.routeHeader = this.route.snapshot["_routerState"].url.split(
        "/home/sol/" + this.solno + "/"
      )[1];
      if (this.routeHeader == undefined) {
        this.sectionHeader = "Form";
      } else if (this.routeHeader == "suppliesandservices") {
        this.sectionHeader = "Supplies and Services";
      } else if (this.routeHeader == "statementofwork") {
        this.sectionHeader = "Statement of Work";
      } else if (this.routeHeader == "packagingandmarking") {
        this.sectionHeader = "Packaging and Marking";
      } else if (this.routeHeader == "inspectionandacceptance") {
        this.sectionHeader = "Inspection and Acceptance";
      } else if (this.routeHeader == "deliveriesandperformance") {
        this.sectionHeader = "Deliveries and Performance";
      } else if (this.routeHeader == "contractadmindata") {
        this.sectionHeader = "Contract Administration Data";
      } else if (this.routeHeader == "specialcontractreq") {
        this.sectionHeader = "Special Contract Requirements";
      } else if (this.routeHeader == "contractclauses") {
        this.sectionHeader = "Clauses";
      } else if (this.routeHeader == "attachmentsinfo") {
        this.sectionHeader = "Attachments";
      } else if (this.routeHeader == "representationandcerts") {
        this.sectionHeader = "Representation and Certifications";
      } else if (this.routeHeader == "instructions") {
        this.sectionHeader = "Instructions";
      } else if (this.routeHeader == "evluationfactors") {
        this.sectionHeader = "Evaluation Factors";
      }
      console.log("Route Header",this.routeHeader);
      //this.displayValue('Varun');
      this.acqService.preview.subscribe((value) => {
        ////console.log("Value Updated"+value);
        this.data = value;
        this.ngOnInit();
      });
    });
    // $(document).ready(function () {
    //   $("#sidebar").mCustomScrollbar({
    //     theme: "minimal",
    //   });

    //   $("#sidebarCollapse").on("click", function () {
    //     $("#sidebar, #content").toggleClass("active");
    //     $(".collapse.in").toggleClass("in");
    //     $("a[aria-expanded=true]").attr("aria-expanded", "false");
    //   });
    // });

    this.acqService.getsoldappids(this.solno).subscribe((response) => {
      ////console.log(response);
      this.formData = response;
      this.ap_no = response.ap_no;
      console.log(response.solId);
      this.acqService.getSolicitation(response.solId).subscribe((response) => {
        console.log("Solicitation Response", response);
        //this.solType = response.productKind;
        if (
          (response.Source == true && response.productKind == "full") ||
          response.Source == false ||
          response.productKind == ""
        ) {
          this.solType1 = true;
          this.solType2 = false;
          console.log("Solicitation Type", this.solType1, this.solType2);
        } else if (response.Source == true && response.productKind != "full") {
          this.solType1 = false;
          this.solType2 = true;
          console.log("Solicitation Type", this.solType1, this.solType2);
        }
        this.navtabdata = response;
        this.status = response.status;

        setTimeout(()=>{
          if(this.status == 'Amendment') {
            document.getElementById('pageSubmenu').classList.remove('show');
            document.getElementById('ammendmentSubmenu').classList.add('show');
            this.router.navigate(['/home/sol', this.solno, 'sf30']);
            this.previewState = 'Amendment';
          } else {
            document.getElementById('pageSubmenu').classList.add('show');
          }
        },10)

        //console.log("Testing Status"+ " " +response.ID)
        //console.log("response from solicitation"+response);
      });
    });
  }

  sidebarFunction() {
    var x = document.getElementById("material");
    if (x.innerHTML === "arrow_forward") {
      x.innerHTML = "arrow_back";
      this.hide = true;
    } else {
      x.innerHTML = "arrow_forward";
      this.hide = false;
    }
  }

  clickIgceCollapse() {
    let elements = document.querySelectorAll(".collapse");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("show");
    }
  }

  getClick(){
    console.log('Clicked');
    this.previewState = 'Amendment';
  }

  getClickSol(){
    console.log('sol');
    this.previewState = 'Solicitation';
  }
}
