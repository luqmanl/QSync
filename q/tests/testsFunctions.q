system "d .testsFunctions";

\l construct_mock_tables.q

timeNow:.z.z;
orderbooktop: constructSimpleMockOrderbooktable[timeNow];

testTest:{.qunit.assertEquals[2+2; 4; "Trial test 2 plus 2 equals four"]};

testPriceAtTimeNow:{
    .qunit.assertEquals[.price.at.time[`$"BTC-USDT";`BINANCE;.z.p]; 56; "Price at time now"];
    }

testPriceAtTime1Week:{
    .qunit.assertEquals[.price.at.time[`$"BTC-USDT";`BINANCE;.z.p - 5 * 24:00:00]; 59; "Price at time 1 week"];
    }

testPriceAtTime1Year:{
    .qunit.assertEquals[.price.at.time[`$"BTC-USDT";`BINANCE;.z.p - 366 * 24:00:00]; 61.5;"Price at time 1 year"];
    }

testSelectByMinTimeNow:{
    .qunit.assertEquals[(exec exchangeTime from .selectByMinTime[timeNow])[0]; timeNow; "Select by min time now"]; 
    }

testSelectByMinTime1Month:{
    .qunit.assertEquals[(exec exchangeTime from .selectByMinTime[timeNow - 31 * 24:00:00])[0]; timeNow - 5 * 24:00:00; "Select by min time 1 month"]; 
    }

testSelectMidpricesWithResolution:{
    .qunit.assertEquals[.selectMidpricesWithResolution[orderbooktop;`$"BTC-USDT"]; timeNow - 5 * 24:00:00; "Select midprices with resolution"];
    }

testCalculatePriceChangeDownTrend:{
    .qunit.assertEquals[.calculatePriceChange[`$"BTC-USDT";orderbooktop;30]; -0.5; "Calculate price change with downward trend"];
    }

testCalculatePriceChangeUpTrend:{
    .qunit.assertEquals[.calculatePriceChange[`$"BTC-USDT";orderbooktop;120]; 2.0; "Calculate price change with upward trend"];
    }

/ Tests for 'futures' symbols
orderbooktop: constructSpotFutureMockOrderbooktable[timeNow]

testOrderbookBasisInvalid:{
    .qunit.assertError[.orderbook.basis; (`$"BTC-USDT";`$"BTC-USD-PERP";`BINANCE;`DERIBIT;timeNow - 1000 * 24:00:00; 1); "Calculate order book basis for invalid data"];
    }

testOrderbookBasisValid:{
    .qunit.assertEquals[.orderbook.basis[`$"BTC-USDT";`$"BTC-USD-PERP";`BINANCE;`DERIBIT;timeNow - 1000 * 24:00:00; 1]; 2.0; "Calculate order book basis"];
    }












