FROM node

WORKDIR /code

ENV PORT 3000

COPY package.json /code/package.json

RUN npm install

COPY . /code

CMD ["npm", "run", "docker"]