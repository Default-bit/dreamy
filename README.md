# Fairy Tale Generator

A full-stack web application that generates personalized fairy tales using AI. The app features a Python FastAPI backend with a modern web frontend in React.

## 🏗️ Project Structure

```
FAIRY-TALE-GENERATOR/
├── __pycache__/           # Python cache files
├── chroma_store/          # Vector database storage
├── fairy-tale-frontend/   # Frontend application
├── rag/                   # RAG (Retrieval Augmented Generation) components
├── static/                # Static assets (CSS, JS, images)
├── venv/                  # Python virtual environment
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── app.py                # Main FastAPI application
├── auth.py               # Authentication logic
├── db.py                 # Database operations
├── fairy.db              # SQLite database
├── models.py             # Database models
├── requirements.txt      # Python dependencies
├── test_api.sh           # API testing script
├── utils.py              # Utility functions
└── README.md             # This file
```

## ✨ Features

- **AI-Powered Story Generation**: Create unique fairy tales based on user prompts
- **User Authentication**: Secure user registration and login system
- **Story History**: Save and retrieve previously generated stories
- **Modern Frontend**: Responsive web interface built with modern web technologies
- **RAG Integration**: Enhanced story generation using retrieval augmented generation
- **Vector Database**: Efficient story component storage and retrieval

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js and npm (for frontend development)
- Git

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd FAIRY-TALE-GENERATOR
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv venv

   # On Windows
   venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize the database**

   ```bash
   python db.py
   ```

6. **Run the FastAPI application**
   ```bash
   uvicorn app:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd fairy-tale-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing

### API Testing

Run the API test script to verify backend functionality:

```bash
chmod +x test_api.sh
./test_api.sh
```

## 📝 API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/generate` - Generate fairy tale
- `GET /api/stories` - Retrieve user stories
- `GET /api/story/<id>` - Get specific story

## 🛠️ Technologies Used

### Backend

- **FastAPI** - Modern web framework
- **SQLite** - Database
- **ChromaDB** - Vector database for RAG
- **HuggingFace API** - AI story generation
- **Uvicorn** - ASGI server

### Frontend

- **React + TypeScript + Vite** - Core web technologies

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///fairy.db
ENVIRONMENT=development
```

## 📦 Dependencies

Key Python packages (see `requirements.txt` for complete list):

- FastAPI
- uvicorn
- fastapi-cors or fastapi[all]
- chromadb
- sqlite3
- python-dotenv
- pydantic

---

Made with ❤️ for creating magical stories
