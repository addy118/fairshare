# React Auth Template by Aditya Kirti

This template includes a basic setup with ShadCN UI components for a Tailwind React project.

## 🚀 Installation

1. Clone the repository:

   ```sh
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Update the package name**:

   - Open `package.json` and `package-lock.json`.
   - Change the `"name"` field to your actual project name.

3. Install dependencies:

   ```sh
   npm i
   ```

   > **⚠️ Warning:** Only run the following command **if** `src/components/ui/` is not present:

   ```sh
   npx shadcn@latest add button card input label dropdown-menu avatar
   ```

4. Update the **App Name**:
   - Open `src/layouts/Layout.jsx`.
   - Locate **around line 27** and change `AppName` to your actual application's name.

## 📌 Notes

- Ensure all required UI components are installed before running the project.
- Restart the dev server if changes are not reflected.

Happy coding! 🚀
