import { Component, OnInit} from '@angular/core';
import { DatePipe} from '@angular/common';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import * as $ from 'jquery';
import { FormsService } from '../../../../Services/forms.service';
import { AcquisitionService } from '../../../../Services/acquisition.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';

import { callbackify } from 'util';
import { FormdetailComponent } from '../formdetail/formdetail.component';

@Component({
  selector: 'app-contract-generation',
  templateUrl: './contract-generation.component.html',
  styleUrls: ['./contract-generation.component.css']
})
export class ContractGenerationComponent implements OnInit {

  date = '';
  allsoldata;
  coAddress;
  solnum;
  solid;
  StartDate;
  requisitionNumber;
  solicitationNumber;
  orderNumber;
  contractNumber;
  UNr;
  SA;
  percent;
  SB;
  HZ;
  SD;
  WSB;
  ED;
  a8;
  RFQ;
  IFB;
  RFP;
  DueDate = undefined;
  bType;
  Name;
  Phone;
  soldata;
  htmldata=[];
  status;
  boo;
  solno;
  formid;
  hideclausepreview = false;

  pos = { x: 0, y: 0 };
  constructor(
    private route: ActivatedRoute,
    private httpClient: Http, 
    private formservice:FormsService, 
    private acqservice:AcquisitionService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);
    this.getfullsol();
    //Script to load the Solication Section HTML Data
    
  }

  getfullsol() {
    let pathname = window.location;
    this.solnum=pathname.toString().split("sol/")[1].split('/')[0];
    this.acqservice.getfullsol(this.solnum).subscribe(res =>{
      console.log("full SOL Respond",res);
      this.allsoldata =res;
      console.log(this.allsoldata);
      let form = this.allsoldata.FORM;
      console.log("Form data",this.allsoldata);
      this.soldata = this.allsoldata.FORM;
      this.formid = this.soldata.id;
      console.log("SOLICIATION DATA",this.soldata);
      //Script to remove the Publish feature if status is exported.
      this.status = this.allsoldata.SOL.status;
      this.solid = this.allsoldata.SOL.id;
      console.log("SOL ID", this.solid)
      
      
      // console.log("evaluations",this.allsoldata.Evaludation_Criteria.description); 
      console.log("status on initiation", this.status);
      this.boo = this.status == 'Published'? true:false;
      
      console.log("boo value =",this.boo +";SOL ID"+this.status.id);
    
      for(var key in form){
        if(form[key] == true){
          console.log("Key",key)
          $("#"+key).html("X");
          break
        }else{
          $("#"+key).html("")
        }
       
      };

      if( form.method_of_solicitation){
        console.log("method_of_solicitation",form.method_of_solicitation);
        document.getElementById(form.method_of_solicitation).innerHTML = "X";
      }

      //convert date
      this.date = this.soldata.offerDueDate ? this.datepipe.transform(new Date(this.soldata.offerDueDate +" "+this.soldata.offerDueTime),"MM-dd-yyyy h:mm:ss a"):'';

      console.log("Adding section contents to document")
      let printview = document.getElementById("pdfadd");
      printview.innerHTML += this.allsoldata.SUPPLY.description? this.allsoldata.SUPPLY.description:'';
      printview.innerHTML += this.allsoldata.SOW.description?this.allsoldata.SOW.description:'';
      printview.innerHTML += this.allsoldata.PACKAGING.description?this.allsoldata.PACKAGING.description:'';
      printview.innerHTML += this.allsoldata.INSPECTION.description?this.allsoldata.INSPECTION.description:'';
      printview.innerHTML += this.allsoldata.DELIVERY.description?this.allsoldata.DELIVERY.description:'';
      printview.innerHTML += this.allsoldata.CONTRACT_ADMIN.description?this.allsoldata.CONTRACT_ADMIN.description:'';
      printview.innerHTML += this.allsoldata.CONTRACT_REQ.description?this.allsoldata.CONTRACT_REQ.description:'';
      printview.innerHTML += this.allsoldata.CONTRACT_CLAUSE.description?this.allsoldata.CONTRACT_CLAUSE.description:'';
      printview.innerHTML += this.allsoldata.CERT.description?this.allsoldata.CERT.description:'';
      printview.innerHTML += this.allsoldata.INSTRUCTION.description?this.allsoldata.INSTRUCTION.description:'';
      printview.innerHTML += this.allsoldata.Evaludation_Criteria.mandatoryCriterias?this.allsoldata.Evaludation_Criteria.mandatoryCriterias:'';
      var imgsrc = "assets/SF1449image.jpg"
      $("#image").attr("src",imgsrc);

    });

  }


  //Script to make the  form selections editable()
  edit(event) {
    $(event.currentTarget).prop("contenteditable","true")
  }

  unedit(event) {
    $(event.currentTarget).prop("contenteditable","false")
  }

  makepdf(verification) {
    
  let soldata = this.soldata;
  let solid = this.solid;
   
    $(".close").click();
    $("#sidebar").hide();
    $(".col-md-11").hide();
    $(".savebutton").hide();
    window.onbeforeprint= function (){
    
    }
    setTimeout(function(){
      window.print();
    },500);
    window.onafterprint= function (){
      $("#newpdf").css({"margin-left":"0px","margin-top":"0px"});
      $("#sidebar").show("fade-in");
      $(".col-md-11").show("fade-in");
      $(".savebutton").show();
    }

//  Patch request for publish dont remove this add your code on top of this john

  this.status == "Published"? console.log("status validation exceuted") :this.acqservice.getsoldappids(this.solno).subscribe(response => {
    console.log(response.solId);
    let rightnow = $.now();
    let date = this.datepipe.transform(new Date(rightnow),"MM-dd-yyyy");
    this.soldata.startdate = date;
    var data = {
      startdate: date,
      status: "Published"
    };
    console.log(data);
    this.acqservice.putSolData(this.solid, data).subscribe(response => {
      console.log(response);
      console.log("Updated");
    });

    this.formservice.putFormData(this.formid,data).subscribe(response => {
      console.log(response);
      console.log("Updated");
    });

    
  });
  
  } 


  // new position from mouse event
setPosition(e) {
  console.log('drawmousedown',e);
  console.log(this.pos.x, this.pos.y)
  this.pos.x = e.offsetX ;
  this.pos.y = e.offsetY;
}


d = "";
 draw(e) {
    console.log(e);
    console.log("intial draw position",this.pos.x, this.pos.y);
    console.log("offset",e.offsetX , e.offsetY)
    // function to allow the user to create mulitple seperate signature vectors.
    let reset = () =>{
      console.log( this.d.search("Z"));
      this.d.search("Z") > -1? '' :this.d += ' Z M ';
      return
    }
    // function to allow the user to create mulitple seperate signature vectors.
    let recordsig = ()=>{
      //remove the end marker in the svg;
      this.d =this.d.replace("Z",'')
      
      this.d += " " + this.pos.x +" " + this.pos.y;
      this.setPosition(e);
      $("#write").attr("d",this.d)
    }

    e.buttons !== 1? reset():recordsig();

  

 
 
   
}

}
