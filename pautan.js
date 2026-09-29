// Pautan bayaran ToyyibPay (bil dicipta 27 Sep 2026).
// Satu fail ini dikongsi oleh semua halaman jualan.
const PAUTAN = {
  topik13: "https://toyyibpay.com/8s3c4rzy",  // 13 Topik Panas · RM39
  topik33: "https://toyyibpay.com/g58lqf5f",  // 13 Topik + 20 topik lagi · RM68
  set1:    "https://toyyibpay.com/x0ue7hsq",  // Set Ramalan · 1 set · RM7
  set5:    "https://toyyibpay.com/iyy62btr",  // Set Ramalan · 5 set · RM29
  set10:   "https://toyyibpay.com/e2s3q1rg",  // Set Ramalan · 10 set · RM49
  set20:   "https://toyyibpay.com/lq5vmudl",  // Set Ramalan · 20 set · RM79
  sampel:  "../demo/",                        // Sampel percuma (pratonton)
  tambah20: "https://toyyibpay.com/k83lfsbn", // Tambah 20 topik (+RM29) untuk pembeli 13 Topik
  selesai: "../demo/terima-kasih.html"        // Halaman terima kasih
};
// ALIRAN: selepas bayar 13/33 Topik, tetapkan URL kembali platform bayaran kepada
//   set-ramalan/?selepas=topik13   (atau ?selepas=topik33)
// supaya pembeli terus nampak tawaran Set Ramalan (bayaran berasingan).

(function () {
  const toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let tt;
  function tunjuk(msg) {
    toast.textContent = msg; toast.classList.add("on");
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 2600);
  }
  // Mod demo (dibuka dari demo/): butang beli pergi ke halaman bayaran olok-olok
  // Mod demo hanya apabila halaman itu sendiri di bawah /demo/ atau ada ?demo.
  // Tidak disimpan dalam sesi, supaya butang beli pelanggan sebenar tidak tersasar.
  const DEMO = /[?&]demo\b/.test(location.search) || location.pathname.indexOf("/demo/") !== -1;
  const SELEPAS = { topik13: "13 Topik Panas", topik33: "Semua 33 Topik" };
  const selepas = new URLSearchParams(location.search).get("selepas");
  const lepasBayar = Object.prototype.hasOwnProperty.call(SELEPAS, selepas) ? selepas : null;
  window.MM = { DEMO, lepasBayar };

  if (DEMO) {
    const bar = document.createElement("div");
    bar.className = "demobar-lite";
    bar.innerHTML = '<a href="../demo/">← Peta demo</a><span>DEMO · ' + (lepasBayar ? 'Langkah 4/7: <b>Tawaran Set Ramalan (selepas bayaran)</b>' : 'Langkah 2/7: <b>Halaman jualan</b>') + '</span>';
    bar.style.cssText = "position:sticky;top:0;z-index:70;display:flex;gap:14px;flex-wrap:wrap;background:#6B21A8;color:#fff;padding:9px 16px;font:600 .8rem/1.3 'JetBrains Mono',monospace";
    bar.querySelector("a").style.cssText = "color:#fff;text-decoration:none";
    bar.querySelector("b").style.color = "#FDE68A";
    document.body.prepend(bar);
  }

  // Mod selepas bayaran: banner kejayaan + pautan "tidak, terima kasih"
  if (lepasBayar) {
    const ban = document.createElement("div");
    ban.className = "paid-banner";
    ban.innerHTML = '<b>✓ Pembayaran berjaya.</b> ' + SELEPAS[lepasBayar] + ' anda sedang dihantar ke e-mel. Sebelum pergi, lihat langkah seterusnya untuk anak anda ↓';
    const nav = document.querySelector(".nav");
    nav ? nav.after(ban) : document.body.prepend(ban);
    document.querySelectorAll("[data-selepas]").forEach(el => el.hidden = false);
  }

  window.pasangPautan = function (a) {
    const k = a.dataset.pautan, url = PAUTAN[k];
    if (DEMO && k === "selesai") { a.href = "../demo/terima-kasih.html?p=" + lepasBayar; delete a.dataset.kosong; }
    else if (DEMO && k !== "sampel") { a.href = "../demo/bayar.html?p=" + k + (lepasBayar ? "&juga=" + lepasBayar : ""); delete a.dataset.kosong; }
    else if (url) { a.href = url; delete a.dataset.kosong; }
    else { a.href = "#"; a.dataset.kosong = "1"; }
  };
  document.querySelectorAll("[data-pautan]").forEach(window.pasangPautan);
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-kosong]");
    if (a) { e.preventDefault(); tunjuk("Draf: pautan \"" + a.dataset.pautan + "\" belum dipasang dalam pautan.js"); }
  });

  // Bar melekit (mudah alih): muncul selepas hero, sembunyi bila kotak tawaran kelihatan
  const stick = document.querySelector(".stick"), hero = document.querySelector(".hero"), offer = document.querySelector("#tawaran");
  if (stick && hero && offer && "IntersectionObserver" in window) {
    let lepas = false, nampak = false;
    const kemas = () => stick.classList.toggle("on", lepas && !nampak);
    new IntersectionObserver(([e]) => { lepas = !e.isIntersecting; kemas(); }).observe(hero);
    new IntersectionObserver(([e]) => { nampak = e.isIntersecting; kemas(); }).observe(offer);
  }
})();
