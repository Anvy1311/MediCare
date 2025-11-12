# Doctor Appointment Booking Platform

A full-stack healthcare appointment booking platform with three user roles: Patient, Doctor, and Admin.

## Project info

**URL**: https://lovable.dev/projects/5d346788-43ed-4269-8f0d-446672f9edee

## Features

### Patient Features
- Register and login
- Browse doctors by specialization
- View doctor profiles with ratings and fees
- Book appointments with doctors
- View and manage appointments
- Cancel appointments

### Doctor Features
- Login to doctor dashboard
- View and manage profile
- View all appointments
- Mark appointments as completed
- Cancel appointments
- Track earnings and patient statistics

### Admin Features
- Comprehensive dashboard with system statistics
- Manage all users (patients and doctors)
- View and manage all appointments
- Delete users and appointments
- Track revenue and system metrics

## Demo Credentials

The application comes pre-loaded with demo users:

**Patient**
- Email: patient@example.com
- Password: patient123

**Doctor**
- Email: dr.smith@hospital.com
- Password: doctor123

**Admin**
- Email: admin@hospital.com
- Password: admin123

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom healthcare design system
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **Data Persistence**: localStorage (client-side database)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

## Data Storage

All data is stored in the browser's localStorage:
- **Users**: Login credentials and profiles
- **Appointments**: All appointment records
- **Time Slots**: Doctor availability

The data persists across browser sessions but is local to each browser.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5d346788-43ed-4269-8f0d-446672f9edee) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5d346788-43ed-4269-8f0d-446672f9edee) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
