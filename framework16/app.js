const campaignConfig = {
  // Replace these placeholders only when the dedicated campaign payment rails are ready.
  upiId: "YOUR_UPI_ID",
  upiName: "Project F16",
  raised: 0,
  target: 300000,
  startDate: "2026-09-29T00:00:00+05:30",
  endDate: "2026-12-27T23:59:59+05:30"
};

const sponsorSlots = [
  {
    id:"founding",
    code:"01",
    title:"Founding / centre",
    funds:"Core laptop purchase",
    placement:"Largest centre placement",
    price:74999,
    featured:true,
    sold:false,
    description:"The primary physical placement on the laptop lid and the most visible sponsorship position in the project.",
    benefits:[
      "Largest logo placement on the finished laptop lid",
      "Featured sponsor credit on the campaign page",
      "Included in the final hardware build/reveal video",
      "Mention when the main laptop-purchase milestone is funded"
    ],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"graphics",
    code:"05",
    title:"Graphics",
    funds:"Graphics module",
    placement:"Lower-right placement",
    price:39999,
    sold:false,
    description:"A large lower-right placement associated with the graphics portion of the build.",
    benefits:[
      "Large physical logo placement",
      "Sponsor listing on the campaign page",
      "Campaign milestone credit"
    ],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"memory",
    code:"03",
    title:"Memory",
    funds:"DDR5 memory",
    placement:"Top-right placement",
    price:24999,
    sold:false,
    description:"A premium top-right placement associated with the memory configuration.",
    benefits:[
      "Top-right physical logo placement",
      "Sponsor listing on the campaign page",
      "Campaign milestone credit"
    ],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"storage",
    code:"04",
    title:"Storage",
    funds:"M.2 storage",
    placement:"Lower-left placement",
    price:19999,
    sold:false,
    description:"A lower-left placement associated with the storage configuration.",
    benefits:[
      "Lower-left physical logo placement",
      "Sponsor listing on the campaign page",
      "Campaign milestone credit"
    ],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"power",
    code:"02",
    title:"Power",
    funds:"Power adapter",
    placement:"Top-left placement",
    price:14999,
    sold:false,
    description:"A top-left placement associated with the power adapter and charging setup.",
    benefits:[
      "Top-left physical logo placement",
      "Sponsor listing on the campaign page",
      "Campaign milestone credit"
    ],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-1",
    code:"06",
    title:"Expansion A",
    funds:"Expansion cards",
    placement:"Lower sponsor rail",
    price:7999,
    sold:false,
    description:"A compact sponsor placement for an indie company, product or developer tool.",
    benefits:["Compact physical placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-2",
    code:"07",
    title:"Expansion B",
    funds:"Expansion cards",
    placement:"Lower sponsor rail",
    price:7999,
    sold:false,
    description:"A compact sponsor placement for an indie company, product or developer tool.",
    benefits:["Compact physical placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-1",
    code:"08",
    title:"Corner A",
    funds:"Build accessories",
    placement:"Compact lid mark",
    price:4999,
    sold:false,
    description:"A small sponsor mark in the final physical lid layout.",
    benefits:["Small physical logo placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-2",
    code:"09",
    title:"Corner B",
    funds:"Build accessories",
    placement:"Compact lid mark",
    price:4999,
    sold:false,
    description:"A small sponsor mark in the final physical lid layout.",
    benefits:["Small physical logo placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"supporter",
    code:"10",
    title:"Build supporter",
    funds:"Remaining build cost",
    placement:"Supporter strip",
    price:1499,
    sold:false,
    description:"Entry sponsor placement for a small business or indie project.",
    benefits:["Name/logo on the supporter strip","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  }
];

const money = value => new Intl.NumberFormat("en-IN", {
  style:"currency",
  currency:"INR",
  maximumFractionDigits:0
}).format(value);

const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

function updateCampaign(){
  const start = new Date(campaignConfig.startDate);
  const end = new Date(campaignConfig.endDate);
  const now = new Date();

  const day = clamp(Math.floor((now - start) / 86400000) + 1, 1, 90);
  const left = Math.max(0, Math.ceil((end - now) / 86400000));
  const pct = clamp((campaignConfig.raised / campaignConfig.target) * 100, 0, 100);

  document.querySelector("#raisedAmount").textContent = money(campaignConfig.raised);
  document.querySelector("#targetAmount").textContent = money(campaignConfig.target);
  document.querySelector("#percentFunded").textContent = pct.toFixed(pct >= 10 ? 0 : 1) + "%";
  document.querySelector("#progressFill").style.width = pct + "%";
  document.querySelector("#heroDay").textContent = day;
  document.querySelector("#dayNumber")?.remove();
  document.querySelector("#footerDay").textContent = day;
  document.querySelector("#daysLeft").textContent = left + " day" + (left === 1 ? "" : "s");
}

function renderSponsors(){
  const grid = document.querySelector("#sponsorGrid");

  grid.innerHTML = sponsorSlots.map(slot => `
    <article class="inventory-row ${slot.featured ? "featured" : ""} ${slot.sold ? "sold" : ""}">
      <div class="inventory-place">
        <span class="inventory-code">${slot.code}</span>
        <div>
          <b>${slot.title}</b>
          <small>${slot.placement}</small>
        </div>
      </div>
      <div class="inventory-funds">${slot.funds}</div>
      <div class="inventory-price">${money(slot.price)}</div>
      ${slot.sold
        ? '<span class="inventory-status">SOLD</span>'
        : `<button class="inventory-action sponsor-open" data-id="${slot.id}">Details ↗</button>`
      }
    </article>
  `).join("");

  const sold = sponsorSlots.filter(slot => slot.sold).length;
  document.querySelector("#spotsSold").textContent = sold;
  document.querySelector("#spotsAvailable").textContent = sponsorSlots.length - sold;

  document.querySelectorAll(".sponsor-open").forEach(button => {
    button.addEventListener("click", () => openSponsor(button.dataset.id));
  });
}

const dialog = document.querySelector("#sponsorDialog");

function openSponsor(id){
  const slot = sponsorSlots.find(item => item.id === id);
  if(!slot || slot.sold) return;

  dialog.dataset.slot = id;
  document.querySelector("#dialogSlotCode").textContent = slot.code;
  document.querySelector("#dialogTitle").textContent = slot.title;
  document.querySelector("#dialogPrice").textContent = money(slot.price);
  document.querySelector("#dialogDescription").textContent = slot.description;
  document.querySelector("#dialogBenefits").innerHTML = slot.benefits.map(item => `<li>${item}</li>`).join("");

  const configured = slot.paymentLink && !slot.paymentLink.includes("YOUR_");
  document.querySelector("#dialogStatus").textContent = configured
    ? "This opens the configured Razorpay sponsor checkout."
    : "Razorpay sponsor link is not live yet.";

  dialog.showModal();
}

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if(event.target === dialog) dialog.close();
});

document.querySelector("#dialogBuy").addEventListener("click", () => {
  const slot = sponsorSlots.find(item => item.id === dialog.dataset.slot);

  if(slot?.paymentLink && !slot.paymentLink.includes("YOUR_")){
    window.open(slot.paymentLink, "_blank", "noopener");
  } else {
    document.querySelector("#dialogStatus").textContent = "This sponsor checkout has not been connected yet.";
  }
});

document.querySelectorAll(".lid-slot").forEach(button => {
  button.addEventListener("click", () => openSponsor(button.dataset.slot));
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
    tn:"Project F16 support"
  });
  return "upi://pay?" + params.toString();
}

document.querySelector("#payUpiBtn").addEventListener("click", () => {
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "The dedicated campaign UPI account has not been connected yet.";
    return;
  }

  window.location.href = makeUpiLink();
});

document.querySelector("#copyUpiBtn").addEventListener("click", async () => {
  if(!upiConfigured()){
    document.querySelector("#paymentStatus").textContent = "The dedicated campaign UPI account has not been connected yet.";
    return;
  }

  try{
    await navigator.clipboard.writeText(campaignConfig.upiId);
    document.querySelector("#paymentStatus").textContent = "Copied: " + campaignConfig.upiId;
  } catch {
    document.querySelector("#paymentStatus").textContent = campaignConfig.upiId;
  }
});

setAmount(100);
updateCampaign();
renderSponsors();
setInterval(updateCampaign, 60000);
