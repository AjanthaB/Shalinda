import { EmpType } from './empType';

export interface Employee {
    _id: string;
    name: string;
    age: string;
    salary: string;
    empType: EmpType;
}
