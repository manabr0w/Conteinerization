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