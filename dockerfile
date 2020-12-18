FROM node:14.15.2-alpine3.10 as builder

WORKDIR /app
COPY package.json .
RUN npm install --silent --progress=false

COPY tsconfig.json .
COPY ./src ./src
RUN npm run build

FROM node:14.15.2-alpine3.10
WORKDIR /app

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

CMD ["node", "./dist/index.js"]