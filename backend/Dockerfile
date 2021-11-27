FROM python:3.8
RUN pip install pipenv
COPY . .
RUN pipenv lock --keep-outdated --requirements > requirements.txt
RUN pip install -r requirements.txt
CMD python3 src/app/feed_handler.py