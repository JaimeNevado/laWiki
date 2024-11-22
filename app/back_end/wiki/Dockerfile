FROM python:3.12-slim

WORKDIR /app
COPY ./wiki/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir /articles
COPY ./articles/articles.py /articles

COPY ./database_connection.py /app
COPY ./la_wiki_utils.py /app
COPY ./wiki/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "wiki_controller:api", "--reload", "--host", "0.0.0.0", "--port", "80"]

