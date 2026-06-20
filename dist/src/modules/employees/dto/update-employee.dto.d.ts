import { CreateEmployeeDto } from './create-employee.dto';
declare const UpdateEmployeeDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateEmployeeDto, "initialPassword">>>;
export declare class UpdateEmployeeDto extends UpdateEmployeeDto_base {
    newPassword?: string;
}
export {};
