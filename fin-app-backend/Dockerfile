FROM golang:1.20-alpine AS builder

WORKDIR /app

ADD go.mod go.sum ./

RUN go mod download

ADD . .

RUN go build -o server main.go

FROM alpine:3.17 AS app

WORKDIR /app
COPY --from=builder /app/server /app/

# start PocketBase
CMD ["/app/server", "serve", "--http=0.0.0.0:8080"]