let {config, authenticate} = require('../config');
let fetch = require('node-fetch');

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

authenticate(async loginPayload => {

	try {
		let queryResponse = await fetch(
			config.apiUrl,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': loginPayload.token,
				},
				body: JSON.stringify({
					query,
					variables
				})
			}
		);

		let responseJson = await queryResponse.json();
		if (responseJson.errors) {
			throw responseJson.errors;
		}

		let responsePretty = JSON.stringify(responseJson.data, null, 2);
		console.log(responsePretty);

	} catch (error) {
		console.error(JSON.stringify(error, null, 2))
	}

});
