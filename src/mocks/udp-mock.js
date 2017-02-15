import dgram from 'dgram';

const client = dgram.createSocket('udp4');

let message = '\u00bd + \u00bc = \u00be';

console.log(`Sending UDP messsage: ${message}`);
client.send(message, 0, 500, 50505, '127.0.0.1', (err) => {
	client.close();
});
