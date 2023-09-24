FROM node:lts
WORKDIR /app

COPY . .
RUN npm i

CMD ["npm", "run", "build"]
# CMD ["ls", "-la", "src"]