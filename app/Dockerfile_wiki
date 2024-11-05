FROM python:3.12-slim

RUN mkdir /articles
COPY ./articles/articles.py /articles

WORKDIR /app
COPY ./database_connection.py /app
COPY ./wiki/requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY ./wiki/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "wiki_controller:api", "--reload", "--host", "0.0.0.0", "--port", "80"]

