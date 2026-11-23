# Clemotex Engineering Limited website

A responsive, static company website based on the two supplied 2026 Clemotex company profiles.

## Run locally
1. Run `npm start`.
2. Open `http://localhost:3000`.

No build step or backend is required.

## Deploy to Railway
1. Push this project to GitHub.
2. In Railway, create a new project from the GitHub repository.
3. Railway will detect Node.js and use `npm start`.
4. The included `railway.json` enables the `/health` health check.

Set `PORT` automatically through Railway; no manual environment variable is required.

## Included
- Responsive homepage and navigation
- Company overview, services, capabilities, values and contact sections
- Click-to-call and email links
- Mobile navigation
- Client enquiry form that opens the visitor's email application
- Scroll reveal effects and active-section navigation
- Product catalogue for fuel tanks and custom fabricated equipment
- Dedicated product store with category filters, search, a quote list and quote-request email preparation
- Tank quote requests can include capacity, capacity units, dimensions, dimension units and orientation
- The product store is quote-based; it does not take online payments or confirm orders

## Image credit
- The green 500-gallon tank photo is supplied in the site assets.
- The illustrative outdoor tank photo is by W. Carter, Wikimedia Commons, licensed under CC BY-SA 4.0:
  https://commons.wikimedia.org/wiki/File:Outdoor_fuel_tank.jpg

## Before publishing
- Confirm the current contact numbers, address and email.
- Replace the illustrative remote photography with approved Clemotex project photographs.
- Add the official logo file if you have a high-resolution transparent PNG/SVG.
- The photographs and Google Fonts load from external services and therefore require an internet connection.
- This is a static front-end website; it does not include a database, CMS or enquiry-form backend.
