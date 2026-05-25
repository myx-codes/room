FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_GRAPHQL_URL
ARG VITE_UPLOADS_URL
ARG VITE_WS_URL
ARG VITE_CSRF_URL
ARG INTERNAL_GRAPHQL_URL

ENV VITE_GRAPHQL_URL=${VITE_GRAPHQL_URL}
ENV VITE_UPLOADS_URL=${VITE_UPLOADS_URL}
ENV VITE_WS_URL=${VITE_WS_URL}
ENV VITE_CSRF_URL=${VITE_CSRF_URL}
ENV INTERNAL_GRAPHQL_URL=${INTERNAL_GRAPHQL_URL}

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]