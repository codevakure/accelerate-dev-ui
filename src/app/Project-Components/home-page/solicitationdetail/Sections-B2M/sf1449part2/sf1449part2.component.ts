import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: "app-sf1449part2",
  templateUrl: "./sf1449part2.component.html",
  styleUrls: ["./sf1449part2.component.css"],
})
export class Sf1449part2Component implements OnInit {
  solno;
  data;
  data2;
  data3;
  data4;
  id;
  id2;
  id3;
  id4;
  sectionname = "contract-admin";
  sectionname2 = "sow";
  sectionname3 ='delivery';
  sectionname4 ='contract-req';
  clauseString = "";
  response;
  status;
  disabled;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  hideclauses: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);
    this.getSectiondata();
  }

  onContentChanged(event) {
    // this.clauseString = event.html;
    console.log(this.clauseString);
    this.sections
      .patchSections(this.id, this.sectionname, event.html)
      .subscribe((response) => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000,
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      });
  }

  onContentChanged2(event) {
    //  console.log(event.html);
      this.sections.patchSections(this.id2, this.sectionname2, event.html).subscribe(response => {
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      });
    }

    onContentChanged3(event) {
      // this.clauseString = event.html;
         this.sections.patchSections(this.id3, this.sectionname3, event.html).subscribe(response => {
           if (response) {
             setTimeout(() =>
               this.toastr.success("Error Occured", "Server Error", {
                 timeOut: 2000
               })
             );
           } else {
           //  console.log("Updated Successfully");
           }
         });
       }

       onContentChanged4(event) {
        //this.clauseString = event.html;
          this.sections.patchSections(this.id4, this.sectionname4, event.html).subscribe(response => {
            if (response) {
              setTimeout(() =>
                this.toastr.success("Error Occured", "Server Error", {
                  timeOut: 2000
                })
              );
            } else {
             // console.log("Updated Successfully");
            }
          });
        }

  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe((response) => {
      this.id = response.contractAdminId;
      this.id2 = response.sowid;
      this.id3 = response.deliveryId;
      this.id4 = response.contractReqId;
      //console.log(this.id)
      this.ap.getSolicitation(response.solId).subscribe((response) => {
        this.status = response.status;
        this.response = response;
        // console.log("All SOL Data",response)
        this.ap.getUserprofile().subscribe((response) => {
          //Code to verify the user is the Main CO
          if (
            this.status == "Published" || this.status == 'Amendment' || this.status == 'Re-Published' 
          ) {
            this.hideDiv = true;
          } else {
            this.hideEditor = true;
          }
        });
        setTimeout(() => {
          this.hideclauses = true;
        }, 100);
      });

      this.sections
        .getSections(this.id, this.sectionname)
        .subscribe((response) => {
          //  this.clauseString = response.clause;
          this.data = response.description;
          // this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>G. Contract Administration Data</b></h3></div><div><br></div>':response.description:'<div><h3><b>Contract Administration Data</b></h3></div><div><br></div>';
        });

      this.sections
        .getSections(this.id2, this.sectionname2)
        .subscribe((response2) => {
          this.data2 = response2.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
        this.sections
        .getSections(this.id3, this.sectionname3)
        .subscribe((response3) => {
          this.data3 = response3.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
        this.sections
        .getSections(this.id4, this.sectionname4)
        .subscribe((response4) => {
          this.data4 = response4.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
    });
  }
}
