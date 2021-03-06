import { CustomValidators } from './../../shared/custom.validators';
import { EmployeeService } from './employee.service';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 3 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domain should be dell.com'
    }, 'confirmEmail': {
      'required': 'Email is required.',
    },
    'emailGroup': { 'emailMismatch': 'Email and Confirm Email do not match' },
    'phone': { 'required': 'Phone is required.' },
    'skillName': { 'required': 'SkillName is required.' },
    'experienceInYears': { 'required': 'Experience in years is required.' },
    'proficiency': { 'required': 'Proficiency is required.' },
  };

  formErrors = {};


  constructor(private router: Router, private _validators: CustomValidators, private _employeeService: EmployeeService,
    private _route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, this._validators.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]]
      }, { validator: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });
    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => this.onContactPreferenceChanged(data));
    this.employeeForm.valueChanges.subscribe(() => this.logValidationErrors(this.employeeForm));

    this._route.paramMap.subscribe(params => {
      const employeeId = +params.get('id');
      if (employeeId) {
        this.getEmployeeId(employeeId);
        this.pageTitle = 'Edit Employee';
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }

  getEmployeeId(employeeId: number) {
    this._employeeService.getEmployee(employeeId)
      .subscribe((employee: IEmployee) => {
        this.editEmployee(employee),
          this.employee = employee;
      },
        (error: any) => console.error('getEmployeeId: ', error));
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skills: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skills.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });
    return formArray;
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(index: number): void {
    const skillsFormArray = (<FormArray>this.employeeForm.get('skills'));
    skillsFormArray.removeAt(index);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      this.formErrors[key] = '';
      if (control && !control.valid && (control.touched || control.dirty || control.value !== '')) {
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
      if (control instanceof FormArray) {
        for (const ctrl of control.controls) {
          if (ctrl instanceof FormGroup) {
            this.logValidationErrors(ctrl);
          }
        }
      }
    });
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this._employeeService.updateEmployee(this.employee)
      .subscribe(() => this.router.navigate(['employees']), (err: any) => console.log(err));
    } else {
      this._employeeService.addEmployee(this.employee)
      .subscribe(() => this.router.navigate(['employees']), (err: any) => console.log(err));
    }
  }

  onLoadDataClick(): void {
  }

  onContactPreferenceChanged(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    const emailControl = this.employeeForm.get('emailGroup').get('email');

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

  if (emailControl.value === confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  }
  return { 'emailMismatch': true };


}
