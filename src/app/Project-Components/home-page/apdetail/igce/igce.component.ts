import { Component, OnInit, NgZone, HostListener } from "@angular/core";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { acquisition } from "../../../../Models/acquisition.model";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { TouchSequence } from "selenium-webdriver";
import { Cookie } from "ng2-cookies/ng2-cookies";
import * as jwt_decode from "jwt-decode";
import { CurrencyPipe } from '@angular/common';
declare var $: any;
const resolvedPromise = Promise.resolve(null);

@Component({
  selector: "app-igce",
  templateUrl: "./igce.component.html",
  styleUrls: ["./igce.component.css"]
})
export class IgceComponent implements OnInit {
  status;
  budget;
  total = 0;
  igce;
  apdata;
  endDate;
  igceid;
  igcedata;
  userGroup;
  rowGroup;
  picture;
  role;
  paramid;
  popStart;
  popEnd;
  minDate;
  maxDate;
  baseStart;
  baseEnd;
  daee;
  data;
  interval;
  baseValidationStart;
  baseValidationEnd;
  change;
  index = 0;
  na = "N/A";
  Labor = "LH";
  unitPrice = 1;
  awardType = [
    "Select Group",
    "Freight",
    "Labor",
    "Other Direct Cost",
    "Product",
    "Travel",
    "Custom"
  ];
  unitofMesure = ["Each"];
  unitofMesureService = ["T&M", "LH"];
  selectedProduct: boolean = true;
  selectedService: boolean = false;
  selected;
  totalbaseyear = 0;
  servicestart;
  serviceend;
  dateValidation;
  getapno;
  igcetotal;
  valueBudget;
  userid;
  subscription;
  igceData;
  remainingTotal: Array<any>;
  ngtotalcost: Array<any>;
  indexi;
  indexj;
  indexk;
  remainingbudget;
  count;
  endDatess: boolean = false;
  igceTotal1;
  estimatedTotal1;
  cPipe = new CurrencyPipe('en-US');

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private spinner: NgxSpinnerService,
    private zone: NgZone,
    private currencyPipe: CurrencyPipe
  ) {
    
    console.log("updated");
  }

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.getAp();
    this.igce = new FormGroup({
      igceTotal: new FormControl(""),
      optionYears: new FormArray([
      ], Validators.maxLength(4))
    });

   
  
    this.igce.get("optionYears").valueChanges.subscribe((values, index) => {
      this.igcetotal = 0;

      values.forEach((clinsValues, k) => {
        clinsValues.totalbaseyear = 0;
        clinsValues.clins.forEach((clins, i) => {
          var total = 0;
         // console.log(clins.estimatedTotal);
          clins.productrows.forEach((productrows, j) => {
            productrows.totalcost =
              productrows.quantity * (productrows.unitprice.replace(/\,/g, ""));
            total += productrows.quantity * (productrows.unitprice.replace(/\,/g, ""));
            $("#total" + k + i + j).val(productrows.totalcost.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            $("#unitprice" + k + i + j).blur(function() {  
              $("#unitprice" + k + i + j).val((parseFloat(productrows.unitprice.replace(/\,/g,'')).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) 
            });
            $("#clinTotal" + k + i).text("$"+total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
          });
          clins.clinTotal = total;
          this.estimatedTotal1 = clins.estimatedTotal;
          if(this.estimatedTotal1 > this.valueBudget){
            //clins.estimatedTotal = "0";
            this.toastr.error("Estimated Budget is greater than target budget");
          }
          clins.remainingTotal = (clins.estimatedTotal.replace(/\,/g, "")) - total;
         // console.log(clins.remainingTotal);
          clinsValues.totalbaseyear += clins.clinTotal;
        //  console.log(clinsValues.totalbaseyear);
          $("#totalbaseyear" + k).text("$"+clinsValues.totalbaseyear.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
          $("#remaining" + k + i).text(clins.remainingTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        
          var inputValue;
          $("#estimated" + k + i).blur(function() {
           // console.log("Total Estimated Varun",clins.estimatedTotal.replace(/\,/g,''));
           $("#estimated" + k + i).val(parseFloat(clins.estimatedTotal.replace(/\,/g,'')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) 
         // $("#estimated" + k + i).val(parseFloat(clins.estimatedTotal).toFixed(2))
          });
        });
        this.igcetotal += clinsValues.totalbaseyear;
        if(this.igcetotal == 0) {
          clinsValues.totalbaseyear = 0;
          $("#totalbaseyear" + k).text("$"+clinsValues.totalbaseyear.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
        this.igceTotal1 =  this.igcetotal;
        this.igce.get("igceTotal").setValue(this.igcetotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));

      });
    });
    this.igce.disable();

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

  initBase() {
    return new FormGroup({
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      totalbaseyear: new FormControl(""),
      clins: new FormArray([
        // this.initClin(),
      ])
    });
  }

  
  initClin() {
    return new FormGroup({
      clinId: new FormControl(""),
      estimatedTotal: new FormControl(""),
      remainingTotal: new FormControl(""),
      clinTitle: new FormControl(this.selected),
      clinTotal: new FormControl(this.total),
      productrows: new FormArray([this.initProduct()])
    });
  }

  initProduct() {
    return new FormGroup({
      clin: new FormControl(""),
      acctcode: new FormControl(""),
      description: new FormControl(""),
      quantity: new FormControl(""),
      unitmesure: new FormControl(""),
      unitprice: new FormControl(""),
      totalcost: new FormControl("")
    });
  }

  addOption() {
    const control = <FormArray>this.igce.get("optionYears");
    //console.log(control.controls.length);
    this.index = control.controls.length;
    control.push(this.initBase());
  }

  indexPass(pass){
    console.log(pass);
  }

  addClin(k, event) {
    const newVal = event.target.value;
    const elements = document.getElementsByTagName("select");
    for (var j = 0; j < elements.length; j++) {
      elements[j].selectedIndex = 0;
    }
    const control = <FormArray>(
      this.igce.get("optionYears").controls[k].get("clins")
    );
    if (newVal == "Labor") {
      this.selected = "Labor";
      //console.log(this.selected);
      control.push(this.initClin());
      this.selectedProduct = true;
      this.selectedService = false;
    } else if (newVal == "Product") {
      this.selected = "Product";
      this.selectedService = true;
      this.selectedProduct = false;
      control.push(this.initClin());
    } else if (newVal == "Travel") {
      this.selected = "Travel";
      this.selectedService = true;
      this.selectedProduct = false;
      control.push(this.initClin());
    } else if (newVal == "Freight") {
      this.selected = "Freight";
      this.selectedService = true;
      this.selectedProduct = false;
      control.push(this.initClin());
    } else if (newVal == "Other Direct Cost") {
      this.selected = "Other Direct Cost";
      this.selectedService = true;
      this.selectedProduct = false;
      control.push(this.initClin());
    } else if (newVal == "Custom") {
      this.selected = "Custom";
      this.selectedService = true;
      this.selectedProduct = false;
      control.push(this.initClin());
    }
    setTimeout(() => {
      //let len =  this.evaluations.get("evaluationCriteria").length;
      let len = this.igce.get("optionYears").controls[k].get("clins").length;
      let ic = len -1;
      let id = '#prefix' + ic;
      let element = document.querySelector(id)
      element.classList.add('show');
      //Script to srcoll  to the position of the element added Factor
     let etop = (<HTMLDivElement>element).getBoundingClientRect().top;
     console.log(etop);
     window.scroll(0,etop-200);

     }, 200);
  }

  addProduct(k, i) {
    const control = <FormArray>this.igce
      .get("optionYears")
      .controls[i].get("clins")
      .controls[k].get("productrows");
    control.push(this.initProduct());
  }

  getOptions(form) {
    return form.controls.optionYears.controls;
  }
  getClins(form) {
    return form.controls.clins.controls;
  }
  getProducts(form) {
    return form.controls.productrows.controls;
  }

  removeOption(k) {
    //console.log(this.count)
    const control = <FormArray>this.igce.get("optionYears");
    control.removeAt(k);
    this.index = k - 1;
    this.onChange(this.igce);
  }

  removeProduct(control, index) {
    control.removeAt(index);
    this.onChange(this.igce);
  }

  removeClin(control, index) {
    control.removeAt(index);
    this.onChange(this.igce);
  }


  formatMoney(value) {
    const temp = `${value}`.replace(/\,/g, "");
    var testVar = this.currencyPipe.transform(temp).replace("$", "");
    console.log("Format Money", temp, testVar)
    return this.currencyPipe.transform(temp).replace("$", "");
}


  convert(value) {
    if (value == "") {
      return value;
    } else if (value != "") {
      value = value.indexOf(".") == "-1" ? value + ".00" : value;
      let splitvalue = value.split(".");
      let dollars = splitvalue[0];
      let dot = ".";
      let decimals = splitvalue[1].toString().substr(0, 2);
      decimals = decimals.length == "1" ? decimals + "0" : decimals;
      return `${dollars}${dot}${decimals}`;
    }
  }

  setclins(x) {
    let array = new FormArray([]);
    x.clins.forEach(y => {
      array.push(
        this.fb.group({
          estimatedTotal: parseFloat(y.estimatedTotal.replace(/\,/g,'')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
         // estimatedTotal: parseFloat(y.estimatedTotal).toFixed(2),
          remainingTotal: parseFloat(y.remainingTotal).toFixed(2),
          clinTitle: y.clinTitle,
          clinTotal: parseFloat(y.clinTotal).toFixed(2),
          productrows: this.setrows(y)
        })
      );
    });
    return array;
  }

  setrows(y) {
    let arr = new FormArray([]);
    y.productrows.forEach((z, index, array) => {

      arr.push(
        this.fb.group({
          clin: z.clin,
          acctcode: z.acctcode,
          description: z.description,
          quantity: z.quantity,
          unitmesure: z.unitmesure,
          unitprice: parseFloat(z.unitprice.replace(/\,/g,'')).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          totalcost: z.totalcost
        })
      );
    });
    return arr;
  }
  onChange(igce) {
    //console.log(igce.value);
    this.change = igce.value;
    this.ap.patchIGCE(this.igceid, igce.value).subscribe(response => {
      if (response) {
        console.log("IGCE from response",response.error.statusCode);
        if(response.error.statusCode == 403){
          this.toastr.error("Option Period dates cannot overlap");
        }
        // setTimeout(() =>
        //   this.toastr.success(
        //     "IGCE updated successfully",
        //     "Updated Successfully",
        //     { timeOut: 2000 }
        //   )
        // );
      } else {
      }
    });
  }

  getAp() {
    this.ap.getApdappids(this.getapno).subscribe(response => {
      var totalbase = 0;
      this.ap.getApdata(response.apId).subscribe(response => {
        this.apdata = response;
        this.popStart = this.apdata.popstartDate;
        this.popEnd = this.apdata.popendDate;
        this.budget = parseFloat(this.apdata.estimatedBudgett).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.valueBudget = this.apdata.estimatedBudgett;
        console.log("Value Budget", this.budget);
        this.status = this.apdata.status;
      });
      this.igceid = response.igceId;

      this.ap.getIGCE(this.igceid).subscribe(response => {
        this.igceData = response;
        console.log(this.count);
        console.log(this.igceData);
     
        if (this.igceData) {
          let control = <FormArray>this.igce.controls.optionYears;
          if (this.igceData.optionYears != undefined) {
            this.igceData.optionYears.forEach((oy, index, array) => {
           
             if(oy.startDate == ''){
              this.endDatess = false;
            } else {
                this.endDatess = true;
            }
              this.baseStart = oy.startDate;
              
              this.baseEnd = oy.endDate;
              if (new Date(this.baseStart) < new Date(this.popStart)) {
                this.toastr.error("Base Start Date validation error");
                this.baseValidationStart = "";
              } else if (new Date(this.baseEnd) > new Date(this.popEnd)) {
                this.toastr.error("Base End Date validation error");
                this.baseValidationEnd = "";
              } else {
                this.baseValidationStart = this.baseStart;
                this.baseValidationEnd = this.baseEnd;
              }

              control.push(
                this.fb.group({
                  startDate: this.baseValidationStart,
                  endDate: this.baseValidationEnd,
                  totalbaseyear: oy.totalbaseyear,
                  clins: this.setclins(oy)
                })
              );
            });
            this.igceData.igceTotal = this.igcetotal;
            this.igce.get("igceTotal").setValue(response.igceTotal);
            if (this.igcetotal > this.budget) {
              this.toastr.error("IGCE Total is greater than Target Budget");
            }
          } else {
            this.addOption();
          }
        } else {
        }
      });
    });
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
  currentIndex(index) {
    this.index = index;
  }

  startDatess() {
    this.endDatess = true;
  }

  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}
