"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // ---------------- GET USER ----------------
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUser(data.user);
      loadBookmarks(data.user.id);
    }
  }

  // ---------------- LOAD BOOKMARKS ----------------
  async function loadBookmarks(userId: string) {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (!error) setBookmarks(data || []);
  }

  // ---------------- GOOGLE LOGIN ----------------
  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  // ---------------- LOGOUT ----------------
  async function logout() {
    await supabase.auth.signOut();
    location.reload();
  }

  // ---------------- ADD BOOKMARK ----------------
  async function addBookmark() {
    if (!title || !url) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("bookmarks").insert({
      title: title,
      url: url,
      user_id: user!.id,
    });

    if (!error) {
      setTitle("");
      setUrl("");
      loadBookmarks(user!.id);
    } else {
      alert("Insert failed — check RLS policy");
      console.log(error);
    }
  }

  // ---------------- DELETE BOOKMARK ----------------
  async function deleteBookmark(id: number) {
    await supabase.from("bookmarks").delete().eq("id", id);
    loadBookmarks(user.id);
  }

  // ---------------- UI (NOT LOGGED IN) ----------------
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={login}
          style={{
            padding: "14px 24px",
            fontSize: "18px",
            background: "black",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>
      </div>
    );
  }

  // ---------------- UI (LOGGED IN) ----------------
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Welcome {user.user_metadata.full_name}</h2>
      <p>{user.email}</p>

      <button
        onClick={logout}
        style={{
          background: "red",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>

      <hr />

      <h3>Add Bookmark</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <button
        onClick={addBookmark}
        style={{
          padding: "10px 20px",
          background: "green",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Add
      </button>

      <hr />

      <h3>Your Bookmarks</h3>

      {/* Empty state message */}
      {bookmarks.length === 0 && (
        <p style={{ opacity: 0.7 }}>You haven’t saved any links yet 👀</p>
      )}

      {/* Bookmark List */}
      {bookmarks.map((b) => (
        <div key={b.id} style={{ marginBottom: 15 }}>
          <a href={b.url} target="_blank" rel="noreferrer">
            {b.title}
          </a>
          <button
            onClick={() => deleteBookmark(b.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}