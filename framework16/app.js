const campaignConfig = {
  // EDIT THESE FOUR VALUES TO ACTIVATE LIVE PAYMENTS + PROGRESS.
  upiId: "YOUR_UPI_ID",
  upiName: "Framework 16 Experiment",
  razorpayDefault: "YOUR_RAZORPAY_PAYMENT_LINK",
  raised: 0,

  target: 300000,
  startDate: "2026-09-29T00:00:00+05:30",
  endDate: "2026-12-27T23:59:59+05:30"
};

const sponsorSlots = [
  {
    id:"founding", title:"Founding / Center Sponsor", price:74999, featured:true, sold:false,
    description:"The highest-visibility physical placement: the large center of the laptop lid.",
    benefits:["Largest logo placement on the laptop lid","Featured sponsor credit on the campaign page","Included in the final build/reveal video","Sponsor credit when the funded build milestone is reached"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"graphics", title:"Graphics Sponsor", price:39999, sold:false,
    description:"A large lower-right placement tied to the graphics portion of the build.",
    benefits:["Large physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"memory", title:"Memory Sponsor", price:24999, sold:false,
    description:"Premium top-right placement associated with the memory upgrade.",
    benefits:["Top-right physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"storage", title:"Storage Sponsor", price:19999, sold:false,
    description:"Lower-left placement associated with storage.",
    benefits:["Lower-left physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"power", title:"Power Sponsor", price:14999, sold:false,
    description:"Top-left placement associated with the charger and power setup.",
    benefits:["Top-left physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-1", title:"Expansion Sponsor A", price:7999, sold:false,
    description:"Smaller placement for a brand that wants to be part of the experiment.",
    benefits:["Small physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-2", title:"Expansion Sponsor B", price:7999, sold:false,
    description:"Smaller placement for a brand that wants to be part of the experiment.",
    benefits:["Small physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-1", title:"Corner Sponsor A", price:4999, sold:false,
    description:"Compact corner placement on the final design.",
    benefits:["Compact physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-2", title:"Corner Sponsor B", price:4999, sold:false,
    description:"Compact corner placement on the final design.",
    benefits:["Compact physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"supporter", title:"Build Supporter", price:1499, sold:false,
    description:"Entry sponsor tier for small brands and indie projects.",
    benefits:["Name/logo on supporter wall","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  }
];

const money = value => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(value);
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

function updateCampaign(){
  const start = new Date(campaignConfig.startDate);
  const end = new Date(campaignConfig.endDate);
  const now = new Date();
  const totalDays = 90;
  const day = clamp(Math.floor((now-start)/86400000)+1,1,totalDays);
  const left = Math.max(0,Math.ceil((end-now)/86400000));
  const pct = clamp((campaignConfig.raised/campaignConfig.target)*100,0,100);

  document.querySelector("#raisedAmount").textContent = money(campaignConfig.raised);
  document.querySelector("#targetAmount").textContent = money(campaignConfig.target);
  document.querySelector("#percentFunded").textContent = pct.toFixed(pct >= 10 ? 0 : 1)+"%";
  document.querySelector("#progressFill").style.width = pct+"%";
  document.querySelector("#dayNumber").textContent = day;
  document.querySelector("#footerDay").textContent = day;
  document.querySelector("#daysLeft").textContent = left+" day"+(left===1?"":"s");
}

function renderSponsors(){
  const grid = document.querySelector("#sponsorGrid");
  grid.innerHTML = sponsorSlots.map((slot,i)=>`
    <article class="sponsor-card ${slot.featured?"featured":""} ${slot.sold?"sold":""}">
      <span class="tag">${slot.sold?"SOLD":"SLOT "+String(i+1).padStart(2,"0")}</span>
      <h3>${slot.title}</h3>
      <div class="price">${money(slot.price)}</div>
      <p>${slot.description}</p>
      <button class="btn ${slot.featured?"btn-primary":"btn-outline"} sponsor-open" data-id="${slot.id}" ${slot.sold?"disabled":""}>
        ${slot.sold?"Sold":"View sponsor package"} <span>→</span>
      </button>
    </article>
  `).join("");

  const sold = sponsorSlots.filter(s=>s.sold).length;
  document.querySelector("#spotsSold").textContent = sold;
  document.querySelector("#spotsAvailable").textContent = sponsorSlots.length-sold;

  document.querySelectorAll(".sponsor-open").forEach(btn=>btn.addEventListener("click",()=>openSponsor(btn.dataset.id)));
}

const dialog = document.querySelector("#sponsorDialog");
function openSponsor(id){
  const slot = sponsorSlots.find(s=>s.id===id);
  if(!slot || slot.sold) return;
  dialog.dataset.slot = id;
  document.querySelector("#dialogTitle").textContent = slot.title;
  document.querySelector("#dialogPrice").textContent = money(slot.price);
  document.querySelector("#dialogDescription").textContent = slot.description;
  document.querySelector("#dialogBenefits").innerHTML = slot.benefits.map(x=>`<li>${x}</li>`).join("");
  const configured = slot.paymentLink && !slot.paymentLink.includes("YOUR_");
  document.querySelector("#dialogStatus").textContent = configured
    ? "You’ll be redirected to the configured Razorpay payment page."
    : "Razorpay link not configured yet. Add this slot's Payment Link in app.js.";
  dialog.showModal();
}

document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
document.querySelector("#dialogBuy").addEventListener("click",()=>{
  const slot = sponsorSlots.find(s=>s.id===dialog.dataset.slot);
  if(slot?.paymentLink && !slot.paymentLink.includes("YOUR_")){
    window.open(slot.paymentLink,"_blank","noopener");
  }else{
    document.querySelector("#dialogStatus").textContent = "Payment link is not live yet.";
  }
});

document.querySelectorAll(".slot").forEach(btn=>btn.addEventListener("click",()=>openSponsor(btn.dataset.slot)));

let selectedAmount = 100;
function setAmount(amount){
  selectedAmount = Number(amount);
  document.querySelector("#selectedAmount").textContent = money(selectedAmount);
  document.querySelectorAll("#quickAmounts button").forEach(b=>b.classList.toggle("active",Number(b.dataset.amount)===selectedAmount));
}
document.querySelectorAll("#quickAmounts button").forEach(b=>b.addEventListener("click",()=>setAmount(b.dataset.amount)));
setAmount(100);

function upiConfigured(){return campaignConfig.upiId && !campaignConfig.upiId.includes("YOUR_")}
function makeUpiLink(){
  const params = new URLSearchParams({pa:campaignConfig.upiId,pn:campaignConfig.upiName,am:String(selectedAmount),cu:"INR",tn:"Framework 16 experiment support"});
  return "upi://pay?"+params.toString();
}
document.querySelector("#payUpiBtn").addEventListener("click",()=>{
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "UPI is not live yet. The campaign UPI ID still needs to be added.";
    return;
  }
  window.location.href = makeUpiLink();
});
document.querySelector("#copyUpiBtn").addEventListener("click",async()=>{
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "UPI ID has not been configured yet.";
    return;
  }
  await navigator.clipboard.writeText(campaignConfig.upiId);
  document.querySelector("#paymentStatus").textContent = "UPI ID copied: "+campaignConfig.upiId;
});

updateCampaign();
renderSponsors();
setInterval(updateCampaign,60000);
