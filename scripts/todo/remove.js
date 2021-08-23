const IOST = require("@kunroku/iost");
const iostConfig = require("../../config/iost.json");
const parseArgs = require("../parseArgs");

const { id } = parseArgs({
  id: (value) => {
    if (!Number.isInteger(Number(value))) {
      throw new Error("integer value required");
    }
    return value;
  },
});

const { address, owner } = require("../../config/contract/todo.json");
const { secret_key } = require(`../../config/account/${owner}.json`);

const iost = new IOST(iostConfig);
const publisher = new IOST.Account(owner);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secret_key));
publisher.addKeyPair("active", kp);
iost.setPublisher(publisher);

const tx = iost.call(address, "remove", [id]);
const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
