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

export async function gantiPassword(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const passwordBaru = form?.get?.("password_baru")?.toString() || "";
  const konfirmasiPassword = form?.get?.("konfirmasi_password")?.toString() || "";

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password harus sama." };
  }

  const supabase = await createSessionClient();

  // Wajib memeriksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Anda belum login atau sesi telah berakhir." };
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    return { error: error.message || "Gagal mengganti password." };
  }

  return { success: true, message: "Password berhasil diganti." };
}
