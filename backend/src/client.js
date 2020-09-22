import ws from 'ws';

const client = new ws('ws://127.0.0.1:8000/asx-data');
client.on('open', () => {
  client.send(JSON.stringify({ header: '00' }));
  client.send(JSON.stringify({ header: '01' }));
});

client.on('message', (data) => {
  const msg = data.toString();
  console.log('Received Message Of Length ', msg.length, ' | First 30 chars: ', msg.slice(0, 30));
});

client.on('error', (err) => {
  console.error(err);
});

client.on('close', (code) => {
  console.log('ws closed: ', code);
});

setTimeout(() => client.close(), 5000);
