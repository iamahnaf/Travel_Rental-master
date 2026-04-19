# TravelRen: B2B + B2C Tour Planning Platform

TravelRen is a full-stack marketplace platform for travel services.
It helps travelers book complete trip services and helps business owners grow by listing and managing their services.

This platform supports:
- 🚗 Car rental with driver
- 🚙 Car rental without driver
- 🏨 Hotel booking
- 🧑‍✈️ Driver booking
- 🗺️ Tour guide booking

It is designed as a B2B + B2C business model:
- 🧳 B2C: Travelers directly book services.
- 💼 B2B: Service providers (car owners, hotel owners, drivers, tour guides) manage listings and booking requests.

## 💡 Business Concept

In Bangladesh, travelers usually need to use separate services for each part of a trip. They may book a car from one place, find a hotel from another place, and then arrange a driver or tour guide manually.

There is still no widely adopted local web platform that combines:
- Car rental with driver
- Car rental without driver
- Hotel booking
- Driver and tour guide booking
in one complete tour workflow.

TravelRen was built to solve this exact problem.

TravelRen solves two big needs in one ecosystem:
- Travelers get one platform to plan and book their full tour arrangement from start to finish.
- Service providers get one digital marketplace to list services, receive bookings, and grow their business.

This is why TravelRen is designed as a practical B2B + B2C platform for Bangladesh: it connects customers and travel businesses through one unified booking system.

## 🇧🇩 Why This Matters In Bangladesh

- Most travel arrangements are still fragmented and manual
- Self-drive car rental options are limited and hard to trust
- Small and medium travel businesses often have no unified digital sales channel
- Travelers need convenience, transparency, and faster decision-making

TravelRen addresses these gaps by giving users an all-in-one booking experience and giving providers a structured online business model.

## 👥 Target Users

### 1. 🧳 Travelers (Customers)
- Browse vehicles, hotels, drivers, and tour guides
- Book services by date
- Rent cars with or without driver
- Add pickup and destination for vehicle bookings
- Track and manage bookings

### 2. 🤝 Business Partners
- Car Owners: list vehicles and manage rental requests
- Hotel Owners: list hotels, manage rooms, and accept/reject bookings
- Drivers: manage profile and accept/reject trip requests
- Tour Guides: manage profile and accept/reject tour requests

### 3. 🛡️ Admin
- Verify and approve NID and driving license submissions
- Maintain trust and compliance in the platform

## ✨ Core Features

- 🔐 Multi-role authentication and authorization
- 🧭 Role-specific dashboards
- 📅 Booking system for multiple service types
- 🔄 Booking request lifecycle: pending, confirmed, completed, cancelled
- 🎟️ Promo code validation and discount support
- 🪪 License and NID upload with verification workflow
- 🖼️ Multi-image upload support for listings
- 📍 Map-based pickup and destination selection for vehicles
- 📱 Responsive web UI for desktop and mobile

## 🧱 Tech Stack

### 🎨 Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### ⚙️ Backend
- Node.js
- Express.js
- MySQL
- JWT authentication
- Multer for file uploads

## 🗂️ Project Structure

- [backend](backend): REST API, business logic, database access, upload handling
- [frontend](frontend): Next.js application, pages, components, role dashboards
- [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md): Detailed workflow and system behavior
- [START_PROJECT.md](START_PROJECT.md): Quick startup guide

## 🔄 How It Works (High-Level)

1. A user registers with a selected role.
2. Business roles can create or manage service listings.
3. A traveler searches and books a service.
4. Booking request goes to the relevant provider dashboard.
5. Provider accepts or rejects with feedback.
6. Booking status updates for both sides.

## 🧾 Booking Types Supported

- Vehicle booking
- Hotel booking
- Driver booking
- Tour guide booking

Vehicle booking supports:
- ✅ With driver
- ✅ Without driver (subject to approved driving license)

## 🛠️ Local Development Setup

## 📋 Prerequisites
- Node.js installed
- MySQL running (configured for port 3307 in this project)
- Database created: car_rental_booking

## 1. 🚀 Start Backend

```bash
cd backend
npm install
npm start
```


## 2. 🌐 Start Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## 📈 Current Product Positioning

TravelRen is positioned as a practical travel-commerce platform for:
- Customers planning tours with complete service options
- Service providers building and scaling travel-related businesses

It is suitable as an MVP and can be extended for production with:
- Cloud media storage
- Payment gateway integration
- Notification system
- Advanced analytics and reporting

