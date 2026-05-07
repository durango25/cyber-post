"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schemes/auth";
import { siteConfig } from "@/config/site";
import ErrorAlert, { type ErrorPayload } from "@/components/ErrorAlert";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorPayload | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        const raw = result.code
          ? decodeURIComponent(result.code)
          : "Login gagal. Silakan coba lagi.";
        // Coba parse sebagai JSON (misal: {"email":["..."],"password":["..."]})
        try {
          const parsed = JSON.parse(raw);
          setErrorMessage(parsed);
        } catch {
          setErrorMessage(raw);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      router.push("/dashboard/posts");
      router.refresh();
    }
    catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Login failed. Please try again !');
      }
      setErrorMessage('Login failed. Please try again !');
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-base-200 py-16 px-4">
      <div className="card bg-base-100 shadow-md w-full max-w-md">
        <div className="card-body gap-5">
          <div className="flex flex-col items-center gap-2 mb-2">
            <LogIn className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Login ke {siteConfig.short_name}</h1>
            <p className="text-sm text-base-content/60">
              Selamat datang ! Silahkan login menggunakan akun Anda.
            </p>
          </div>

          {errorMessage && (
            <ErrorAlert error={errorMessage} onClose={() => setErrorMessage(null)} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="grow"
                  {...register("password")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-base-content/50 hover:text-base-content"
                  aria-label="Tampilkan/sembunyikan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </label>
              {errors.password && (
                <p className="fieldset-label text-error text-xs mt-1">{errors.password.message}</p>
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
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/60">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="link link-primary font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

