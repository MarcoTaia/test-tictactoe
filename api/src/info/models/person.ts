import { PersonDataRequest as PersonDataRequestInterface } from '../interfaces/person.js';
import { IsNotEmpty,IsOptional,
         IsString,IsNumber,IsBoolean,IsDate,
		 MinLength,MaxLength,Min,Max } from 'class-validator';
import {Transform,Type} from 'class-transformer';

export class PersonDataRequest implements PersonDataRequestInterface {
	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(5)
	name: string;
	
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	@Max(150)
	age: number;
	
	@IsOptional()
	@IsBoolean()
	married: boolean;
	
	@IsNotEmpty()
    //@Transform( ({ value }) => new Date(value))
	@Type(() => Date)
    @IsDate()
	birthDate: Date;
}