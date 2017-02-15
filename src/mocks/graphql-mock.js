import {config, authPromise} from '../config';
import fetch from 'node-fetch';

let query = `
mutation ($id: ID!, $input: PhysicalQuantitiesInput!) {
  createWeatherStationRecord(id: $id, quantities: $input) {
    id
  }
}`;

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

let variables = {
	id: '00000000-0001-0000-0000-000000000001', //FIXME
	input: {
		absolutePressure: random(101300, 101350),
		relativePressure: random(99500, 100000),
		indoorTemperature: random(20, 23),
		outdoorTemperature: random(8, 16),
		indoorHumidity: random(30, 50),
		outdoorHumidity: random(50, 80),
		windSpeed: random(0, 10),
		windAzimuth: random(90, 270),
		windGust: random(10, 50),
		pressureUnit: 'PASCAL',
		humidityUnit: 'PERCENTAGE',
		windSpeedUnit: 'KMH',
		temperatureUnit: 'CELSIUS'
	}
};

authPromise.then(function (loginResponseBody) {

	if (loginResponseBody.errors) {
		console.error(loginResponseBody.errors);
	}

	fetch(
		config.apiUrl,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': loginResponseBody.data.login.token,
			},
			body: JSON.stringify({
				query,
				variables
			})
		}
	).then(
		res => res.json()
	).then(
		json => {
			if (json.errors) {
				console.error(json.errors);
			} else {
				let jsonPretty = JSON.stringify(json.data, null, 0);
				console.log(jsonPretty);
			}
		}
	).catch(
		err => console.error(err)
	);

});
