const { default: axios } = require('axios');

const baseRestUrl = 'https://www.okex.com';

function getRestPrice() {
    axios.get(`${baseRestUrl}/api/v5/public/instruments`, {
            params: {
                instType: 'SWAP'
            }
        })
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        })
}

exports.getRestPrice = getRestPrice