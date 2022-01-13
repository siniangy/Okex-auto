const { getWsPrice } = require('./getWsPrice');
const { getRestPrice } = require('./getRestPrice');

function main() {
    getWsPrice();
    getRestPrice();
}

main();