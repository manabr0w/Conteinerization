# Лабораторна робота 3 (Федоренко Максим ІМ-32)

# Мета роботи дослідження технології контейнеризації та набуття практичних навичок

## Частина 1. Контейнеризація застосунку на Python
### За вимогою завдання я написав Dockerfile для застосунку написаного на мові програмування Python. Ось який вигляд має сам файл:
```docker
FROM debian

RUN apt -y update && apt -y upgrade && apt install -y python3 \
python3-pip \
python3-venv

WORKDIR /app

COPY . .

RUN python3 -m venv .venv

RUN . .venv/bin/activate && .venv/bin/pip install --upgrade pip \
&& .venv/bin/pip install -r requirements.txt

CMD [ "uvicorn", "spaceship.main:app", "--host=0.0.0.0", "--port=8080" ]
```
### Час збірки:

```Building 70.1s (12/12) FINISHED```

### Розмір образу:

```python_app/first              latest    d18b65b4b4f1   41 seconds ago   770MB```
