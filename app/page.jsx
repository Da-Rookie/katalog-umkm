import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// US-01: Katalog produk dari database
// US-11: Filter kategori dan pencarian produk
export default async function HalamanKatalog({ searchParams }) {
  const params = (await searchParams) || {};
  const filterKategori = params.kategori || "Semua";
  const cari = params.cari?.trim() || "";

  let daftarProduk = [];
  let daftarKategori = ["Semua"];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    // Ambil semua kategori untuk tombol filter
    const { data: dataKategori } = await supabase
      .from("produk")
      .select("kategori");
    if (dataKategori) {
      const kategoriUnik = [
        ...new Set(dataKategori.map((p) => p.kategori).filter(Boolean)),
      ];
      daftarKategori = ["Semua", ...kategoriUnik];
    }

    // Query daftar produk sesuai filter dan pencarian
    let query = supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (filterKategori && filterKategori !== "Semua") {
      query = query.eq("kategori", filterKategori);
    }

    if (cari) {
      query = query.ilike("nama", `%${cari}%`);
    }

    const { data, error } = await query;

    if (error) {
      pesanError = error.message;
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = err.message || "Gagal mengambil data produk dari database.";
  }

  const adaFilterAktif = filterKategori !== "Semua" || Boolean(cari);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="judul-produk" className="text-xl font-bold">
              Produk kami
            </h2>
            {/* Form Pencarian (US-11) */}
            <form method="GET" action="/" className="flex w-full items-center gap-2 sm:w-auto">
              {filterKategori !== "Semua" && (
                <input type="hidden" name="kategori" value={filterKategori} />
              )}
              <input
                type="text"
                name="cari"
                defaultValue={cari}
                placeholder="Cari produk..."
                className="w-full rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none sm:w-60"
              />
              <Tombol type="submit">Cari</Tombol>
              {adaFilterAktif && (
                <Tombol href="/" varian="garis">
                  Reset
                </Tombol>
              )}
            </form>
          </div>

          {/* Filter Kategori (US-11) */}
          {daftarKategori.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {daftarKategori.map((kat) => {
                const isActive = filterKategori === kat;
                const urlParams = new URLSearchParams();
                if (kat !== "Semua") urlParams.set("kategori", kat);
                if (cari) urlParams.set("cari", cari);
                const queryString = urlParams.toString();
                const href = queryString ? `/?${queryString}` : "/";

                return (
                  <Link
                    key={kat}
                    href={href}
                    className={`rounded-full px-3.5 py-1 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-utama text-white"
                        : "bg-permukaan text-teks hover:bg-garis"
                    }`}
                  >
                    {kat}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-4 text-bahaya">
            <p className="font-semibold">Gagal memuat produk:</p>
            <p className="mt-1 text-sm">{pesanError}</p>
          </div>
        ) : daftarProduk.length === 0 ? (
          <p className="py-8 text-center text-teks-lembut">
            {adaFilterAktif ? "Tidak ada produk yang cocok" : "Belum ada produk"}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
