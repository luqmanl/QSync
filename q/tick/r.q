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

secondInNanosecs: 1000000000j
dayInSeconds: 86400

/ OUR FUNCTION
.orderbook.basis:{[spotSym;futureSym;spotEx;futEx;minTimestamp;resolution] midprices: (select midprice:(avg bid1 + avg ask1) % 2 by (secondInNanosecs*resolution) xbar exchangeTime,sym,exchange from orderbooktop where sym in (spotSym;futureSym), exchange in (spotEx;futEx), exchangeTime > minTimestamp); 
    diff:{[x] -/ [0 -x]};
    basis: select basis:diff midprice by exchangeTime from midprices;
    0!select from basis where basis > -30000
    }

/ open hdb
hdb:hopen`::5012;

.percentage.change:{[sym;exchange]
    priceNow:hdb(`.price.at.time, sym, exchange, 2021.12.28D13:27:25.065361000);
    price24hAgo:hdb(`.price.at.time, sym, exchange, 2021.12.28D13:27:25.065361000 - 1000000000j*86400);
    price7dAgo:hdb(`.price.at.time, sym, exchange, 2021.12.28D13:27:25.065361000 - 1000000000j*604800);
    percentageChange24h: (priceNow - price24hAgo) % price24hAgo;
    percentageChange7d: (priceNow - price7dAgo) % price7dAgo;
    percentageChange24h,percentageChange7d
    }

/ close hdb
/hclose hdb;