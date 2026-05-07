"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterFormData } from "@/schemes/auth";
import { siteConfig } from "@/config/site";
import ErrorAlert, { type ErrorPayload } from "@/components/ErrorAlert";

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<ErrorPayload | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const res = await fetch("/api/proxy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        // Tangani 422 (errors object) maupun error message biasa
        setServerError(json.errors ? { message: json.message, errors: json.errors } : json.message ?? "Pendaftaran gagal.");
        return;
      }

      // Login otomatis setelah daftar
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/login");
        return;
      }

      router.push("/dashboard/posts");
      router.refresh();
    } catch {
      setServerError("Terjadi kesalahan jaringan. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-base-200 py-16 px-4">
      <div className="card bg-base-100 shadow-md w-full max-w-md">
        <div className="card-body gap-5">
          <div className="flex flex-col items-center gap-2 mb-2">
            <UserPlus className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Buat Akun</h1>
            <p className="text-sm text-base-content/60">
              Bergabung dengan {siteConfig.short_name} dan mulai menulis.
            </p>
          </div>

          {serverError && (
            <ErrorAlert error={serverError} onClose={() => setServerError(null)} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Nama</legend>
              <input
                type="text"
                placeholder="Nama"
                className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                {...register("name")}
                autoComplete="name"
              />
              {errors.name && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.name.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                placeholder="Email"
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                {...register("email")}
                autoComplete="email"
              />
              {errors.email && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.email.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Kata Sandi</legend>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Kata sandi"
                  className="grow"
                  {...register("password")}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-base-content/50 hover:text-base-content"
                  aria-label="Tampilkan/sembunyikan kata sandi"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </label>
              {errors.password && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.password.message}</p>
              )}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Konfirmasi Kata Sandi</legend>
              <input
                type={showPw ? "text" : "password"}
                placeholder="Ulangi kata sandi"
                className={`input input-bordered w-full ${errors.password_confirmation ? "input-error" : ""
                  }`}
                {...register("password_confirmation")}
                autoComplete="new-password"
              />
              {errors.password_confirmation && (
                <p className="fieldset-label text-error text-xs mt-1">
                  {errors.password_confirmation.message}
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Buat Akun"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

