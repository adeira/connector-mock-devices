import { config, authenticate } from './config';
import fetch from 'node-fetch';

const query = `
mutation ($id: ID!, $input: PhysicalQuantitiesInput!) {
  createWeatherStationRecord(id: $id, quantities: $input) {
    id
  }
}`;

export default function createRecord(variables) {
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
}
