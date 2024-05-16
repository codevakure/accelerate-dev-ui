import { Response } from "@angular/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
declare var $: any;

@Component({
  selector: "app-evaluatevendor",
  templateUrl: "./evaluatevendor.component.html",
  styleUrls: ["./evaluatevendor.component.css"]
})
export class EvaluatevendorComponent implements OnInit {
  solno;
  vendorEvaluation;
  vendorID;
  id;
  evaluationData;
  columnsToDisplay = ['files','status','myScore','action'];

  evaluateVendor = {
    sol_no: "",
    vendor: "Vendor 1",
    date: "01/12/2019 3:00 PM EST",
    status: "",
    vendorFiles: [
      {
        volumeName: "Volume1: Past Performance",
        pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
        strengths: "",
        weekness: "",
        Deficiencies: "",
        Remarks: "",
       // Score: "",
        status: "",
      },
    ],
    supportedFiles: [
      {
        fileName: "filename",
        pdfSrc: "assets/Resources/security-privacy-language_1.pdf",
      },
    ]
  };
  constructor(    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ap: AcquisitionService) {
      this.vendorID = this.route.snapshot.parent.firstChild.params.vendorName;
    }

  ngOnInit() {
    this.solno = this.route.snapshot.parent.parent.params.sid;
    console.log(this.vendorID);
    
    this.vendorEvaluation = new FormGroup({
      vendor: new FormControl(""),
      date: new FormControl(""),
      status: new FormControl(""),
      vendorFiles: new FormArray([
        //this.initFiles()
      ]),
      supportedFiles: new FormArray([
        //this.initPdf()
      ])
    });
    //Uncomment the getProposalEvaluation if we need something
  //  this.ap.getPropsalevaluation(this.vendorID).subscribe(response1 => {
     // console.log(response1);
      var response = this.evaluateVendor;
      console.log("Static Response",response)
      this.vendorEvaluation.get('vendor').setValue(response.vendor);
      this.vendorEvaluation.get('date').setValue(response.date);
      this.vendorEvaluation.get('status').setValue(response.status);
      let control = <FormArray>this.vendorEvaluation.controls.vendorFiles;
      let control1 = <FormArray>this.vendorEvaluation.controls.supportedFiles;
      response.vendorFiles.forEach(li => { 
        control.push(
          this.fb.group({
            volumeName: li.volumeName,
            pdfSrc: li.pdfSrc,
            strengths: li.strengths,
            weekness: li.weekness,
            Deficiencies: li.Deficiencies,
            Remarks: li.Remarks,
           // Score: li.Score,
            status: li.status,
          })
        );
      });
      response.supportedFiles.forEach(ul => { 
        control1.push(
          this.fb.group({
            fileName: ul.fileName,
            pdfSrc: ul.pdfSrc,
          })
        );
      });
  //  });
  
  
  }

  
  initFiles() {
    return new FormGroup({
      volumeName: new FormControl("", Validators.required),
      pdfSrc: new FormControl("", Validators.required),
      strengths: new FormControl("", Validators.required),
      weekness: new FormControl("", Validators.required),
      Deficiencies: new FormControl("", Validators.required),
      Remarks: new FormControl("", Validators.required),
      //Score: new FormControl("", Validators.required),
      status: new FormControl("", Validators.required),
    });
  }

  initPdf() {
    return new FormGroup({
      fileName: new FormControl("", Validators.required),
      pdfSrc: new FormControl("", Validators.required),
    });
  }

  addFiles() {
    const control = <FormArray>this.vendorEvaluation.get("vendorFiles");
    control.push(this.initFiles());
  }

  addPdf() {
    const control = <FormArray>this.vendorEvaluation.get("supportedFiles");
    control.push(this.initPdf());
  }

  getFiles(form) {
    return form.controls.vendorFiles.controls;
  }

  
  getPdf(form) {
    return form.controls.supportedFiles.controls;
  }

  back() {
    this.router.navigate(["/home/sol/" + this.solno + "/proposalevaluation/"]);
  }


  onChange(f) {
    //console.log(f.value);
    //console.log(this.vendorID);
    this.ap.patchProposalevaluation(this.vendorID, f.value).subscribe((response)=> {
      console.log(response);
    })
  }
  
  saveComplete(i) {
   // console.log(i);
    const control = <FormArray>this.vendorEvaluation.get("vendorFiles").controls[i].get("status").setValue("Complete");
    this.onChange(this.vendorEvaluation);
    this.updatePropsoalEvaluation();
  }

  updatePropsoalEvaluation(){
    let all =<FormArray>this.vendorEvaluation.get("vendorFiles").controls ;
    let length = all.length;
    let completed=0;
    for(let i=0;i<length;i++){
      all[i].get("status").value == "Complete"? completed = completed+1:""; 
      console.log(completed) 
    };
    let updatepropsalstatus = (status)=>{
      let data ={
        "status":status
      }
      console.log(data)
      this.ap.patchProposalevaluation(this.vendorID,data).subscribe(response =>{
        console.log(response)
      })
    }
    setTimeout(() => {
      completed == 5?updatepropsalstatus("Completed"):completed == 0?updatepropsalstatus("Pending Evaluation"):updatepropsalstatus("Pending Evaluation");
    }, 500);
  }


  savePending(i) {
    //console.log(i);
    const control = <FormArray>this.vendorEvaluation.get("vendorFiles").controls[i].get("status").setValue("Pending");
    this.onChange(this.vendorEvaluation);
    this.updatePropsoalEvaluation();
  }
}
