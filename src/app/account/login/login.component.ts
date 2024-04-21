
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountserviceService } from '../accountservice.service';
import { Userloginfo } from '../userloginfo';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  datasaved = false;
  message: string | undefined;
  status: boolean | undefined;

  constructor(private formbuilder: FormBuilder,private router: Router, private accountservice: AccountserviceService) {
    this.loginForm = this.formbuilder.group({
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]]
    })


    if (localStorage.getItem('Loginuser')) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit(): void {
  }

  onSubmit() {
    let userinfo = this.loginForm.value;
    console.log(userinfo);
    this.userLogin(userinfo);
    this.loginForm.reset();
  }

  userLogin(logininfo: Userloginfo) {
    this.accountservice.userlogin(logininfo).subscribe(
      (result: any) => {
       
        console.log(JSON.stringify(result));
        this.datasaved = true;
        this.status = result.flag;
        this.message = result.message;

        if (result.flag) {
          console.log(this.message);
          localStorage.setItem('Loginuser', JSON.stringify(result))
        } else {
          localStorage.removeItem('Loginuser');
        }
        setTimeout(() => {
          this.datasaved = false;
          this.message = undefined;
        }, 6000);
        this.loginForm.reset();
      },
      (error) => {
        console.error('Error while user login :', error);
        this.message = "Error while user login";
        // Optionally, handle error response here
      }
    );
  }

}
