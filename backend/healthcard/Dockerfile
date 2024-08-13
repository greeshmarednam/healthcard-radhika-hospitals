# Use the official Python image as the base image
FROM python:3.9

# Set environment variables for Python
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y poppler-utils \
    && apt-get install -y --no-install-recommends \
        libreoffice \
    && rm -rf /var/lib/apt/lists/*
# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


# Copy the rest of the application code into the container at /app
COPY . /app/
#
# RUN chmod +x /app/build.sh
# CMD ["/app/build.sh"]

EXPOSE 10000

CMD ["gunicorn","--bind", ":10000", "healthcard.wsgi:application"]