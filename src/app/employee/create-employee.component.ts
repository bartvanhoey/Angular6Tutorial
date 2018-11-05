import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../shared/custom.validators';

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
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be hotmail.com'
    }, 'confirmEmail': {
      'required': 'Email is required.',
    },
    'emailGroup': { 'emailMismatch': 'Email and Confirm Email do not match' },
    'phone': { 'required': 'Phone is required.' },
    'skillName': { 'required': 'Skill Name is required.' },
    'experienceInYears': { 'required': 'Experience is required.' },
    'proficiency': { 'required': 'Proficiency is required.' }
  };

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
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
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('hotmail.com')]],
        confirmEmail: ['', [Validators.required]]
      }, { validator: matchEmail }),
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
      this.formErrors[key] = '';
      if (control && !control.valid && (control.touched || control.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in control.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (control instanceof FormGroup) {
        this.logValidationErrors(control);
      }
    });
  }

  onSubmit(): void {
  }

  onLoadDataClick(): void {
    // const formArray = new FormArray([
    //   new FormControl('John', Validators.required),
    //   new FormGroup({
    //     country: new FormControl('', Validators.required)
    //   }),
    //   new FormArray([])
    // ]);
    // console.log(formArray.length);

    const formArray1 = this.fb.array([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('d', Validators.required),
    ]);
    formArray1.push(new FormControl('Mark', Validators.required));
    // console.log(formArray1.value);
    // console.log(formArray1.valid);
    // console.log(formArray1.at(3).value);

    const formGroup = this.fb.group([
      new FormControl('John', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('d', Validators.required),
    ]);

    console.log(formArray1);
    console.log(formGroup);

    // for (const control of formArray.controls) {
    //   if (control instanceof FormControl) {
    //     console.log('Control is FormControl');
    //   }
    //   if (control instanceof FormGroup) {
    //     console.log('Control is FormGroup');
    //   }
    //   if (control instanceof FormArray) {
    //     console.log('Control is FormArray');
    //   }
    // }
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

function matchEmail(group: AbstractControl): { [key: string]: any } | any {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine) {
    return null;
  }
  return { 'emailMismatch': true };
}
