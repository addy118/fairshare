# Prisma Auth Template by Aditya Kirti

This template provides a ready-to-use authentication system with Prisma and Node.js.

## Environment Variables

1.  Navigate to the server directory:
    ```bash
    cd fair-share-server
    ```
2.  Create a new file named `.env` in the `fair-share-server` directory.
3.  Copy the following content into the `.env` file and replace the placeholders with your actual credentials.

    ```env
    # Clerk Authentication - Get these from your Clerk Dashboard
    CLERK_PUBLISHABLE_KEY=pk_test_your_new_clerk_publishable_key
    CLERK_SECRET_KEY=sk_test_your_new_clerk_secret_key
    CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_new_webhook_signing_secret

    # PostgreSQL Database Connection
    # Make sure your username, password, and database name are correct
    DATABASE_URL="postgresql://addy:lumosaddy@localhost:5432/fairshare"

    # Application Port
    PORT=3000

    # A custom secret password for your mail service (google)
    APP_PASSWORD=your_app_specific_password
    ```

## Installation and Running

1.  Install the required dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:3000`.

## 🛠️ Testing Authentication

### 1️⃣ **Signup**

- **Endpoint:** `POST http://localhost:3000/auth/signup`
- **Body Params Required:**
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
- **Body Params Required:**
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
  Value: <copied-value>
  ```

### 5️⃣ **Test Auth Protection**

- **Endpoint:** `POST http://localhost:3000/user/:userId/protected`
- Replace `:userId` with the actual user ID.
- Ensure the **Authorization Bearer Token** is included in the request.
- If authentication works correctly, you should receive a **json containing user info**.

## 📌 Notes

- Ensure the `.env` file is correctly configured before running the project.

Happy coding! 🚀
