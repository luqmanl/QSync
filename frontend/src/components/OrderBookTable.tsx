import React from 'react';

// time     tickersymbol     bid/ask     price      quantity

interface OrderBookDataType {
    time: number,
    ticker : string,
    price: number,
    quantity: number
}

interface OrderBookType { 
    bids : OrderBookDataType[],
    asks: OrderBookDataType[]
}

const exampleData : OrderBookType = {
    bids : [
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        },
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        },
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        }
    ],
    asks: [
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        },
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        },
        {
            time: 0,
            ticker: "BTC-USD",
            price: 11,
            quantity: 20   
        }
    ]
}


const OrderBookTable = () => {
    return (
    <div>
        <table style={{
            border: "1px solid black",
            textAlign: "center"
        }}>
            <tr>
                <th></th>
                <th colSpan={2}>bids</th>
                <th colSpan={2}>asks</th>
            </tr>
            <tr>
                <td style={{
                        border: "1px solid black"
                    }}>time</td>
                <td style={{
                        border: "1px solid black"
                    }}>price</td>
                <td style={{
                        border: "1px solid black"
                    }}>quantity</td>
                <td style={{
                        border: "1px solid black"
                    }}>price</td>
                <td style={{
                        border: "1px solid black"
                    }}>quantity</td>
            </tr>
            {exampleData.bids.map((item, i) => {
                return (
                    <tr key={i} style={{
                        border: "1px solid black"
                    }}>
                        <td style={{
                            padding: "20px"
                        }}>{item.time}</td>
                        <td style={{
                            padding: "20px"
                        }}>{item.price}</td>
                        <td style={{
                            padding: "20px"
                        }}>{item.quantity}</td>
                        <td style={{
                            padding: "20px"
                        }}>{exampleData.asks[i].price}</td>
                        <td style={{
                            padding: "20px"
                        }}>{exampleData.asks[i].price}</td>
                    </tr>
                );
            })}
            {exampleData.asks.map((item, i) => {
                return (
                    <tr key={i} style={{
                        border: "1px solid black"
                    }}>
                        <td style={{
                            padding: "20px"
                        }}>{item.time}</td>
                        <td style={{
                            padding: "20px"
                        }}>{item.price}</td>
                        <td style={{
                            padding: "20px"
                        }}>{item.quantity}</td>
                        <td style={{
                            padding: "20px"
                        }}>{exampleData.asks[i].price}</td>
                        <td style={{
                            padding: "20px"
                        }}>{exampleData.asks[i].price}</td>
                    </tr>
                );
            })}
        </table>
    </div>);
}

export default OrderBookTable
