# Hotel Booking Website - Client Project Details (Personal Notes)

This is a personal reference document for the frontend (`client`) directory of the Hotel Booking Website project.

## 🛠️ Technology Stack
- **Framework:** React 19 (built with Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **Authentication:** Clerk (`@clerk/clerk-react`)
- **API Requests:** Axios
- **Notifications:** React Hot Toast

## 📂 Folder Structure Overview
The `src` directory contains the main application code:
- **`assets/`**: Contains static assets (images, icons).
- **`components/`**: Reusable UI components (like `Navbar`, `Footer`, `HotelReg`).
- **`context/`**: Contains React Context API files (e.g., `AppContext.jsx` for global state management).
- **`pages/`**: Contains the page-level components which map directly to routes.

## 🚦 Application Routes
The application is split into two main flows: **Customer/User** and **Hotel Owner**.

### Customer/User Routes
- **`/`**: Home Page (`Home.jsx`)
- **`/rooms`**: All Rooms Listing (`AllRooms.jsx`)
- **`/rooms/:id`**: Single Room Details (`RoomDetails.jsx`)
- **`/my-bookings`**: User's Bookings (`MyBooking.jsx`)

### Hotel Owner Routes (`/owner/*`)
These routes are nested within an Owner Layout:
- **`/owner`**: Dashboard Panel (`Dashboard.jsx`)
- **`/owner/add-room`**: Add a New Room (`AddRoom.jsx`)
- **`/owner/list-room`**: List/Manage Existing Rooms (`ListRoom.jsx`)

## 🔑 Key Configurations
- **Authentication (Clerk):** The Clerk Provider in `main.jsx` requires a `VITE_CLERK_PUBLISHABLE_KEY` environment variable inside an `.env` file to function properly.
- **Tailwind/Vite:** Configured via `vite.config.js` and `tailwind.config.js`.

---
*Note: This file is added to `.gitignore` to ensure it is kept as personal notes and not pushed to the GitHub repository.*
