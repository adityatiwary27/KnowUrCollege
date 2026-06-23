"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      setError(err?.response?.data || err?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const postObj = { content: caption };
      const form = new FormData();
      form.append("post", JSON.stringify(postObj));
      if (image) form.append("image", image);

      const res = await api.post("/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCaption("");
      setImage(null);
      setPosts((p) => [res.data, ...p]);
    } catch (err) {
      setError(err?.response?.data || err?.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="glass squircle p-6 mb-6 card-shadow">
        <h2 className="text-2xl font-semibold mb-2 text-white">Create Post</h2>
        <p className="muted mb-4">Share a moment with your followers.</p>
        <form onSubmit={handleCreate} className="mb-0 space-y-3">
          <textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} required className="w-full p-3 border border-white/10 rounded bg-transparent text-white placeholder:text-white/50" />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="text-sm text-white/70" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="px-4 py-2 btn-accent rounded shadow-md">{submitting ? "Posting..." : "Post"}</button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-white">Feed</h2>
      {loading ? (
        <p className="muted">Loading posts...</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((p) => (
            <div key={p.id} className="glass squircle overflow-hidden">
              {p.imageUrl && <img src={p.imageUrl} alt="post" className="w-full max-h-96 object-cover" />}
              <div className="p-4">
                <p className="text-sm muted">{p.user?.username}</p>
                <p className="mt-2 text-white">{p.content}</p>
                <p className="text-xs muted mt-2">{new Date(p.createdAt ?? "").toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
