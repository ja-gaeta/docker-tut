FROM node:15
WORKDIR /app
COPY package.json .
RUN npm install
ENV PORT 3000
EXPOSE $PORT
COPY . .
CMD ["npm", "run", "start"]