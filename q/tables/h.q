secondInNanosecs: 1000000000j

.orderbook.basis:{[spotSym;futureSym;spotEx;futEx;minTimestamp;resolution] 
    midprices: (select midprice:(avg bid1 + avg ask1) % 2 by (secondInNanosecs*resolution) xbar exchangeTime,sym,exchange from orderbooktop where sym in (spotSym;futureSym), exchange in (spotEx;futEx), exchangeTime > minTimestamp); 
    diff:{[x] -/ [0 -x]};
    basis: select basis:diff midprice by exchangeTime from midprices;
    0!select from basis where basis > -30000
    }

.price.at.time:{[sym1;exchange1;theTime] 
    firstOrderbookEntry:-1#select from orderbooktop where exchangeTime < theTime, sym=sym1, exchange=exchange1;
    price: (exec midprice from (select midprice:(avg bid1 + avg ask1) % 2 by exchangeTime from firstOrderbookEntry))[0]
    }