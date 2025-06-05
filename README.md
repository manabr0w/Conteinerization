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

### Тепер внесемо зміни в файл spaceship/app.py, а саме додамо коментар і зберемо образ ще раз.
### Час збірки:

```Building 14.0s (12/12) FINISHED```

### Розмір образу:

```python_app/second             latest    f313f5a53706   48 seconds ago   770MB```

### Тепер я переписав Dockerfile притримуючись підходу ефективного використання шарів, про який було сказано в 3-му пункті 1-ї частини завдання.
### Сам файл :

```docker
FROM debian

RUN apt -y update && apt -y upgrade && apt install -y python3 python3-pip python3-venv

WORKDIR /app

COPY requirements.txt .

RUN python3 -m venv .venv

RUN . .venv/bin/activate && .venv/bin/pip install --upgrade pip \
&& .venv/bin/pip install -r requirements.txt

COPY . .

CMD [ "uvicorn", "spaceship.main:app", "--host=0.0.0.0", "--port=8080" ]
```
### Час збірки:

```Building 0.9s (12/12) FINISHED```
### Розмір образу:

```python_app/third              latest    3d5fcd6ebe5c   About a minute ago   770MB```

### Тепер візьмемо базовий образ менше, ніж звичайний. Сам файл:
```docker
FROM python:3.10-alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "uvicorn", "spaceship.main:app", "--host=0.0.0.0", "--port=8080" ]
```
**ПРИМІТКА:** хочу зауважити, що Докерфайл дуже видозмінився (відсутні шари про встановленням пайтона, про створення та активацію середовище) - це зроблено через те, що в образі вже встановлений пайтон та всі системні залежності для його роботи (окрім залежностей для нашого проекту), саме тому шарів стало менше, бо вони просто не потрібні.

### Час збірки:

``` Building 14.5s (11/11) FINISHED```

### Розмір образу:

```python_app/fourth              latest    e3355f9216a4   30 seconds ago   153MB```