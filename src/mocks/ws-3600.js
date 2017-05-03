import fs from 'fs';
import createRecord from '../request';
import nodePack from '../../node-pack/build/Release/pagepack';

/**
 * This converter takes into account only the last line of the file 'history.dat' and sends it
 * to the GraphQL API server.
 */

const binaryDataFormatTable = [
  {
    type: 'd',
    name: 'timestamp',
  }, {
    type: 'f',
    name: 'absPressure',
    minRange: 300,
    maxRange: 1100,
  }, {
    type: 'f',
    name: 'relPressure',
    minRange: 300,
    maxRange: 1100,
  }, {
    type: 'f',
    name: 'windSpeed',
    minRange: 0,
    maxRange: 50,
  }, {
    type: 'V',
    name: 'windDirection',
    minRange: 0,
    maxRange: 15,
  }, {
    type: 'f',
    name: 'windGust',
    minRange: 0,
    maxRange: 50,
  }, {
    type: 'f',
    name: 'totalRainfall',
    minRange: 0,
    maxRange: 10000,
  }, {
    type: 'f',
    name: 'newRainfall',
    minRange: 0,
    maxRange: 10000, // ?
  }, {
    type: 'f',
    name: 'indoorTemp',
    minRange: -10,
    maxRange: 60,
  }, {
    type: 'f',
    name: 'outdoorTemp',
    minRange: -40,
    maxRange: 60,
  }, {
    type: 'f',
    name: 'indoorHumidity',
    minRange: 1,
    maxRange: 99,
  }, {
    type: 'f',
    name: 'outdoorHumidity',
    minRange: 1,
    maxRange: 99,
  }, {
    type: 'V',
    name: '__unknown',
  },
];

let lastLine = null;
const readStream = fs.createReadStream('../history.dat', { highWaterMark: 56 });

readStream.on('data', function (chunk) {
  lastLine = chunk;
});

readStream.on('close', () => {
  const unpackFormat = binaryDataFormatTable.reduce((acc, value) => {
    acc += value.type + value.name + '/';
    return acc;
  }, '');

  const bytes = nodePack.unpack(unpackFormat, lastLine);
  for (let obj of binaryDataFormatTable) {
    if (obj.minRange !== undefined || obj.maxRange !== undefined) {
      bytes[obj.name] = calmDown(bytes[obj.name], obj.minRange, obj.maxRange);
    }
  }
  const seconds = bytes['timestamp'] * 24 * 3600; // timestamp is in days
  bytes['timestamp'] = new Date(Date.UTC(1899, 11, 30, 0, 0, seconds)).toISOString();

  const variables = {
    id: '00000000-0001-0000-0000-000000000001',
    input: {
      absolutePressure: bytes['absPressure'],
      relativePressure: bytes['relPressure'],
      indoorTemperature: bytes['indoorTemp'],
      outdoorTemperature: bytes['outdoorTemp'],
      indoorHumidity: bytes['indoorHumidity'],
      outdoorHumidity: bytes['outdoorHumidity'],
      windSpeed: bytes['windSpeed'],
      windAzimuth: (bytes['windDirection'] === null) ? null : bytes['windDirection'] * 22.5,
      windGust: bytes['windGust'],
      pressureUnit: 'PASCAL',
      humidityUnit: 'PERCENTAGE',
      windSpeedUnit: 'KMH',
      temperatureUnit: 'CELSIUS'
    }
  };

  console.log(variables);
  createRecord(variables);
});

function calmDown(value, minRange, maxRange) {
  if (value >= minRange && value <= maxRange) {
    return Math.round(value * 100) / 100;
  }
  return null;
}
