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

### Тепер я додав в залежності проекту numpy та створив ендпоінт для генерації рандомних матриць і їх перемноження, Докерфайл при цьому лишився незмінним

### Час збірки: 
```Building 18.0s (11/11) FINISHED```

### Розмір образу:
```python_app/fifth              latest    8ad1fd84cfd7   About a minute ago   310MB```

### Підтвердження, що ендпоінт працює - вивід браузера:
```{
  "matrix_a": [
    [0.93, 0.18, 0.1, 0.56, 0.94, 0.52, 0.95, 0.97, 0.68, 0.23],
    [0.1, 0.42, 0.65, 0.6, 0.44, 0.26, 0.44, 0.89, 0.74, 0.23],
    [0.87, 0.93, 0.21, 0.59, 0.45, 0.11, 0.42, 0.4, 0.22, 0.38],
    [0.64, 0.41, 0.23, 0.66, 0.86, 0.98, 0.12, 0.1, 0.18, 0.55],
    [0.39, 0.92, 0.91, 0.34, 0.05, 0.48, 0.74, 0.21, 0.87, 0.1],
    [0.96, 0.15, 0.96, 0.47, 0.89, 0.42, 0.39, 0.24, 0.58, 0.31],
    [0.98, 0.83, 0.23, 0.88, 0.33, 0.21, 0.62, 0.37, 0.68, 0.76],
    [0.95, 0.99, 0.7, 0.05, 0.05, 0.32, 0.15, 0.6, 0.1, 0.36],
    [0.59, 0.49, 0.72, 0.1, 0.22, 0.81, 0.13, 0.24, 0.25, 0.95],
    [0.61, 0.36, 0.68, 0.4, 0.16, 0.67, 0.78, 0.92, 0.34, 0.41]
  ],
  "matrix_b": [
    [0.83, 0.6, 0.6, 0.45, 0.52, 0.36, 0.96, 0.96, 0.07, 0.1],
    [0.06, 0.41, 0.36, 0.49, 0.23, 0.99, 0.84, 0.72, 0.66, 0.99],
    [0.82, 0.11, 0.43, 0.68, 0.82, 0.14, 0.28, 0.23, 0.64, 0.61],
    [0.17, 0.15, 0.57, 0.57, 0.51, 0.94, 0.19, 0.09, 0.72, 0.29],
    [0.59, 0.57, 0.06, 0.61, 0.46, 0.75, 0.33, 0.35, 0.89, 0.06],
    [0.84, 0.99, 0.2, 0.6, 0.73, 0.95, 0.7, 0.2, 0.44, 0.28],
    [1, 0.03, 0.35, 0.35, 0.73, 0.02, 0.44, 0.03, 0.75, 0.41],
    [0.74, 0.25, 0.39, 0.88, 0.66, 0.68, 0.15, 0, 0.93, 0.72],
    [0.92, 0.27, 0.43, 0.37, 0.62, 0.17, 0.72, 0.32, 0.38, 0.44],
    [0.74, 0.82, 0.49, 0.15, 0.49, 0.56, 0.85, 0.71, 0.26, 0.98]
  ],
  "product": [
    [4.4149, 2.4206, 2.2613, 3.2515, 3.5726, 3.1754, 3.1012, 1.9382, 3.6493, 2.3091],
    [3.1708, 1.526, 1.8431, 2.7047, 2.8599, 2.5524, 2.1274, 1.2212, 3.1369, 2.4677],
    [2.6079, 1.8639, 1.9162, 2.3042, 2.3199, 2.7905, 2.739, 2.1385, 2.5522, 2.2941],
    [2.9538, 2.665, 1.6822, 2.4132, 2.598, 3.2739, 2.7833, 1.9706, 2.5288, 1.867],
    [3.3854, 1.6576, 2.0133, 2.5381, 2.9746, 2.3532, 2.8876, 1.7618, 2.8243, 2.6763],
    [3.8814, 2.2192, 2.0795, 2.8299, 3.2312, 2.58, 2.8821, 2.1056, 2.9126, 2.0291],
    [3.6543, 2.3995, 2.5752, 2.7412, 3.1338, 3.2861, 3.5894, 2.6038, 3.0484, 2.9584],
    [2.6811, 1.8824, 1.8288, 2.3111, 2.3217, 2.4382, 2.7236, 2.1639, 2.1913, 2.4995],
    [3.1773, 2.4868, 1.7843, 2.1641, 2.6272, 2.5671, 2.9189, 2.0912, 2.1124, 2.5194],
    [3.8877, 2.0843, 2.1385, 2.9108, 3.3126, 2.7323, 2.7507, 1.6505, 3.1171, 2.679]
  ]
}
```

## Частина 2. Контейнеризація проекту на мові Golang

### Я зтягнув репозиторій з проектом, та написав Докерфайл, ось його вміст:
```docker
FROM golang:1.24

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o fizzbuzz

EXPOSE 8080

CMD [ "./fizzbuzz", "serve" ]
```

### Час збірки:
```Building 11.0s (12/12) FINISHED```

### Розмір образу:
```golang_app/first              latest    52967de0288c   2 minutes ago       965MB```

### Аналізуючи вміст контейнеру і враховуючи специфіку мови Go, як компільованої мови програмування, я зрозумів, що не всі файли, які знаходяться в контейнері потрібні для його роботи, вистачить лише артефакту (двійкового файлу). Тому тепер я створив багатоетапний Dockerfile, ось його вміст:

```docker
FROM golang:1.24 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o fizzbuzz

FROM scratch

WORKDIR /app

COPY --from=build /app/fizzbuzz .

EXPOSE 8080

CMD [ "./fizzbuzz", "serve" ]
```

### Час збірки:
```Building 6.4s (13/13) FINISHED```

### Розмір образу:
```golang_app/multistage         latest    ae94f03cdb6c   34 seconds ago      12.5MB```

### Після спроби запуску контейнера він одразу закінчив своє існування - тому я вирішив його протраблшутити за допомогою команди ```docker logs```, ось який вивід я отримав: 
```:~$ docker logs e0c61a328d049022ef35c8595a2d76c6cf4225daf5d16b0bb773e113a6177108
panic: open templates/index.html: no such file or directory

goroutine 1 [running]:
html/template.Must(...)
	/usr/local/go/src/html/template/template.go:368
fizzbuzz/cmd.init.func2(0xc22da0, {0x887221?, 0x4?, 0x887225?})
	/app/cmd/serve.go:21 +0x1ba
github.com/spf13/cobra.(*Command).execute(0xc22da0, {0xc4d4e0, 0x0, 0x0})
	/go/pkg/mod/github.com/spf13/cobra@v1.3.0/command.go:860 +0x691
github.com/spf13/cobra.(*Command).ExecuteC(0xc22b20)
	/go/pkg/mod/github.com/spf13/cobra@v1.3.0/command.go:974 +0x38d
github.com/spf13/cobra.(*Command).Execute(...)
	/go/pkg/mod/github.com/spf13/cobra@v1.3.0/command.go:902
fizzbuzz/cmd.Execute()
	/app/cmd/root.go:21 +0x1a
main.main()
	/app/main.go:10 +0xf
```
### З цього виводу я зробив висновок, що для роботи застосунку лише "бінарника" не вистачить, а ще й треба html файл з шаблонів, тому я переписав докерфайл:
```docker
FROM golang:1.24 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o fizzbuzz

FROM scratch

WORKDIR /app

COPY --from=build /app/fizzbuzz .

COPY --from=build /app/templates ./templates

EXPOSE 8080

CMD [ "./fizzbuzz", "serve" ]
```

### В результаті додавання директорії templates застосунок працює. Хотілось би зауважити, що використовувати "пустий" образ scratch зручно в плані економії місця у сховищі (наприклад той же самий Docker Hub), але є дуже велики мінус - це відсутність операційної системи і загалом можливість робити щось всередині контейнеру. Наприклад переглянути вміст контейнеру підключившись до нього, або підключитись до нього через оболонку "sh" неможливо через відсутність цих інструментів всередині. Тепер я використаю образ з проекту distroless:
```
FROM golang:1.24 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o fizzbuzz

FROM gcr.io/distroless/static-debian12

WORKDIR /app

COPY --from=build /app/fizzbuzz .

COPY --from=build /app/templates ./templates

EXPOSE 8080

CMD [ "./fizzbuzz", "serve" ]
```

### Час збірки:
```Building 9.1s (16/16) FINISHED```

### Розмір образу:
```golang_app/distroless         latest    2d35669cd1f1   35 seconds ago      14.5MB```

### Ми бачимо, що час збірки контейнера збільшивс, але це через те, що стягувався новий образ. А також збільшився його обсяг на 2МБ. А також всередині контейнера на базі distroless ми можемо побачити такі директорії як: /lib, /etc/passwd.

## Частина 3. Контейнеризація власного застосунку. Деплой застосунку за допомогою docker-compose

### Для у мовами завдання я створив власний простий застосунок на базі node.js, який створює користувачів та видаляє їх, все це робиться за допомогою post та delete операцій з СУБД MySQL.

### Для застосунку я створив Dockerfile:
```dockerfile
FROM node:22.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
```
### Також я створив docker-compose.yaml файл, за допомогою якого я підіймаю свій застосунок.
```docker
version: '3.8'

services:
  mysql:
    image: mysql:8
    container_name: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: balerina_kapuchina
      MYSQL_DATABASE: testdb
    ports:
      - "3307:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init:/docker-entrypoint-initdb.d

  app:
    build: .
    container_name: node-app
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=balerina_kapuchina
      - DB_NAME=testdb
      - DB_PORT=3306
    depends_on:
      - mysql
    volumes:
      - .:/app

volumes:
  mysql-data:
```

### Звертаючись до докер компоус файлу я хотів би акцентувати увагу на деяких аспектах. По-перше - це вирішення проблем із втратою даних після зупинки контейнера, в цьому мені допомогло монтування томів:
```docker
volumes:
      - mysql-data:/var/lib/mysql
      - ./init:/docker-entrypoint-initdb.d
```

### Це пункт створює спільну точку збереження файлів на хостовій машині, до якої має доступ і контейнер. Також для уникнення проблем, коли аплікація підіймається швидше ніж БД я встановив залежність запуску web частини від запуску БД:
```depends_on:
      - mysql
```
### Запуск мого застосунку відбувається за допомогою команди ```docker compose up --build``` в директорії, де знаходиться docker-compose.yaml файл.

## Висновок
### На основі пророблених експерементів, я формував восновок з кожного кейсу в один:
### 1. При плануванні та створенні Dockerfile в першу чергу необхідно звертати увагу на розмір та відповідність до вимог базового образу, на якому буде будуватись наше кастомне рішення.
### 2. Варто завжди ефективно розміщувати шари в докерфайлі і не забувати про можливість кешування при збірці, яка дає змогу набагато зменшити час білду нашого образу.
### 3. Для застосунків, написаних на компільованих мовах програмування, дуже корисно практикувати багатоетапну збірку імейджу в Докер, адже це значно зменшує розмір кінцевого артефакту.
