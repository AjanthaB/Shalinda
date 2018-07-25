import { Component, OnInit, Input} from '@angular/core';
import { Employee } from '../../model/employee';
// import { EmpType } from '../../model/empType';
import { Router } from '@angular/router';
import { EmployeeService } from '../../service/employee.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { EmpTypeService } from '../../service/empType.service';
import { types } from 'util';
import { EmpType } from '../../model/empType';
// import { EmpTypeService }  from '../../service/empType.service';

@Component({
  templateUrl: 'employees.component.html',
  selector: 'app-employees',
  styleUrls: ['employees.component.scss']
})

export class EmployeesComponent implements OnInit {
  _employeeForm: FormGroup;
  _empTypes: EmpType[] = [];
  _editMode = false;

  employees: Employee[] = [];
  _selectedEmployee: Employee;

  constructor(private employeeService: EmployeeService,
    private employeeTypeService: EmpTypeService) { }

  ngOnInit() {
    this.getEmpTypes();
    this.getEmployees();
    this._selectedEmployee = this.employeeService.getDummyEmployee();
    this.initForm();
  }

  initForm(): void {
    this._employeeForm = new FormGroup({
      name: new FormControl(this._selectedEmployee.name, [Validators.required]),
      age: new FormControl(this._selectedEmployee.age, [Validators.required]),
      salary: new FormControl(this._selectedEmployee.salary, [Validators.required]),
      empType: new FormControl(this._selectedEmployee.empType._id, [Validators.required])
    });
  }

  // TODO: Need to refactor this method
  selectEmployee(employee: Employee): void {
    if (this._selectedEmployee) {
      if (this._selectedEmployee._id === employee._id) {
        this.clear();
        this._editMode = false;
        return;
      } else {
        this._editMode = true;
      }
    }
    this._selectedEmployee = employee;
    this.initForm();
  }

  compareRole(val1, val2) {
    return val1 === val2;
  }

  save(): void {
    console.log(this._employeeForm.value);
    const isUserValid = this.validateUser();
    if (isUserValid) {
      console.log('Employee valid');
      this.employeeService.addEmployee(this._employeeForm.value)
        .subscribe((res) => {
          this.clear();
          this.employees = [...this.employees, res];
          console.log('Employee Saved: ', res);
        }, err => {
          console.log('Error Saving Employee');
        });
    }
  }

  updateEmployee(): void {
    const isUserValid = this.validateUser();
    if (isUserValid) {
      const emp = { ...this._employeeForm.value, _id: this._selectedEmployee._id};
      console.log('Updating Employee..', emp);
      this.employeeService.updateEmployee(emp)
        .subscribe(updatedEmp => {
          console.log('Employee Updated Successfully', updatedEmp);
          this.updateEmployeeArray(updatedEmp);
        }, err => {
          console.log('Error Updating Employee');
        });
    }
  }

  deleteEmployee(): void {
    const employee = this._selectedEmployee;
    this.employeeService.deleteEmployee(employee)
      .subscribe(deletedEmp => {
        console.log('Employee deleted');
        this.removeEmployeeFromArray();
        this.clear();
      }, err => {
        console.log('Error Deleting Employee');
      });
  }

  private updateEmployeeArray(employee: Employee): void {
    this.employees = this.employees
      .map(emp => (emp._id === employee._id) ? employee : emp);
  }

  private removeEmployeeFromArray(): void {
    const employee = this._selectedEmployee;
    this.employees = this.employees
      .filter(emp => emp._id !== employee._id);
  }

  private validateUser(): boolean {
    const formDataValid = this._employeeForm.valid;
    if (!formDataValid) {
      Object.keys(this._employeeForm.controls)
        .forEach(field => {
          const control = this._employeeForm.get(field);
          control.markAsDirty({ onlySelf: true });
        });
    }
    return formDataValid;
  }

  getEmpTypes(): void {
    this.employeeTypeService.getEmpTypes()
      .subscribe((empTypes: EmpType[]) => {
        this._empTypes = empTypes;
        console.log('EmpTypes: ', empTypes);
      }, err => {
        console.log('Error getting EmpTypes: ', types);
      });
  }

  getEmployees(): void {
    this.employeeService.getEmployees()
      .subscribe(employees => {
        this.employees = employees;
        console.log('Employees: ', employees);
      });
  }

  clear(): void {
    this._selectedEmployee = this.employeeService.getDummyEmployee();
    this.initForm();
  }

  showParent() {
    // this.employee = new Employee;
    this.getEmployees();
  }
}
