# Deploying Anand Sweets to Vercel

You can easily create a shareable HTTPS link by deploying your frontend to Vercel.

## Prerequisites
- You need a Vercel account (free).
- You need a deployed backend URL (e.g., from Render.com).

## Option 1: Using the Command Line (Recommended)
1.  Open your terminal in the `frontend` folder:
    ```powershell
    cd "c:\Users\anand\OneDrive\Desktop\sweet shop\frontend"
    ```
2.  Run the deployment command:
    ```powershell
    npx vercel
    ```
3.  Follow the prompts:
    -   **Set up and deploy?** [Y]
    -   **Which scope?** [Select your account]
    -   **Link to existing project?** [N]
    -   **Project Name:** `sweet-shop-frontend` (or just `sweet-shop`)
    -   **In which directory is your code located?** `./` (Press Enter)
    -   **Want to modify these settings?** [N] (Press Enter)

4.  **Important**: After the first deployment, you need to set the Backend URL.
    - Go to your Vercel Dashboard for this project.
    - Go to **Settings** > **Environment Variables**.
    - Add a new variable:
        -   **Key**: `VITE_API_URL`
        -   **Value**: `YOUR_BACKEND_URL_HERE` (e.g., `https://sweet-shop-backend.onrender.com`)
    -   **Save**.
    -   Go to **Deployments** and **Redeploy** to apply the changes.

## Option 2: Using GitHub
1.  Push your code to GitHub.
2.  Go to Vercel.com and "Add New Project".
3.  Import from GitHub.
4.  In the "Environment Variables" section, add `VITE_API_URL` with your backend URL.
5.  Click **Deploy**.

## Shareable Link
Once finished, Vercel will give you a domain like `https://sweet-shop-frontend.vercel.app`.
You can share this link with anyone!

---

# PART 2: Deploying the Backend (Render)

For the login to work, you need the backend online.

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [dashboard.render.com](https://dashboard.render.com).
3.  Click **New +** -> **Blueprint**.
4.  Connect your GitHub repository.
5.  Render will find the `render.yaml` file and automatically configure the backend.
6.  Click **Apply**.
7.  Wait for the deployment to finish (it will say "Live").
8.  **Copy the Backend URL** (it looks like `https://sweet-shop-backend.onrender.com`).

# PART 3: Connecting Them

1.  Go back to your **Vercel Dashboard**.
2.  Go to **Settings** > **Environment Variables**.
3.  Add/Edit `VITE_API_URL` with your **Render Backend URL**.
4.  Go to **Deployments** and **Redeploy**.

Now your login will work!
