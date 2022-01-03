/q tick/r.q [host]:port[:usr:pwd] [host]:port[:usr:pwd]
/2008.09.09 .k ->.q

if[not "w"=first string .z.o;system "sleep 1"];

numExchanges: 6

upd:insert;

/ get the ticker plant and history ports, defaults are 5010,5012
.u.x:.z.x,(count .z.x)_(":5010";":5012");

/ end of day: save, clear, hdb reload
.u.end:{t:tables`.;t@:where `g=attr each t@\:`sym;.Q.hdpf[`$":",.u.x 1;`:.;x;`sym];@[;`sym;`g#] each t;};

/ init schema and sync up from log file;cd to hdb(so client save can run)
.u.rep:{(.[;();:;].)each x;if[null first y;:()];-11!y;system "cd ",1_-10_string first reverse y};
/ HARDCODE \cd if other than logdir/db

/ Gets the total volume of trades for a given currency /
.trades.vol: {[x] vols:select vol:sum quantity from trades where sym=x,exchangeTime > .z.z - 01:00; vols[0;`vol]}

/ connect to ticker plant for (schema;(logcount;log))
.u.rep .(hopen `$":",.u.x 0)"(.u.sub[`;`];`.u `i`L)";

secondInNanosecs: 1000000000j;
dayInSeconds: 86400;
weekInSeconds: 604800;

/ OUR FUNCTION
.orderbook.basis:{[spotSym;futureSym;spotEx;futEx;minTimestamp;resolution] midprices: (select midprice:(avg bid1 + avg ask1) % 2 by (secondInNanosecs*resolution) xbar exchangeTime,sym,exchange from orderbooktop where sym in (spotSym;futureSym), exchange in (spotEx;futEx), exchangeTime > minTimestamp); 
    diff:{[x] -/ [0 -x]};
    basis: select basis:diff midprice by exchangeTime from midprices;
    0!select from basis where basis > -30000
    }

/ open hdb
hdb:hopen`::5012;

/ \t 2000
.syms.easy:{`.syms.percentage[(`$"BTC-USDT";`$"ETH-USDT";`$"ADA-USDT";`$"SOL-USDT";`$"DOGE-USDT");`BINANCE]};

.syms.percentage:{[syms;exchange] 
    t:.percentage.change[;exchange] each syms;
    `topCurrencyData insert t;
    -5#topCurrencyData
    }

.percentage.change:{[sym;exchange]
    timeNow: .z.p;
    / priceNow:hdb(`.price.at.time, sym, exchange, timeNow);
    priceNow:.price.at.time[sym;exchange;timeNow];
    price24hAgo:hdb(`.price.at.time, sym, exchange, timeNow - secondInNanosecs*dayInSeconds);
    price7dAgo:hdb(`.price.at.time, sym, exchange, timeNow - secondInNanosecs*weekInSeconds);
    percentageChange24h: (priceNow - price24hAgo) % price24hAgo;
    percentageChange7d: (priceNow - price7dAgo) % price7dAgo;
    `time`sym`price`change24h`change7d`marketCap!(timeNow;sym;priceNow;percentageChange24h;percentageChange7d;0f) / market cap zero for the time being
    }

.price.at.time:{[sym1;exchange1;theTime] 
    firstOrderbookEntry:-1#select from orderbooktop where exchangeTime < theTime, sym=sym1, exchange=exchange1;
    price: (exec midprice from (select midprice:(avg bid1 + avg ask1) % 2 by exchangeTime from firstOrderbookEntry))[0]
    }

/ close hdb
/hclose hdb;
/ 
/ for reference
/ syms:(`$"BTC-USDT";`$"ETH-USDT")