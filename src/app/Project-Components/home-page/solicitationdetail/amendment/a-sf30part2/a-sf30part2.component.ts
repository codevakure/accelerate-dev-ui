import { Component, OnInit } from "@angular/core";
import { AcquisitionService } from "../../../../../Services/acquisition.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SectionsService } from "../../../../../Services/sections.service";

@Component({
  selector: 'app-a-sf30part2',
  templateUrl: './a-sf30part2.component.html',
  styleUrls: ['./a-sf30part2.component.css']
})
export class ASf30part2Component implements OnInit {

  solno;
  data;
  data2;
  data3;
  data4;
  data5;
  orginaldata;
  orginaldata2;
  orginaldata3;
  orginaldata4;
  orginaldata5;
  id;
  id2;
  id3;
  id4;
  id5;
  sectionname = "contract-admin";
  sectionname2 = "sow";
  sectionname3 ='delivery';
  sectionname4 ='contract-req';
  sectionname5 = 'soc'
  clauseString = "";
  response;
  status;
  disabled;
  soceditorstring;
  hideEditor: boolean = false;
  hideDiv: boolean = false;
  hideclauses: boolean = false;
  allformchanges=[''];
  allclauseschanges=[];
  manualchanges=[];
  changes=[]

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
    // console.log(this.clauseString,event);

    if(event.html != undefined){
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
    

        //Script to record the change.
       //Keep the changes from Updating onInit
       if(event.source != 'api' &&  event.html == undefined){
          if(this.data != this.orginaldata){
            console.warn('Found Change')
            let change = `<b>CONTRACT ADMINISTRATION DATA</b> was updated. `,data
            this.changes.push(change);
            this.allclauseschanges.push(change)
            data={
              continuationofsf30Changes:this.changes
            }
            this.patchchanges(data)
            this.orginaldata = this.data
          }
       }


     

  }

  onContentChanged2(event) {
    //  console.log(event.html);
    if(event.html != undefined){
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

      if(event.source != 'api' &&  event.html == undefined){
        if(this.data2 != this.orginaldata2){
          console.warn('Found Change')
          let change = `<b>STATEMENT OF WORK</b> was updated. `,data2
          this.changes.push(change);
          this.allclauseschanges.push(change)
          data2={
            continuationofsf30Changes:this.changes
          }
          this.patchchanges(data2)
          this.orginaldata2 = this.data2
        }
     }


    }

    onContentChanged3(event) {
      // this.clauseString = event.html;
      if(event.html != undefined){
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

         if(event.source != 'api' &&  event.html == undefined){
          if(this.data3 != this.orginaldata3){
            console.warn('Found Change')
            let change = `<b>DELIVERABLES</b> was updated. `,data3
            this.changes.push(change);
            this.allclauseschanges.push(change)
            data3={
              continuationofsf30Changes:this.changes
            }
            this.patchchanges(data3)
            this.orginaldata3 = this.data3
          }
       }
       }

       onContentChanged4(event) {
        //this.clauseString = event.html;
        if(event.html != undefined){
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
          if(event.source != 'api' &&  event.html == undefined){
            if(this.data4 != this.orginaldata4){
              console.warn('Found Change')
              let change = `<b>SPECIAL CONTRACT REQUIREMENTS</b> was updated. `,data4
              this.changes.push(change);
              this.allclauseschanges.push(change)
              data4={
                continuationofsf30Changes:this.changes
              }
              this.patchchanges(data4)
              this.orginaldata4 = this.data4
            }
         }
        }


        onContentChanged5() {
          //this.clauseString = event.html;
          this.manualchanges.push(this.data5);
          console.log('EditorChanges',this.manualchanges);
          let data={
            manualchanges:this.manualchanges
          }


            this.sections.patchSectionsChanges(this.id5, this.sectionname5, data).subscribe(response => {
              if (response) {
                setTimeout(() =>
                  this.toastr.success("Added Change", "Server Error", {
                    timeOut: 2000
                  })
                );
                this.data5 = ''
              } else {
               // console.log("Updated Successfully");
              }
            });
          }

          patchchanges(data){
            console.log('***********data sent to Changes',data)
            this.sections.patchSectionsChanges(this.id5, this.sectionname5, data).subscribe(response => {
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
      this.ap.getAmendmentdapp(response.amendment_no).subscribe(amres => {

      this.id = amres.contractAdminId;
      this.id2 = amres.sowid;
      this.id3 = amres.deliveryId;
      this.id4 = amres.contractReqId;
      this.id5 = amres.socId;
      //console.log(this.id)
      this.ap.getSolicitation(response.solId).subscribe((response) => {
        this.status = response.status;
        this.response = response;
        // console.log("All SOL Data",response)
        this.ap.getUserprofile().subscribe((response) => {
          //Code to verify the user is the Main CO
          console.log("Status for app", this.status);
          if (
            this.status == "Re-Published" 
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
          this.orginaldata =  response.description;
          // this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>G. Contract Administration Data</b></h3></div><div><br></div>':response.description:'<div><h3><b>Contract Administration Data</b></h3></div><div><br></div>';
        });

      this.sections
        .getSections(this.id2, this.sectionname2)
        .subscribe((response2) => {
          this.data2 = response2.description;
          this.orginaldata2 =  response.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
        this.sections
        .getSections(this.id3, this.sectionname3)
        .subscribe((response3) => {
          this.data3 = response3.description;
          this.orginaldata3 =  response.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
        this.sections
        .getSections(this.id4, this.sectionname4)
        .subscribe((response4) => {
          this.data4 = response4.description;
          this.orginaldata4 =  response.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });

        this.sections
        .getSections(this.id5, this.sectionname5)
        .subscribe((response5) => {
          console.log('***SummaryofChangesData',response5)
          console.warn(typeof response5.continuationofsf30Changes)

          if( response5.continuationofsf30Changes == undefined){
           this.changes = [];
          }else{
            this.changes = response5.continuationofsf30Changes
          }


          console.warn('this.changes',this.changes)
          let keys = Object.keys(response5)
          keys.forEach(key=>{
            console.log(typeof response5[key] )
            if(key != 'id'){
              if(typeof response5[key] === 'string'){
                this.allformchanges.push(response5[key])
              }else{
                if(key != 'description' && key != 'manualchanges' ){
                response5[key].forEach(element => {
                  this.allclauseschanges.push(element)
                });
              }
              }
            }
            
             
          })
          console.log('formchanges',this.allformchanges)
          // this.allformchanges = response5.description;
          //this.data=response.description? response.description == '<div><br></div>'?'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>':response.description:'<div><h3><b>C. Statement of Work</b></h3></div><div><br></div>';
        });
    });
  });
  }
}

