import { Response } from "@angular/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-vendorresponse",
  templateUrl: "./vendorresponse.component.html",
  styleUrls: ["./vendorresponse.component.css"],
})
export class VendorresponseComponent implements OnInit {
  dltdid;
  responseBlockchain;
  solno;
  volumes;
  proposalEvalId;
  vendorName;
  timeStamp;
  volumeIndex;
  evaluations;
  evaluationFactors;
  statusPatch;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ap: AcquisitionService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.parent.params.sid;
    this.dltdid = this.route.snapshot.params.vendorName;
    this.proposalEvalId = this.route.snapshot.params.vendorName;
    this.volumeIndex = this.route.snapshot.params.volumeIndex;
    // console.log(this.volumeIndex);

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
    // this.ap.getBlockchainres(this.dltdid).subscribe((response)=>{
    //   console.log(response);
    //    this.responseBlockchain = response.response;
    //  // this.volumes = response.response.volume;
    //   var vendorData;
    //   var vendevalData;
    //   var combinedResponse;
    //   this.ap.getAuroVendorevalhome(this.dltdid).subscribe(response1 => {
    //     //console.log(response1);
    //     vendevalData = response1;
    //     console.log(vendevalData);
    //     vendorData = response.response.volume;
    //     const longest = vendorData.length > vendevalData.length ? vendorData : vendevalData;
    //     const shortest = vendorData.length <= vendevalData.length ? vendorData : vendevalData;
    //     combinedResponse = longest.map((item, index) => ({ ...item, ...shortest[index] }));
    //     this.volumes = combinedResponse;
    //    console.log(this.volumes);
    //     for(var i= 0; i<vendevalData.length; i++ ){
    //       console.log(vendevalData[i].vendorstatus);
    //       if(vendevalData[i].vendorstatus == "Complete"){
    //         console.log("All Data Completed")

    //         this.ap
    //         .getAuroProposaleval(response.response.seller.pkId)
    //         .subscribe(idresponse => {
    //         console.log(idresponse[0].ID);
    //         let data = {
    //           status: "Completed",
    //           sol_no: this.solno
    //         };
    //         this.ap.patchAuroProposaleval(idresponse[0].ID, data).subscribe(response => {});
    //         })

    //       } else {
    //         console.log("Still Pending");

    //         this.ap
    //         .getAuroProposaleval(response.response.seller.pkId)
    //         .subscribe(idresponse => {
    //           console.log(idresponse[0].ID);
    //         let data = {
    //           status: "Pending",
    //           sol_no: this.solno
    //         };
    //         this.ap.patchAuroProposaleval(idresponse[0].ID, data).subscribe(response => {});
    //         })
    //       }
    //     }
    //   })
    // })
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

  getProposals() {
    this.ap.getProposalEvalId(this.proposalEvalId).subscribe((response) => {
      console.log(response);
      this.timeStamp = response.submissionTimeStamp;
      this.vendorName = response.vendorName;
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
     // console.log(this.evaluationFactors.evaluationCriteria);
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
      var status = this.evaluationFactors.evaluationCriteria;
      for (var i = 0; i < status.length; i++) {
        console.log(status[i].status);
        if(status[i].status == "Complete"){
          this.statusPatch = {
            status: "Completed"
          }
          console.log('Completed');
        } else if(status[i].status == "Pending" || status[i].status == "") {
          this.statusPatch = {
            status: "Pending"
          }
          console.log("Pending");
        }
        this.ap
        .patchProposalEval(this.proposalEvalId, this.statusPatch)
        .subscribe((response) => {
          console.log(response);
        });
      }
    });
  }

  back() {
    this.router.navigate(["/home/sol/" + this.solno + "/proposalevaluation/"]);
  }

  Evaluate(res, i) {
    this.router.navigate([
      "/home/sol/" +
        this.solno +
        "/proposalevaluation/" +
        this.proposalEvalId +
        "/" +
        i,
    ]);
  }

  onChange(evaluations) {
    // console.log(evaluations.value);
    this.ap
      .patchProposalEval(this.proposalEvalId, evaluations.value)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
