import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  Form
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgForm } from "@angular/forms";
import { AuthenticationService } from "../../../Services/authentication.service";
import { AcquisitionService } from "../../../Services/acquisition.service";
import {ContractService} from "../../../Services/contract.service"
declare var $: any;

@Component({
  selector: 'app-contractdetail',
  templateUrl: './contractdetail.component.html',
  styleUrls: ['../solicitationdetail/solicitationdetail.component.css']
})
export class ContractdetailComponent implements OnInit {

  inputValue: string;
  formData: any;
  acqDetails;
  accuracy;
  sectionData;
  sectionData1;
  picture;
  role;
  name;
  hide: boolean = true;
  solno;
  navtabdata;
  hideme:boolean = true;
  projecttitle

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private ap: AcquisitionService,
    private cs: ContractService,
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.params.contractid;
    console.log(this.solno);
    this.getAp();
    // $(document).ready(function() {
    //   $("#sidebar").mCustomScrollbar({
    //     theme: "minimal"
    //   });
    //   $("#sidebarCollapse").on("click", function() {
    //     $("#sidebar, #content").toggleClass("active");
    //     $(".collapse.in").toggleClass("in");
    //     $("a[aria-expanded=true]").attr("aria-expanded", "false");
    //   });
    // });
  }

getAp() {
  this.cs.getfullContract(this.solno).subscribe((response) => {
    console.log(response);
    this.navtabdata = response;
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

  collaborate() {

  }
}
