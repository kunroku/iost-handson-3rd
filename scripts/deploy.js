const IOST = require("@kunroku/iost");
const fs = require("fs");
const iostConfig = require("../config/iost.json");
const parseArgs = require("./parseArgs");

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
if (!fs.existsSync(`src/${contract}.js`)) {
  throw new Error("contract code not found");
}
if (!fs.existsSync(`src/${contract}.js.abi`)) {
  throw new Error("contract abi not found");
}

const { secret_key } = require(`../config/account/${id}.json`);

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
const tx = iost.contract.system.setCode(source, abi);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess((res) => {
  const contract_address = JSON.parse(res.returns[0])[0];
  fs.writeFileSync(`config/contract/${contract}.json`, JSON.stringify({
    name: contract,
    address: contract_address,
    owner: publisher.id,
  }, null, 2), "utf-8");
  console.log(res);
});
handler.onFailed(console.log);
