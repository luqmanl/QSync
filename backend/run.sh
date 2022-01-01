python3 src/manage.py runserver &
echo "Python server started."
python3 src/app/feed_handler.py
echo "Python feed handler started."

wait $PID