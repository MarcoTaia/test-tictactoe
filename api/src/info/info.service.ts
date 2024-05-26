import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateInfoRequest as UpdateInfoRequestInterface } from './interfaces';
import { PersonDataRequest as PersonDataRequestInterface } from './interfaces/person.js';
import { BaseResponse } from '../interfaces';
import { UpdateInfoRequest } from './models';
import { PersonDataRequest } from './models/person.js';

@Injectable()
export class InfoService {
  async validateInfo(
    rawData: UpdateInfoRequestInterface,
  ): Promise<BaseResponse> {
    const data = plainToClass(UpdateInfoRequest, rawData);
    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }
    return {
      success: true,
      data,
    };
  }
  
  async validatePersonData(
    rawData: PersonDataRequestInterface,
  ): Promise<BaseResponse> {
    const data = plainToClass(PersonDataRequest, rawData);
    const validationErrors = await validate(data);
    if ((data.age>=18)&&((data.married===null)||(data.married===undefined))){
		let constr = {'mandatory':'required if age>18'};
		validationErrors.push({	target:data,
								property:"married",
								value:data.married,
								constraints:constr,
								});
	}
	let dFineAnno = new Date();
	dFineAnno.setFullYear(dFineAnno.getFullYear() - data.age);
	let dInizioAnno = new Date();
	dInizioAnno.setMonth(1);
	dInizioAnno.setDate(1);
	dInizioAnno.setFullYear(dFineAnno.getFullYear());
	if ((data.birthDate<dInizioAnno)||(data.birthDate>dFineAnno)){	
		let constr = {'wrong_date':'birthDate not coherent with age'};
		validationErrors.push({	target:data,
								property:"birthDate",
								value:data.birthDate,
								constraints:constr,
								});
	}
	if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }
    return {
		success: true,
		data,
    };
  }
}
