
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AccountserviceService } from '../accountservice.service';
import { Accountinfo } from '../accountinfo';
import { Router } from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  regForm: FormGroup;
  datasaved = false;
  message: string | undefined;
  error: boolean | undefined;

  constructor(private router: Router, private formbuilder: FormBuilder, private accountservice: AccountserviceService) {
    this.regForm = this.formbuilder.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]]
    });

    if (localStorage.getItem('Loginuser')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {

  }

  setFormState(): void {
    this.regForm = this.formbuilder.group({
      Name: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.regForm.valid) {
      // console.log(this.regForm);
      const userinfo = this.regForm.value;
      this.createuserAccount(userinfo);
    }
  }

  createuserAccount(accinfo: Accountinfo) {
    this.accountservice.createaccount(accinfo).subscribe(
      (result: any) => { // Capture the response from the backend
        this.datasaved = true;
        this.message = result.message; // Use the message from the response
        this.error = result.flag; // Use the error
        this.regForm.reset();
        console.error(JSON.stringify(result));
        // Hide the success message after 6 seconds
        setTimeout(() => {
          this.datasaved = false;
          this.message = undefined;
        }, 6000);
      },
      (error) => {
        console.error('Error creating user:', error);
        this.message = "Error while creating User details";
        // Optionally, handle error response here
      }
    );
  }


}
