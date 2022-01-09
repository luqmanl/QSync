/ Construct tables for testing.
/ -
/ Since our functions work on data using timestamps, we ensure
/ that the database is constructed using live timestamps, in order to prevent 
/ errors relating to stale data.
oneDay:24:00:00;

constructSimpleMockOrderbooktable:{[timeNow]
    times:(timeNow; timeNow - 01:00:00; timeNow - 06:00:00; timeNow - 25:00:00; timeNow - 49:00:00; timeNow - 5*oneDay; timeNow - 10*oneDay; timeNow - 20*oneDay; timeNow - 40*oneDay; timeNow - 70*oneDay; timeNow - 200*oneDay; timeNow - 400*oneDay);
    exchangeTimes:(timeNow; timeNow - 01:00:00; timeNow - 06:00:00; timeNow - 25:00:00; timeNow - 49:00:00; timeNow - 5*oneDay; timeNow - 10*oneDay; timeNow - 20*oneDay; timeNow - 40*oneDay; timeNow - 70*oneDay; timeNow - 200*oneDay; .z.z - 400*oneDay);
    symbols:(`$"BTC-USDT";`$"ETH-USDT");
    exchanges:(`BINANCE;`DERIBIT);
    asks1:(100;102;104;106;108;110;112;114;116;118;120;122);
    asks2:asks3:asks4:asks5:asks6:asks7:asks8:asks9:asks10:(0;0;0;0;0;0;0;0;0;0;0;0);
    bids1:(12;11;10;9;8;7;6;5;4;3;2;1);
    bids2:bids3:bids4:bids5:bids6:bids7:bids8:bids9:bids10:(0;0;0;0;0;0;0;0;0;0;0;0);
    bidSizes1:(1;2;3;4;5;6;7;8;9;10;11;12);
    bidSizes2:bidSizes3:bidSizes4:bidSizes5:bidSizes6:bidSizes7:bidSizes8:bidSizes9:bidSizes10:(0;0;0;0;0;0;0;0;0;0;0;0);
    askSizes1:(1;2;3;4;5;6;7;8;9;10;11;12);
    askSizes2:askSizes3:askSizes4:askSizes5:askSizes6:askSizes7:askSizes8:askSizes9:askSizes10:(0;0;0;0;0;0;0;0;0;0;0;0);
    orderbooktop:([]time:times; sym:symbols[0]; exchange:exchanges[0]; exchangeTime:exchangeTimes; bid1:bids1; bid2:bids2; bid3:bids3; bid4:bids4; bid5:bids5; bid6:bids6; bid7:bids7; bid8:bids8; bid9:bids9; bid10:bids10; ask1:asks1; ask2:asks2; ask3:asks3; ask4:asks4; ask5:asks5; ask6:asks6; ask7:asks7; ask8:asks8; ask9:asks9; ask10:asks10; bidSize1:bidSizes1; bidSize2:bidSizes2; bidSize3:bidSizes3; bidSize4:bidSizes4; bidSize5:bidSizes5; bidSize6:bidSizes6; bidSize7:bidSizes7; bidSize8:bidSizes8; bidSize9:bidSizes9; bidSize10:bidSizes10; askSize1:askSizes1; askSize2:askSizes2; askSize3:askSizes3; askSize4:askSizes4; askSize5:askSizes5; askSize6:askSizes6; askSize7:askSizes7; askSize8:askSizes8; askSize9:askSizes9; askSize10:askSizes10);
    orderbooktop   
    }

/ create mock table with spot=BTC-USDT and future="BTC-USDT-PERP"
constructSpotFutureMockOrderbooktable:{[timeNow]
    times:(timeNow; timeNow - 01:00:00; timeNow - 06:00:00; timeNow - 25:00:00; timeNow - 49:00:00; timeNow - 5*oneDay; timeNow - 10*oneDay; timeNow - 20*oneDay; timeNow - 40*oneDay; timeNow - 70*oneDay; timeNow - 200*oneDay; timeNow - 400*oneDay);
    exchangeTimes:(timeNow; timeNow - 01:00:00; timeNow - 06:00:00; timeNow - 25:00:00; timeNow - 49:00:00; timeNow - 5*oneDay; timeNow - 10*oneDay; timeNow - 20*oneDay; timeNow - 40*oneDay; timeNow - 70*oneDay; timeNow - 200*oneDay; .z.z - 400*oneDay);
    symbols:(`$"BTC-USDT";`$"BTC-USD-PERP");
    exchanges:(`BINANCE;`DERIBIT);
    asks1:(100;102;104;106;108;110;112;114;116;118;120;122);
    asks2:asks3:asks4:asks5:asks6:asks7:asks8:asks9:asks10:(0;0;0;0;0;0;0;0;0;0;0;0);
    bids1:(12;11;10;9;8;7;6;5;4;3;2;1);
    bids2:bids3:bids4:bids5:bids6:bids7:bids8:bids9:bids10:(0;0;0;0;0;0;0;0;0;0;0;0);
    bidSizes1:(1;2;3;4;5;6;7;8;9;10;11;12);
    bidSizes2:bidSizes3:bidSizes4:bidSizes5:bidSizes6:bidSizes7:bidSizes8:bidSizes9:bidSizes10:(0;0;0;0;0;0;0;0;0;0;0;0);
    askSizes1:(1;2;3;4;5;6;7;8;9;10;11;12);
    askSizes2:askSizes3:askSizes4:askSizes5:askSizes6:askSizes7:askSizes8:askSizes9:askSizes10:(0;0;0;0;0;0;0;0;0;0;0;0);
    orderbooktopSpot:([]time:times; sym:symbols[0]; exchange:exchanges[0]; exchangeTime:exchangeTimes; bid1:bids1; bid2:bids2; bid3:bids3; bid4:bids4; bid5:bids5; bid6:bids6; bid7:bids7; bid8:bids8; bid9:bids9; bid10:bids10; ask1:asks1; ask2:asks2; ask3:asks3; ask4:asks4; ask5:asks5; ask6:asks6; ask7:asks7; ask8:asks8; ask9:asks9; ask10:asks10; bidSize1:bidSizes1; bidSize2:bidSizes2; bidSize3:bidSizes3; bidSize4:bidSizes4; bidSize5:bidSizes5; bidSize6:bidSizes6; bidSize7:bidSizes7; bidSize8:bidSizes8; bidSize9:bidSizes9; bidSize10:bidSizes10; askSize1:askSizes1; askSize2:askSizes2; askSize3:askSizes3; askSize4:askSizes4; askSize5:askSizes5; askSize6:askSizes6; askSize7:askSizes7; askSize8:askSizes8; askSize9:askSizes9; askSize10:askSizes10);
    orderbooktopFuture:([]time:times; sym:symbols[1]; exchange:exchanges[1]; exchangeTime:exchangeTimes; bid1:bids1; bid2:bids2; bid3:bids3; bid4:bids4; bid5:bids5; bid6:bids6; bid7:bids7; bid8:bids8; bid9:bids9; bid10:bids10; ask1:asks1; ask2:asks2; ask3:asks3; ask4:asks4; ask5:asks5; ask6:asks6; ask7:asks7; ask8:asks8; ask9:asks9; ask10:asks10; bidSize1:bidSizes1; bidSize2:bidSizes2; bidSize3:bidSizes3; bidSize4:bidSizes4; bidSize5:bidSizes5; bidSize6:bidSizes6; bidSize7:bidSizes7; bidSize8:bidSizes8; bidSize9:bidSizes9; bidSize10:bidSizes10; askSize1:askSizes1; askSize2:askSizes2; askSize3:askSizes3; askSize4:askSizes4; askSize5:askSizes5; askSize6:askSizes6; askSize7:askSizes7; askSize8:askSizes8; askSize9:askSizes9; askSize10:askSizes10);
    raze (orderbooktopSpot; orderbooktopFuture)
    }