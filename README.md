# Conversational-Agentic-AI – Installation & Setup Guide

Follow these steps to set up and run the **Conversational-Agentic-AI** project on your local machine.

---

## 1. Clone or Download the Repository
- If you cloned the repository, skip extraction.  
- If you downloaded a `.zip` file, extract it to your preferred directory.

    git clone <repository_url>
    cd Conversational-Agentic-AI

---

## 2. Setup the Model service (Python Backend)

Open a new terminal and navigate to the model directory:

    cd model

Create a virtual environment:

    python3 -m venv venv

Activate the virtual environment:

- **Windows:**
  
      venv\Scripts\activate

- **Mac/Linux:**
  
      source venv/bin/activate

Install Python dependencies:

    pip install -r requirements.txt

Run the Python service:

    python app.py
    
Configure environment variables:  
- Update the `.env` file inside the `model/` directory.  
- Add your own credentials and required configurations.  


➡️ The model service will usually run on **http://127.0.0.1:5273**.

---

➡️ Keep this terminal running.

---

## 3. Setup the Server (Backend)

Open a new terminal and navigate to the server directory:

    cd server

Install dependencies:

    npm install

Ensure **nodemon** is installed globally (if not, install it):

    npm install -g nodemon

Start the server:

    nodemon index.js
    
Configure environment variables:  
- Update the `.env` file inside the `server/` directory.  
- Add your own credentials and required configurations.  


- The server will run on **http://localhost:5000** (or another available port).  

➡️ Keep this terminal running.

## 4. Setup the Client (Frontend)

Navigate to the client directory:

    cd client

Install dependencies:

    npm install

Configure environment variables:  
- Update the `.env` file inside the `client/` directory.  
- Add your own credentials and required configurations.  

Example `.env`:

    VITE_API_URL=http://localhost:5000
    VITE_FIREBASE_KEY=your_firebase_key

Run the client in development mode:

    npm run dev

- The app will run on **http://localhost:5173**.  
- Press `Ctrl + Click` on the link to open it in your browser.  

## 5. Running the Application

At this point, you should have **three terminals** open and running:

1. **Client (Frontend)** → http://localhost:5173  
2. **Server (Node.js Backend)** → http://localhost:5000  
3. **Model Service (Python)** → http://127.0.0.1:5273  

The application is now fully functional in development mode.

---

## 6. System Requirements

- **Node.js** (>= 18.x)  
- **npm** (>= 9.x)  
- **Python** (>= 3.9)  
- **pip** (latest recommended)  

For best performance, ensure you are using the latest stable versions.

---

## Notes

- Update the `.env` files with your own credentials (API keys, Firebase, etc.).  
- If any **port conflicts** occur, modify the `.env` values accordingly.  
- For smooth workflow, you can optionally use tools like **concurrently** to run client and server together, but keeping them separate is recommended for debugging.  

---

## ⚡ Quick Start (Power Users)

If you already have the required tools installed, you can run everything with these commands:

    # Clone the repo
    git clone <repository_url>
    cd Conversational-Agentic-AI

    # --- Client ---
    cd client
    npm install
    npm run dev &

    # --- Server ---
    cd ../server
    npm install
    nodemon index.js &

    # --- Model ---
    cd ../model
    python3 -m venv venv
    source venv/bin/activate   # (Windows: venv\Scripts\activate)
    pip install -r requirements.txt
    python app.py

---

✅ Now your **Conversational-Agentic-AI** app should be up and running locally!
