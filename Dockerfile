FROM node:alpine

WORKDIR /opt/airtable-service

COPY ./package.json .

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run"]

CMD ["development"]