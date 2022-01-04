FROM python:3.8
RUN pip install pipenv
COPY . .
RUN apt-get update
RUN apt-get install redis-server -y
RUN pipenv update cryptofeed --dev
RUN pipenv lock --keep-outdated --requirements > requirements.txt
RUN pip install -r requirements.txt
RUN chmod u+x run.sh
EXPOSE 8000
CMD ./run.sh