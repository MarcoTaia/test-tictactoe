export class PersonData {
	name: string;
	age: number;
	married: boolean;
	birthDate: string;
	
	constructor(name?:string='',age?=0,married?=false,birthDate?='01/01/2024'){
		this.name = name;
		this.age = age;
		this.married = married;
		this. birthDate = birthDate;
	}
}