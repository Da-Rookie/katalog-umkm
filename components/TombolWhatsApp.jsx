"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

// US-03: Pesan via WhatsApp
// US-12: Pilih jumlah produk sebelum memesan
export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);

  if (!produk) return null;

  const totalHarga = (produk.harga || 0) * jumlah;
  const pesan = `Halo, saya ingin memesan ${produk.nama} sebanyak ${jumlah} pcs (total ${formatRupiah(totalHarga)}).`;
  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Pemilih Jumlah (US-12) */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-teks">Pilih jumlah:</span>
        <div className="flex items-center overflow-hidden rounded-lg border border-garis bg-latar">
          <button
            type="button"
            onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1.5 text-base font-bold text-teks hover:bg-permukaan active:bg-garis transition-colors"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-bold text-teks">
            {jumlah}
          </span>
          <button
            type="button"
            onClick={() => setJumlah((prev) => prev + 1)}
            className="px-3 py-1.5 text-base font-bold text-teks hover:bg-permukaan active:bg-garis transition-colors"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
        <span className="text-sm text-teks-lembut">
          Total: <strong className="text-harga font-bold">{formatRupiah(totalHarga)}</strong>
        </span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto transition-colors"
      >
        Pesan via WhatsApp ({jumlah} pcs)
      </a>
    </div>
  );
}
