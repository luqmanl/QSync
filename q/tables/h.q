secondInNanosecs: 1000000000j

.orderbook.basis:{[spotSym;futureSym;spotEx;futEx;minTimestamp;resolution] 
    midprices: (select midprice:(avg bid1 + avg bid2) % 2 by (secondInNanosecs*resolution) xbar exchangeTime,sym,exchange from orderbooktop where sym in (spotSym;futureSym), exchange in (spotEx;futEx), exchangeTime > minTimestamp); 
    diff:{[x] -/ [0 -x]};
    basis: select basis:diff midprice by exchangeTime from midprices;
    0!select from basis where basis > -30000
    }

.orderbook.price:{[exch;pair;timeperiod;freq]
    select price:(avg bid1 + avg bid2) % 2 by date:`date$exchangeTime, time:01:00u*freq xbar exchangeTime.hh from orderbooktop where exchangeTime > .z.z - 01:00u*timeperiod, exchange=exch, sym=pair
    }

.orderbook.prevprice:{[exch;pairs]
    price1D: select price1D: (last bid2 + last bid1) % 2 by sym from orderbooktop where exchangeTime < .z.z - 24:00, exchange=exch, sym in pairs;
    price7D: select price7D: (last bid2 + last bid1) % 2 by sym from orderbooktop where exchangeTime < .z.z - 24:00u*7, exchange=exch, sym in pairs;
    price1D^price7D
    }
.price.at.time:{[sym1;exchange1;theTime] 
    firstOrderbookEntry:-1#select from orderbooktop where exchangeTime < theTime, sym=sym1, exchange=exchange1;
    price: (exec midprice from (select midprice:(avg bid1 + avg bid2) % 2 by exchangeTime from firstOrderbookEntry))[0]
    }

.selectByMinTime:{[timeFrom] select from orderbooktop where exchangeTime > timeFrom}