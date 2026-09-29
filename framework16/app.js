const RATE=96;
const campaign={upiId:"YOUR_UPI_ID",upiName:"Sponsored Laptop",raised:0,start:"2026-09-29T00:00:00+05:30",end:"2026-12-27T23:59:59+05:30"};

const parts=[
{id:"ssd8",code:"01",name:"8TB primary SSD",detail:"SANDISK 850X PCIe 4.0",usd:2269,featured:true},
{id:"platform",code:"02",name:"Ryzen AI 9 HX 370 platform",detail:"Framework Laptop 16 DIY Edition",usd:1799},
{id:"ram",code:"03",name:"96GB DDR5-5600",detail:"2 × 48GB SODIMM",usd:1318},
{id:"gpu",code:"04",name:"RTX 5070 12GB",detail:"Framework Graphics Module",usd:1199},
{id:"ssd2",code:"05",name:"2TB secondary SSD",detail:"SANDISK SN770M M.2 2230",usd:495},
{id:"windows",code:"06",name:"Windows 11 Pro",detail:"Download license",usd:199},
{id:"io",code:"07",name:"Premium 6-card I/O set",detail:"10G Ethernet + HDMI + DP + SD + MicroSD + USB-A",usd:194},
{id:"warranty",code:"08",name:"3-year warranty",detail:"Extended warranty",usd:189},
{id:"power",code:"09",name:"240W USB-C adapter",detail:"Framework GaN power adapter",usd:109},
{id:"keyboard",code:"10",name:"RGB Clear ANSI keyboard",detail:"Premium Framework 16 keyboard",usd:109},
{id:"macropad",code:"11",name:"RGB Macropad",detail:"2nd Gen",usd:79},
{id:"haptic",code:"12",name:"Haptic touchpad",detail:"One-piece matte-glass touchpad",usd:70},
{id:"bezel",code:"13",name:"Orange bezel",detail:"Color bezel upgrade",usd:20}
].map(p=>({...p,inr:p.usd*RATE,sold:false,paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"}));

const total=parts.reduce((s,p)=>s+p.inr,0);
campaign.target=total;
parts.forEach(p=>p.share=p.inr/total);

const rupee=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function splitClosest(items){
  if(items.length<=1)return[items,[]];
  const total=items.reduce((s,p)=>s+p.inr,0),half=total/2;
  let run=0,best=1,diff=Infinity;
  for(let i=1;i<items.length;i++){run+=items[i-1].inr;const d=Math.abs(half-run);if(d<diff){diff=d;best=i}}
  return[items.slice(0,best),items.slice(best)];
}
function treemap(items,x=0,y=0,w=100,h=100){
  if(items.length===1)return[{p:items[0],x,y,w,h}];
  const total=items.reduce((s,p)=>s+p.inr,0);
  const [a,b]=splitClosest(items),ratio=a.reduce((s,p)=>s+p.inr,0)/total;
  if(w>=h){const wa=w*ratio;return[...treemap(a,x,y,wa,h),...treemap(b,x+wa,y,w-wa,h)]}
  const ha=h*ratio;return[...treemap(a,x,y,w,ha),...treemap(b,x,y+ha,w,h-ha)];
}

function renderMap(){
  const el=document.querySelector("#lidMap");
  el.innerHTML=treemap([...parts].sort((a,b)=>b.inr-a.inr)).map(({p,x,y,w,h})=>{
    const pct=p.share*100,tiny=pct<1.5?" tiny":"",major=p.featured?" major":"";
    return `<button class="zone${tiny}${major}" data-zone="${p.id}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="${p.name}, ${rupee(p.inr)}, ${pct.toFixed(1)} percent of lid">
      <span class="zone-copy"><span class="zone-code">${p.code}</span><b class="zone-name">${p.name}</b><span class="zone-meta"><span>${rupee(p.inr)}</span><span>${pct.toFixed(1)}%</span></span></span>
    </button>`;
  }).join("");
  document.querySelectorAll("[data-zone]").forEach(z=>{
    z.onclick=()=>openSponsor(z.dataset.zone);
    ["mouseenter","focus"].forEach(e=>z.addEventListener(e,()=>link(z.dataset.zone,true)));
    ["mouseleave","blur"].forEach(e=>z.addEventListener(e,()=>link(z.dataset.zone,false)));
  });
}

function renderLists(){
  document.querySelector("#partsList").innerHTML=parts.map(p=>`<article class="part" data-part="${p.id}"><span class="part-code">${p.code}</span><div><b>${p.name}</b><small>${p.detail}</small></div><span class="part-price">${rupee(p.inr)}</span><span class="part-share">${(p.share*100).toFixed(1)}%</span></article>`).join("");

  document.querySelector("#sponsorGrid").innerHTML=parts.map(p=>`<article class="inventory-row ${p.featured?"featured":""}" data-row="${p.id}"><div class="inventory-place"><span>${p.code}</span><div><b>${p.name}</b><small>${p.detail}</small></div></div><span class="inventory-share">${(p.share*100).toFixed(1)}% of lid</span><span class="inventory-price">${rupee(p.inr)}</span><button class="inventory-action" data-open="${p.id}">Details ↗</button></article>`).join("");

  document.querySelectorAll("[data-part],[data-row]").forEach(el=>{
    const id=el.dataset.part||el.dataset.row;
    el.addEventListener("mouseenter",()=>link(id,true));
    el.addEventListener("mouseleave",()=>link(id,false));
  });
  document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openSponsor(b.dataset.open));
}

function link(id,on){
  document.querySelector(`[data-zone="${id}"]`)?.classList.toggle("linked",on);
  document.querySelector(`[data-part="${id}"]`)?.classList.toggle("linked",on);
  document.querySelector(`[data-row="${id}"]`)?.classList.toggle("linked",on);
}

const dialog=document.querySelector("#sponsorDialog");
function openSponsor(id){
  const p=parts.find(x=>x.id===id); if(!p)return;
  dialog.dataset.id=id;
  document.querySelector("#dialogCode").textContent=p.code;
  document.querySelector("#dialogTitle").textContent=p.name;
  document.querySelector("#dialogPrice").textContent=rupee(p.inr);
  document.querySelector("#dialogShare").textContent=(p.share*100).toFixed(1)+"% of rear lid";
  document.querySelector("#dialogDescription").textContent=`Funding this zone covers the planning cost of the ${p.name}. Your physical ad area is proportional to this component’s share of the maxed practical build.`;
  document.querySelector("#dialogBenefits").innerHTML=["Printed logo on this proportional Lenovo-lid zone","Sponsor listing on the website","Component-funding milestone credit","Inclusion in the final build/reveal where applicable"].map(x=>`<li>${x}</li>`).join("");
  document.querySelector("#dialogStatus").textContent=p.paymentLink.includes("YOUR_")?"Razorpay sponsor link is not live yet.":"This opens the configured Razorpay checkout.";
  dialog.showModal();
}
document.querySelector(".dialog-close").onclick=()=>dialog.close();
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
document.querySelector("#dialogBuy").onclick=()=>{const p=parts.find(x=>x.id===dialog.dataset.id);if(p&&!p.paymentLink.includes("YOUR_"))window.open(p.paymentLink,"_blank","noopener");else document.querySelector("#dialogStatus").textContent="This sponsor checkout has not been connected yet."};

function updateCampaign(){
  const now=new Date(),start=new Date(campaign.start),end=new Date(campaign.end);
  const day=clamp(Math.floor((now-start)/86400000)+1,1,90),left=Math.max(0,Math.ceil((end-now)/86400000)),pct=clamp(campaign.raised/total*100,0,100);
  document.querySelector("#raisedAmount").textContent=rupee(campaign.raised);
  document.querySelector("#targetAmount").textContent=rupee(total);
  document.querySelector("#targetCard").textContent=rupee(total);
  document.querySelector("#heroTarget").textContent=rupee(total);
  document.querySelector("#percentFunded").textContent=pct.toFixed(pct>=10?0:1)+"%";
  document.querySelector("#progressFill").style.width=pct+"%";
  document.querySelector("#heroDay").textContent=day;document.querySelector("#footerDay").textContent=day;document.querySelector("#daysLeft").textContent=left+" day"+(left===1?"":"s");
  document.querySelector("#componentCount").textContent=parts.length;
  document.querySelector("#spotsTotal").textContent=parts.length;
  document.querySelector("#spotsSold").textContent=parts.filter(p=>p.sold).length;
  document.querySelector("#spotsAvailable").textContent=parts.filter(p=>!p.sold).length;
}

let amount=100;
function selectAmount(v){amount=Number(v);document.querySelector("#selectedAmount").textContent=rupee(amount);document.querySelectorAll("#quickAmounts button").forEach(b=>b.classList.toggle("active",Number(b.dataset.amount)===amount))}
document.querySelectorAll("#quickAmounts button").forEach(b=>b.onclick=()=>selectAmount(b.dataset.amount));
function configured(){return campaign.upiId&&!campaign.upiId.includes("YOUR_")}
function payLink(){const q=new URLSearchParams({pa:campaign.upiId,pn:campaign.upiName,am:String(amount),cu:"INR",tn:"Sponsored Laptop Framework 16 project"});return"upi://pay?"+q}
document.querySelector("#payUpiBtn").onclick=()=>{if(configured())location.href=payLink();else document.querySelector("#paymentStatus").textContent="The campaign UPI account has not been connected yet."};
document.querySelector("#copyUpiBtn").onclick=async()=>{if(!configured()){document.querySelector("#paymentStatus").textContent="The campaign UPI account has not been connected yet.";return}try{await navigator.clipboard.writeText(campaign.upiId);document.querySelector("#paymentStatus").textContent="Copied: "+campaign.upiId}catch{document.querySelector("#paymentStatus").textContent=campaign.upiId}};

function tilt(){
  const stage=document.querySelector("#laptopStage");if(matchMedia("(hover:none)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;document.documentElement.style.setProperty("--ry",((x-.5)*4).toFixed(2)+"deg");document.documentElement.style.setProperty("--rx",(-(y-.5)*3).toFixed(2)+"deg");document.documentElement.style.setProperty("--tx",((x-.5)*3).toFixed(1)+"px");document.documentElement.style.setProperty("--ty",((y-.5)*2).toFixed(1)+"px")});
  stage.addEventListener("pointerleave",()=>["--rx","--ry","--tx","--ty"].forEach((v,i)=>document.documentElement.style.setProperty(v,i<2?"0deg":"0px")));
}

document.querySelector("#labelToggle").onclick=e=>{const hidden=document.querySelector("#lidMap").classList.toggle("hide");e.currentTarget.textContent=hidden?"Show labels":"Hide labels";e.currentTarget.setAttribute("aria-pressed",hidden?"false":"true")};

function scrollUI(){
  const links=[...document.querySelectorAll(".nav-links a")],sections=links.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const run=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty("--scroll",(max?scrollY/max*100:0)+"%");let active="";const probe=scrollY+Math.min(280,innerHeight*.35);sections.forEach(s=>{if(s.offsetTop<=probe)active=s.id});links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+active))};
  addEventListener("scroll",run,{passive:true});run();
}
function reveal(){
  const els=[...document.querySelectorAll(".section-head,.part,.inventory-row,.paybox,.log article,.final>*")];
  els.forEach(e=>e.classList.add("reveal"));
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){els.forEach(e=>e.classList.add("show"));return}
  const o=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("show");o.unobserve(x.target)}}),{threshold:.1});
  els.forEach(e=>o.observe(e));
}

renderMap();renderLists();selectAmount(100);updateCampaign();tilt();scrollUI();reveal();setInterval(updateCampaign,60000);