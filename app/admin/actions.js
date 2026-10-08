"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase";

export async function login(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const email = form?.get?.("email")?.toString().trim() || "";
  const password = form?.get?.("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah."
          : error.message || "Gagal masuk. Silakan periksa kembali email dan password Anda.",
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export const keluar = logout;
