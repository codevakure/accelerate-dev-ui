import { Component, OnInit, Input} from '@angular/core';
import { AcquisitionService } from '../../../../Services/acquisition.service';
import { AuthenticationService } from '../../../../Services/authentication.service';
import { acquisition } from '../../../../Models/acquisition.model';
import { Router, ActivatedRoute } from '@angular/router';
import { type } from 'os';

@Component({
  selector: 'app-dash-active',
  templateUrl: './dash-active.component.html',
  styleUrls: ['./dash-active.component.css']
})
export class DashActiveComponent implements OnInit {

  // getacq: acquisition[];
  // getacq = [""];
  emailUser;
  username1;
  address;
  phone;
  email;
  userid;
  username;
  CommentsData;
  QandAData;

  constructor(private route: ActivatedRoute, private router: Router, private authco: AuthenticationService, private acqco: AcquisitionService) { }

  ngOnInit() {
    this.acqco.getUserprofile().subscribe(response => {
    //
    let fullName , firstName , lastName;
   

      //Script to validate email has '.' and set first name and lastname 
      if(response.email.split('@')[0].split('.')){
        //Script to set the first/last name in Dev enviroment
        fullName = response.email.split('@')[0].split('.');
        firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
        lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
      }else{
        //Script to set the first/last name in stagging enviroment
        fullName = response.email.split('@')[0];
        firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
        lastName = '';
      }

      
      this.emailUser = firstName;
      this.username1 = response.firstName;
      this.address = response.address;
      this.phone = response.phone;
      this.email = response.email;
      this.userid = response.pkId;


      if(this.username1 == 'Not') {
        this.username= this.emailUser; 
      } else if (this.username1 != 'Not') {
        this.username = response.firstName + " " +response.lastName;
      }

      //Script to get the comments by firstname
      this.acqco.getCommentsDashboard(this.username).subscribe(response => {
        console.log("CommentsData",response)
        this.CommentsData = response;
      })
      
      
      this.acqco.getVendorqaQuestionsDash(this.email).subscribe(response => {
        console.log(response);
        this.QandAData = response;
      })


    })
  }

  viewComment(data) {
      console.log("Comment Data",data);
   
      if(data.status == "Initiated") {
        if(data.routeHeaders == undefined) {
          this.router.navigate(['/home/sol/'+data.ap_no]);
          this.acqco.deleteAttachment(data.id).subscribe(response=>{});
        } else {
          this.router.navigate(['/home/sol/'+data.ap_no+"/"+data.routeHeaders]);
          this.acqco.deleteAttachment(data.id).subscribe(response=>{});
        }
      } else {

        if(data.routeHeaders == undefined) {
          this.router.navigate(['/home/'+data.ap_no]);
          this.acqco.deleteAttachment(data.id).subscribe(response=>{});
        } else {
          this.router.navigate(['/home/'+data.ap_no+"/"+data.routeHeaders]);
          this.acqco.deleteAttachment(data.id).subscribe(response=>{});
        }
      }
      setTimeout(()=>{
        document.getElementById("commentCollab").click();
    },600)
  }

  viewQA(data){
    this.router.navigate(['/home/sol/'+data.sol_no+"/qanda"]);
  }
}
