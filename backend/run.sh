redis-server &
echo "Redis server started."

python3 src/manage.py runserver &
echo "Python server started."

wait $PID