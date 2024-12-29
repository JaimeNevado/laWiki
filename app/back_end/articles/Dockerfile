FROM python:3.12-alpine

WORKDIR /app
COPY ./back_end/articles/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir /comments
COPY ./back_end/comments/comments.py /comments

COPY ./back_end/database_connection.py /app
COPY ./back_end/la_wiki_utils.py /app
COPY ./back_end/image_upload.py /app
COPY ./back_end/authentication.py /app
COPY ./back_end/articles/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "article_controller:router", "--reload", "--host", "0.0.0.0", "--port", "80"]

