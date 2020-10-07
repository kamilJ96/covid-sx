import { createWriteStream, createReadStream } from 'fs';
import { createInterface } from 'readline';
import stream from 'stream';
import yahoo from 'yahoo-finance';
const { quote } = yahoo;

const stateFile = '../../../data/states.csv';
const symbolFile = '../../../data/symbols.txt';

const timer = (ms) => { return new Promise(res => setTimeout(res, ms)); };
const writeStream = createWriteStream(stateFile, { flags: 'a' });

const getStateData = async (symbols) => {
  for (const symbol of symbols) {
    try {
      const res = await quote({
        symbol,
        modules: ['summaryProfile']
      });
      // res[symbol].forEach(row => writeStream.write(`${s}, ${row.date.toISOString()}, ${row.adjClose}, ${row.volume}\n`));

      if (res.summaryProfile) {
        const s = symbol.split('.')[0];
        console.log('Got Summary Profile For: ', s);
        const country = res.summaryProfile.country;
        const state = res.summaryProfile.state ? res.summaryProfile.state : '';
        writeStream.write(`${s},${country},${state},${res.summaryProfile.industry}\n`);
      } else {
        console.error('No Summary Profile For: ', symbol);
      }

      await timer(50);

    } catch (err) {
      console.error('Error Getting Summary Profile For ', symbol, ' - ', err);
    }
  }
};

const inStream = createReadStream(symbolFile);
const outStream = new stream;
const rl = createInterface(inStream, outStream);

const symbols = [];

const start = async () => {
  getStateData(symbols);
};

rl.on('line', (line) => {
  symbols.push(`${line}.AX`);
});

rl.on('close', () => {
  start();
});
