const $=s=>document.querySelector(s);
$("#scan").onclick=async()=>{
  $("#status").textContent="SCANNING";
  $("#progress").textContent="Аналізуємо ринки…";
  $("#result").classList.add("hidden");
  try{
    const r=await fetch("/api/scan");
    const d=await r.json();
    $("#status").textContent=d.status;
    if(d.status==="SIGNAL"){
      const s=d.signal;
      $("#result").innerHTML=`
        <div class="eyebrow">FINAL SIGNAL</div>
        <h2>🏆 ${s.symbol}</h2>
        <div class="direction ${s.direction==="CALL"?"call":"put"}">${s.direction}</div>
        <div class="grid">
          <div><small>Signal</small><b>${s.score}/100</b></div>
          <div><small>Risk</small><b>${s.risk}/100</b></div>
          <div><small>Expiry</small><b>${s.expiryMinutes} min</b></div>
          <div><small>Payout</small><b>${s.payout}%</b></div>
        </div>
        <div class="checks">
          <span>VWAP ✓</span><span>EMA ✓</span><span>${s.structure} ✓</span>
          <span>RSI ✓</span><span>Momentum ✓</span><span>Volume ✓</span><span>ATR ✓</span>
        </div>
      `;
      $("#riskfill").style.width=s.risk+"%";
      $("#result").classList.remove("hidden");
      $("#progress").textContent=`Scanned: ${d.scanned} • Valid setups: ${d.candidates}`;
    }else{
      $("#result").innerHTML=`<h2>⛔ NO TRADE</h2><p>${d.reason||"Жоден актив не пройшов жорсткі фільтри."}</p>`;
      $("#result").classList.remove("hidden");
      $("#riskfill").style.width="100%";
      $("#progress").textContent=`Scanned: ${d.scanned} • Valid setups: ${d.candidates}`;
    }
  }catch(e){
    $("#status").textContent="ERROR";
    $("#progress").textContent="Не вдалося отримати дані.";
  }
};
