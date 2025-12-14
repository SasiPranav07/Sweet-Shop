# How to Push Your Sweet Shop to GitHub

Since "Git" is not currently active in this terminal, please follow these simple steps to save your code to GitHub.

## Step 1: Create a Repository on GitHub
1.  Log in to [GitHub.com](https://github.com/).
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name it `sweet-shop`.
4.  Leave it as **Public** or **Private**.
5.  **Do NOT** check "Add a README" or ".gitignore" (we already have them).
6.  Click **Create repository**.
7.  Copy the URL (it looks like `https://github.com/your-username/sweet-shop.git`).

## Step 2: Open the Terminal in the Right Folder (The Easy Way)
You don't need to type long commands! Choose **ONE** of these two methods:

### Method A: Right-Click (Easiest)
1.  Open **File Explorer** (Win+E).
2.  Go to your project folder: `C:\Users\anand\OneDrive\Desktop\sweet shop`
3.  **Right-click** anywhere in the blank white space of the folder window.
4.  Select **"Open Git Bash Here"** (if installed) or **"Open in Terminal"**.

### Method B: The Address Bar Trick
1.  Open your folder in **File Explorer**.
2.  Click the **Address Bar** at the very top (where it says `> This PC > ...`).
3.  Delete the text, type `cmd`, and press **Enter**.
4.  A black terminal window will open *already inside* your folder.

*Check: Type `git status` in that new window. If it says "fatal: not a git repository" or similar, you are in the right place! If it says "command not found", you need to install Git.*

## Step 3: Run These Commands (One by One)
Copy and paste these commands **one line at a time** into your black terminal window.

**1. Configure your identity (Required first time):**
*(Replace with your actual email and name)*
```bash
git config --global user.email "youremail@example.com"
git config --global user.name "Your Name"
```

**2. Initialize and Commit:**
```bash
git init
git add .
git commit -m "Final Version: Sweet Shop App Complete"
```

**3. Connect to GitHub:**
*(You must type `git remote add origin` BEFORE the link!)*
```bash
git remote add origin https://github.com/SasiPranav07/Sweet-Shop.git
```
*(If it says "remote origin already exists", ignore it).*

**4. FIX BRANCH NAME & PUSH (Crucial Step):**
Run these two commands to fix the "refspec" error:

```bash
git branch -M main
git push -u origin main
```

**If it still fails:**
It means your **commit failed** earlier (because of the email error). Run this again:
```bash
git commit -m "Final Commit"
git push -u origin main
```

## Troubleshooting
*   **"git not found"**: You need to install Git from [git-scm.com](https://git-scm.com/downloads).
*   **"remote origin already exists"**: Run `git remote remove origin` and try again.
