import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

declare var $: any;

@Component({
  selector: "app-a-deliveriesandperformances",
  templateUrl: "./a-deliveriesandperformances.component.html",
  styleUrls: ["./a-deliveriesandperformances.component.css"],
})
export class ADeliveriesandperformancesComponent implements OnInit {
  solno;
  data;
  id;
  sectionname = "delivery";
  clauseString = "";
  status;
  disable;
  response;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  hideclauses: boolean = false;

  changes=[]
  socid
  orginaldata
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}

  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
    //  console.log(this.solno)
    this.getSectiondata();
  }

  onContentChanged(event) {
    //  console.log(event.html);
    if(event.html != undefined){
      this.sections.patchSections(this.id, this.sectionname, event.html)
      .subscribe(response => {
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
  
      if(event.source != 'api' &&  event.html == undefined){
        if(this.data != this.orginaldata){
          let change = `<b>DELIVERIES AND PERFORMANCE</b> was updated.`,data4
          this.changes.push(change);
          data4={
            deliveriesChanges:this.changes
          }
          this.patchchanges(data4)
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
         
        }
      });
    }


  getSectiondata() {
    this.ap.getsoldappids(this.solno).subscribe((response) => {
      this.ap.getAmendmentdapp(response.amendment_no).subscribe((amres) => {
        this.id = amres.deliveryId;
        this.socid=amres.socId

        // console.log(this.id)
        this.ap.getSolicitation(response.solId).subscribe((response) => {
          this.status = response.status;
          this.response = response;
          this.ap.getUserprofile().subscribe((response) => {
            if (
              this.status == "Re-Published" ||
              this.response.pointsofContact[0].includes(response.pkId)
            ) {
              this.hideDiv = true;
              this.hideclauses;
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
            this.clauseString = response.clause;
            this.data = response.description;
            this.orginaldata = response.description
            // this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>F. Deliveries and Performance</b></h3></div><div><br></div>':response.description:'<div><h3><b>F. Deliveries and Performance</b></h3></div><div><br></div>';
          });



          this.sections
          .getSections(this.socid, 'soc')
          .subscribe((response5) => {
            console.log('***SummaryofChangesData',response5)
            console.warn(typeof response5.deliveriesChanges)
            if( response5.deliveriesChanges == undefined){
             this.changes = [];
            }else{
              this.changes = response5.deliveriesChanges
            }
            });
      });
    });
  }
}
