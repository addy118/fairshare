# Prisma Auth Template

This template provides a ready-to-use authentication system with Prisma and Node.js.

## 🚀 Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <repo-folder>
   ```
2. Install dependencies:
   ```sh
   npm i
   ```
3. Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=<server port address>

   DATABASE_URL="postgresql://<psql-username>:<password>@<host>:<port>/<db-name>?schema=public"

   ACCESS_TOKEN=<your access token secret>
   REFRESH_TOKEN=<your refresh token secret>
   ```

4. Apply database migrations:
   ```sh
   npx prisma migrate dev --name basic_auth_init
   ```
5. Start the server:
   ```sh
   nodemon server.js
   ```

## 🛠️ Testing Authentication

### 1️⃣ **Signup**

- **Endpoint:** `POST http://localhost:3000/auth/signup`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```

### 2️⃣ **Login**

- **Endpoint:** `POST http://localhost:3000/auth/login`
- **Body (JSON):**
  ```json
  {
    "data": "johndoe or john@example.com",
    "password": "securepassword"
  }
  ```
- **Response:** Contains an `accessToken`.

### 3️⃣ **Use Access Token**

- Copy the `accessToken` received in the response.
- Paste it in the **Authorization** tab under the **Bearer Token** field.

### 4️⃣ **Use Refresh Token**

- In the response tab, go to **Cookies** (top-right).
- Copy the `refreshCookie` from **localhost**.
- In the **Headers** tab, add:
  ```
  Key: Cookie
  Value: refreshCookie=<copied-value>
  ```

## 📌 Notes

- Ensure the `.env` file is correctly configured before running the project.

Happy coding! 🚀
