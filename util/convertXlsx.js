const fs = require('fs')
const xlsx = require('node-xlsx');

const exchangeSheet = xlsx.parse(fs.readFileSync(`${__dirname}/data/exchanges_data.xlsx`));
const data = exchangeSheet[0].data

const res = {}
for (let i=1; i<data.length; i++ ) {
  const dataInstance = data[i]
  const pair = dataInstance[0].split('/').slice(-1)[0].toLowerCase()

  res[pair] = {
    proc: dataInstance[4],
    amount: {
      min: dataInstance[2],
      max: dataInstance[3],
    }
  }
}


console.log(JSON.stringify(res, null, 4))
