"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

// US-08: Tambah produk (harus terkunci login admin)
export async function tambahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const nama = form?.get?.("nama")?.toString().trim();
  const harga = parseInt(form?.get?.("harga")?.toString() || "0", 10);
  const kategori = form?.get?.("kategori")?.toString().trim() || null;
  const foto_url = form?.get?.("foto_url")?.toString().trim() || "/produk/kopi.svg";
  const deskripsi = form?.get?.("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan minimal 0." };
  }

  const supabase = await createSessionClient();

  // Wajib memeriksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: error.message || "Gagal menyimpan produk baru." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

// US-09: Ubah produk (harus terkunci login admin)
export async function ubahProduk(prevState, formData) {
  const form = formData instanceof FormData ? formData : prevState;
  const id = form?.get?.("id")?.toString();
  const nama = form?.get?.("nama")?.toString().trim();
  const harga = parseInt(form?.get?.("harga")?.toString() || "0", 10);
  const kategori = form?.get?.("kategori")?.toString().trim() || null;
  const foto_url = form?.get?.("foto_url")?.toString().trim() || "/produk/kopi.svg";
  const deskripsi = form?.get?.("deskripsi")?.toString().trim() || null;

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan minimal 0." };
  }

  const supabase = await createSessionClient();

  // Wajib memeriksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Aksi ditolak: Anda harus login sebagai admin." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal memperbarui produk." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

// US-10: Hapus produk (harus terkunci login admin)
export async function hapusProduk(formData) {
  const id = formData?.get?.("id")?.toString();
  if (!id) return;

  const supabase = await createSessionClient();

  // Wajib memeriksa di server bahwa admin sudah login
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Aksi ditolak: Anda harus login sebagai admin.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) {
    throw new Error(error.message || "Gagal menghapus produk.");
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
