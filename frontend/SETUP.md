# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Project2/
├── app/                    # Next.js app directory (pages)
│   ├── dashboard/         # User dashboard
│   ├── hostels/           # Hostel listing and details
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── vehicles/          # Vehicle listing and details
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── DriverSelection.tsx
│   ├── FeaturedHostels.tsx
│   ├── FeaturedVehicles.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LicenseUpload.tsx
│   ├── Navbar.tsx
│   └── ThemeProvider.tsx
├── lib/                   # Utilities and data
│   └── mockData.ts       # Mock data for vehicles, hostels, drivers
├── types/                 # TypeScript type definitions
│   └── index.ts
└── public/               # Static assets
    └── images/          # Image assets (add your images here)
```

## Features Implemented

✅ Landing page with hero search section
✅ Vehicle listing with filters
✅ Vehicle details with booking UI
✅ Driver selection modal
✅ Hostel listing and details
✅ Authentication (Login/Register)
✅ Driving license upload flow
✅ User dashboard with bookings
✅ Dark/Light mode toggle
✅ Responsive mobile-first design
✅ Loading skeletons
✅ Empty states

## Adding Images

Place your images in the `public/images/` directory:
- Vehicle images: `car1.jpg`, `car2.jpg`, etc.
- Hostel images: `hostel1.jpg`, `hostel2.jpg`, etc.
- Driver photos: `driver1.jpg`, `driver2.jpg`, etc.

## Customization

- Colors: Edit `tailwind.config.ts` to change the color scheme
- Mock Data: Modify `lib/mockData.ts` to add/update vehicles, hostels, and drivers
- Styling: Global styles are in `app/globals.css`

## Build for Production

```bash
npm run build
npm start
```
