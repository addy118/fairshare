FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json .
RUN npm install --ignore-scripts
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD [ "sh", "-c", "npm run db:deploy && npm start" ]