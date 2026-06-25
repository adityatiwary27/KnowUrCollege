"use client";

import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  
  // Upload states
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const [generatingAi, setGeneratingAi] = useState(false);

  const handleGenerateAiCaption = async () => {
    if (!image) return;
    setGeneratingAi(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("image", image);
      const res = await api.post("/posts/generate-caption", form);
      if (res.data.caption) setCaption(res.data.caption);
      if (res.data.hashtags) setHashtags(res.data.hashtags);
      if (res.data.location) setLocation(res.data.location);
    } catch (err) {
      let errMsg = "Failed to generate AI caption";
      if (err?.response?.data) {
        errMsg = typeof err.response.data === 'string' 
          ? err.response.data 
          : (err.response.data.error || err.response.data.message || JSON.stringify(err.response.data));
      } else if (err?.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const finalContent = hashtags.trim() ? `${caption}\n\n${hashtags}` : caption;
      const postObj = { content: finalContent, location: location.trim() || null };
      const form = new FormData();
      form.append("post", JSON.stringify(postObj));
      if (image) form.append("image", image);

      await api.post("/posts", form);

      router.push("/feed");
    } catch (err) {
      let errMsg = "Failed to create post";
      if (err?.response?.data) {
        errMsg = typeof err.response.data === 'string' 
          ? err.response.data 
          : (err.response.data.message || err.response.data.error || JSON.stringify(err.response.data));
      } else if (err?.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 py-8 animate-fade-up">
      <button 
        onClick={() => router.push("/feed")} 
        className="mb-6 px-4 py-2 rounded-xl border border-teal-500/30 text-teal-500 hover:bg-teal-500/10 transition-smooth font-medium flex items-center gap-2"
      >
        ← Back to Feed
      </button>

      {/* Upload Component */}
      <div className="glass squircle p-6 mb-10 card-shadow transition-smooth">
        <h2 className="text-2xl font-bold mb-1 text-theme">Create Post</h2>
        <p className="muted text-sm mb-6">Share your latest moments, thoughts, and hashtags.</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <textarea placeholder="Write a captivating caption..." value={caption} onChange={(e) => setCaption(e.target.value)} required className="w-full p-4 border border-theme rounded-xl input-theme focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none min-h-[100px]" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Location (e.g., Library)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-theme rounded-xl input-theme focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
            <input type="text" placeholder="Add hashtags (e.g. #college #fest)" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full p-3 border border-theme rounded-xl input-theme focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-4 py-3 rounded-xl border border-theme hover:bg-theme/5 transition-smooth text-sm text-theme flex-1 text-center">
              <span>{image ? 'Change Photo 📸' : 'Upload Photo 📸'}</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {image && (
              <button type="button" onClick={handleGenerateAiCaption} disabled={generatingAi} className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl font-medium border border-teal-500 text-teal-500 hover:bg-teal-500/10 transition-smooth">
                {generatingAi ? "Generating..." : "✨ AI Caption"}
              </button>
            )}
            <button type="submit" disabled={submitting} className="w-full sm:w-auto flex-1 px-4 py-3 btn-accent rounded-xl font-medium shadow-md shadow-teal-500/20">
              {submitting ? "Posting..." : "Share Post ✨"}
            </button>
          </div>

          {preview && (
            <div className="mt-4 relative rounded-xl overflow-hidden border border-theme h-64 bg-black/5">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="absolute top-2 right-2 bg-black/60 text-white p-1 px-3 rounded-full text-xs hover:bg-black/80">✕ Remove</button>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}
        </form>
      </div>
    </div>
  );
}
