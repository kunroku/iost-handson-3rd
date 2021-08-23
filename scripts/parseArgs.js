/**
 * 
 * @param {{ [key: string]: (value: string) => any }} validators 
 * @returns {{ [key: string]: any }}
 */
module.exports = (validators) => Object.keys(validators)
  .map((key) => {
    const identifier = `${key}:`;
    const value = process.argv.find(e => e.startsWith(identifier));
    if (!value) {
      throw new Error(`${key} not found in args`);
    }
    const rawValue = value.replace(identifier, "");
    const ficedValue = validators[key](rawValue);
    return { [key]: ficedValue };
  })
  .reduce((prev, current) => ({ ...prev, ...current }));