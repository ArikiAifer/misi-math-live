// Demo perjalanan pembeli — data produk & bar demo (BUKAN untuk halaman sebenar)
// PDF sebenar hanya dibuka semasa pratonton tempatan (pelayan di produk/). Di laman awam: tiada fail disertakan.
const TEMPATAN = ["localhost", "127.0.0.1"].includes(location.hostname);
const F = "../../../"; // dari demo/ ke produk/
const HADIAH = {
  H1: { nama: "Nota Kilat 33 Topik", fail: F + "hadiah/H1-Nota-Kilat-33-Topik.pdf" },
  H2: { nama: "50 Perangkap Markah", fail: F + "hadiah/H2-50-Perangkap-Markah.pdf" },
  H3: { nama: "Teknik Menjawab & Pengurusan Masa", fail: F + "hadiah/H3-Teknik-Menjawab.pdf" },
  H4: { nama: "Jadual Misi 60 Hari", fail: F + "hadiah/H4-Jadual-Misi-60-Hari.pdf" },
  H5: { nama: "Panduan Ibu Bapa", fail: F + "hadiah/H5-Panduan-Ibu-Bapa.pdf" },
  KP: { nama: "Kalkulator Pintar SPM", fail: F + "buku/Kalkulator-Pintar-SPM.pdf" }
};
const set = n => ({
  nama: n + " Set Ramalan", harga: { 1: 7, 5: 29, 10: 49, 20: 79 }[n], jenis: "set",
  utama: [{ nama: `Set Ramalan 1${n > 1 ? "–" + n : ""} (K1 + K2 + skema)`, fail: F + "pakej/MISI-MATH-A+-20-Set-Ramalan.pdf" }],
  bonus: ["H3", "H2"]
});
const PRODUK = {
  topik13: {
    nama: "13 Topik Panas", harga: 39, jenis: "topik",
    utama: [{ nama: "13 Topik Panas (1,495 soalan + skema)", fail: F + "pakej/MISI-MATH-A+-13-Topik-Panas-v2.pdf" }],
    bonus: ["H1", "H2", "H3", "H4", "H5"]
  },
  topik33: {
    nama: "Semua 33 Topik", harga: 68, jenis: "topik",
    baris: [["13 Topik Panas", 39], ["+20 topik lagi (tambahan)", 29]],
    utama: [{ nama: "Semua 33 Topik (3,795 soalan + skema)", fail: F + "pakej/MISI-MATH-A+-Bundle-Penuh-v2.pdf" }],
    bonus: ["H1", "H2", "H3", "H4", "H5", "KP"]
  },
  set1: set(1), set5: set(5), set10: set(10), set20: set(20)
};
if (!TEMPATAN) {
  Object.values(HADIAH).forEach(h => h.fail = null);
  Object.values(PRODUK).forEach(P => P.utama.forEach(u => u.fail = null));
}

const LANGKAH = ["Iklan", "Halaman jualan", "Bayaran", "Tawaran Set Ramalan", "Terima kasih", "E-mel", "Muat turun"];

const Q = new URLSearchParams(location.search);
function kodP() {
  const p = Q.get("p");
  return PRODUK[p] ? p : "topik13";
}
// Produk yang sudah dibeli sebelum ini dalam perjalanan yang sama (bank soalan → Set Ramalan)
function kodJuga() {
  const j = Q.get("juga");
  return PRODUK[j] && j !== kodP() ? j : null;
}
// Gabung semua pesanan: bank soalan dahulu, kemudian Set Ramalan; bonus tanpa ulangan
function pesanan() {
  const ks = [kodJuga(), kodP()].filter(Boolean), Ps = ks.map(k => PRODUK[k]);
  return {
    ks, Ps, nama: Ps.map(P => P.nama).join(" + "),
    harga: Ps.reduce((a, P) => a + P.harga, 0),
    utama: Ps.flatMap(P => P.utama),
    bonus: [...new Set(Ps.flatMap(P => P.bonus))],
    adaTopik: Ps.some(P => P.jenis === "topik"), adaSet: Ps.some(P => P.jenis === "set")
  };
}
function qs() { return "?p=" + kodP() + (kodJuga() ? "&juga=" + kodJuga() : ""); }
function simpan(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
function baca(k, d) { try { return sessionStorage.getItem(k) || d; } catch (e) { return d; } }

// Bar demo di atas setiap halaman demo
function barDemo(i, label) {
  const el = document.createElement("div");
  el.className = "demobar";
  el.innerHTML = `<a href="./">← Peta demo</a><span>DEMO · Langkah ${i + 1}/${LANGKAH.length}: <b>${label || LANGKAH[i]}</b></span>` +
    `<ol>${LANGKAH.map((l, j) => `<li class="${j < i ? "done" : j === i ? "now" : ""}" title="${l}"></li>`).join("")}</ol>`;
  document.body.prepend(el);
}
