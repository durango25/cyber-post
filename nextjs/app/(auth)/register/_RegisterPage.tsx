"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await axios.post(`${API_URL}/register`, form);
            setSuccess(true);
            setTimeout(() => router.push("/auth/login"), 1500);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
            <div className="card-body gap-4">
                <h1 className="card-title text-2xl justify-center">⚡ CyberPost</h1>
                <p className="text-center opacity-60 text-sm">Create a new account</p>

                {success && (
                    <div role="alert" className="alert alert-success text-sm py-2">
                        Registered! Redirecting…
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {(["name", "email", "password", "password_confirmation"] as const).map((field) => (
                        <label key={field} className="form-control">
                            <div className="label">
                                <span className="label-text capitalize">
                                    {field === "password_confirmation" ? "Confirm Password" : field}
                                </span>
                            </div>
                            <input
                                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                                name={field}
                                className={`input input-bordered w-full ${errors[field] ? "input-error" : ""}`}
                                value={form[field]}
                                onChange={handleChange}
                                required
                                autoComplete={field === "password_confirmation" ? "new-password" : field}
                            />
                            {errors[field] && (
                                <div className="label">
                                    <span className="label-text-alt text-error">{errors[field][0]}</span>
                                </div>
                            )}
                        </label>
                    ))}

                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="link link-primary">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
