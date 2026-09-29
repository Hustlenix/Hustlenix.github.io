# Build My Framework 16

A static campaign website for a 90-day internet experiment: fund a Framework Laptop 16 through UPI supporter contributions and limited physical sponsor placements on the laptop.

## Live site

https://hustlenix.github.io/framework16/

## Payment setup

Open `framework16/app.js` and edit:

- `campaignConfig.upiId`
- `campaignConfig.upiName`
- `campaignConfig.razorpayDefault`
- `campaignConfig.raised`
- each sponsor slot's `paymentLink`

The public site intentionally ships with placeholder payment details so no private payment identifier is exposed before it is deliberately configured.

## Campaign data

The current target defaults to ₹3,00,000. Change `campaignConfig.target` once the exact Framework 16 configuration and landed cost are locked.

## Notes

- Sponsor purchases are advertising/sponsorship transactions, not charitable donations.
- Do not promise guaranteed views or impressions unless you can contractually deliver them.
- Because the creator is under 18, payment accounts and sponsorship contracts should be controlled/reviewed by a parent or guardian where required.
- This project is independent and is not affiliated with Framework Computer Inc.
