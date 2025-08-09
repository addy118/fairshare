FROM node:22-alpine AS build
WORKDIR /app

ARG VITE_BASE_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY

ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}

COPY package*.json .
RUN npm install
COPY . .

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public /usr/share/nginx/html

RUN chmod -R 644 /usr/share/nginx/html/*
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \;

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
