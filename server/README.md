# IT Conference Backend (Combined Registration + Abstract Upload)

## Combined Registration Endpoint
POST /api/register  (multipart/form-data)
Headers: Authorization: Bearer <token>
Fields:
- fullName (text)
- college (text)
- category (text)
- affiliation (text)
- phone (text)
- abstractTitle (text)
- abstractFile (file: pdf/doc/docx/png/jpg)

Response: { message, registration }

Other endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/user/me
- GET /api/status
- PATCH /api/admin/abstract/:userId/select
- PATCH /api/admin/payment/:userId/confirm
