const IOST = require("@kunroku/iost");
const iostConfig = require("../../config/iost.json");

const { address, owner } = require(`../../config/contract/todo.json`);
const { secret_key } = require(`../../config/account/${owner}.json`);

const iost = new IOST(iostConfig);
const publisher = new IOST.Account(owner);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
publisher.addKeyPair("active", kp);
iost.setPublisher(publisher);

const tx = iost.call(address, "getAllTasks", []);
const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess((res) => {
  console.log(JSON.parse(JSON.parse(res.returns[0])[0]));
});
handler.onFailed(console.log);
