import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 3 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': { 'required': 'Email is required.' },
    'phone': { 'required': 'Phone is required.' },
    'skillName': { 'required': 'Skill Name is required.' },
    'experienceInYears': { 'required': 'Experience is required.' },
    'proficiency': { 'required': 'Proficiency is required.' }
  };

  formErrors = {
    'fullName': '',
    'email': '',
    'phone': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': '',
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      email: ['', Validators.required],
      phone: [''],
      skills: this.fb.group({
        skillName: ['', Validators.required],
        experienceInYears: ['', Validators.required],
        proficiency: ['', Validators.required]
      })
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => this.onContactPreferenceChanged(data));

    this.employeeForm.valueChanges.subscribe(() => this.logValidationErrors(this.employeeForm));
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.logValidationErrors(control);
      } else {
        this.formErrors[key] = '';
        if (control && !control.valid && (control.touched || control.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in control.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  onSubmit(): void {
  }

  onLoadDataClick(): void {
    // this.logValidationErrors(this.employeeForm);
    // console.log(this.formErrors);
  }

  onContactPreferenceChanged(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('email');

    if (selectedValue === 'phone') {
      phoneControl.setValidators([Validators.required]);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();

    if (selectedValue === 'email') {
      emailControl.setValidators([Validators.required]);
    } else {
      emailControl.clearValidators();
    }
    emailControl.updateValueAndValidity();
  }
}
