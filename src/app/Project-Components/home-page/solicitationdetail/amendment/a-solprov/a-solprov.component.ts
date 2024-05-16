import { Component, OnInit, OnChanges } from "@angular/core";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: "app-a-solprov",
  templateUrl: "./a-solprov.component.html",
  styleUrls: ["./a-solprov.component.css"],
})
export class ASolprovComponent implements OnInit {
  solno;
  status;
  sol_id;
  data;
  id;
  id2;
  socid;
  orginaldata
  sectionname = "contract-clause";
  clauseString;
  changes=[]
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  disabled;
  response;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    console.log(this.solno);
    this.getSectiondata();
  }

  onContentChanged(event) {
    //  console.log(event.html);
    if(event.html != undefined){
    this.sections.patchSections(this.id2, "packaging", event.html).subscribe(
      (response) => {
        console.log("patch made");
        if (response) {
          setTimeout(() =>
            this.toastr.success("Error Occured", "Server Error", {
              timeOut: 2000,
            })
          );
        } else {
          //console.log("Updated Successfully");
        }
      },
      (error) => {
        console.log(error);
      }
    );
    }

    if(event.source != 'api' &&  event.html == undefined){
      if(this.data != this.orginaldata){
        let change = `<b>SOLICITATION PROVISIONS</b> was updated. `,data4
        this.changes.push(change);
        console.warn('CHANGES',this.changes)
        data4={
          provisionChanges:this.changes
        }
        if( this.changes.length < 2){
          this.patchchanges(data4)
        }
        this.orginaldata = this.data
      }
   }



  }

  
  patchchanges(data){
    console.log('***********data sent to Changes',data)
    this.sections.patchSectionsChanges(this.socid, 'soc', data).subscribe(response => {
      if (response) {
        setTimeout(() =>
          this.toastr.success("Added Change", "Server Error", {
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
      this.ap.getAmendmentdapp(response.amendment_no).subscribe((amres) => {
        this.id = amres.contractClauseId;
        this.id2 = amres.packagingId;
        this.socid = amres.socId;

        this.ap.getSolicitation(response.solId).subscribe((response) => {
          this.status = response.status;
          this.response = response;
          this.ap.getUserprofile().subscribe((response) => {
            //Code to verify the user is the Main CO
            if (
              this.status == "Re-Published"
            ) {
              this.hideDiv = true;
            } else {
              this.hideEditor = true;
            }
            setTimeout(() => {
              // this.hideclauses = true
            }, 100);
          });
        });

        this.sections
          .getSections(this.id, this.sectionname)
          .subscribe((response) => {
            this.clauseString = response.clause;
          });

        this.sections
          .getSections(this.id2, "packaging")
          .subscribe((response) => {
            this.data = response.description;
            this.orginaldata = response.description;
  
          });

          this.sections
          .getSections(this.socid, 'soc')
          .subscribe((response5) => {
            console.log('***SummaryofChangesData',response5)
            console.warn(typeof response5.provisionChanges)
            if( response5.provisionChanges == undefined){
             this.changes = [];
            }else{
              this.changes = response5.provisionChanges
            }
  
  
          });




      });
    });
  }
}
