# IIIT Buy-Sell Platform

## Overview
This is a marketplace platform for IIIT users to buy and sell items. Users must register with an official `@iiit.ac.in` email.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express + MongoDB

## Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (Local or Cloud)
- **Git**

---

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. The app will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd ../backend
   ```
2. Start the backend server:
   ```sh
   npm start
   ```

---

## Authentication Rules
- Only emails ending in `@iiit.ac.in` are allowed for registration and login.
- JWT-based authentication is used for secure API access.

---

