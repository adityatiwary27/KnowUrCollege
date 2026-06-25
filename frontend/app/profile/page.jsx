"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userRes = await api.get("/users/me");
      const userData = userRes.data;
      setUser(userData);
      setEditUsername(userData.username || "");
      setEditBio(userData.bio || "");

      if (userData && userData.id) {
        const postsRes = await api.get(`/posts/user/${userData.id}`);
        const sortedPosts = (postsRes.data || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      }
    } catch (err) {
      setError("Failed to load profile. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/users/${user.id}`, {
        ...user,
        username: editUsername,
        bio: editBio
      });
      setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile: " + (err.response?.data || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500 glow-theme"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto p-4 py-12 text-center glass mt-10">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-theme">{error || "User not found"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 py-6 sm:py-8 animate-fade-up w-full">
      {/* Profile Header */}
      <div className="glass p-6 sm:p-8 mb-8 sm:mb-12 glow-theme mx-2 sm:mx-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 shrink-0 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center text-white font-bold text-4xl sm:text-5xl md:text-7xl shadow-lg glow-theme">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex flex-col text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              {isEditing ? (
                <input 
                  type="text" 
                  value={editUsername} 
                  onChange={e => setEditUsername(e.target.value)}
                  className="input-theme rounded px-3 py-1 text-xl sm:text-2xl font-light w-full max-w-xs mx-auto md:mx-0"
                />
              ) : (
                <h1 className="text-3xl sm:text-4xl font-light text-theme text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 break-words">
                  {user.username}
                </h1>
              )}
              
              <div className="flex gap-2 justify-center">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 bg-theme/10 hover:bg-theme/20 text-theme rounded-lg font-medium text-sm transition-smooth border border-theme/20">
                      Cancel
                    </button>
                    <button onClick={handleSaveProfile} disabled={saving} className="px-4 py-1.5 btn-accent rounded-lg font-medium text-sm transition-smooth glow-theme">
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-5 py-2 glass hover:border-teal-500 text-theme rounded-full font-medium text-sm transition-smooth glow-theme">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex justify-center md:justify-start gap-4 sm:gap-8 mb-6 bg-theme/5 p-3 sm:p-4 rounded-xl border border-theme/10">
              <div className="text-center">
                <span className="block font-bold text-lg sm:text-xl text-theme">{posts.length}</span> 
                <span className="text-[10px] sm:text-xs uppercase tracking-wider muted">posts</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-lg sm:text-xl text-theme">{user.followerCount || 0}</span> 
                <span className="text-[10px] sm:text-xs uppercase tracking-wider muted">followers</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-lg sm:text-xl text-theme">{user.followingCount || 0}</span> 
                <span className="text-[10px] sm:text-xs uppercase tracking-wider muted">following</span>
              </div>
            </div>
            
            <div className="text-theme max-w-md mx-auto md:mx-0">
              <p className="font-semibold text-sm sm:text-base">{user.username}</p>
              {isEditing ? (
                <textarea 
                  value={editBio} 
                  onChange={e => setEditBio(e.target.value)}
                  className="input-theme rounded p-2 w-full mt-2 min-h-[80px] text-sm sm:text-base"
                  placeholder="Write something about yourself..."
                />
              ) : (
                <p className="whitespace-pre-wrap muted mt-1 text-sm sm:text-base">{user.bio || "Welcome to my profile! Capturing campus life."}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-theme uppercase tracking-widest text-center border-b border-theme/10 pb-4">Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 sm:gap-2 md:gap-4 px-1 sm:px-0">
        {posts.map(post => (
          <div key={post.id} className="aspect-square glass relative group cursor-pointer overflow-hidden p-0 border border-theme/20">
            {post.imageUrl ? (
              <>
                <img 
                  src={post.imageUrl} 
                  alt="post" 
                  className="w-full h-full object-cover img-zoom" 
                  onError={(e) => {
                    const group = e.target.closest('.group');
                    if (group) group.style.display = 'none';
                    if (user && user.id) {
                      api.delete(`/posts/${post.id}`).catch(() => {});
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="line-clamp-2 text-sm font-medium text-white shadow-sm">{post.content}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 hover:from-teal-500/20 hover:to-indigo-500/20 transition-colors">
                <p className="text-theme text-center line-clamp-4 text-xs md:text-sm font-medium">{post.content}</p>
              </div>
            )}
            
            {/* Location Badge */}
            {post.location && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs px-2 py-1 rounded-full shadow-lg border border-white/10 glow-theme opacity-80 group-hover:opacity-100 transition-opacity">
                📍 {post.location.split(',')[0]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20 glass mt-4">
          <div className="text-6xl mb-4 opacity-50">📷</div>
          <h2 className="text-2xl font-bold text-theme mb-2">No Posts Yet</h2>
          <p className="muted">When you share photos, they will appear on your profile.</p>
        </div>
      )}
    </div>
  );
}
