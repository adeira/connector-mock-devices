let fetch = require('node-fetch');


let options = {
	apiUrl: 'http://connector.adeira.loc/graphql',
	username: 'test',
	password: 'test',
};

let loginQuery = `
mutation {
	login (username: "${options.username}", password: "${options.password}") {
		token
	}
}`;


let authenticate = fulfilled => fetch(options.apiUrl, {
	method: 'post',
	body: JSON.stringify({
		query: loginQuery
	})
}).then(
	loginResponse => loginResponse.json()
).then(json => {

	if (json.errors) {
		throw json.errors;
	} else {
		fulfilled(json.data.login);
	}

}).catch(
	loginErrors => console.error(JSON.stringify(loginErrors, null, 2))
);


exports.config = options;
exports.authenticate = authenticate;
