import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder, FormArray} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";

declare var $: any;
const resolvedPromise = Promise.resolve(null);

@Component({
  selector: "app-reqform",
  templateUrl: "./reqform.component.html",
  styleUrls: ["./reqform.component.css"]
})

export class ReqformComponent implements OnInit {  
  change;
  getapno;
  id;
  index;
  requisition;
  title = 'Requisition Form';
  unitofMesureService = ["EA", "T&M", "LH"];
  

  itemQuantity: Array <any>;
  itemUnitPrice: Array <any>;
  itemTotalCost: Array <number>;
  itemTotalCostStr: Array <string>;
  itemAllocation: Array <number>;
  itemAllocationTotal: Array <number>;
  itemAllocationTotalBalance: Array <number>;
  itemAllocationPercent: Array <number>;
  itemAllocationPercentBalance: Array <number>;
  userexists;
  userid;
  status;
  finalValue;

  accountcodes = [
    { officeInfo: "OGAPA", accountCodes: "CF16140000.2016.7004300000.5003000000.25100.61000001", select: false, allocation: 0},
    { officeInfo: "OGAPA", accountCodes: "CF16140000.2016.7004300000.5003000000.25100.61000002", select: false, allocation: 0},
    { officeInfo: "OGAPA", accountCodes: "CF16140000.2016.7004300000.5003000000.25100.61000003", select: false, allocation: 0},
    { officeInfo: "OGAPA", accountCodes: "CF16140000.2016.7004300000.5003000000.25100.61000004", select: false, allocation: 0},
    { officeInfo: "OGAPA", accountCodes: "CF16140000.2016.7004300000.5003000000.25100.61000005", select: false, allocation: 0},
  ];

  constructor(
    private ap: AcquisitionService,
    private auth: AuthenticationService,
    private cp: CurrencyPipe,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private ref: ChangeDetectorRef
  ) {}

  // Initial function
  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid; 
    this.itemQuantity = [];
    this.itemUnitPrice = [];  
    this.itemTotalCost = [];  
    this.itemTotalCostStr = [];
    this.itemAllocation = [];
    this.itemAllocationTotal = [];
    this.itemAllocationTotalBalance = [];
    this.itemAllocationPercent = [];
    this.itemAllocationPercentBalance = [];
    
      this.getRequisition();
 
    
    this.requisition = new FormGroup({
      lineTotal: new FormControl([]),
      lineItems: new FormArray([]),
      option: new FormControl(""),
    });

    // Script to run (valueChanges) everytime requsitions values are updated.
    this.requisition.get("lineItems").valueChanges.subscribe(values => {
      values.forEach((ac,index) => {
        resolvedPromise.then(() => {

          if (ac.acctcode[index]) {
            console.log("ac.acctcode[index]!!!",index,ac.acctcode[index]);
            var calcAlloTotal = 0;
            this.itemAllocationTotal[index] = ac.acctcode.reduce((acc, cur) => { 
              cur.allocation = parseFloat(cur.allocation);

              if (isNaN(cur.allocation) == true) { 
                cur.allocation = 0;
              }

              if (cur.allocation < 0) { 
                cur.allocation = 0;
              }

              calcAlloTotal = calcAlloTotal + cur.allocation;
              if (cur.allocation > 0) {
                console.log("isNaN(cur.allocation)",isNaN(cur.allocation));
                console.log("cur.allocation",cur.allocation);
                console.log("calcAlloTotal",calcAlloTotal);
              }
            },0);
            this.itemAllocationTotal[index] = calcAlloTotal;
            console.log("this.itemAllocationTotal[index]",this.itemAllocationTotal[index]);

            ac.acctcode[index].allocation = (Math.round(ac.acctcode[index].allocation * 100) / 100).toFixed(2);
          }

          this.itemQuantity[index] = ac.quantity; 
          this.itemUnitPrice[index] = ac.unitprice;   
          this.itemTotalCost[index] = Math.round((this.itemUnitPrice[index] * this.itemQuantity[index]) * 100) / 100 || 0;
          this.itemTotalCostStr[index] = this.itemTotalCost[index].toFixed(2);


          console.log("Quantity x Unit Price x Total Cost",
            this.itemQuantity[index],
            this.itemUnitPrice[index],
            this.itemTotalCost[index]);      

          ac.clintotal = parseFloat(ac.clintotal);
          this.itemAllocationTotalBalance[index] = ac.clintotal - this.itemAllocationTotal[index];
          console.log("this.itemAllocationTotalBalance[index]",this.itemAllocationTotalBalance[index]);
          console.log("ac.clintotal",ac.clintotal);


          console.log("this.itemAllocationTotal[index]",this.itemAllocationTotal[index]);
          this.itemAllocationPercent[index] = 100 * (this.itemAllocationTotal[index] / ac.clintotal); 

          console.log("this.itemAllocationPercent[index]",this.itemAllocationPercent[index]);       
          console.log("this.itemAllocationTotal[index]",this.itemAllocationTotal[index]); 
          
          if (this.itemAllocationTotal[index] > ac.clintotal) {
            this.itemAllocationTotal[index] = ac.clintotal;   
            this.itemAllocationPercent[index] = 100;    
            console.log("this.itemAllocationPercent[index]",this.itemAllocationPercent[index]);       
            console.log("this.itemAllocationTotal[index]",this.itemAllocationTotal[index]); 
          }
          this.itemAllocationPercentBalance[index] = 100 - this.itemAllocationPercent[index];
          //Script to add the percentage to the index row
          let elem:NodeListOf<HTMLElement> = document.querySelectorAll(".percentUpdateCalculate");
          if (elem[index]) 
            elem[index].innerHTML = Math.floor(parseFloat(this.itemAllocationPercent[index].toFixed(2))).toString();
        }); 
      });

      //script to update the total cost in the table
      var lineTotalString = 0;
      resolvedPromise.then(() => {
        this.requisition.get("lineTotal").setValue(
          values.reduce(  
            (acc, cur) => {
              lineTotalString = lineTotalString + parseFloat(cur.clintotal);
              // console.log("acc",acc);
            }, 0)
        );
        if (this.requisition.get("lineTotal").value > 0)
          lineTotalString = (this.requisition.get("lineTotal").value).toFixed(2);
        this.requisition.get("lineTotal").setValue(lineTotalString);
        console.log("getlineTotal.value",this.requisition.get("lineTotal").value);
      });
    });
    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  fillEmptyInput(event,inputtype) {
   
    if (event.keyCode == 69) {
      event.preventDefault(); 
    }
    console.log("event",event);
    // console.log("current",current);
    console.log("inputtype",inputtype);
    let current = event.target.valueAsNumber || event.target.value || 0;
    current = parseFloat(current);
    if ((!current) || (current == NaN) || (current == "NaN") || (current == "") || (current < 0)) {
      current = 0;
      console.log("Couldn't retrieve target input. Default to Zero",current);
    } 
    event.target.value = current;
    console.log("event.target.value",event.target.value);
  }

  addCommas = (newCurrent,inputtype) => {
    var length = newCurrent.length;
    console.log("inputtype is ", inputtype);
    console.log("newCurrent is ", newCurrent);
    console.log("newCurrent length is ", length);

    
    
    if ((inputtype == 'q') && length >= 4 ) {
      var loopCount = length - 1; // newCurrent.charAt(0 to loopCount)
      var thousands = length - 3; // Chunk that requires commas
      var newNumberString = ""; // New Output
      while (loopCount >= 0) {
        if (loopCount > thousands) {
          newNumberString = newCurrent.charAt(loopCount) + newNumberString;
        } else if ((thousands == loopCount) || (thousands % 3 == 0)) {
          newNumberString = "," + newCurrent.charAt(loopCount) + newNumberString;
        } else {
          newNumberString = newCurrent.charAt(loopCount) + newNumberString;
        }
        loopCount = loopCount - 1;
      } 
      
      // 4 321 098 765 432.10 // 16 char // last 6 exist // 10/3 = 3%1 = 0,1,2,3,[1]
    } else if (length >= 7) { // 5432.10 = 7 char | 

      var loopCount = length - 1; // newCurrent.charAt(0 to loopCount)
      var thousands = length - 6; // Chunk that requires commas
      var newNumberString = ""; // New Output
      while (loopCount >= 0) {
        if (loopCount > thousands) {
          newNumberString = newCurrent.charAt(loopCount) + newNumberString;
          console.log("1 newNumberString",newNumberString);
        } else if ((thousands == loopCount) || (thousands % 3 == 0)) {
          newNumberString = "," + newCurrent.charAt(loopCount) + newNumberString;
          console.log("2 newNumberString",newNumberString);
        } else {
          newNumberString = newCurrent.charAt(loopCount) + newNumberString;
          console.log("3 newNumberString",newNumberString);
        }
        loopCount = loopCount - 1;
      } 
    } else {
      newNumberString = newCurrent;
    }
    console.log("Return Comma String X", newNumberString);
    return newNumberString;
  }

  

  formatNumber(event,inputtype,i) {
    console.log("event",event);
    // console.log("current",current);
    console.log("inputtype",inputtype);
    console.log("this.itemAllocationTotalBalance[i]",this.itemAllocationTotalBalance[i]);
    let current = event.target.valueAsNumber || event.target.value || '0.00';
    console.log("current",current);
    current = parseFloat(current.replace(/,/g, ''));
    
    console.log("current",current);
    
    if (inputtype=='a') {
        
      let targetValue = parseFloat(current);
      if (targetValue < 0) targetValue = 0;
      let max = current + this.itemAllocationTotalBalance[i];
      if (this.itemAllocationTotalBalance[i] < 0)
        this.itemAllocationTotalBalance[i] = 0;
      console.log("max",max);
      console.log("current",current);
      console.log("this.itemAllocationTotalBalance[i]",this.itemAllocationTotalBalance[i]);
      if (max < 0) max = 0; console.log("max", max);
      // let createmax = (event,value)=>{
      //   event.target.value = format(value);
      //   console.log("event.target.value", event.target.value);
      // }
      max <= targetValue ? targetValue = max : console.log("not maxed", false)
      if (current > this.itemTotalCost[i]) current = this.itemTotalCost[i];
      console.log("max vs targetValue", max,targetValue);  
      console.log("Current after 'a'", current);
      current = targetValue;
    } 
    let format = (newCurrent) => {

      // Remove beginning zero
      let newCurrentStr = newCurrent.toString();
      let newIndex = newCurrentStr.indexOf(".");
      let newCharIndex = newCurrentStr.charAt(0);
      console.log("newIndex", newIndex);
      console.log("newCurrent", newCurrent);
      console.log("newCharIndex", newCharIndex);
      
      if ((newCurrent == 0) || (newCurrent == '.0') || (newCurrent == '.00') || (newCurrent == '0.0')) {
        newCurrent = '0.00';
        console.log("Remove Zeros A", newCurrent);
      } else if ((newIndex > 1) && (newCharIndex == 0)) {
        newCurrent = newCurrent.substr(1);
        // newCurrent = removeZero(newCurrent);
        console.log("Remove Zeros B", newCurrent);
      } else if (
          (newCurrent != '0.00') && 
          (newIndex < 0) && 
          (newCharIndex == 0) && 
          (newCurrent.length > 1)
        ) {
        newCurrent = newCurrent.substr(1);
        // newCurrent = removeZero(newCurrent);
        console.log("Remove Zeros C", newCurrent);
      } else {
        newCurrent = newCurrent;
        console.log("Remove Zeros D", newCurrent);
      }
      
      // .split.(".").length - 1

      newCurrentStr = newCurrent.toString();
      // If decimals exist
      if (newCurrentStr.split(".")[1]) {
        if (newCurrentStr.split(".")[1].length == 0) {
          newCurrent = newCurrentStr.split(".")[0] + "." + newCurrentStr.split(".")[1] + '00';
          console.log("A Decimals exist",newCurrent);
        } else if (newCurrentStr.split(".")[1].length == 1) {
          console.log("B Decimals exist",newCurrent);
          newCurrent = newCurrentStr.split(".")[0] + "." + newCurrentStr.split(".")[1] + '0';
        } else if (newCurrentStr.split(".")[1].length > 2) {
          console.log("C Decimals exist",newCurrent);
          newCurrent = newCurrentStr.split(".")[0] + "." + newCurrentStr.split(".")[1].charAt(0) + newCurrentStr.split(".")[1].charAt(1);
        }
        console.log("Decimals exist",newCurrent);
      } else {
        newCurrent = newCurrent + ".00";
        console.log("No Decimals",newIndex,newCurrent);
      } 

      // If first character is .
      if (newCurrent.charAt(0) == '.') {
        newCurrent = "0" + newCurrent;
        console.log("newCurrent",newCurrent);
      }
  
      // If all zeros
      while ((parseInt(newCurrent.charAt(0)) == 0) && (parseInt(newCurrent.charAt(1)) == 0)) {        
        newCurrent = newCurrent.substr(1);
        console.log("While 0 newCurrent",newCurrent); 
      }  

      // If Quantity, make whole number
      if (inputtype == 'q') {
        newCurrent = newCurrent.split(".")[0];
        console.log("q newCurrent",newCurrent);
      }
      
      newIndex = newCurrentStr.indexOf(".");
      // If final character is decimal
      if (inputtype == 'q' && (newCurrent.length - 1 == newIndex)) {
        newCurrent = newCurrent.split(".")[0];
        console.log("newCurrent",newCurrent);
      } else if (newCurrent.length - 1 == newIndex) {
        newCurrent = newCurrent + "00";
        console.log("newCurrent",newCurrent);
      }

      return newCurrent;

    }
    current = format(current);
    console.log("A Final value", current);
    current = this.addCommas(current,inputtype);
    console.log("B Final value", current);
    if (current == 0) current = '0.00';    
    console.log("C Final value", current);
    event.target.value = current;
  }

  convert(value){ 
    value= value.indexOf(".") == '-1'? value+'.00':value; 
    let splitvalue = value.split('.'); 
    let dollars = splitvalue[0]+'.'; 
    let decimals = splitvalue[1].toString().substr(0,2); 
    decimals = decimals.length == '1'?decimals+'0':decimals; 
    return `${dollars}${decimals}`
  } 

  // Called from ngOnInit()
  getRequisition() {
    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.id = response.requisitionId;
      this.ap.getApdata(response.apId).subscribe(response => {
        this.status = response.status;
        this.userexists = response.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted'){
          this.requisition.disable();
        } else  {
          this.requisition.enable();
        }
      });
      this.ap.getRequisition(this.id).subscribe(response => {
        this.requisition.get("option").setValue(response.option);
        let control = <FormArray>this.requisition.controls.lineItems;
        if (response.lineItems) {
          response.lineItems.forEach(li => {
            li.acctcode.forEach(element => {
            });

            control.push(
              this.fb.group({
                itemno: li.itemno,
                acctcode: this.setcode(li.acctcode),
                description: li.description,
                quantity: li.quantity,
                unitofmeasure: li.unitofmeasure,
                unitprice: this.convert(li.unitprice),
                clintotal: li.clintotal,
              })
            );
          });
        } else {
          this.addLines();
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

  // Called from getRequisition()
  setcode(x) {
    let array = new FormArray([]);
    x.forEach(y => {
      console.log("y",y);
      console.log("y.allocation",y.allocation);
      array.push(
        this.fb.group({
          officeInfo: y.officeInfo,
          accountCodes: y.accountCodes,
          select: y.select,
          allocation: y.allocation,
        })
      );
    });
    return array;
  }

  // Called from reqform.component.html to build the main table
  getLines(form) {
    return form.controls.lineItems.controls;
  }

  // Called from reqform.component.html to build the modal table
  getAcctcodes(form) {
    return form.controls.acctcode.controls;
  }


  saveAllocationWithEnter(event: any,i) {
    if (event.keyCode === 13) {
      event.preventDefault();
      // console.log("this.itemAllocationPercent[i]",);
      if (this.itemAllocationPercent[i]==100)
        document.getElementById("inputAllocationButton"+i).click();
    }
  }

  // Called from reqform.component.html to observe main table
  onChange(requisition) {
    this.ap.patchRequisition(this.id, requisition.value).subscribe(response => {
      if (response) 
        console.log(response);
    });
  }

  // Called from addLines() // Resets the values in the main table
  initLineitems() {
    return new FormGroup({
      itemno: new FormControl(""),
      acctcode: new FormArray([]),
      description: new FormControl("", Validators.required),
      quantity: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      unitofmeasure: new FormControl("", Validators.required),
      unitprice: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]*$")
      ]),
      clintotal: new FormControl([], Validators.required),
    });
  }

  // Called from reqform.component.html 
  addAcctcodes(i) {
    const control = <FormArray>(this.requisition.get("lineItems").controls[i].get("acctcode"));
    // console.log("control",control);

    if (control.value.length == 0) {
      console.log("accountcodes",this.accountcodes[i]);
      this.accountcodes.forEach((li, index) => {
        control.push(
          this.fb.group({
            officeInfo: new FormControl(li.officeInfo, Validators.required),
            accountCodes: new FormControl(li.accountCodes, Validators.required),
            select: new FormControl(li.select, Validators.required),
            allocation: new FormControl(li.allocation, Validators.required),
          })
        );
      });
    }
  }

  // Called from getRequisition() & reqform.component.html // Creates a new line on the main table
  addLines() {
    const control = <FormArray>this.requisition.get("lineItems");
    this.index = control.controls.length;
    control.push(this.initLineitems());
  }

  // Called from reqform.component.html // Removes a line on the main table
  removeLines(i) {
    const control = <FormArray>this.requisition.get("lineItems");
    control.removeAt(i);
    this.index = i - 1;
    this.onChange(this.requisition);
  }
}