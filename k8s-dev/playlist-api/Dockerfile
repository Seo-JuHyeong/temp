FROM python:3.8

WORKDIR /app

RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8102
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8102"]
