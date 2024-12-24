FROM python:3.12-alpine

WORKDIR /app
COPY ./back_end/wiki/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir /articles
COPY ./back_end/articles/articles.py /articles

COPY ./back_end/database_connection.py /app
COPY ./back_end/la_wiki_utils.py /app
COPY ./back_end/image_upload.py /app
COPY ./back_end/wiki/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "wiki_controller:api", "--reload", "--host", "0.0.0.0", "--port", "80"]

