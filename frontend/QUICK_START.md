# Quick Start Guide

## 🚀 Getting Started

1. **Navigate to project directory**
   ```bash
   cd Project2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📱 Pages Available

- **/** - Landing page with search
- **/vehicles** - Browse all vehicles
- **/vehicles/[id]** - Vehicle details and booking
- **/hostels** - Browse all hostels
- **/hostels/[id]** - Hostel details and booking
- **/login** - User login
- **/register** - User registration
- **/dashboard** - User dashboard with bookings

## 🎨 Features

- ✅ Dark/Light mode toggle (top right)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Vehicle filtering (price, fuel type, transmission, driver)
- ✅ Hostel filtering (location, price, rating)
- ✅ Driver selection modal
- ✅ Driving license upload
- ✅ Booking management dashboard

## 🖼️ Adding Images

To add real images, place them in `public/images/`:
- Vehicle images: `car1.jpg`, `car2.jpg`, etc.
- Hostel images: `hostel1.jpg`, `hostel2.jpg`, etc.
- Driver photos: `driver1.jpg`, `driver2.jpg`, etc.

Currently, placeholder icons are shown. The app will work with mock data.

## 🛠️ Customization

- **Colors**: Edit `tailwind.config.ts`
- **Mock Data**: Edit `lib/mockData.ts`
- **Styling**: Edit `app/globals.css`

## 📦 Build for Production

```bash
npm run build
npm start
```

Enjoy building! 🎉
