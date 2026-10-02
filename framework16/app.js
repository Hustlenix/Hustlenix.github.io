const RATE=96;
const GUMROAD_URL="https://hustlenix.gumroad.com/coffee";
const campaign={
  upiId:"YOUR_UPI_ID",
  upiName:"Sponsored Laptop",
  raised:0,
  start:"2026-09-29T00:00:00+05:30",
  end:"2026-12-27T23:59:59+05:30"
};

const parts=[
  {id:"ssd8",code:"01",name:"8TB primary SSD",detail:"SANDISK 850X PCIe 4.0",usd:2269,featured:true},
  {id:"platform",code:"02",name:"Ryzen AI 9 HX 370 platform",detail:"Framework Laptop 16 DIY Edition",usd:1799},
  {id:"ram",code:"03",name:"96GB DDR5-5600",detail:"2 × 48GB SODIMM",usd:1318},
  {id:"gpu",code:"04",name:"RTX 5070 12GB",detail:"Framework Graphics Module",usd:1199},
  {id:"ssd2",code:"05",name:"2TB secondary SSD",detail:"SANDISK SN770M M.2 2230",usd:495},
  {id:"windows",code:"06",name:"Windows 11 Pro",detail:"Download license",usd:199},
  {id:"io",code:"07",name:"Premium six-card I/O",detail:"10G Ethernet + HDMI + DisplayPort + SD + MicroSD + USB-A",usd:194},
  {id:"warranty",code:"08",name:"3-year warranty",detail:"Extended warranty",usd:189},
  {id:"power",code:"09",name:"240W USB-C adapter",detail:"Framework GaN power adapter",usd:109},
  {id:"keyboard",code:"10",name:"RGB Clear ANSI keyboard",detail:"Framework Laptop 16 Keyboard",usd:109},
  {id:"macropad",code:"11",name:"RGB Macropad",detail:"2nd Gen",usd:79},
  {id:"haptic",code:"12",name:"Haptic touchpad",detail:"One-piece matte-glass touchpad",usd:70},
  {id:"bezel",code:"13",name:"Orange bezel",detail:"Color bezel upgrade",usd:20}
].map(p=>({...p,inr:p.usd*RATE,sold:false,paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"}));

const total=parts.reduce((sum,p)=>sum+p.inr,0);
campaign.target=total;
parts.forEach(p=>p.share=p.inr/total);

const rupee=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function splitClosest(items){
  if(items.length<=1)return[items,[]];
  const sum=items.reduce((s,p)=>s+p.inr,0),half=sum/2;
  let running=0,best=1,diff=Infinity;
  for(let i=1;i<items.length;i++){
    running+=items[i-1].inr;
    const d=Math.abs(half-running);
    if(d<diff){diff=d;best=i}
  }
  return[items.slice(0,best),items.slice(best)];
}

function treemap(items,x=0,y=0,w=100,h=100){
  if(items.length===1)return[{part:items[0],x,y,w,h}];
  const sum=items.reduce((s,p)=>s+p.inr,0);
  const [a,b]=splitClosest(items);
  const ratio=a.reduce((s,p)=>s+p.inr,0)/sum;

  if(w>=h){
    const wa=w*ratio;
    return[...treemap(a,x,y,wa,h),...treemap(b,x+wa,y,w-wa,h)];
  }

  const ha=h*ratio;
  return[...treemap(a,x,y,w,ha),...treemap(b,x,y+ha,w,h-ha)];
}

const rects=treemap([...parts].sort((a,b)=>b.inr-a.inr));
let selectedId=parts[0].id;

function mapMarkup(mini=false){
  return rects.map(({part,x,y,w,h})=>{
    const pct=part.share*100;
    if(mini){
      return `<div class="mini-zone ${part.featured?"major":""}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></div>`;
    }

    return `<button class="zone ${part.featured?"major":""} ${pct<1.5?"tiny":""}" data-zone="${part.id}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="${part.name}, ${rupee(part.inr)}, ${pct.toFixed(1)} percent of rear lid">
      <span class="zone-copy">
        <span class="zone-code">${part.code}</span>
        <b class="zone-name">${part.name}</b>
        <span class="zone-meta"><span>${rupee(part.inr)}</span><span>${pct.toFixed(1)}%</span></span>
      </span>
    </button>`;
  }).join("");
}

function renderMaps(){
  document.querySelector("#lidMap").innerHTML=mapMarkup(false);
  document.querySelector("#heroMap").innerHTML=mapMarkup(true);

  document.querySelectorAll("[data-zone]").forEach(zone=>{
    zone.addEventListener("click",()=>selectPart(zone.dataset.zone,true));
    zone.addEventListener("mouseenter",()=>setLinked(zone.dataset.zone,true));
    zone.addEventListener("mouseleave",()=>setLinked(zone.dataset.zone,false));
    zone.addEventListener("focus",()=>setLinked(zone.dataset.zone,true));
    zone.addEventListener("blur",()=>setLinked(zone.dataset.zone,false));
  });
}

function renderInventory(){
  document.querySelector("#inventory").innerHTML=parts.map(part=>`
    <article class="inventory-row" data-row="${part.id}">
      <span class="inventory-code">${part.code}</span>
      <div class="inventory-name">
        <b>${part.name}</b>
        <small>${part.detail}</small>
      </div>
      <span class="inventory-share">${(part.share*100).toFixed(1)}% of lid</span>
      <span class="inventory-price">${rupee(part.inr)}</span>
      <button type="button" data-select="${part.id}">Select</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-row]").forEach(row=>{
    row.addEventListener("mouseenter",()=>setLinked(row.dataset.row,true));
    row.addEventListener("mouseleave",()=>setLinked(row.dataset.row,false));
  });

  document.querySelectorAll("[data-select]").forEach(button=>{
    button.addEventListener("click",()=>{
      selectPart(button.dataset.select,true);
      document.querySelector("#sponsor").scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}

function renderParts(){
  document.querySelector("#partsTable").innerHTML=parts.map(part=>`
    <article class="part-row">
      <span>${part.code}</span>
      <b>${part.name}</b>
      <span class="part-cost">${rupee(part.inr)}</span>
      <span class="part-share">${(part.share*100).toFixed(1)}%</span>
    </article>
  `).join("");
}

function setLinked(id,on){
  document.querySelector(`[data-zone="${id}"]`)?.classList.toggle("linked",on);
  document.querySelector(`[data-row="${id}"]`)?.classList.toggle("linked",on);
}

function selectPart(id,animate=false){
  const part=parts.find(p=>p.id===id);
  if(!part)return;

  selectedId=id;

  document.querySelectorAll("[data-zone]").forEach(el=>el.classList.toggle("selected",el.dataset.zone===id));
  document.querySelectorAll("[data-row]").forEach(el=>el.classList.toggle("selected",el.dataset.row===id));

  document.querySelector("#selectedCode").textContent=part.code;
  document.querySelector("#selectedName").textContent=part.name;
  document.querySelector("#selectedDetail").textContent=part.detail;
  document.querySelector("#selectedPrice").textContent=rupee(part.inr);
  document.querySelector("#selectedShare").textContent=(part.share*100).toFixed(1)+"% of rear lid";
  document.querySelector("#selectedDescription").textContent=
    `Funding this zone covers the planning cost of the ${part.name}. Your printed sponsor mark gets the same percentage of my Lenovo rear lid as this component takes from the Framework hardware budget.`;

  const configured=part.paymentLink&&!part.paymentLink.includes("YOUR_");
  document.querySelector("#sponsorStatus").textContent=configured
    ?"This opens the configured Razorpay sponsor checkout."
    :"Razorpay checkout is not connected yet.";

  if(animate&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelector("#selectionPanel").animate(
      [{opacity:.72,transform:"translateY(5px)"},{opacity:1,transform:"none"}],
      {duration:180,easing:"ease-out"}
    );
  }
}

document.querySelector("#sponsorButton").addEventListener("click",()=>{
  const part=parts.find(p=>p.id===selectedId);
  if(part?.paymentLink&&!part.paymentLink.includes("YOUR_")){
    window.open(part.paymentLink,"_blank","noopener");
  }else{
    document.querySelector("#sponsorStatus").textContent="This sponsor checkout has not been connected yet.";
  }
});

function updateCampaign(){
  const now=new Date(),start=new Date(campaign.start),end=new Date(campaign.end);
  const day=clamp(Math.floor((now-start)/86400000)+1,1,90);
  const days=Math.max(0,Math.ceil((end-now)/86400000));
  const pct=clamp(campaign.raised/total*100,0,100);

  document.querySelector("#heroDay").textContent=day;
  document.querySelector("#footerDay").textContent=day;
  document.querySelector("#daysLeft").textContent=days;
  document.querySelector("#raisedAmount").textContent=rupee(campaign.raised);
  document.querySelector("#targetAmount").textContent=rupee(total);
  document.querySelector("#buildTarget").textContent=rupee(total);
  document.querySelector("#fundedPercent").textContent=pct.toFixed(pct>=10?0:1)+"% funded";
  document.querySelector("#fundingFill").style.width=pct+"%";
  document.querySelector("#zonesAvailable").textContent=parts.filter(p=>!p.sold).length;
}

let amount=100;
function selectAmount(value){
  amount=Number(value);
  document.querySelector("#selectedAmount").textContent=rupee(amount);
  document.querySelectorAll("#quickAmounts button").forEach(button=>{
    button.classList.toggle("active",Number(button.dataset.amount)===amount);
  });
}
document.querySelectorAll("#quickAmounts button").forEach(button=>{
  button.addEventListener("click",()=>selectAmount(button.dataset.amount));
});

function upiConfigured(){return campaign.upiId&&!campaign.upiId.includes("YOUR_")}
function upiLink(){
  const q=new URLSearchParams({pa:campaign.upiId,pn:campaign.upiName,am:String(amount),cu:"INR",tn:"Sponsored Laptop Framework 16 project"});
  return"upi://pay?"+q.toString();
}
document.querySelector("#payUpiBtn").addEventListener("click",()=>{
  if(upiConfigured())location.href=upiLink();
  else document.querySelector("#paymentStatus").textContent="The campaign UPI account has not been connected yet.";
});
document.querySelector("#copyUpiBtn").addEventListener("click",async()=>{
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent="The campaign UPI account has not been connected yet.";
    return;
  }
  try{
    await navigator.clipboard.writeText(campaign.upiId);
    document.querySelector("#paymentStatus").textContent="Copied: "+campaign.upiId;
  }catch{
    document.querySelector("#paymentStatus").textContent=campaign.upiId;
  }
});

document.querySelector("#labelToggle").addEventListener("click",event=>{
  const hidden=document.querySelector("#lidMap").classList.toggle("hide");
  event.currentTarget.textContent=hidden?"Show labels":"Hide labels";
  event.currentTarget.setAttribute("aria-pressed",hidden?"false":"true");
});

function setupTilt(){
  const scene=document.querySelector("#scene");
  if(matchMedia("(hover:none)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;

  scene.addEventListener("pointermove",event=>{
    const r=scene.getBoundingClientRect();
    const x=clamp((event.clientX-r.left)/r.width,0,1);
    const y=clamp((event.clientY-r.top)/r.height,0,1);
    document.documentElement.style.setProperty("--ry",(5+(x-.5)*8).toFixed(2)+"deg");
    document.documentElement.style.setProperty("--rx",(-2-(y-.5)*5).toFixed(2)+"deg");
  });

  scene.addEventListener("pointerleave",()=>{
    document.documentElement.style.setProperty("--rx","-2deg");
    document.documentElement.style.setProperty("--ry","5deg");
  });
}

function setupScroll(){
  const progress=document.querySelector("#pageProgress");
  const links=[...document.querySelectorAll(".nav-links a")];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);

  let ticking=false;
  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max?scrollY/max*100:0)+"%";

    const probe=scrollY+Math.min(innerHeight*.35,280);
    let active="";
    sections.forEach(section=>{if(section.offsetTop<=probe)active=section.id});
    links.forEach(link=>link.classList.toggle("active",link.getAttribute("href")==="#"+active));
    ticking=false;
  };

  addEventListener("scroll",()=>{
    if(!ticking){requestAnimationFrame(update);ticking=true}
  },{passive:true});
  update();
}

renderMaps();
renderInventory();
renderParts();
selectPart(parts[0].id);
selectAmount(100);
updateCampaign();
setupTilt();
setupScroll();
setInterval(updateCampaign,60000);
