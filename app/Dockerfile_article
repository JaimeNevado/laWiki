FROM python:3.12-slim

RUN mkdir /comments
COPY ./comments/comments.py /comments

WORKDIR /app
COPY ./database_connection.py /app
COPY ./articles/requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

COPY ./articles/* /app
EXPOSE 80
CMD ["python", "-m", "uvicorn", "article_controller:router", "--reload", "--host", "0.0.0.0", "--port", "80"]

