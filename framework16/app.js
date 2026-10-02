const GUMROAD_URL="https://hustlenix.gumroad.com/coffee";
const RATE=96;

const campaign={
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
].map(part=>({
  ...part,
  inr:part.usd*RATE,
  sold:false,
  paymentUrl:GUMROAD_URL
}));

const episodes=[
  {day:"01",title:"The idea",text:"Turn the rear lid of my current Lenovo into finite sponsor inventory for a Framework 16."},
  {day:"02",title:"The sponsor map",text:"Component prices became proportional physical rectangles instead of arbitrary ad tiers."},
  {day:"04",title:"The campaign site",text:"The website was rebuilt around two actions only: watch the experiment or pay through Gumroad."}
];

const total=parts.reduce((sum,part)=>sum+part.inr,0);
campaign.target=total;
parts.forEach(part=>part.share=part.inr/total);

const money=value=>new Intl.NumberFormat("en-IN",{
  style:"currency",
  currency:"INR",
  maximumFractionDigits:0
}).format(value);

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function splitClosest(items){
  if(items.length<=1)return[items,[]];

  const sum=items.reduce((total,item)=>total+item.inr,0);
  const half=sum/2;
  let running=0;
  let bestIndex=1;
  let bestDifference=Infinity;

  for(let i=1;i<items.length;i++){
    running+=items[i-1].inr;
    const difference=Math.abs(half-running);
    if(difference<bestDifference){
      bestDifference=difference;
      bestIndex=i;
    }
  }

  return[items.slice(0,bestIndex),items.slice(bestIndex)];
}

function makeTreemap(items,x=0,y=0,w=100,h=100){
  if(items.length===1)return[{part:items[0],x,y,w,h}];

  const sum=items.reduce((total,item)=>total+item.inr,0);
  const [a,b]=splitClosest(items);
  const ratio=a.reduce((total,item)=>total+item.inr,0)/sum;

  if(w>=h){
    const firstWidth=w*ratio;
    return[
      ...makeTreemap(a,x,y,firstWidth,h),
      ...makeTreemap(b,x+firstWidth,y,w-firstWidth,h)
    ];
  }

  const firstHeight=h*ratio;
  return[
    ...makeTreemap(a,x,y,w,firstHeight),
    ...makeTreemap(b,x,y+firstHeight,w,h-firstHeight)
  ];
}

const rects=makeTreemap([...parts].sort((a,b)=>b.inr-a.inr));
let selectedId=parts[0].id;

function heroMapMarkup(){
  return rects.map(({part,x,y,w,h})=>`
    <div class="mini-zone ${part.featured?"major":""}"
      style="left:${x}%;top:${y}%;width:${w}%;height:${h}%">
    </div>
  `).join("");
}

function sponsorMapMarkup(){
  return rects.map(({part,x,y,w,h})=>{
    const share=part.share*100;
    return `
      <button
        class="zone ${part.featured?"major":""} ${share<1.5?"tiny":""}"
        data-zone="${part.id}"
        style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"
        aria-label="${part.name}, ${money(part.inr)}, ${share.toFixed(1)} percent of rear lid">
        <span class="zone-copy">
          <span class="zone-code">${part.code}</span>
          <b class="zone-name">${part.name}</b>
          <span class="zone-meta">
            <span>${money(part.inr)}</span>
            <span>${share.toFixed(1)}%</span>
          </span>
        </span>
      </button>
    `;
  }).join("");
}

function renderMaps(){
  document.querySelector("#heroZoneMap").innerHTML=heroMapMarkup();
  document.querySelector("#sponsorMap").innerHTML=sponsorMapMarkup();

  document.querySelectorAll("[data-zone]").forEach(zone=>{
    zone.addEventListener("click",()=>selectZone(zone.dataset.zone,true));
    zone.addEventListener("mouseenter",()=>linkZone(zone.dataset.zone,true));
    zone.addEventListener("mouseleave",()=>linkZone(zone.dataset.zone,false));
    zone.addEventListener("focus",()=>linkZone(zone.dataset.zone,true));
    zone.addEventListener("blur",()=>linkZone(zone.dataset.zone,false));
  });
}

function renderZoneList(){
  document.querySelector("#zoneList").innerHTML=parts.map(part=>`
    <article class="zone-row" data-row="${part.id}">
      <span class="row-code">${part.code}</span>
      <div class="row-name">
        <b>${part.name}</b>
        <small>${part.detail}</small>
      </div>
      <span class="row-share">${(part.share*100).toFixed(1)}% of lid</span>
      <span class="row-price">${money(part.inr)}</span>
      <button type="button" data-select="${part.id}">Select</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-row]").forEach(row=>{
    row.addEventListener("mouseenter",()=>linkZone(row.dataset.row,true));
    row.addEventListener("mouseleave",()=>linkZone(row.dataset.row,false));
  });

  document.querySelectorAll("[data-select]").forEach(button=>{
    button.addEventListener("click",()=>{
      selectZone(button.dataset.select,true);
      document.querySelector("#lid").scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}

function renderParts(){
  document.querySelector("#partsList").innerHTML=parts.map(part=>`
    <article class="part-row">
      <span>${part.code}</span>
      <b>${part.name}</b>
      <span class="cost">${money(part.inr)}</span>
      <span class="share">${(part.share*100).toFixed(1)}%</span>
    </article>
  `).join("");
}

function renderEpisodes(){
  document.querySelector("#episodeList").innerHTML=episodes.map(episode=>`
    <article class="episode-card">
      <span>DAY ${episode.day}</span>
      <h4>${episode.title}</h4>
      <p>${episode.text}</p>
    </article>
  `).join("");
}

function linkZone(id,on){
  document.querySelector(`[data-zone="${id}"]`)?.classList.toggle("linked",on);
  document.querySelector(`[data-row="${id}"]`)?.classList.toggle("linked",on);
}

function selectZone(id,animate=false){
  const part=parts.find(item=>item.id===id);
  if(!part)return;

  selectedId=id;

  document.querySelectorAll("[data-zone]").forEach(element=>{
    element.classList.toggle("selected",element.dataset.zone===id);
  });
  document.querySelectorAll("[data-row]").forEach(element=>{
    element.classList.toggle("selected",element.dataset.row===id);
  });

  document.querySelector("#zoneCode").textContent=part.code;
  document.querySelector("#zoneName").textContent=part.name;
  document.querySelector("#zoneDetail").textContent=part.detail;
  document.querySelector("#zonePrice").textContent=money(part.inr);
  document.querySelector("#zoneShare").textContent=(part.share*100).toFixed(1)+"%";
  document.querySelector("#zoneDescription").textContent=
    `Fund this component and ${(part.share*100).toFixed(1)}% becomes the target size of your printed sponsor mark on the back of my Lenovo.`;
  document.querySelector("#zonePay").href=GUMROAD_URL;

  if(animate&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.querySelector("#zonePanel").animate(
      [{opacity:.72,transform:"translateY(5px)"},{opacity:1,transform:"none"}],
      {duration:180,easing:"ease-out"}
    );
  }
}

function updateCampaign(){
  const now=new Date();
  const start=new Date(campaign.start);
  const end=new Date(campaign.end);

  const day=clamp(Math.floor((now-start)/86400000)+1,1,90);
  const daysLeft=Math.max(0,Math.ceil((end-now)/86400000));
  const percent=clamp(campaign.raised/campaign.target*100,0,100);
  const sold=parts.filter(part=>part.sold).length;

  ["#heroDay","#watchDay","#watchDayStat","#footerDay"].forEach(selector=>{
    document.querySelector(selector).textContent=day;
  });

  document.querySelector("#raisedAmount").textContent=money(campaign.raised);
  document.querySelector("#targetAmount").textContent=money(campaign.target);
  document.querySelector("#fundingFill").style.width=percent+"%";
  document.querySelector("#fundedPercent").textContent=percent.toFixed(percent>=10?0:1)+"% funded";
  document.querySelector("#daysLeft").textContent=daysLeft;

  document.querySelector("#watchPercent").textContent=percent.toFixed(percent>=10?0:1)+"%";
  document.querySelector("#watchRaised").textContent=money(campaign.raised);
  document.querySelector("#watchFill").style.width=percent+"%";
  document.querySelector("#claimedZones").textContent=sold;
  document.querySelector("#availableZones").textContent=parts.length-sold;
}

function setupTilt(sceneSelector,laptopVarPrefix){
  const scene=document.querySelector(sceneSelector);
  if(!scene||matchMedia("(hover:none)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;

  scene.addEventListener("pointermove",event=>{
    const rect=scene.getBoundingClientRect();
    const x=clamp((event.clientX-rect.left)/rect.width,0,1);
    const y=clamp((event.clientY-rect.top)/rect.height,0,1);

    document.documentElement.style.setProperty(`--${laptopVarPrefix}-ry`,(5+(x-.5)*8).toFixed(2)+"deg");
    document.documentElement.style.setProperty(`--${laptopVarPrefix}-rx`,(-2-(y-.5)*5).toFixed(2)+"deg");
  });

  scene.addEventListener("pointerleave",()=>{
    document.documentElement.style.setProperty(`--${laptopVarPrefix}-rx`,"-2deg");
    document.documentElement.style.setProperty(`--${laptopVarPrefix}-ry`,"5deg");
  });
}

document.querySelector("#labelToggle").addEventListener("click",event=>{
  const hidden=document.querySelector("#sponsorMap").classList.toggle("hide");
  event.currentTarget.textContent=hidden?"Show labels":"Hide labels";
  event.currentTarget.setAttribute("aria-pressed",hidden?"false":"true");
});

document.querySelector("#shareButton").addEventListener("click",async()=>{
  const shareData={
    title:"Sponsored Laptop",
    text:"I'm trying to fund a Framework 16 by selling proportional ad space on the back of my Lenovo.",
    url:location.href.split("#")[0]
  };

  try{
    if(navigator.share){
      await navigator.share(shareData);
      document.querySelector("#shareStatus").textContent="Shared.";
    }else{
      await navigator.clipboard.writeText(shareData.url);
      document.querySelector("#shareStatus").textContent="Link copied.";
    }
  }catch{
    document.querySelector("#shareStatus").textContent="";
  }
});

function setupScroll(){
  const progress=document.querySelector("#scrollProgress");
  const links=[...document.querySelectorAll(".nav-links a")];
  const sections=links.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
  let ticking=false;

  const update=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max?scrollY/max*100:0)+"%";

    const probe=scrollY+Math.min(innerHeight*.35,280);
    let active="";

    sections.forEach(section=>{
      if(section.offsetTop<=probe)active=section.id;
    });

    links.forEach(link=>{
      link.classList.toggle("active",link.getAttribute("href")==="#"+active);
    });

    ticking=false;
  };

  addEventListener("scroll",()=>{
    if(!ticking){
      requestAnimationFrame(update);
      ticking=true;
    }
  },{passive:true});

  update();
}

renderMaps();
renderZoneList();
renderParts();
renderEpisodes();
selectZone(parts[0].id);
updateCampaign();
setupTilt("#heroScene","hero");
setupTilt("#lidScene","lid");
setupScroll();
setInterval(updateCampaign,60000);
