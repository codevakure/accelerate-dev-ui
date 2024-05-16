import { Component, OnInit } from '@angular/core';
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-a-sow',
  templateUrl: './a-sow.component.html',
  styleUrls: ['./a-sow.component.css']
})
export class ASowComponent implements OnInit {

  solno;
  status;
  sol_id;
  data;
  id;
  sectionname='sow';
  socid;
  orginaldata
  changes=[]
  hideEditor: boolean = false;
  hideDiv: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private ap: AcquisitionService,
    private sections: SectionsService
  ) {}
  disabled;
  response;
  ngOnInit() {
    this.solno = this.route.snapshot.parent.params.sid;
   // console.log(this.solno)
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
        let change = `<b>STATEMENT OF WORK</b> was updated. `,data4
        this.changes.push(change);
        data4={
          sowChanges:this.changes
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
    this.ap.getsoldappids(this.solno).subscribe(response => {
      console.log("Sol-dapp ids",response);
      this.ap.getAmendmentdapp(response.amendment_no).subscribe(amres => {
        console.log("Amendment D-app response", amres);
        this.id = amres.sowid;
        this.socid = amres.socId;
      
      
        this.ap.getSolicitation(response.solId).subscribe((response) => {
          this.response = response;
          this.status = response.status;
          console.log(this.status);
       
        });
  
  
        this.sections.getSections(this.id, this.sectionname).subscribe(response => {
          this.data = response.description;
          this.orginaldata = response.description
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
      
          this.ap.getUserprofile().subscribe(response => {
            //Code to verify the user is the Main CO
            console.log('this.response.pointsofContact',this.response.pointsofContact);
            console.log('response.pkId',response.pkId)
            if(this.status == 'Re-Published' ) {
              this.hideDiv = true;
            } else {
              this.hideEditor = true;
            }
              
            
  
          })
  
  
  
        });

        this.sections
          .getSections(this.socid, 'soc')
          .subscribe((response5) => {
            console.log('***SummaryofChangesData',response5)
            console.warn(typeof response5.sowChanges)
            if( response5.sowChanges == undefined){
             this.changes = [];
            }else{
              this.changes = response5.sowChanges
            }
  
  
          });
  
  
      })
     


    });
  }
}
