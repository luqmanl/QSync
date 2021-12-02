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

/ OUR FUNCTION
.orderbook.basis: {midprices: (select midprice:(avg bid1 + avg ask1) % 2 by time.hh,time.mm,sym,exchange from orderbooktop where sym in `$("BTC-USD-21Z31";"BTC-USDT")); 
    cutprices: 6 cut 0!midprices;
    selectWithSpot: {[x] select from x where sym=`$"BTC-USDT"};
    selectWithFuture: {[x] `hh`mm`sym`exchange2`midprice2 xcol (select from x where sym=`$"BTC-USD-21Z31")};
    makeTable:{[x] (selectWithSpot x; selectWithFuture x)}; 
    tableaux: makeTable each cutprices
    crossThem:{[t] select hh,mm,sym,exchange,exchange2,basis:midprice2 - midprice from t[0] cross t[1]};
    crossThem each tableaux
    }