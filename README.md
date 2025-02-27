# Real-Time To-Do App

## Short Description
A real-time to-do web application that allows users to manage tasks across three categories: **Pending, Ongoing, and Completed**. The application supports **drag-and-drop** functionality and uses **Socket.io** for real-time task updates.

## Live Link
[Live Demo](https://realtime-to-do-3ff30.web.app/)

## Dependencies
```json
"dependencies": {
    "@tailwindcss/vite": "^4.0.8",
    "axios": "^1.7.9",
    "firebase": "^11.3.1",
    "lucide-react": "^0.476.0",
    "react": "^18.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.4.3",
    "socket.io-client": "^4.8.1",
    "sweetalert2": "^11.17.2",
    "tailwindcss": "^4.0.8"
}
```

## Installation Steps
1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project
   - Configure Firebase SDK and update environment variables

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Start the backend server:**
   ```sh
   node server.js
   ```

## Technologies Used
- **Frontend:** React, TailwindCSS, React Beautiful DnD
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Real-Time Communication:** Socket.io
- **Authentication & Hosting:** Firebase
