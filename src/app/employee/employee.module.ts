import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';
import { EmployeeRoutingModule } from './employee-routing.module';

@NgModule({
  imports: [
    EmployeeRoutingModule,
    SharedModule
  ],
  declarations: [
    CreateEmployeeComponent,
    ListEmployeesComponent
  ]
})
export class EmployeeModule { }
