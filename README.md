# 🔖 Smart Bookmark Manager

A full-stack web application that allows users to securely save and manage their personal bookmarks using Google authentication.

Live Demo: https://smart-bookmark-kappa-ruddy.vercel.app
GitHub Repo: https://github.com/devarasasank31/smart-bookmark

---

## 🚀 Features

* Google OAuth Login (Secure authentication)
* Personal bookmark storage
* Add and delete bookmarks
* Persistent cloud database
* Each user sees only their own bookmarks
* Protected using Row Level Security (RLS)
* Deployed on the internet

---

## 🧠 How it Works

1. User logs in using Google
2. Supabase authenticates the user
3. A secure session is created
4. Bookmarks are stored in a cloud PostgreSQL database
5. Row Level Security ensures users can only access their own data

---

## 🛠 Tech Stack

**Frontend**

* Next.js (React Framework)
* TypeScript
* CSS

**Backend / Database**

* Supabase (PostgreSQL Database)
* Supabase Auth (Google OAuth)

**Deployment**

* Vercel (Cloud Hosting)

---

## 🔐 Security

This project uses **Row Level Security (RLS)** policies in Supabase:

```
auth.uid() = user_id
```

This guarantees:

* Users cannot access other users’ bookmarks
* Data is protected even if the frontend is bypassed

---

## 📷 Application Flow

Login → Authentication → Database → Secure Storage → Fetch → Display

---

## 🏗 Project Structure

```
smart-bookmark
│
├── app/                # Next.js pages
├── lib/                # Supabase client
├── public/             # Static assets
├── .env.local          # Environment variables
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 💻 Running Locally

```
git clone https://github.com/devarasasank31/smart-bookmark
cd smart-bookmark
npm install
npm run dev
```

Then open:

```
http://localhost:3000
```

---

## 🎯 Learning Outcomes

Through this project I learned:

* Full-stack development workflow
* OAuth authentication
* Secure database design
* API communication
* Production deployment
* Debugging real world issues

---

## 📌 Future Improvements

* Bookmark categories
* Edit bookmark
* Website favicon preview
* Search functionality
* Dark mode UI

---

🧩 Challenges Faced & How I Solved Them
During development I encountered several real-world full-stack issues. Solving these helped me understand how production web apps actually work.
1. OAuth Redirect Loop (Google Login returned to same page)
Problem:
After logging in with Google, the app redirected back to the homepage but the user session was not available. The UI still showed the login button.
Cause:
Next.js App Router renders on the server first, while Supabase authentication runs in the browser. The session cookie was not yet read when the page loaded.
Solution:
I implemented a client-side session check using:
supabase.auth.getUser()
inside useEffect() so the UI updates only after the browser receives the session.
What I learned:
Difference between server rendering and client authentication state.

2. Database Insert Failed (RLS Policy Error)
Problem:
Adding a bookmark showed:
“Insert failed — check RLS policy”
Even though the database table existed.
Cause:
Supabase uses Row Level Security by default. Without policies, the database rejects all operations even from authenticated users.
Solution:
I created policies
SELECT
auth.uid() = user_id

INSERT
auth.uid() = user_id

DELETE
auth.uid() = user_id
What I learned:
Frontend authentication ≠ database authorization.
Security must be enforced at the database level, not only in UI.

## 👨‍💻 Author

**Shashank Devarasetty**

If you like this project, feel free to ⭐ the repository!
