"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-200"></div>
        
        <main className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12 text-theme">
            What would you like to do today?
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
            <Link href="/upload" className="glass squircle p-10 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/20 transition-all group">
              <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                📸
              </div>
              <h2 className="text-2xl font-bold text-theme">Upload Photo</h2>
              <p className="muted text-sm text-center">Share a new memory or campus moment with your friends.</p>
            </Link>
            
            <Link href="/feed" className="glass squircle p-10 flex flex-col items-center justify-center gap-4 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 transition-all group">
              <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                🌟
              </div>
              <h2 className="text-2xl font-bold text-theme">Campus Feed</h2>
              <p className="muted text-sm text-center">Catch up on what everyone else has been up to.</p>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-200"></div>
      
      <main className="z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-up">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">
            Share Your Journey
          </span>
          <br />
          <span className="text-theme">With The World</span>
        </h1>
        
        <p className="text-lg md:text-xl muted mb-10 max-w-2xl animate-fade-up delay-100">
          KnowUr College is the ultimate platform to capture, share, and discover the best moments from your campus life. Join the community today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
          <Link href="/register" className="px-8 py-4 rounded-full text-lg font-medium btn-accent shadow-lg shadow-teal-500/30 hover:-translate-y-1 transition-all">
            Get Started
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-up delay-300">
          <div className="glass squircle p-6 text-left">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-4 text-teal-400 text-xl">📸</div>
            <h3 className="text-xl font-bold mb-2">Capture Moments</h3>
            <p className="muted text-sm">Instantly upload and share photos from events, fests, and daily college life.</p>
          </div>
          <div className="glass squircle p-6 text-left">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 text-xl">🤝</div>
            <h3 className="text-xl font-bold mb-2">Connect</h3>
            <p className="muted text-sm">Find your peers, see what they are up to, and build your campus network.</p>
          </div>
          <div className="glass squircle p-6 text-left">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400 text-xl">✨</div>
            <h3 className="text-xl font-bold mb-2">Discover</h3>
            <p className="muted text-sm">Explore trending posts and hidden gems across different departments and clubs.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
