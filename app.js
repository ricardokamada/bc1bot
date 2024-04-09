const cron = require('node-cron');
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: 'qLiJoXnyeiffZYqEcbzQ6pSZKHGWbfYcpntISLU04godqHvokNH4RBgN0rMWqkJI',
    APISECRET: 'ABPzh0iq3pjhYlFE3XjcYEmkXTITdI8qJjNX3vISD91wpyAPAp7Ln4HUKH9iSOtV',
    recvWindow: 60000,
    family: 0,
    urls: {
        base: "https://testnet.binance.vision/api/",

}
});


let prices = {};
let amountSell = 0;
let amountBuy = 0;


// Função para zerar a variável
function zerarVariavel() {
    amountSell = 0;
    amountBuy = 0;
    console.log('Variável zerada!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
}

// Agendar tarefa para 09:00:00 da manhã
cron.schedule('0 9 * * *', () => {
    zerarVariavel();
});

// Agendar tarefa para 21:00:00 da noite
cron.schedule('0 21 * * *', () => {
    zerarVariavel();
});

binance.futuresAggTradeStream('BTCUSDT', (trades) => {
    prices[trades.symbol] = {
        eventType: trades.eventType,
        eventTime: trades.eventTime,
        symbol: trades.symbol,
        aggTradeId: trades.aggTradeId,
        price: parseFloat(trades.price),
        amount: parseFloat(trades.amount),
        total: parseFloat(trades.price) * parseFloat(trades.amount), // Calculate total
        firstTradeId: trades.firstTradeId,
        lastTradeId: trades.lastTradeId,
        timestamp: trades.timestamp,
        maker: trades.maker,
    };

    // Update amountSell and amountBuy
    if (trades.maker) {
        // Sell
        amountSell += prices['BTCUSDT'].amount;
    } else {
        // Buy
        amountBuy += prices['BTCUSDT'].amount;
    }
});

setInterval(() => {
    if (prices['BTCUSDT']) {
    console.log("Ratio:", (amountBuy / amountSell).toFixed(2), "Price:", prices['BTCUSDT'].price, "AmoutBTCBuy :", amountBuy.toFixed(2), "AmountBTCSell :", amountSell.toFixed(2), "Diff :", (amountBuy - amountSell).toFixed(2), new Date());
    } else {
    console.log("BTCUSDT data not available yet.");
    }
}, 1000);







//{
//   eventType: 'aggTrade',
//   eventTime: 1712061184014,
//   symbol: 'BTCUSDT',
//   aggTradeId: 2111295860,
//     //   price: '65698.60',
//     //   amount: '0.003',
//     //   total: '0.003',
//     //   firstTradeId: 4827087403,
//     //   lastTradeId: 4827087403,
//     //   timestamp: 1712061184000,
//     //   maker: true
//     // }
//     //make a bid purchase


//     // Se maker for true: Indica uma venda. Isso significa que a ordem foi colocada no livro de ofertas e retirou liquidez do mercado.
//     // Se maker for false: Indica uma compra. Isso significa que a ordem foi colocada no livro de ofertas e adicionou liquidez ao mercado.
//     // Outras informações:
//     
//     // price: Preço da transação.
//     // amount: Quantidade de criptomoeda negociada.
//     // total: Valor total da transação (preço * quantidade).