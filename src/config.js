import fetch from 'node-fetch';


let options = {
	apiUrl: 'http://connector.adeira.loc/graphql',
	username: 'test',
	password: 'test',
};


let authPromise = fetch(options.apiUrl, {
	method: 'post',
	body: JSON.stringify({
		query: `mutation { login(username: "${options.username}", password: "${options.password}") { token } }`
	})
}).then(function (loginResponse) {
	return loginResponse.json();
}).catch(
	err => console.error(err)
);


export {
	options as config,
	authPromise
};
