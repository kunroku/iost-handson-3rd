const IOST = require("@kunroku/iost");
const fs = require("fs");
const parseArgs = require("./parseArgs");
const iostConfig = require("../config/iost.json");
const admin = require("../config/account/admin.json");

const { id } = parseArgs({
  id: (value) => {
    return value;
  },
});

const iost = new IOST(iostConfig);
const publisher = new IOST.Account(admin.id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(admin.secret_key));
publisher.addKeyPair("active", kp);
iost.setPublisher(publisher);

const newKp = IOST.KeyPair.Ed25519.randomKeyPair();
const tx = iost.contract.auth.signUp(id, IOST.Bs58.encode(newKp.publicKey), IOST.Bs58.encode(newKp.publicKey));
iost.contract.gas.pledge(publisher.id, id, 1000, tx);
iost.contract.ram.buy(publisher.id, id, 1024 * 256, tx);
iost.contract.token.transfer("iost", publisher.id, id, 50000, "initial transfer", tx);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess((res) => {
  fs.writeFileSync(`config/account/${id}.json`, JSON.stringify({
    id: id,
    secret_key: IOST.Bs58.encode(newKp.secretKey)
  }, null, 2), "utf-8");
  console.log(res);
});
handler.onFailed(console.log);
