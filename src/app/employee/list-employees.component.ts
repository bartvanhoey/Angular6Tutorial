import { Router } from '@angular/router';
import { IEmployee } from './IEmployee';
import { EmployeeService } from './employee.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: IEmployee[];

  constructor(private _router: Router, private _employeeService: EmployeeService) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe(
      (listEmployees) => this.employees = listEmployees,
      (error) => console.log('getEmployees: ', error)
    );
  }

  editButtonClick(employeeId: number) {
    this._router.navigate(['/edit', employeeId]);
  }

}
