import type { Metadata } from "next";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await axios.get(`${API_URL}/posts/${id}`);
    const post = res.data.data;
    const plainContent = String(post.content).replace(/<[^>]*>/g, " ").trim();
    return {
      title: post.title,
      description: plainContent.slice(0, 160),
      openGraph: { title: post.title, description: plainContent.slice(0, 160) },
    };
  } catch {
    return { title: "Post" };
  }
}

export { default } from "./_PostDetailPage";
