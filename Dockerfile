# Stage 1
FROM --platform=linux/amd64 node:18.12-alpine AS build

WORKDIR /usr/src/app
COPY ./frontend ./frontend

RUN cd frontend && \
    npm install && \
    npm run build

# Stage 2
FROM --platform=linux/amd64 node:18.12-alpine

WORKDIR /usr/src/app

COPY ./backend ./backend

RUN cd backend && \
    npm install && \
    npm run build:backend && \
    adduser --system --no-create-home appuser

RUN mkdir /home/appuser && chown appuser /home/appuser
USER appuser

WORKDIR /usr/src/app/backend
COPY --from=build /usr/src/app/frontend/build /usr/src/app/backend/build

EXPOSE 3001

CMD ["npm", "run", "start"]