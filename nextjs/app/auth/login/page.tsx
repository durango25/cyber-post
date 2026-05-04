"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid email or password.");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
            <div className="card-body gap-4">
                <h1 className="card-title text-2xl justify-center">⚡ CyberPost</h1>
                <p className="text-center opacity-60 text-sm">Sign in to your account</p>

                {error && (
                    <div role="alert" className="alert alert-error text-sm py-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </label>

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input
                            type="password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </label>

                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="link link-primary">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
