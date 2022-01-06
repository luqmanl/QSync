redis-server --protected-mode no &
echo "Redis server started."

python3 src/manage.py runserver &
echo "Python server started."

python3 src/manage.py runfeedhandler &
echo "Feed handler started."

wait $PID