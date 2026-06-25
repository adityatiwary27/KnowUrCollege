"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  
  // Edit states
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLocation, setEditLocation] = useState("");
  
  // Welcome animation state
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("welcomeShown")) {
      setShowWelcome(true);
      sessionStorage.setItem("welcomeShown", "true");
      setTimeout(() => setShowWelcome(false), 2800);
    }
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data);
      
      const followRes = await api.get("/users/me/following");
      setFollowing(followRes.data || []);
    } catch (err) {
      console.error("Failed to load user info");
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      // ensure new posts appear first
      setPosts((res.data || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, silent = false) => {
    if (!silent && !confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter(p => p.id !== postId));
    } catch (err) {
      if (!silent) alert("Failed to delete post");
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post.id);
    setEditContent(post.content || "");
    setEditLocation(post.location || "");
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditContent("");
    setEditLocation("");
  };

  const handleSaveEdit = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}`, {
        content: editContent,
        location: editLocation
      });
      setPosts((prev) => prev.map(p => p.id === postId ? res.data : p));
      setEditingPostId(null);
    } catch (err) {
      alert("Failed to save post");
    }
  };

  const toggleFollow = async (targetUserId) => {
    try {
      const isFollowing = following.includes(targetUserId);
      if (isFollowing) {
        await api.delete(`/users/${targetUserId}/follow`);
        setFollowing(prev => prev.filter(id => id !== targetUserId));
      } else {
        await api.post(`/users/${targetUserId}/follow`);
        setFollowing(prev => [...prev, targetUserId]);
      }
    } catch (err) {
      alert("Failed to update follow status.");
    }
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-theme text-theme overflow-hidden">
        <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
        <h1 className="text-5xl md:text-6xl font-bold animate-fade-up">Welcome Back!</h1>
        <p className="mt-4 text-lg muted animate-fade-up delay-100">Preparing your feed...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 py-8 animate-fade-up w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-theme">Campus Feed</h2>
        <button 
          onClick={() => router.push("/upload")}
          className="px-5 py-2.5 btn-accent rounded-xl font-medium glow-theme"
        >
          + Create Post
        </button>
      </div>

      {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--primary-from)] glow-theme"></div></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 glass squircle glow-theme"><p className="muted">No posts yet. Be the first to share something!</p></div>
      ) : (
        <div className="grid gap-8">
          {posts.map((p) => (
            <div key={p.id} className="glass squircle overflow-hidden glow-theme transition-smooth group relative">
              <div className="p-4 flex items-center justify-between border-b border-theme/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-white font-bold shadow-lg">
                    {p.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-theme">{p.user?.username}</p>
                    <p className="text-xs muted">{new Date(p.createdAt ?? "").toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-center">
                  {currentUser && p.user?.id !== currentUser.id && (
                    <button 
                      onClick={() => toggleFollow(p.user.id)} 
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-smooth border ${following.includes(p.user.id) ? 'border-theme/50 text-theme bg-theme/5' : 'border-[#00f2fe] text-[#00f2fe] hover:bg-[#00f2fe]/10'}`}
                    >
                      {following.includes(p.user.id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                  {currentUser && p.user?.id === currentUser.id && editingPostId !== p.id && (
                    <>
                      <button onClick={() => startEditing(p)} className="text-xs text-[#00f2fe] hover:text-[#4facfe] font-medium px-2 py-1 rounded bg-[#00f2fe]/10">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-[#ff007f] hover:text-red-500 font-medium px-2 py-1 rounded bg-[#ff007f]/10">Delete</button>
                    </>
                  )}
                </div>
              </div>
              
              {p.imageUrl && (
                <div className="w-full bg-black/5 overflow-hidden relative border-y border-theme/10">
                  <img 
                    src={p.imageUrl} 
                    alt="post" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (currentUser && p.user?.id === currentUser.id) {
                        handleDelete(p.id, true); // true = silent delete without confirm
                      } else {
                        // just remove from local state
                        setPosts(prev => prev.filter(post => post.id !== p.id));
                      }
                    }}
                    className="w-full max-h-[600px] object-cover group-hover:scale-[1.02] transition duration-700" 
                  />
                  {p.location && (
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg border border-white/10 glow-theme">
                      📍 {p.location}
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-5">
                {editingPostId === p.id ? (
                  <div className="space-y-3">
                    <textarea 
                      value={editContent} 
                      onChange={(e) => setEditContent(e.target.value)} 
                      className="w-full p-3 rounded-xl input-theme resize-none min-h-[100px]"
                    />
                    <input 
                      type="text" 
                      placeholder="Location" 
                      value={editLocation} 
                      onChange={(e) => setEditLocation(e.target.value)} 
                      className="w-full p-3 rounded-xl input-theme"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEditing} className="px-4 py-2 text-sm font-medium text-theme hover:bg-theme/10 rounded-lg transition-smooth">Cancel</button>
                      <button onClick={() => handleSaveEdit(p.id)} className="px-4 py-2 text-sm font-medium btn-accent rounded-lg shadow-md">Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {!p.imageUrl && p.location && (
                      <p className="text-xs text-[#00f2fe] font-medium mb-2">📍 {p.location}</p>
                    )}
                    <p className="text-theme whitespace-pre-wrap leading-relaxed text-[15px]">{p.content}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
