# How to Run the Sweet Shop Management System

Follow these steps to get the application running on your Windows machine.

## Prerequisites
- **Python 3.10+** installed.
- **Node.js** (LTS version) installed.

## Step 1: Backend Setup (FastAPI)

1.  Open a terminal (Command Prompt or PowerShell) and navigate to the project folder:
    ```powershell
    cd "c:\Users\anand\OneDrive\Desktop\sweet shop"
    ```

2.  Navigate to the backend directory:
    ```powershell
    cd backend
    ```

3.  Activate the Python virtual environment (from the root folder):
    ```powershell
    ..\venv\Scripts\activate
    ```
    *Alternatively, activate it before entering the backend folder:*
    ```powershell
    cd ..
    .\venv\Scripts\activate
    cd backend
    ```

4.  Install dependencies (if not already installed):
    ```powershell
    pip install -r requirements.txt
    ```

5.  Start the Backend Server:
    ```powershell
    uvicorn app.main:app --reload
    ```
    ✅ The backend is now running at **http://localhost:8000**

---

## Step 2: Frontend Setup (React)

1.  Open a **NEW** terminal window (keep the backend running in the first one).

2.  Navigate to the frontend directory:
    ```powershell
    cd "c:\Users\anand\OneDrive\Desktop\sweet shop\frontend"
    ```

3.  Install dependencies (only needed the first time):
    ```powershell
    npm install
    ```

4.  Start the Frontend Development Server:
    ```powershell
    # If npm is not found, run this line first:
    $env:Path += ";C:\Program Files\nodejs"
    
    npm run dev
    ```
    ✅ The frontend is now running at **http://localhost:5173** (or the port shown in your terminal).

---

## Step 3: Using the Application

1.  Open your web browser (Chrome/Edge/Firefox).
2.  Go to **http://localhost:5173**.
3.  **Register** a new user account.
4.  **Login** with your new credentials.
5.  You will see the Dashboard.
6.  To add sweets, click the **Admin** link in the navigation bar.
    *   *Note: In a real app, you'd need admin rights. For this demo, all users have access or you can toggle the `is_admin` flag in the database if strict checks are enabled.*
7.  Add some sweets (e.g., "Chocolate Bar", "Candy", Price: 2.50, Qty: 100).
8.  Go back to the Dashboard to see them and test the **Buy** button!
