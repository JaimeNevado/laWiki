FROM python:3.12-slim

WORKDIR /app
COPY ./comments/requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt

COPY ./database_connection.py /app
COPY ./la_wiki_utils.py /app
COPY ./comments/* /app

EXPOSE 80
CMD ["python", "-m", "uvicorn", "comment_controller:api", "--reload", "--host", "0.0.0.0", "--port", "80"]

