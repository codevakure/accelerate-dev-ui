import { Response } from "@angular/http";
import { Component, OnInit, Input } from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";
declare var $: any;

@Component({
  selector: 'app-vendorreseval',
  templateUrl: './vendorreseval.component.html',
  styleUrls: ['./vendorreseval.component.css']
})
export class VendorresevalComponent implements OnInit {

  evaluationID;
  dltdid;
  solno;
  blockchainRes;
  vendorEvaluation;
  id;
  attachments;
  volumename;
  proposalEvalId;
  volumeIndex;
  evaluations;
  vendorName;
  timeStamp;
  evaluationFactors;
  evaluationVendor;
  vendorAttachments;
  status;
  weakness;
  strengths;
  remarks;
  def;
  factorRows;
  factorIndex;
  factorId;
  evalutionPreview;
  instructionPreview;
  attachmentsdata;
  @Input() i;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ap: AcquisitionService,
    private toastr: ToastrService,
    private sections: SectionsService,
  ) { }

  ngOnInit() {

    this.solno = this.route.snapshot.parent.parent.params.sid;
    this.dltdid = this.route.snapshot.params.vendorName;
    this.proposalEvalId = this.route.snapshot.params.vendorName;
    this.volumeIndex = this.route.snapshot.params.volumeIndex;
    
    this.vendorEvaluation = new FormGroup({
      strengths: new FormControl(),
      weekness: new FormControl(),
      Deficiencies: new FormControl(),
      Remarks: new FormControl(),
      Score: new FormControl(),
      status: new FormControl(),
      vendorstatus:new FormControl(),
    });


    this.evaluations = new FormGroup({
      solNum: new FormControl(),
      vendorName: new FormControl(),
      vendorId: new FormControl(),
      submissionTimeStamp: new FormControl(),
      status: new FormControl(),
      vendorStatus: new FormControl(),
      score: new FormControl(),
      evaluationCriteria: new FormArray([
        //this.initVolumes(),
      ]),
    });
    this.getProposals();
  }

  initVolumes() {
    return new FormGroup({
      volumeName: new FormControl(),
      strengths: new FormControl(),
      weekness: new FormControl(),
      Deficiencies: new FormControl(),
      Remarks: new FormControl(),
      Score: new FormControl(),
      status: new FormControl(),
      uploadFiles: new FormArray([
        //this.inituploadFiles()
      ]),
      factorRows: new FormArray([
        //this.initFactors()
      ]),
    });
  }

  initFactors() {
    return new FormGroup({
      strengths: new FormControl(),
      weekness: new FormControl(),
      Deficiencies: new FormControl(),
      Remarks: new FormControl(),
      Score: new FormControl(),
      factorName: new FormControl(),
      factorText: new FormControl(),
      factorScore: new FormControl("", Validators.required),
      factorScoreUpdate: new FormControl("", Validators.required),
      factorPoints: new FormControl("", Validators.required),
    });
  }

  inituploadFiles(filename, fileLocation) {
    return new FormGroup({
      fileName: new FormControl(filename),
      fileLocation: new FormControl(fileLocation),
    });
  }




  getVolumes(form) {
    return form.controls.evaluationCriteria.controls;
  }
  getFactors(form) {
    return form.controls.factorRows.controls;
  }
  getFiles(form) {
    return form.controls.uploadFiles.controls;
  }

  setfactorrows(x) {
    let arr = new FormArray([]);
    x.factorRows.forEach((y) => {
      //  console.log(y);
      arr.push(
        this.fb.group({
          strengths: y.strengths,
          weekness: y.weekness,
          Deficiencies: y.Deficiencies,
          Remarks: y.Remarks,
          Score: y.score,
          factorName: y.factorName,
          factorText: y.factorText,
          factorScore: y.factorScore,
          factorScoreUpdate: y.factorScoreUpdate,
          factorPoints: y.factorPoints,
        })
      );
      // console.log(tot);
      //this.total = tot;
    });
    return arr;
  }

  setuploadFiles(x) {
    let arr = new FormArray([]);
    //console.log(x.uploadFiles);
    x.uploadFiles.forEach((y) => {
      //console.log(y);
      arr.push(
        this.fb.group({
          fileName: y.fileName,
          fileLocation: y.fileLocation,
        })
      );
    });
    return arr;
  }


  back() {
    this.router.navigate([
      "/home/sol/"+this.solno +"/proposalevaluation/"+this.proposalEvalId
    ]);
  }
  proposals() {
    this.router.navigate([
      "/home/sol/"+this.solno +"/proposalevaluation"
    ]);
  }

  getIndividualProposal(){
    setTimeout(()=>{
      this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].value;
      this.status = this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('status').value;
      this.weakness = this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('weekness').value;
      this.def = this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Deficiencies').value;
      this.remarks = this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Remarks').value;
      this.strengths =this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('strengths').value;
    },300)
  }


  getProposals() {
    this.ap.getsoldappids(this.solno).subscribe((response) => {
      console.log("Sol-dapp", response)
      this.ap
        .getEvaluations(response.evaluationCriteriaId)
        .subscribe((response1) => {
          this.evalutionPreview = response1;
        });
      
        this.sections.getSections(response.instructionId, 'instruction').subscribe(response1 => {
          this.instructionPreview = response1.description;
        });

        this.ap.getAttachments(response.ap_no, 'Attachments').subscribe(response1 => {
          //console.log(response);
          this.attachmentsdata = response1;
        })
    });
    this.ap.getProposalEvalId(this.proposalEvalId).subscribe((response) => {
      console.log("Response from proposals",response, this.volumeIndex);
      this.timeStamp = response.submissionTimeStamp;
      this.volumename = response.evaluationCriteria[this.volumeIndex].volumeName;
      this.vendorName = response.vendorName;
      this.attachments = response.evaluationCriteria[this.volumeIndex].uploadFiles;
      this.factorRows = response.evaluationCriteria[this.volumeIndex].factorRows;
      console.log("Factor Rows", this.factorRows);
      this.vendorEvaluation.get('weekness').setValue(response.evaluationCriteria[this.volumeIndex].weekness);
      this.vendorEvaluation.get('strengths').setValue(response.evaluationCriteria[this.volumeIndex].strengths);
      this.vendorEvaluation.get('Deficiencies').setValue(response.evaluationCriteria[this.volumeIndex].Deficiencies);
      this.vendorEvaluation.get('Remarks').setValue(response.evaluationCriteria[this.volumeIndex].Remarks);
      //this.volumes = response.evaluationCriteria;
      this.evaluationFactors = response;
      this.evaluations.get("solNum").setValue(this.evaluationFactors.solNum);
      this.evaluations
        .get("vendorName")
        .setValue(this.evaluationFactors.vendorName);
      this.evaluations
        .get("vendorId")
        .setValue(this.evaluationFactors.vendorId);
      this.evaluations
        .get("submissionTimeStamp")
        .setValue(this.evaluationFactors.submissionTimeStamp);
      this.evaluations.get("status").setValue(this.evaluationFactors.status);
      this.evaluations
        .get("vendorStatus")
        .setValue(this.evaluationFactors.vendorStatus);
      this.evaluations.get("score").setValue(this.evaluationFactors.score);
      let control = <FormArray>this.evaluations.controls.evaluationCriteria;
      console.log(this.evaluationFactors.evaluationCriteria);
      if (this.evaluationFactors.evaluationCriteria != undefined) {
        //   console.log(evalRes.evaluationCriteria);
        this.evaluationFactors.evaluationCriteria.forEach((x) => {
          console.log(x);
          control.push(
            this.fb.group({
              volumeName: x.volumeName,
              strengths: x.strengths,
              weekness: x.weakness,
              Deficiencies: x.Deficiencies,
              Remarks: x.Remarks,
              Score: x.Score,
              status: x.status,
              factorRows: this.setfactorrows(x),
              uploadFiles: this.setuploadFiles(x),
            })
          );
        });
      }
    });
  }
  saveComplete(){
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('status').patchValue('Complete');
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('weekness').patchValue(this.vendorEvaluation.get('weekness').value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Deficiencies').patchValue(this.vendorEvaluation.get('Deficiencies').value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Remarks').patchValue(this.vendorEvaluation.get('Remarks').value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('strengths').patchValue(this.vendorEvaluation.get('strengths').value);
    this.onChange(this.evaluations);
    this.toastr.success("Evaluation Completed for"+" "+this.volumename);
    this.router.navigate([
      "/home/sol/"+this.solno +"/proposalevaluation/"+this.proposalEvalId
    ]);
    this.getIndividualProposal();
   // this.evaluations.get('vendorstatus').setValue("Complete");
   // this.onChange(this.evaluations);
   // this.toastr.success(this.volumename+" "+"Evaluation Completed Successfully");
  }

  savePending(){
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('status').patchValue('Pending');
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('weekness').patchValue(this.vendorEvaluation.get('weekness').value);
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Deficiencies').patchValue(this.vendorEvaluation.get('Deficiencies').value);
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Remarks').patchValue(this.vendorEvaluation.get('Remarks').value);
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('strengths').patchValue(this.vendorEvaluation.get('strengths').value);
    console.log(this.evaluations.value)
    this.onChange(this.evaluations);
    this.getIndividualProposal();
    //this.onChange(this.evaluations);
   // this.toastr.info(this.volumename+" "+"Evaluation Saved")

  }


  onChange(evaluations) {
    // console.log(evaluations.value);
    this.ap
      .patchProposalEval(this.proposalEvalId, evaluations.value)
      .subscribe((response) => {
        console.log(response);
      });
  }


  getIndex(i, idValue) {
    this.factorIndex = i;
    this.factorId = idValue;
    console.log(i, idValue);
  }

  getValue($event) {
    console.log($event.target.value);
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('status').patchValue('Pending');
    this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('factorRows').controls[this.factorIndex].get(this.factorId).patchValue($event.target.value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Deficiencies').patchValue(this.vendorEvaluation.get('Deficiencies').value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('Remarks').patchValue(this.vendorEvaluation.get('Remarks').value);
    // this.evaluations.get('evaluationCriteria').controls[this.volumeIndex].get('strengths').patchValue(this.vendorEvaluation.get('strengths').value);
    console.log(this.evaluations.value)
    this.onChange(this.evaluations);
   // this.getIndividualProposal();
  }
}
