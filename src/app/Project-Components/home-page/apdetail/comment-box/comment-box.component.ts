import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import { FormsService } from "../../../../Services/forms.service";
import { AcquisitionService } from "../../../../Services/acquisition.service";
import { AuthenticationService } from "../../../../Services/authentication.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;
import { SanitizeHtmlPipe } from "../../../../sanitize-html.pipe";

import Quill from "quill";
import "quill-mention";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { QuillEditorComponent } from "ngx-quill";

@Component({
  selector: "app-comment-box",
  templateUrl: "./comment-box.component.html",
  styleUrls: ["./comment-box.component.css"]
})
export class CommentBoxComponent implements OnInit, OnChanges {
  commentService;
  commentMessage;
  replyMessage;
  modules = {};
  content = "";
  getHeader;
  username;
  getapno;
  //sectionHeader;
  @Input() sectionHeader;
  @Input() routeHeader;
  id;
  projectGeneral;
  replyBoolean: boolean = true;
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
  @Input() data: any[];
  commentUsers = new Array();
  commentUservalue;
  replyTextvalue;
  commentText;
  emailUser;
  username1;
  commentUserName;
  commentNotificationName;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService,
    private acqService: AcquisitionService,
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private ap: AcquisitionService
  ) {
    this.modules = {
      mention: {
        allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        onSelect: (item, insertItem) => {
          console.log(item);
          const editor = this.editor.quillEditor as Quill;
          insertItem(item);
          console.log(item.value);
          this.commentUsers.push(item.value);
          this.commentUservalue = item.value;
          editor.insertText(editor.getLength() - 1, "", "user");
        },
        source: (searchTerm, renderList) => {

          if (searchTerm.length === 0) {
            console.log(this.data);
            renderList(this.data, searchTerm);
          } else {
            const matches = [];

            this.data.forEach(entry => {
              //console.log(entry)
              if (
                entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
                -1
              ) {
                matches.push(entry);
              }
            });
            // console.log(matches);
            renderList(matches, searchTerm);
          }
        }
      },
      toolbar: { container: ["emoji"] }
    };
  }

  ngOnInit() {
    console.log("Comment service headers", this.getHeader);
    this.getapno = this.route.snapshot.params.apid;

    //console.log(this.getapno);
    this.commentService = new FormGroup({
      typeSection: new FormControl(""),
      description: new FormControl(""),
      comments: new FormArray([])
    });


    this.ap.invokeEvent.subscribe(value => {
      this.data = value;
      console.log("Varun"+this.username1);
      if(this.username1 == 'Not') {
        this.data = value.filter(v => v.value !== this.emailUser); 
      } else if (this.username1 != 'Not') {
        this.data = value.filter(v => v.value !== this.username); 
      }
   
      console.log(this.data);
      // console.log(this.data.findIndex(std=> std.value === 'Pm1'));
    });

    this.ap.getUserprofile().subscribe(response => {
      var fullName = response.email.split('@')[0].split('.');
      var firstName = fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
      var lastName = fullName[ fullName.length-1 ].charAt(0).toUpperCase() + fullName[ fullName.length-1 ].slice(1);
      this.emailUser = firstName;
      console.log(this.emailUser);
      this.username = response.firstName + " " +response.lastName;
      this.username1 = response.firstName;
      if(this.username1 == 'Not') {
        this.commentUserName= this.emailUser; 
        this.commentNotificationName = this.emailUser;
      } else if (this.username1 != 'Not') {
        this.commentUserName= this.username; 
        this.commentNotificationName = this.username1;
      }
      
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.getapno = this.route.snapshot.params.apid;
    console.log(this.sectionHeader);
    console.log("Testing Route header from comments",this.routeHeader);
    this.getCommentsdata(this.sectionHeader);
    //console.log(this.data);
  }

  
  onContentChanged(event) {
    //console.log(event.html)
    this.commentMessage = event.html;
    this.onChange(this.commentService);
    this.commentText = event.text;
  }

  replyMessageevent(event) {
    this.replyMessage = event.html;
    this.onChange(this.commentService);
    this.replyTextvalue = event.text;
  }
  

  initComments() {
    return new FormGroup({
      replyDescription: new FormControl(""),
      commentText: new FormControl(this.commentMessage),
      commentDate: new FormControl(new Date()),
      commentUser: new FormControl(this.commentUserName),
      replyGroup: new FormArray([])
    });
  }

  initReplies() {
    return new FormGroup({
      replyText: new FormControl(this.replyMessage),
      replyDate: new FormControl(new Date()),
      replyUser: new FormControl(this.commentUserName)
    });
  }

  addComments() {
    const control = <FormArray>this.commentService.get("comments");
    control.push(this.initComments());
 
    if(this.routeHeader == undefined) {
      this.routeHeader = ""
    }
    console.log(this.commentUsers);
    var data = {
      ap_no: this.getapno,
      users: this.commentUsers,
      textUser: this.commentUserName,
      commentText: this.commentText,
      sectionHeaders: this.sectionHeader,
      routeHeaders: this.routeHeader,
      text: "tagged you in the comment for"+" "+this.sectionHeader,
      message: "for AP" + " " + "#" + this.getapno,
      iconstyle: "fa-commenting-o",
      date: new Date(),
      type: "Comment"
    };
    this.ap.postAttnotifications(data).subscribe(Response => {
      // console.log(Response);
      console.log("Posted Comment for the AP");
    });

  
    //console.log(data);
    this.commentService.get("description").setValue("");
    this.commentService.get("typeSection").setValue(this.sectionHeader);
    setTimeout(() => {
      this.commentUsers.splice(0, this.commentUsers.length);
    }, 3000);
    this.onChange(this.commentService);
  }

  addReplies(i) {
    // console.log(i);
    const control = <FormArray>(
      this.commentService.get("comments").controls[i].get("replyGroup")
    );
    control.push(this.initReplies());
    if(this.routeHeader == undefined) {
      this.routeHeader = ""
    }
    var data = {
      ap_no: this.getapno,
      users: this.commentUsers,
      textUser: this.commentUserName,
      commentText: this.replyTextvalue,
      sectionHeaders: this.sectionHeader,
      routeHeaders: this.routeHeader,
      text: "tagged you in the reply for"+" "+this.sectionHeader,
      message: "for AP" + " " + "#" + this.getapno,
      iconstyle: "fa-reply-all",
      date: new Date(),
      type: "Comment",
      alt: "Reply",
    };
    this.ap.postAttnotifications(data).subscribe(Response => {
      console.log(Response);
      console.log("Posted Reply for the Comment");
    });
    // console.log(data);
    this.commentService
      .get("comments")
      .controls[i].get("replyDescription")
      .setValue("");
    setTimeout(() => {
      this.commentUsers.splice(0, this.commentUsers.length);
    }, 3000);

    $("#prefix" + i).addClass("show");
    this.onChange(this.commentService);
   
  }
  removeComments(i) {
    const control = <FormArray>this.commentService.get("comments");
    control.removeAt(i);
    this.onChange(this.commentService);
  }
  removeReply(control, index) {
    control.removeAt(index);
    this.onChange(this.commentService);
  }

  getComments(form) {
    return form.controls.comments.controls;
  }

  setReplies(x) {
    let array = new FormArray([]);
    x.replyGroup.forEach(y => {
      array.push(
        this.fb.group({
          replyText: y.replyText,
          replyDate: y.replyDate,
          replyUser: y.replyUser
        })
      );
    });
    return array;
  }

  getCommentsdata(x) {
    console.log(x);
  
    // console.log(this.sectionHeader);
    console.log(this.getapno);
  
    this.ap.getAcqcomments(this.getapno, x).subscribe(response => {
      this.ngOnInit();
      console.log(response);
      this.id = response[0].id;
      this.commentService.get("typeSection").setValue(response.typeSection);
      let control = <FormArray>this.commentService.controls.comments;
      if (response[0].comments != undefined) {
        response[0].comments.forEach(postComments => {
          control.push(
            this.fb.group({
              replyDescription: postComments.replyDescription,
              commentText: postComments.commentText,
              commentDate: postComments.commentDate,
              commentUser: postComments.commentUser,
              replyGroup: this.setReplies(postComments)
            })
          );
        });
      }
    });
    // });
  }

  getReplies(form) {
    return form.controls.replyGroup.controls;
  }

  onChange(commentService) {
    //console.log(commentService.value);
    this.ap.patchComments(this.id, commentService.value).subscribe(response => {
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

  replyReply(i) {
    
    const control = <FormArray>this.commentService.get("comments");
   
    for (var k = 1; k <= control.length; k++) {
      var n = k - 1;
      $("#prefix" + n).removeClass("show");
      $("#suffix" + n).removeClass("show");
      //console.log(k);
    }
    this.onChange(this.commentService);
  }
}
