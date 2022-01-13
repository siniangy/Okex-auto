const Websocket = require('ws');

const { createCounter } = require('./utils/index');

function getWsPrice() {
    const ws = new Websocket('wss://ws.okex.com:8443/ws/v5/public');
    const subscribeArg = {
        op: 'subscribe',
        args: [{
            "channel": "instruments",
            "instType": "SWAP"
        }]
    };
    const unSubscribeArg = {...subscribeArg, op: 'unsubscribe' };
    // 60秒内没有响应退订，并触发退订信息并重新订阅
    const reSubscribeCounter = createCounter(60, () => {
        ws.send(JSON.stringify(unSubscribeArg));
    });
    // ping pong响应测试
    const wsPingPongCounter = createCounter(23, () => {
        ws.send('ping');
    });
    ws.on('open', () => {
        console.log('open');
        ws.send(JSON.stringify(subscribeArg));
    });
    ws.on('error', () => {
        console.log('error');
        getWsPrice();
    });
    ws.on('message', (res) => {
        let msg = Buffer.from(JSON.parse(JSON.stringify(res))).toString('utf8');
        console.log(msg);
        if (msg === 'pong') {
            wsPingPongCounter.resetCount(); // count归0
        } else {
            reSubscribeCounter.resetCount(); // count归0
            const data = JSON.parse(msg);
            if (data.event === 'unsubscribe') {
                console.log('data-subscribe');
                ws.send(JSON.stringify(subscribeArg));
            }
            if (data.event === 'error') {
                console.log('data-error')
            }
            if (data.data) {
                console.log(data);
            }
        }
    })
}
exports.getWsPrice = getWsPrice