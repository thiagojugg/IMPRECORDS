(() => {
  if (document.getElementById("imp-site-search")) return;
  const header=document.querySelector(".header-inner");
  if(!header)return;
  const trigger=document.createElement("button");
  trigger.className="imp-site-search-trigger";trigger.type="button";trigger.setAttribute("aria-label","Pesquisar produtos e artistas");trigger.title="Pesquisar";
  trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  header.prepend(trigger);
  const overlay=document.createElement("div");overlay.className="imp-search-overlay";overlay.id="imp-site-search";overlay.setAttribute("aria-hidden","true");
  overlay.innerHTML='<section class="imp-search-panel" role="dialog" aria-modal="true" aria-labelledby="imp-search-title"><div class="imp-search-top"><strong id="imp-search-title">PESQUISA IMP RECORDS</strong><button class="imp-search-close" type="button" aria-label="Fechar pesquisa">×</button></div><label class="imp-search-input-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input class="imp-search-input" type="search" placeholder="Pesquise produtos ou artistas..." autocomplete="off"></label><p class="imp-search-hint">PESQUISE POR NOME DE PRODUTO OU ARTISTA</p><div class="imp-search-results"><p class="imp-search-empty">Digite para começar a pesquisar.</p></div></section>';
  document.body.appendChild(overlay);
  const input=overlay.querySelector("input"),results=overlay.querySelector(".imp-search-results"),close=overlay.querySelector(".imp-search-close");
  const artists=[["TWIZ","ARTISTA","twiz.html"],["OLLIVERVN","ARTISTA","ollivervn.html"],["LOWEST","ARTISTA","artistas.html"],["GABRIEL LEAL","ARTISTA","gabriel-leal.html"],["YGD LUKE","ARTISTA","ygd-luke.html"],["TG SLATTY","ARTISTA","tg-slatty.html"],["DINGY!","ARTISTA","artistas.html"]];
  const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  let items=artists.map(([name,type,url])=>({name,type,url:"./"+url}));
  fetch("./index.html").then(r=>r.text()).then(html=>{
    const doc=new DOMParser().parseFromString(html,"text/html");
    doc.querySelectorAll(".product-card-link[href]").forEach(a=>{
      const card=a.closest(".product-card")||a;
      const name=card.querySelector(".product-title,h3")?.textContent?.trim()||a.getAttribute("aria-label")||"Produto";
      const type=card.querySelector(".product-vendor")?.textContent?.trim()||"PRODUTO";
      items.push({name,type,url:a.getAttribute("href")});
    });
  }).catch(()=>{});
  const render=()=>{const q=norm(input.value.trim());if(!q){results.innerHTML='<p class="imp-search-empty">Digite para começar a pesquisar.</p>';return;}
    const found=items.filter(x=>norm(x.name+" "+x.type).includes(q)).slice(0,15);
    results.innerHTML=found.length?found.map(x=>{const a=document.createElement("a");a.className="imp-search-result";a.href=x.url;const left=document.createElement("span"),strong=document.createElement("strong"),small=document.createElement("small"),right=document.createElement("span");strong.textContent=x.name;small.textContent=x.type;right.textContent="↗";left.append(strong,small);a.append(left,right);return a.outerHTML;}).join(""):'<p class="imp-search-empty">Nenhum produto ou artista encontrado.</p>';
  };
  const show=()=>{overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";input.value="";render();setTimeout(()=>input.focus(),30);};
  const hide=()=>{overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";trigger.focus();};
  trigger.addEventListener("click",show);close.addEventListener("click",hide);input.addEventListener("input",render);overlay.addEventListener("click",e=>{if(e.target===overlay)hide();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("is-open"))hide();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();show();}});
})();