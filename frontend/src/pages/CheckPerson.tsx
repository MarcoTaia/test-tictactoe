import { useEffect, useState } from 'react';
import { BaseResponse } from '../interfaces';
import { ValidationErrorInfo } from '../interfaces';
import { PersonData } from '../interfaces/person.js';

export function CheckPerson() {
	const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA'>();
	const [data , setData] = useState<BaseResponse>();
	const [dataError, setError] = useState<string>('');
	const [value , setValue] = useState<PersonData>(new PersonData());
	
	function ParseError(resp:BaseResponse):string {
		if (resp?.success===false){
			var body = "";
			var errors : Array<ValidationErrorInfo> = resp.errors;
			for (var i=0;i<errors.length;i++){
				body = body+errors[i].property+'; ';
			}
			if (body!==""){
				body = 'Correggere i campi: '+body;
			}
			return body;
		}
		return "";
	}
	
	useEffect(() => {
		if(status === 'SEND_DATA') {
		  setStatus('SENDING_DATA');
		  fetch('http://localhost:3001/info/validate-person', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(value)
		  })
		  .then((rawResponse) => {
			if([200, 201].includes(rawResponse.status)) {
			  return rawResponse.json();
			} else {
			  throw new Error();
			}        
		  })
		  .then((response: BaseResponse) => {
			setStatus('DATA_SENDED');
			setData(response);
			var s = ParseError(response);
			setError(s);
		  })
		  .catch(e => {
			setStatus('ERROR_SENDING_DATA');
		  })
		}
		}, [status, value]);

		if (status === 'ERROR_SENDING_DATA') {
		return (
		  <div>
			<h1>ERRORE INVIO DATI</h1>
			<button onClick={() => setStatus('INITIAL')}>RIPROVA</button>
		  </div>
		);
		}

	if(status === 'SEND_DATA' || status === 'SENDING_DATA') {
		return (
		  <div>
			<h1>INVIO IN CORSO</h1>
			<button onClick={() => setStatus('INITIAL')}>ANNULLA</button>
		  </div>
		);
	}

	if(status === 'DATA_SENDED') {
		return (<div>
			{data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
			{data?.success === false && <h1>DATI INVIATI NON VALIDI</h1>}
			{data?.success === false && dataError}
			<br/><button onClick={() => setStatus('INITIAL')}>INVIA UN ALTRO VALORE</button>
		</div>)
	}
	
	return (
		<div>		
			<h1>COMPILA DATI PERSONA</h1>
			<div>
				<label>Nome</label><br/>
				<input type="text" value={value.name} 
					onChange={(e) => {
						let p = new PersonData(e.target.value,value.age,value.married,value.birthDate);
						setValue(p);
						}
					}
				>
				</input>
			</div>
			<div>
				<label>Età</label><br/>
				<input type="number" value={value.age}  
					onChange={(e) => {
						let p = new PersonData(value.name,Number(e.target.value),value.married,value.birthDate);
						setValue(p);
						}
					}
				>
				</input>
			</div>
			<div>
				<label htmlFor="married">Sposato</label>
				<input type="checkbox" id="married" defaultChecked={value.married}  
					onChange={(e) => {
						let p = new PersonData(value.name,value.age,e.target.checked,value.birthDate);
						setValue(p);
						}
					}
				>
				</input>
			</div>
			<div>
				<label>Data di nascita</label><br/>
				<input type="date" value={value.birthDate} 
					onChange={(e) => {
						let p = new PersonData(value.name,value.age,value.married,e.target.value);
						setValue(p);
						}
					}
				>
				</input>
			</div>
			<button onClick={() => setStatus('SEND_DATA')}>VALIDA</button>
		</div>
	);
}