const campaignConfig = {
  // Replace these placeholders before accepting payments.
  upiId: "YOUR_UPI_ID",
  upiName: "Framework 16 Experiment",
  raised: 0,
  target: 300000,
  startDate: "2026-09-29T00:00:00+05:30",
  endDate: "2026-12-27T23:59:59+05:30"
};

const sponsorSlots = [
  {
    id:"founding", title:"Founding / centre spot", price:74999, featured:true, sold:false,
    description:"The biggest and most visible placement: the middle of the laptop lid.",
    benefits:["Largest physical logo placement","Featured credit on this campaign page","Included in the final build/reveal video","Mention when the main laptop purchase is funded"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"graphics", title:"Graphics spot", price:39999, sold:false,
    description:"Large lower-right placement, tied to the graphics portion of the build.",
    benefits:["Large physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"memory", title:"Memory spot", price:24999, sold:false,
    description:"Top-right placement, tied to the memory upgrade.",
    benefits:["Top-right physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"storage", title:"Storage spot", price:19999, sold:false,
    description:"Lower-left placement, tied to storage.",
    benefits:["Lower-left physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"power", title:"Power spot", price:14999, sold:false,
    description:"Top-left placement, tied to the charger and power setup.",
    benefits:["Top-left physical logo placement","Sponsor listing on this page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-1", title:"Expansion spot A", price:7999, sold:false,
    description:"Small placement for an indie brand or product.",
    benefits:["Small physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-2", title:"Expansion spot B", price:7999, sold:false,
    description:"Small placement for an indie brand or product.",
    benefits:["Small physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-1", title:"Corner spot A", price:4999, sold:false,
    description:"Compact sponsor mark in the final lid layout.",
    benefits:["Compact physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-2", title:"Corner spot B", price:4999, sold:false,
    description:"Compact sponsor mark in the final lid layout.",
    benefits:["Compact physical logo placement","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"supporter", title:"Small-brand supporter", price:1499, sold:false,
    description:"Entry sponsor tier for small businesses and indie projects.",
    benefits:["Name/logo on supporter wall","Sponsor listing on this page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  }
];

const money = value => new Intl.NumberFormat("en-IN", {
  style:"currency", currency:"INR", maximumFractionDigits:0
}).format(value);

const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

function updateCampaign(){
  const start = new Date(campaignConfig.startDate);
  const end = new Date(campaignConfig.endDate);
  const now = new Date();
  const day = clamp(Math.floor((now-start)/86400000)+1,1,90);
  const left = Math.max(0,Math.ceil((end-now)/86400000));
  const pct = clamp((campaignConfig.raised/campaignConfig.target)*100,0,100);

  document.querySelector("#raisedAmount").textContent = money(campaignConfig.raised);
  document.querySelector("#targetAmount").textContent = money(campaignConfig.target);
  document.querySelector("#percentFunded").textContent = pct.toFixed(pct >= 10 ? 0 : 1) + "%";
  document.querySelector("#progressFill").style.width = pct + "%";
  document.querySelector("#dayNumber").textContent = day;
  document.querySelector("#headerDay").textContent = day;
  document.querySelector("#footerDay").textContent = day;
  document.querySelector("#daysLeft").textContent = left + " day" + (left === 1 ? "" : "s");
}

function renderSponsors(){
  const grid = document.querySelector("#sponsorGrid");

  grid.innerHTML = sponsorSlots.map((slot,i) => `
    <article class="sponsor-card ${slot.featured ? "featured" : ""} ${slot.sold ? "sold" : ""}">
      <span class="tag">${slot.sold ? "sold" : String(i+1).padStart(2,"0")}</span>
      <div class="card-main">
        <h3>${slot.title}</h3>
        <div class="price">${money(slot.price)}</div>
        <p>${slot.description}</p>
        <button class="button sponsor-open" data-id="${slot.id}" ${slot.sold ? "disabled" : ""}>
          ${slot.sold ? "Sold" : "See what’s included"}
        </button>
      </div>
    </article>
  `).join("");

  const sold = sponsorSlots.filter(s => s.sold).length;
  document.querySelector("#spotsSold").textContent = sold;
  document.querySelector("#spotsAvailable").textContent = sponsorSlots.length - sold;

  document.querySelectorAll(".sponsor-open").forEach(btn => {
    btn.addEventListener("click", () => openSponsor(btn.dataset.id));
  });
}

const dialog = document.querySelector("#sponsorDialog");

function openSponsor(id){
  const slot = sponsorSlots.find(s => s.id === id);
  if(!slot || slot.sold) return;

  dialog.dataset.slot = id;
  document.querySelector("#dialogTitle").textContent = slot.title;
  document.querySelector("#dialogPrice").textContent = money(slot.price);
  document.querySelector("#dialogDescription").textContent = slot.description;
  document.querySelector("#dialogBenefits").innerHTML = slot.benefits.map(x => `<li>${x}</li>`).join("");

  const configured = slot.paymentLink && !slot.paymentLink.includes("YOUR_");
  document.querySelector("#dialogStatus").textContent = configured
    ? "This opens the sponsor's Razorpay payment page."
    : "Razorpay link not configured yet.";

  dialog.showModal();
}

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if(e.target === dialog) dialog.close(); });

document.querySelector("#dialogBuy").addEventListener("click", () => {
  const slot = sponsorSlots.find(s => s.id === dialog.dataset.slot);
  if(slot?.paymentLink && !slot.paymentLink.includes("YOUR_")){
    window.open(slot.paymentLink,"_blank","noopener");
  } else {
    document.querySelector("#dialogStatus").textContent = "This sponsor payment link is not live yet.";
  }
});

document.querySelectorAll(".slot").forEach(btn => {
  btn.addEventListener("click", () => openSponsor(btn.dataset.slot));
});

let selectedAmount = 100;

function setAmount(amount){
  selectedAmount = Number(amount);
  document.querySelector("#selectedAmount").textContent = money(selectedAmount);
  document.querySelectorAll("#quickAmounts button").forEach(button => {
    button.classList.toggle("active", Number(button.dataset.amount) === selectedAmount);
  });
}

document.querySelectorAll("#quickAmounts button").forEach(button => {
  button.addEventListener("click", () => setAmount(button.dataset.amount));
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
    tn:"Framework 16 experiment support"
  });
  return "upi://pay?" + params.toString();
}

document.querySelector("#payUpiBtn").addEventListener("click", () => {
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "The campaign UPI ID has not been connected yet.";
    return;
  }
  window.location.href = makeUpiLink();
});

document.querySelector("#copyUpiBtn").addEventListener("click", async () => {
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "The campaign UPI ID has not been connected yet.";
    return;
  }
  await navigator.clipboard.writeText(campaignConfig.upiId);
  document.querySelector("#paymentStatus").textContent = "Copied: " + campaignConfig.upiId;
});

setAmount(100);
updateCampaign();
renderSponsors();
setInterval(updateCampaign,60000);
