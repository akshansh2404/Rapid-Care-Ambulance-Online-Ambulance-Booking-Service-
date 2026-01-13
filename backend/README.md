Ambulance Booking Backend

Setup:
- Create `.env` using `env.example` values
- Run: `npm install` then `npm run dev`

API:
- Auth: POST /api/auth/register, POST /api/auth/login
- Ambulances: POST /api/ambulances/add, GET /api/ambulances/list, PATCH /api/ambulances/update-status
- Bookings: POST /api/bookings/create, GET /api/bookings/my, PATCH /api/bookings/update-status
- Admin: GET /api/admin/users, GET /api/admin/bookings, GET /api/admin/ambulances

