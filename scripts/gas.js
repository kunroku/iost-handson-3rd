const IOST = require("@kunroku/iost");
const iostConfig = require("../config/iost.json");
const admin = require("../config/account/admin.json");
const parseArgs = require("./parseArgs");

const { id, amount } = parseArgs({
  id: (value) => value,
  amount: (value) => {
    if (Number.isNaN(Number(value))) {
      throw new Error("amount is required number type");
    }
    return value;
  }
});

const iost = new IOST(iostConfig);
const account = new IOST.Account(admin.id);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(admin.secret_key));
account.addKeyPair("active", kp);
iost.setPublisher(account);

const tx = iost.contract.gas.pledge(account.id, id, amount);

const handler = iost.signAndSend(tx);
handler.listen({ irreversible: true });
handler.onSuccess(console.log);
handler.onFailed(console.log);
