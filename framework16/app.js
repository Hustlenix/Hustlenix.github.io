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
    id:"founding", code:"01", title:"Founding / centre", funds:"Core laptop purchase",
    placement:"Largest centre placement", price:74999, featured:true, sold:false,
    description:"The primary physical placement on the laptop lid and the most visible sponsorship position in the project.",
    benefits:["Largest logo placement on the finished laptop lid","Featured sponsor credit on the campaign page","Included in the final hardware build/reveal video","Mention when the main laptop-purchase milestone is funded"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"graphics", code:"05", title:"Graphics", funds:"Graphics module",
    placement:"Lower-right placement", price:39999, sold:false,
    description:"A large lower-right placement associated with the graphics portion of the build.",
    benefits:["Large physical logo placement","Sponsor listing on the campaign page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"memory", code:"03", title:"Memory", funds:"DDR5 memory",
    placement:"Top-right placement", price:24999, sold:false,
    description:"A premium top-right placement associated with the memory configuration.",
    benefits:["Top-right physical logo placement","Sponsor listing on the campaign page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"storage", code:"04", title:"Storage", funds:"M.2 storage",
    placement:"Lower-left placement", price:19999, sold:false,
    description:"A lower-left placement associated with the storage configuration.",
    benefits:["Lower-left physical logo placement","Sponsor listing on the campaign page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"power", code:"02", title:"Power", funds:"Power adapter",
    placement:"Top-left placement", price:14999, sold:false,
    description:"A top-left placement associated with the power adapter and charging setup.",
    benefits:["Top-left physical logo placement","Sponsor listing on the campaign page","Campaign milestone credit"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-1", code:"06", title:"Expansion A", funds:"Expansion cards",
    placement:"Lower sponsor rail", price:7999, sold:false,
    description:"A compact sponsor placement for an indie company, product or developer tool.",
    benefits:["Compact physical placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"io-2", code:"07", title:"Expansion B", funds:"Expansion cards",
    placement:"Lower sponsor rail", price:7999, sold:false,
    description:"A compact sponsor placement for an indie company, product or developer tool.",
    benefits:["Compact physical placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-1", code:"08", title:"Corner A", funds:"Build accessories",
    placement:"Compact lid mark", price:4999, sold:false,
    description:"A small sponsor mark in the final physical lid layout.",
    benefits:["Small physical logo placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"corner-2", code:"09", title:"Corner B", funds:"Build accessories",
    placement:"Compact lid mark", price:4999, sold:false,
    description:"A small sponsor mark in the final physical lid layout.",
    benefits:["Small physical logo placement","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  },
  {
    id:"supporter", code:"10", title:"Build supporter", funds:"Remaining build cost",
    placement:"Supporter strip", price:1499, sold:false,
    description:"Entry sponsor placement for a small business or indie project.",
    benefits:["Name/logo on the supporter strip","Sponsor listing on the campaign page"],
    paymentLink:"YOUR_RAZORPAY_PAYMENT_LINK"
  }
];

const money = value => new Intl.NumberFormat("en-IN", {
  style:"currency", currency:"INR", maximumFractionDigits:0
}).format(value);

const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateNumber(element, toValue, formatter, duration = 700){
  if(!element) return;

  if(reducedMotion){
    element.textContent = formatter(toValue);
    return;
  }

  const fromValue = Number(element.dataset.numericValue || 0);
  const start = performance.now();

  function tick(now){
    const p = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const current = fromValue + (toValue - fromValue) * eased;
    element.textContent = formatter(current);

    if(p < 1){
      requestAnimationFrame(tick);
    } else {
      element.dataset.numericValue = String(toValue);
      element.textContent = formatter(toValue);
    }
  }

  requestAnimationFrame(tick);
}

function updateCampaign(animate = false){
  const start = new Date(campaignConfig.startDate);
  const end = new Date(campaignConfig.endDate);
  const now = new Date();

  const day = clamp(Math.floor((now - start) / 86400000) + 1, 1, 90);
  const left = Math.max(0, Math.ceil((end - now) / 86400000));
  const pct = clamp((campaignConfig.raised / campaignConfig.target) * 100, 0, 100);

  const raised = document.querySelector("#raisedAmount");
  const percent = document.querySelector("#percentFunded");

  if(animate){
    animateNumber(raised, campaignConfig.raised, n => money(Math.round(n)));
    animateNumber(percent, pct, n => n.toFixed(n >= 10 ? 0 : 1) + "%");
  } else {
    raised.textContent = money(campaignConfig.raised);
    percent.textContent = pct.toFixed(pct >= 10 ? 0 : 1) + "%";
  }

  document.querySelector("#targetAmount").textContent = money(campaignConfig.target);
  requestAnimationFrame(() => {
    document.querySelector("#progressFill").style.width = pct + "%";
  });

  document.querySelector("#heroDay").textContent = day;
  document.querySelector("#footerDay").textContent = day;
  document.querySelector("#daysLeft").textContent = left + " day" + (left === 1 ? "" : "s");
}

function renderSponsors(){
  const grid = document.querySelector("#sponsorGrid");

  grid.innerHTML = sponsorSlots.map(slot => `
    <article class="inventory-row ${slot.featured ? "featured" : ""} ${slot.sold ? "sold" : ""}" data-slot-row="${slot.id}">
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

  bindCrossHighlighting();
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
document.addEventListener("keydown", event => {
  if(event.key === "Escape" && dialog.open) dialog.close();
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

function setLinkedState(id, on){
  document.querySelector(`[data-slot="${id}"]`)?.classList.toggle("is-linked", on);
  document.querySelector(`[data-slot-row="${id}"]`)?.classList.toggle("is-linked", on);
}

function bindCrossHighlighting(){
  document.querySelectorAll(".lid-slot").forEach(slot => {
    const id = slot.dataset.slot;
    slot.addEventListener("mouseenter", () => setLinkedState(id, true));
    slot.addEventListener("mouseleave", () => setLinkedState(id, false));
    slot.addEventListener("focus", () => setLinkedState(id, true));
    slot.addEventListener("blur", () => setLinkedState(id, false));
  });

  document.querySelectorAll("[data-slot-row]").forEach(row => {
    const id = row.dataset.slotRow;
    row.addEventListener("mouseenter", () => setLinkedState(id, true));
    row.addEventListener("mouseleave", () => setLinkedState(id, false));
  });
}

let selectedAmount = 100;

function setAmount(amount){
  selectedAmount = Number(amount);
  const selected = document.querySelector("#selectedAmount");

  selected.animate?.(
    [{transform:"translateY(0)",opacity:1},{transform:"translateY(-4px)",opacity:.35},{transform:"translateY(0)",opacity:1}],
    {duration:220,easing:"ease-out"}
  );

  selected.textContent = money(selectedAmount);

  document.querySelectorAll("#quickAmounts button").forEach(button => {
    button.classList.toggle("active", Number(button.dataset.amount) === selectedAmount);
    button.setAttribute("aria-pressed", Number(button.dataset.amount) === selectedAmount ? "true" : "false");
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

function flashStatus(message){
  const status = document.querySelector("#paymentStatus");
  status.textContent = message;
  status.animate?.([{opacity:.35},{opacity:1}],{duration:220});
}

document.querySelector("#payUpiBtn").addEventListener("click", () => {
  if(!upiConfigured()){
    flashStatus("The dedicated campaign UPI account has not been connected yet.");
    return;
  }
  window.location.href = makeUpiLink();
});

document.querySelector("#copyUpiBtn").addEventListener("click", async () => {
  if(!upiConfigured()){
    flashStatus("The dedicated campaign UPI account has not been connected yet.");
    return;
  }

  try{
    await navigator.clipboard.writeText(campaignConfig.upiId);
    flashStatus("Copied: " + campaignConfig.upiId);
  } catch {
    flashStatus(campaignConfig.upiId);
  }
});

function setupDeviceReaction(){
  const object = document.querySelector(".hero-object");
  if(!object || reducedMotion || window.matchMedia("(hover:none)").matches) return;

  let frame = null;

  object.addEventListener("pointermove", event => {
    if(frame) cancelAnimationFrame(frame);

    frame = requestAnimationFrame(() => {
      const rect = object.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);

      const ry = (x - .5) * 8;
      const rx = 2 - (y - .5) * 6;

      document.documentElement.style.setProperty("--device-rx", rx.toFixed(2) + "deg");
      document.documentElement.style.setProperty("--device-ry", ry.toFixed(2) + "deg");
      document.documentElement.style.setProperty("--device-x", ((x - .5) * 4).toFixed(1) + "px");
      document.documentElement.style.setProperty("--device-y", ((y - .5) * 4).toFixed(1) + "px");
      document.documentElement.style.setProperty("--shine-x", ((x - .5) * 80).toFixed(0) + "%");
      object.classList.add("is-interacting");
    });
  });

  object.addEventListener("pointerleave", () => {
    object.classList.remove("is-interacting");
    document.documentElement.style.setProperty("--device-rx","2deg");
    document.documentElement.style.setProperty("--device-ry","-1.5deg");
    document.documentElement.style.setProperty("--device-x","0px");
    document.documentElement.style.setProperty("--device-y","0px");
    document.documentElement.style.setProperty("--shine-x","-35%");
  });
}

function setupReveal(){
  const targets = [
    ...document.querySelectorAll(".section-head"),
    ...document.querySelectorAll(".arch-row"),
    ...document.querySelectorAll(".build-spec > div"),
    ...document.querySelectorAll(".flow-node"),
    ...document.querySelectorAll(".inventory-row"),
    ...document.querySelectorAll(".support-copy"),
    ...document.querySelectorAll(".payment-panel"),
    ...document.querySelectorAll(".log article"),
    ...document.querySelectorAll(".trust-list details"),
    ...document.querySelectorAll(".final > *")
  ];

  targets.forEach((el,index) => {
    el.classList.add("js-reveal");
    el.style.setProperty("--reveal-delay", Math.min((index % 5) * 45, 180) + "ms");
  });

  if(reducedMotion){
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -7% 0px"});

  targets.forEach(el => observer.observe(el));
}

function setupScrollState(){
  const topbar = document.querySelector(".topbar");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let ticking = false;

  function update(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    document.documentElement.style.setProperty("--page-progress", pct + "%");
    topbar.classList.toggle("is-scrolled", window.scrollY > 18);

    const probe = window.scrollY + Math.min(window.innerHeight * .35, 300);
    let active = "";

    sections.forEach(section => {
      if(section.offsetTop <= probe) active = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + active);
    });

    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  },{passive:true});

  update();
}

function setupAccordion(){
  const details = [...document.querySelectorAll(".trust-list details")];

  details.forEach(item => {
    item.addEventListener("toggle", () => {
      if(!item.open) return;

      details.forEach(other => {
        if(other !== item) other.open = false;
      });
    });
  });
}

setAmount(100);
renderSponsors();
updateCampaign(false);
setupDeviceReaction();
setupReveal();
setupScrollState();
setupAccordion();

requestAnimationFrame(() => updateCampaign(true));
setInterval(() => updateCampaign(false), 60000);
