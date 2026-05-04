"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000";

interface PostPreview {
  id: number;
  title: string;
  slug: string;
  content: string;
  main_image: string | null;
  author: { name: string };
  created_at: string;
}

export default function LandingPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/posts`)
      .then((res) => setPosts(res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-300 shadow-md sticky top-0 z-50">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            ⚡ CyberPost
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="text-center py-14 px-4">
        <h1 className="text-5xl font-extrabold mb-3">⚡ CyberPost</h1>
        <p className="text-lg opacity-60 max-w-md mx-auto">
          A community blog. Read posts from the community.
        </p>
      </div>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 pb-16 max-w-6xl">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center opacity-60 py-16">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="card bg-base-100 shadow hover:shadow-xl transition-shadow group"
              >
                {/* Cover Image */}
                <figure className="relative h-48 bg-base-300 overflow-hidden">
                  {post.main_image ? (
                    <Image
                      src={`${STORAGE_URL}/storage/${post.main_image}`}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full opacity-30 text-4xl">
                      📝
                    </div>
                  )}
                </figure>

                <div className="card-body gap-2 p-4">
                  <h2 className="card-title text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm opacity-60 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, " ").trim()}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 text-xs opacity-50">
                    <span>{post.author.name}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

