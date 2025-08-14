export class InputGroupData {
    fieldType: string;
    fieldName: string;
    fieldPlaceholder: string;
    fieldValue: string;

    constructor(fieldType: string, fieldName: string, fieldPlaceholder: string, fieldValue: string) {
        this.fieldType = fieldType;
        this.fieldName = fieldName;
        this.fieldPlaceholder = fieldPlaceholder;
        this.fieldValue = fieldValue;
    }
}