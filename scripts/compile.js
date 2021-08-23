const IOST = require("@kunroku/iost");
const fs = require("fs");
const parseArgs = require("./parseArgs");

const { contract } = parseArgs({
  contract: (value) => value,
});

if (!fs.existsSync(`src/${contract}.js`)) {
  throw new Error(`contract code not found: ${contract}`);
}

const source = fs.readFileSync(`src/${contract}.js`);
if (source === undefined) {
  throw new Error(`invalid file content. Is src/${contract}.js exists?`);
}

const abi = IOST.ContractABI.compile(source.toString());
fs.writeFile(`src/${contract}.js.abi`, JSON.stringify(abi, null, 2), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(`The new abi file was saved as src/${contract}.js.abi`);
  }
});
