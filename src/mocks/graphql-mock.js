import createRecord from '../request';

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

let variables = {
	id: '00000000-0001-0000-0000-000000000001',
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

console.log(variables);
createRecord(variables);
