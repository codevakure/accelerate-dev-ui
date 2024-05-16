import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../Services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { CookieStorage } from "amazon-cognito-identity-js";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"]
})
export class LoginPageComponent implements OnInit {
  authenticatedUser = this.auth.getAuthenticatedUser();
  public idToken: string;
  confirmCode: boolean = false;
  confirmVerification: boolean = true;
  codeWasConfirmed: boolean = false;
  error: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthenticationService,
    private toastr: ToastrService
  ) {
    var group;
    if (this.authenticatedUser != null) {
      this.authenticatedUser.getSession(function(err, session) {
        if (err) {
          alert(err);
          return;
        }
        group = session.getIdToken().payload["cognito:groups"];
      });
    }
    this.idToken = group;
  }

  ngOnInit() {
    if (this.auth.isLoggedIn() && this.idToken == "Contracting-Officer") {
      this.router.navigate(["/home"]);
    } else if (this.auth.isLoggedIn() && this.idToken == "Program-Officer") {
      this.router.navigate(["/home"]);
    }
  }

  emailVerificationMessage: boolean = false;
  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required]);
  newpassword = new FormControl("", [Validators.required]);

  loginForm: FormGroup = this.fb.group({
    username: this.username,
    password: this.password,
    newpassword: this.newpassword
  });

  loginUser(formdata: any): void {
    this.auth
      .signIn(
        this.loginForm.get("username").value,
        this.loginForm.get("password").value
      )
      .subscribe(
        data => {
          var user = data.idToken.payload["cognito:groups"];
         // console.log(data);
          if (user == "Contracting-Officer") {
            setTimeout(() => this.toastr.success("Login Successful"));
             this.router.navigate(["/home"]);
             Cookie.set('id_token', 'varun', 0.0138889);
             console.log(Cookie.getAll());
            //document.location.href = '/home'
          } else if (user == "Program-Officer") {
          //  document.location.href = '/home'
            this.router.navigate(["/home"]);
            setTimeout(() => this.toastr.success("Login Successful"));
          }
        },
        err => {
          this.emailVerificationMessage = true;
          this.toastr.error("Invalid Credentials", "Error", { timeOut: 2000 });
        }
      );
  }

  rememberMe(e) {
    if (e.target.checked) {
      localStorage.setItem("username", "username");
      localStorage.setItem("password", "Welcome@1");
    }
  }
}
