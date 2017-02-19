import process from 'child_process';
import fs from 'fs';

let mocksPath = __dirname + '/mocks/';
let knownDevices = [];

fs.readdir(mocksPath, (err, files) => {

	files.forEach(file => {
		let knownDevice = mocksPath + file;
		console.log(knownDevice);
		knownDevices.push(knownDevice);
	});

	for (let mock of knownDevices) {
		setInterval(function () {
			let child = process.fork(mock);
			child.disconnect();
		}, 1000 * 30); // every 30 seconds
	}

});
