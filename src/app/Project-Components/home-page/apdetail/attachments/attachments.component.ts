import { type } from 'os';
import { Response } from '@angular/http';
import { Event } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as jwt_decode from "jwt-decode";
declare var $: any;

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.css']
})
export class AttachmentsComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  filename;
  apId;
  location;
  fname;
  getapno;
  date = new Date();
  fileToUpload: File = null;
  filetype;
  attachmentno;
  attachmentsdata;
  viewAttachment;
  userexists;
  userid;
  status;
  username;
  type = "Attachments";
  yesDisabled: boolean = true;
  noAttachments: boolean = false;
  yesAttachments: boolean = false;
  requirementsType = ['Design & Architecture', 'Evaluation Criteria','Key Personnel','Market Research', 'Statement of Work', 'Others' ];

  constructor(private _formBuilder: FormBuilder,
     private ap: AcquisitionService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getapno = this.route.snapshot.parent.params.apid;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.ap.getUserprofile().subscribe(response => {
      this.username = response.firstName;
    })
    this.getAttachments();
    var tokenInformation = Cookie.get('hhs-a-token');
    var decodedValue = this.getDecodedAccessToken(tokenInformation);
    this.userid = decodedValue.pkId
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
  onFileSelected($event) {
    this.fileToUpload = $event.target.files[0];
    this.filename = $event.path[0].files[0].name;
    if(this.filename != ""){
      document.getElementById('next').click();
    }
  }

  addFactors(event) {
    const newVal = event.target.value; 
    //console.log(newVal);
    this.location = event.target.value;
  }

  uploadFile() {
    ////console.log(this.fileToUpload);
    ////console.log('response');
    this.ap.postFile(this.fileToUpload).subscribe(response => {
      if (response) {
        //console.log(response);
        this.fname = response.result.data.name;
        this.attachmentno = response.result.data.pkId;

        var data = {
          attachment_no: this.attachmentno,
          ap_no: this.getapno,
          file_name: this.fname,
          file_locator: "",
          file_type:this.location,
          ownerID: this.userid,
          ownerName: this.username,
          type: this.type,
          creation_date: new Date(),
        };
       this.ap.postAttnotifications(data).subscribe((response) => {
         //console.log(response);
         this.ngOnInit();
       });
       this.ngOnInit();
       var allRadio = document.getElementsByTagName("input");
       var select = document.getElementsByTagName("select");

       for (var i = 0; i < select.length; i++) {
          select[i].selectedIndex = 0;
          this.filename = "";
      }
       for (var i = 0; i < allRadio.length; i++) {
         if (allRadio[i].type == "radio") {
           allRadio[i].checked = false;
         }
         else if(allRadio[i].type == "text") {
           allRadio[i].value="";
         } else if(allRadio[i].type == "date") {
           allRadio[i].value="";
         } 
       }

      } else {
         //console.log(response);
        ////console.log('updated');

      }
    });
    let element: HTMLElement = document.getElementsByClassName('close')[0] as HTMLElement;
    return element.click();
  }
  getAttachments() {
    this.ap.getAttachments(this.getapno, this.type).subscribe((response) => {
      //console.log(response);
      this.attachmentsdata = response;
      if(this.attachmentsdata == ''){
        this.noAttachments = true;
        this.yesAttachments = false;
      } else if (this.attachmentsdata != '') {
        this.noAttachments = false;
        this.yesAttachments = true;
      }
    })

    this.ap.getApdappids(this.getapno).subscribe(response => {
      this.apId = response.apId
      //console.log(response);
      this.ap.getApdata(response.apId).subscribe(response => {
        this.status = response.status;
        
        //console.log(response);
        //console.log(this.userid);
        this.userexists = response.pointsofContact.includes(this.userid);
        if(this.status == 'Shared' && this.userexists == false || this.status == 'Accepted' || this.status=='Initiated' || this.status=='Generated'){
          this.yesDisabled = true;
        } else {
          this.yesDisabled = false;
        }
        //console.log(this.userexists);
      });
    });

  }
  downloadFile(x, filename) {
    console.log(x);
    this.ap.getFile(x).subscribe((response) => {
      console.log("Response from attachement",response);
      var binaryData = [];

      
      var length = response["_body"].length
      var buffer = new Uint8Array(response["_body"].length);
      for (var i=0; i<response["_body"].length; i++) {
        buffer[i] = response["_body"].charCodeAt(i);
      
      }
       
      const type = response["_body"].type;
      console.log(type);
      const blob = new Blob([response["_body"]], { type: type });
      var fileURL = URL.createObjectURL(blob);
      console.log(fileURL);
      saveAs(blob, filename);
    })
  }
  deleteFile(id, index) {
    //console.log(id, index);
    this.ap.deleteAttachment(id).subscribe(response => {
      //console.log(response);
      this.attachmentsdata.splice(index,1);
    })
  }
}
