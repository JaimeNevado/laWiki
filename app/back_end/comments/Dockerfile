FROM python:3.12-alpine

WORKDIR /app
COPY ./back_end/comments/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY ./back_end/database_connection.py /app
COPY ./back_end/la_wiki_utils.py /app
COPY ./back_end/comments/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "comment_controller:api", "--reload", "--host", "0.0.0.0", "--port", "80"]

