const IOST = require("@kunroku/iost");
const fs = require("fs");
const parseArgs = require("./parseArgs");
const iostConfig = require("../config/iost.json");

const { publisher: id, contract } = parseArgs({
  publisher: (value) => {
    return value;
  },
  contract: (value) => {
    return value;
  },
});

if (!fs.existsSync(`config/account/${id}.json`)) {
  throw new Error("contract publisher not found");
}
if (!fs.existsSync(`config/contract/${contract}.json`)) {
  throw new Error("contract info not found");
}
if (!fs.existsSync(`src/${contract}.js`)) {
  throw new Error("contract code not found");
}
if (!fs.existsSync(`src/${contract}.js.abi`)) {
  throw new Error("contract abi not found");
}

const { secret_key } = require(`../config/account/${id}.json`);
const { address } = require(`../config/contract/${contract}.json`);

const iost = new IOST({
  ...iostConfig,
  gasLimit: 4000000
});

const publisher = new IOST.Account(id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
publisher.addKeyPair("active", kp);
iost.setPublisher(publisher);

const source = fs.readFileSync(`src/${contract}.js`, "utf-8");
const abi = JSON.parse(fs.readFileSync(`src/${contract}.js.abi`, "utf-8"));
const tx = iost.contract.system.updateCode(source, abi, address, "");
const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
