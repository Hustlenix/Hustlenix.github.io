const planningRate = 96;

const campaignConfig = {
  upiId: "YOUR_UPI_ID",
  upiName: "Sponsored Laptop",
  raised: 0,
  startDate: "2026-09-29T00:00:00+05:30",
  endDate: "2026-12-27T23:59:59+05:30"
};

const components = [
  {
    id:"ssd8", code:"01", title:"8TB primary SSD", detail:"SANDISK 850X PCIe 4.0 M.2 2280",
    usd:2269, featured:true, sold:false,
    description:"The largest single line item in the max-spec plan: Framework’s 8TB SANDISK 850X primary drive.",
    benefits:["Physical logo area proportional to this component’s share","Featured sponsor credit on the site","Milestone post when this component is funded","Included in the final Framework build/reveal"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"platform", code:"02", title:"Ryzen AI 9 HX 370 platform", detail:"Framework Laptop 16 DIY Edition",
    usd:1799, sold:false,
    description:"The Framework Laptop 16 DIY platform configured with the top Ryzen AI 9 HX 370 processor option.",
    benefits:["Large physical logo placement","Sponsor listing on the site","Platform-funding milestone credit","Final build/reveal inclusion"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"ram96", code:"03", title:"96GB DDR5-5600", detail:"2 × 48GB SODIMM",
    usd:1318, sold:false,
    description:"Framework’s maximum listed memory configuration: 96GB DDR5-5600 using two 48GB modules.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site","Memory milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"gpu5070", code:"04", title:"RTX 5070 12GB", detail:"Framework Laptop 16 Graphics Module",
    usd:1199, sold:false,
    description:"The top NVIDIA graphics module currently listed by Framework for Laptop 16: GeForce RTX 5070 with 12GB GDDR7.",
    benefits:["Large physical logo placement","Sponsor listing on the site","Graphics milestone credit","Final build/reveal inclusion"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"ssd2", code:"05", title:"2TB secondary SSD", detail:"SANDISK SN770M M.2 2230",
    usd:495, sold:false,
    description:"The maximum listed secondary-drive option, bringing the storage plan to 10TB total.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site","Storage milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"windows", code:"06", title:"Windows 11 Pro", detail:"Download license",
    usd:199, sold:false,
    description:"Framework’s listed Windows 11 Pro download option for the completed build.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"warranty", code:"07", title:"3-year warranty", detail:"Extended warranty",
    usd:189, sold:false,
    description:"The listed three-year extended warranty option for the Framework configuration.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"expansion", code:"08", title:"Expansion card set", detail:"USB-A + HDMI + DisplayPort + Ethernet + MicroSD + SD",
    usd:134, sold:false,
    description:"A six-card practical I/O set using Framework’s listed expansion-card prices.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"power240", code:"09", title:"240W USB-C adapter", detail:"Framework 240W GaN power adapter",
    usd:109, sold:false,
    description:"Framework’s 240W USB-C power adapter, recommended for the best experience with a Graphics Module.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"haptic", code:"10", title:"Haptic touchpad", detail:"One-piece haptic touchpad upgrade",
    usd:70, sold:false,
    description:"The one-piece haptic touchpad upgrade in the Laptop 16 configurator.",
    benefits:["Physical logo area proportional to cost","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"bezel", code:"11", title:"Color bezel", detail:"Orange bezel upgrade",
    usd:20, sold:false,
    description:"A colored bezel upgrade used as the smallest sponsor zone in the proportional map.",
    benefits:["Small physical logo placement","Sponsor listing on the site"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  }
];

const totalUsd = components.reduce((sum,item)=>sum + item.usd,0);
const targetInr = totalUsd * planningRate;
campaignConfig.target = targetInr;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

const usd = value => new Intl.NumberFormat("en-US",{
  style:"currency",currency:"USD",maximumFractionDigits:0
}).format(value);

const inr = value => new Intl.NumberFormat("en-IN",{
  style:"currency",currency:"INR",maximumFractionDigits:0
}).format(value);

const lakh = value => "₹" + (value/100000).toFixed(2) + "L";

components.forEach(item=>{
  item.share = item.usd / totalUsd;
  item.inr = item.usd * planningRate;
});

function splitClosest(items){
  if(items.length <= 1) return [items,[]];

  const sum = items.reduce((s,i)=>s+i.usd,0);
  const half = sum/2;
  let running = 0;
  let bestIndex = 1;
  let bestDiff = Infinity;

  for(let i=1;i<items.length;i++){
    running += items[i-1].usd;
    const diff = Math.abs(half-running);
    if(diff < bestDiff){
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return [items.slice(0,bestIndex),items.slice(bestIndex)];
}

function makeTreemap(items,x=0,y=0,w=100,h=100){
  if(items.length === 1){
    return [{item:items[0],x,y,w,h}];
  }

  const total = items.reduce((s,i)=>s+i.usd,0);
  const [a,b] = splitClosest(items);
  const aTotal = a.reduce((s,i)=>s+i.usd,0);
  const ratio = aTotal/total;

  if(w >= h){
    const wA = w*ratio;
    return [
      ...makeTreemap(a,x,y,wA,h),
      ...makeTreemap(b,x+wA,y,w-wA,h)
    ];
  }

  const hA = h*ratio;
  return [
    ...makeTreemap(a,x,y,w,hA),
    ...makeTreemap(b,x,y+hA,w,h-hA)
  ];
}

function renderMap(){
  const map = document.querySelector("#lidSponsorMap");
  const sorted = [...components].sort((a,b)=>b.usd-a.usd);
  const rects = makeTreemap(sorted);

  map.innerHTML = rects.map(({item,x,y,w,h})=>{
    const pct = item.share*100;
    const classes = [
      "sponsor-zone",
      item.featured ? "major" : "",
      pct < 3 ? "compact" : "",
      pct < 1.2 ? "tiny" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        class="${classes}"
        data-slot="${item.id}"
        aria-label="${item.title}: ${usd(item.usd)}, ${pct.toFixed(1)} percent of sponsor surface"
        style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"
      >
        <span class="zone-copy">
          <span class="zone-code">${item.code}</span>
          <b class="zone-name">${item.title}</b>
          <span class="zone-meta">
            <span>${usd(item.usd)}</span>
            <span>${pct.toFixed(1)}%</span>
          </span>
        </span>
      </button>
    `;
  }).join("");

  document.querySelectorAll(".sponsor-zone").forEach(zone=>{
    zone.addEventListener("click",()=>openSponsor(zone.dataset.slot));
    zone.addEventListener("mouseenter",()=>setLinkedState(zone.dataset.slot,true));
    zone.addEventListener("mouseleave",()=>setLinkedState(zone.dataset.slot,false));
    zone.addEventListener("focus",()=>setLinkedState(zone.dataset.slot,true));
    zone.addEventListener("blur",()=>setLinkedState(zone.dataset.slot,false));
  });
}

function renderComponents(){
  const stack = document.querySelector("#componentStack");

  stack.innerHTML = components.map(item=>`
    <article class="component-row" data-component-row="${item.id}">
      <span class="component-code">${item.code}</span>
      <div class="component-name">
        <b>${item.title}</b>
        <small>${item.detail}</small>
      </div>
      <span class="component-cost">${usd(item.usd)}</span>
      <span class="component-share">${(item.share*100).toFixed(1)}%</span>
    </article>
  `).join("");

  document.querySelectorAll("[data-component-row]").forEach(row=>{
    row.addEventListener("mouseenter",()=>setLinkedState(row.dataset.componentRow,true));
    row.addEventListener("mouseleave",()=>setLinkedState(row.dataset.componentRow,false));
  });
}

function renderSponsors(){
  const grid = document.querySelector("#sponsorGrid");

  grid.innerHTML = components.map(item=>`
    <article class="inventory-row ${item.featured?"featured":""} ${item.sold?"sold":""}" data-slot-row="${item.id}">
      <div class="inventory-place">
        <span class="inventory-code">${item.code}</span>
        <div>
          <b>${item.title}</b>
          <small>${item.detail}</small>
        </div>
      </div>
      <div class="inventory-share">${(item.share*100).toFixed(1)}% of lid</div>
      <div class="inventory-price">${usd(item.usd)} · ${inr(item.inr)}</div>
      ${item.sold
        ? '<span class="inventory-status">SOLD</span>'
        : `<button class="inventory-action sponsor-open" data-id="${item.id}">Details ↗</button>`
      }
    </article>
  `).join("");

  const sold = components.filter(item=>item.sold).length;
  document.querySelector("#spotsSold").textContent = sold;
  document.querySelector("#spotsTotal").textContent = components.length;
  document.querySelector("#spotsAvailable").textContent = components.length-sold;

  document.querySelectorAll(".sponsor-open").forEach(button=>{
    button.addEventListener("click",()=>openSponsor(button.dataset.id));
  });

  document.querySelectorAll("[data-slot-row]").forEach(row=>{
    row.addEventListener("mouseenter",()=>setLinkedState(row.dataset.slotRow,true));
    row.addEventListener("mouseleave",()=>setLinkedState(row.dataset.slotRow,false));
  });
}

function setLinkedState(id,on){
  document.querySelector(`[data-slot="${id}"]`)?.classList.toggle("is-linked",on);
  document.querySelector(`[data-slot-row="${id}"]`)?.classList.toggle("is-linked",on);
  document.querySelector(`[data-component-row="${id}"]`)?.classList.toggle("is-linked",on);
}

const dialog = document.querySelector("#sponsorDialog");

function openSponsor(id){
  const item = components.find(component=>component.id===id);
  if(!item || item.sold) return;

  dialog.dataset.slot = id;
  document.querySelector("#dialogSlotCode").textContent = item.code;
  document.querySelector("#dialogTitle").textContent = item.title;
  document.querySelector("#dialogPrice").textContent = usd(item.usd);
  document.querySelector("#dialogInr").textContent = "≈ " + inr(item.inr);
  document.querySelector("#dialogShare").textContent = (item.share*100).toFixed(1) + "% of lid";
  document.querySelector("#dialogDescription").textContent = item.description;
  document.querySelector("#dialogBenefits").innerHTML = item.benefits.map(text=>`<li>${text}</li>`).join("");

  const configured = item.paymentLink && !item.paymentLink.includes("YOUR_");
  document.querySelector("#dialogStatus").textContent = configured
    ? "This opens the configured Razorpay sponsor checkout."
    : "Razorpay sponsor link is not live yet.";

  dialog.showModal();
}

document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});

document.querySelector("#dialogBuy").addEventListener("click",()=>{
  const item = components.find(component=>component.id===dialog.dataset.slot);
  if(item?.paymentLink && !item.paymentLink.includes("YOUR_")){
    window.open(item.paymentLink,"_blank","noopener");
  } else {
    document.querySelector("#dialogStatus").textContent = "This sponsor checkout has not been connected yet.";
  }
});

function animateNumber(element,toValue,formatter,duration=720){
  if(!element) return;
  if(reducedMotion){
    element.textContent = formatter(toValue);
    return;
  }

  const startValue = Number(element.dataset.value || 0);
  const start = performance.now();

  function tick(now){
    const p = clamp((now-start)/duration,0,1);
    const eased = 1-Math.pow(1-p,3);
    const current = startValue + (toValue-startValue)*eased;
    element.textContent = formatter(current);

    if(p<1){
      requestAnimationFrame(tick);
    } else {
      element.dataset.value = String(toValue);
      element.textContent = formatter(toValue);
    }
  }

  requestAnimationFrame(tick);
}

function updateCampaign(animate=false){
  const now = new Date();
  const start = new Date(campaignConfig.startDate);
  const end = new Date(campaignConfig.endDate);
  const day = clamp(Math.floor((now-start)/86400000)+1,1,90);
  const left = Math.max(0,Math.ceil((end-now)/86400000));
  const pct = clamp((campaignConfig.raised/campaignConfig.target)*100,0,100);

  if(animate){
    animateNumber(document.querySelector("#raisedAmount"),campaignConfig.raised,n=>inr(Math.round(n)));
    animateNumber(document.querySelector("#percentFunded"),pct,n=>n.toFixed(n>=10?0:1)+"%");
  } else {
    document.querySelector("#raisedAmount").textContent = inr(campaignConfig.raised);
    document.querySelector("#percentFunded").textContent = pct.toFixed(pct>=10?0:1)+"%";
  }

  document.querySelector("#targetAmount").textContent = inr(campaignConfig.target);
  document.querySelector("#progressFill").style.width = pct+"%";
  document.querySelector("#heroDay").textContent = day;
  document.querySelector("#footerDay").textContent = day;
  document.querySelector("#daysLeft").textContent = left+" day"+(left===1?"":"s");

  document.querySelector("#heroComponentCount").textContent = components.length;
  document.querySelector("#heroTotalUsd").textContent = usd(totalUsd);
  document.querySelector("#heroTargetInr").textContent = lakh(targetInr);
  document.querySelector("#targetUsd").textContent = usd(totalUsd);
  document.querySelector("#targetInr").textContent = "≈ "+inr(targetInr);
}

let selectedAmount = 100;

function setAmount(amount){
  selectedAmount = Number(amount);
  document.querySelector("#selectedAmount").textContent = inr(selectedAmount);

  document.querySelectorAll("#quickAmounts button").forEach(button=>{
    const active = Number(button.dataset.amount)===selectedAmount;
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",active?"true":"false");
  });
}

document.querySelectorAll("#quickAmounts button").forEach(button=>{
  button.addEventListener("click",()=>setAmount(button.dataset.amount));
});

function upiConfigured(){
  return campaignConfig.upiId && !campaignConfig.upiId.includes("YOUR_");
}

function makeUpiLink(){
  const params = new URLSearchParams({
    pa:campaignConfig.upiId,
    pn:campaignConfig.upiName,
    am:String(selectedAmount),
    cu:"INR",
    tn:"Sponsored Laptop Framework 16 project"
  });
  return "upi://pay?"+params.toString();
}

function paymentStatus(text){
  document.querySelector("#paymentStatus").textContent = text;
}

document.querySelector("#payUpiBtn").addEventListener("click",()=>{
  if(!upiConfigured()){
    paymentStatus("The campaign UPI account has not been connected yet.");
    return;
  }
  window.location.href = makeUpiLink();
});

document.querySelector("#copyUpiBtn").addEventListener("click",async()=>{
  if(!upiConfigured()){
    paymentStatus("The campaign UPI account has not been connected yet.");
    return;
  }

  try{
    await navigator.clipboard.writeText(campaignConfig.upiId);
    paymentStatus("Copied: "+campaignConfig.upiId);
  } catch {
    paymentStatus(campaignConfig.upiId);
  }
});

function setupIdeaPadReaction(){
  const scene = document.querySelector("#ideapadScene");
  if(!scene || reducedMotion || window.matchMedia("(hover:none)").matches) return;

  scene.addEventListener("pointermove",event=>{
    const rect = scene.getBoundingClientRect();
    const x = clamp((event.clientX-rect.left)/rect.width,0,1);
    const y = clamp((event.clientY-rect.top)/rect.height,0,1);

    document.documentElement.style.setProperty("--ry",((x-.5)*10).toFixed(2)+"deg");
    document.documentElement.style.setProperty("--rx",(4-(y-.5)*7).toFixed(2)+"deg");
    document.documentElement.style.setProperty("--mx",((x-.5)*6).toFixed(1)+"px");
    document.documentElement.style.setProperty("--my",((y-.5)*5).toFixed(1)+"px");
  });

  scene.addEventListener("pointerleave",()=>{
    document.documentElement.style.setProperty("--rx","4deg");
    document.documentElement.style.setProperty("--ry","-4deg");
    document.documentElement.style.setProperty("--mx","0px");
    document.documentElement.style.setProperty("--my","0px");
  });
}

document.querySelector("#mapToggle").addEventListener("click",event=>{
  const map = document.querySelector("#lidSponsorMap");
  const hidden = map.classList.toggle("labels-hidden");
  event.currentTarget.textContent = hidden ? "Show labels" : "Hide labels";
  event.currentTarget.setAttribute("aria-pressed",hidden?"false":"true");
});

function setupReveal(){
  const targets = [
    ...document.querySelectorAll(".section-head"),
    ...document.querySelectorAll(".component-row"),
    ...document.querySelectorAll(".target-card"),
    ...document.querySelectorAll(".formula > div"),
    ...document.querySelectorAll(".inventory-row"),
    ...document.querySelectorAll(".support-copy"),
    ...document.querySelectorAll(".payment-panel"),
    ...document.querySelectorAll(".log article"),
    ...document.querySelectorAll(".trust-list details"),
    ...document.querySelectorAll(".final > *")
  ];

  targets.forEach((element,index)=>{
    element.classList.add("js-reveal");
    element.style.setProperty("--delay",Math.min((index%5)*38,150)+"ms");
  });

  if(reducedMotion){
    targets.forEach(element=>element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.1,rootMargin:"0px 0px -6% 0px"});

  targets.forEach(element=>observer.observe(element));
}

function setupScrollState(){
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = navLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);

  let ticking = false;

  function update(){
    const max = document.documentElement.scrollHeight-window.innerHeight;
    const progress = max>0 ? (window.scrollY/max)*100 : 0;
    document.documentElement.style.setProperty("--page-progress",progress+"%");

    const probe = window.scrollY+Math.min(300,window.innerHeight*.35);
    let active = "";

    sections.forEach(section=>{
      if(section.offsetTop<=probe) active=section.id;
    });

    navLinks.forEach(link=>{
      link.classList.toggle("is-active",link.getAttribute("href")==="#"+active);
    });

    ticking=false;
  }

  window.addEventListener("scroll",()=>{
    if(!ticking){
      requestAnimationFrame(update);
      ticking=true;
    }
  },{passive:true});

  update();
}

function setupAccordion(){
  const details = [...document.querySelectorAll(".trust-list details")];
  details.forEach(item=>{
    item.addEventListener("toggle",()=>{
      if(!item.open) return;
      details.forEach(other=>{if(other!==item)other.open=false});
    });
  });
}

renderMap();
renderComponents();
renderSponsors();
setAmount(100);
updateCampaign(false);
setupIdeaPadReaction();
setupReveal();
setupScrollState();
setupAccordion();
requestAnimationFrame(()=>updateCampaign(true));
setInterval(()=>updateCampaign(false),60000);
