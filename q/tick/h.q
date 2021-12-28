.orderbook.basis:{[spotSym;futureSym;spotEx;futEx;minTimestamp] 
    midprices: (select midprice:(avg bid1 + avg ask1) % 2 by 0D00:00:01 xbar exchangeTime,sym,exchange from orderbooktop where sym in (spotSym;futureSym), exchange in (spotEx;futEx), exchangeTime > minTimestamp); 
    diff:{[x] -/ [0 -x]};
    basis: select basis:diff midprice by exchangeTime from midprices;
    0!select from basis where basis > -30000
    }