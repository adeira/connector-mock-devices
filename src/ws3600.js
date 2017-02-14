import config from './config';
import fetch from 'node-fetch';

fetch(
	config.apiUrl,
	{
		method: 'POST',
		body: JSON.stringify({
			query: `mutation ($id: ID!) {
				createWeatherStationRecord(id: $id) {
					id
				}
			}`,
			variables: {
				id: '#####', //TODO
			}
		})
	}
).then(
	res => res.json()
).then(
	json => {
		if (json.errors) {
			console.error(json.errors);
		} else {
			let jsonPretty = JSON.stringify(json.data, null, 2);
			console.log(jsonPretty);
		}
	}
).catch(
	err => console.error(err)
);
