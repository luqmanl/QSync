QHOME="./" l64/q tick.q tables . -p 5010 &
echo "Tickerplant started"

sleep 1

QHOME="./" l64/q tick/r.q -p 5011 &
echo "RDB started"

sleep 1

QHOME="./" l64/q tables -p 5012 &
echo "HDB started"

wait $PID