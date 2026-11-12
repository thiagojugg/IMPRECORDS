(() => {
  "use strict";

  const SUPABASE_URL = "https://livbviutessdnblcqyvv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_sFAQFrL1A5KIu8XGdLumiw_6PL0lvCr";
  const endpoint = SUPABASE_URL + "/rest/v1/store_variants?select=sku,product_id,size,stock,enabled,unlimited";

  const productByPage = {
    "produto-gengar.html": "gengar",
    "produto-bone-underground.html": "bone-truck-imp-records-underground",
    "produto-preset-twiz.html": "preset-vocal-do-twiz",
    "produto-kingdom-808.html": "kingdom-808"
  };

  const available = row => !!row && row.enabled === true &&
    (row.unlimited === true || Number(row.stock) > 0);

  const quantity = rows => rows.reduce((sum, row) =>
    sum + (row.unlimited ? 0 : Math.max(0, Number(row.stock) || 0)), 0);

  const statusFor = rows => {
    if (!rows.length) return { text: "ESTOQUE NÃO CADASTRADO", available: false, unlimited: false };
    if (rows.some(row => row.enabled && row.unlimited)) {
      return { text: "DISPONÍVEL · ESTOQUE ILIMITADO", available: true, unlimited: true };
    }
    const total = quantity(rows.filter(available));
    if (total > 0) return { text: total + (total === 1 ? " UNIDADE DISPONÍVEL" : " UNIDADES DISPONÍVEIS"), available: true, unlimited: false };
    return { text: "ESGOTADO", available: false, unlimited: false };
  };

  function setStatus(node, state, loading = false) {
    if (!node) return;
    node.textContent = loading ? "CONSULTANDO ESTOQUE…" : state.text;
    node.classList.toggle("is-available", !loading && state.available);
    node.classList.toggle("is-unavailable", !loading && !state.available);
    node.classList.toggle("is-loading", loading);
  }

  function renderCards(rows) {
    document.querySelectorAll(".product-card-link[href]").forEach(link => {
      const path = new URL(link.href, location.href).pathname.split("/").pop();
      const productId = productByPage[path];
      if (!productId) return;
      const card = link.closest(".product-card");
      const meta = card && card.querySelector(".product-meta");
      if (!meta) return;
      let badge = meta.querySelector(".store-stock-badge");
      if (!badge) {
        badge = document.createElement("p");
        badge.className = "store-stock-badge is-loading";
        badge.setAttribute("aria-live", "polite");
        const price = meta.querySelector(".product-price-wrap");
        (price || meta).insertAdjacentElement("afterend", badge);
      }
      const productRows = rows.filter(row => row.product_id === productId);
      setStatus(badge, statusFor(productRows));
    });
  }

  function renderDetail(rows) {
    const page = location.pathname.split("/").pop();
    const productId = productByPage[page];
    if (!productId) return;

    const productRows = rows.filter(row => row.product_id === productId);
    const purchaseArea = document.querySelector(".buy-button")?.parentElement ||
      document.querySelector(".product-info, .product-details, .product-content") ||
      document.querySelector("main");
    if (!purchaseArea) return;

    let status = purchaseArea.querySelector(".store-stock-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "store-stock-status is-loading";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      const buyButton = purchaseArea.querySelector(".buy-button");
      purchaseArea.insertBefore(status, buyButton || purchaseArea.firstChild);
    }
    const state = statusFor(productRows);
    setStatus(status, state);

    if (productId === "gengar") {
      document.querySelectorAll(".size-option[data-size]").forEach(button => {
        const sku = "gengar-" + button.dataset.size.toLowerCase();
        const row = productRows.find(item => item.sku === sku);
        button.disabled = !available(row);
        button.setAttribute("aria-disabled", String(button.disabled));
        button.title = row && row.stock > 0 ? row.stock + " unidade(s) disponível(is)" : "Tamanho esgotado";
      });
      const help = document.querySelector(".size-help");
      if (help) {
        const total = quantity(productRows.filter(available));
        help.textContent = total
          ? "Estoque atualizado: " + total + (total === 1 ? " unidade disponível." : " unidades disponíveis.")
          : "No momento, todos os tamanhos estão esgotados.";
      }
    }

    if (productId === "bone-truck-imp-records-underground") {
      const styleButtons = [...document.querySelectorAll("[data-style]")];
      const colorButtons = [...document.querySelectorAll("[data-color]")];

      const updateHatOptions = () => {
        const style = document.querySelector("[data-style][aria-pressed='true']")?.dataset.style || "Estilo 1";
        const color = document.querySelector("[data-color][aria-pressed='true']")?.dataset.color || "Preto";
        styleButtons.forEach(button => {
          const hasAny = productRows.some(row => row.size.startsWith(button.dataset.style + " · ") && available(row));
          button.disabled = !hasAny;
          button.setAttribute("aria-disabled", String(button.disabled));
        });
        colorButtons.forEach(button => {
          const row = productRows.find(item => item.size === style + " · " + button.dataset.color);
          button.disabled = !available(row);
          button.setAttribute("aria-disabled", String(button.disabled));
        });
        const current = productRows.find(row => row.size === style + " · " + color);
        const currentState = available(current)
          ? { text: current.unlimited ? "VARIAÇÃO DISPONÍVEL · ESTOQUE ILIMITADO" : current.stock + (current.stock === 1 ? " UNIDADE DISPONÍVEL" : " UNIDADES DISPONÍVEIS"), available: true }
          : { text: "ESTA VARIAÇÃO ESTÁ ESGOTADA", available: false };
        setStatus(status, currentState);
      };

      [...styleButtons, ...colorButtons].forEach(button =>
        button.addEventListener("click", () => queueMicrotask(updateHatOptions))
      );
      updateHatOptions();
    }

    if (productId === "preset-vocal-do-twiz" && state.unlimited) {
      const note = purchaseArea.querySelector(".buy-note");
      if (note) note.textContent = "Estoque ilimitado. O carrinho e a finalização do pagamento serão integrados em uma próxima etapa.";
    }
  }

  async function loadStock() {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY
        },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("Falha ao consultar estoque (" + response.status + ")");
      const rows = await response.json();
      renderCards(rows);
      renderDetail(rows);
    } catch (error) {
      document.querySelectorAll(".store-stock-badge, .store-stock-status").forEach(node => {
        node.textContent = "ESTOQUE INDISPONÍVEL";
        node.classList.remove("is-loading", "is-available");
        node.classList.add("is-unavailable");
      });
      console.error("[IMP RECORDS] Não foi possível carregar o estoque:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadStock, { once: true });
  } else {
    loadStock();
  }
})();