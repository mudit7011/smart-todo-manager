# Smart Task Manager

![Smart Task Manager Screenshot - Add Task Page](https://github.com/mudit7011/smart-todo-manager/blob/main/frontend/public/image.png?raw=true)
*(Replace this placeholder with an actual screenshot of your Add Task page with AI suggestions, similar to the one you provided earlier.)*

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Features](#2-features)
3.  [Technology Stack](#3-technology-stack)
4.  [Setup and Installation](#4-setup-and-installation)
    *   [Prerequisites](#41-prerequisites)
    *   [Backend Setup](#42-backend-setup)
    *   [Frontend Setup](#43-frontend-setup)
5.  [Usage](#5-usage)
    *   [Adding Context](#51-adding-context)
    *   [Adding Tasks with AI Suggestions](#52-adding-tasks-with-ai-suggestions)
    *   [Viewing Context History](#53-viewing-context-history)
6.  [AI Integration Details](#6-ai-integration-details)
7.  [Future Enhancements](#7-future-enhancements)
8.  [Contact](#8-contact)

---

## 1. Introduction

The Smart Task Manager is an intelligent productivity application designed to help users manage their daily tasks more efficiently. Beyond standard task management, this application leverages Artificial Intelligence to provide smart, context-aware suggestions for task descriptions, deadlines, priorities, and categories, based on the user's historical context entries (notes, emails, WhatsApp messages, etc.).

This project demonstrates a full-stack application with a React-based Next.js frontend, a Python backend, and integration with a large language model (LLM) for intelligent assistance.

## 2. Features

*   **AI-Powered Task Suggestions**: Automatically generates enhanced task descriptions, suggested deadlines, priority scores, and categories as the user types a task title, utilizing historical context.
*   **Context Management**: Users can add daily notes, emails, or messages as "context entries" which the AI then uses to provide more personalized suggestions.
*   **Context History**: View a chronological timeline of all added context entries.
*   **Task Management**: Basic functionality to add and manage tasks.
*   **Dynamic Categorization**: AI suggests task categories from predefined options (Career, Personal, Health, Urgent).
*   **User-Friendly Interface**: Clean and intuitive design for seamless interaction.

## 3. Technology Stack

**Frontend:**
*   **Next.js**: React framework for building user interfaces.
*   **React**: JavaScript library for building UI components.
*   **Tailwind CSS**: Utility-first CSS framework for styling.
*   **`@/lib/api.js`**: Custom API client for interacting with the backend.

**Backend:**
*   **Python**: Primary language for the backend logic.
*   **Flask/Django (Assumed)**: A Python web framework (not explicitly detailed, but implied by `/api/` endpoints).
*   **Groq API**: Integration with Groq's large language models (e.g., `llama3-8b-8192`) for AI-powered suggestions.
*   **`python-dotenv`**: For managing environment variables.
*   **`requests`**: For making HTTP requests to external APIs (like Groq).

**Database (Assumed):**
*   **SQLite/PostgreSQL (Assumed)**: A database system for storing tasks and context entries (implied by the `/api/contexts/` and `/api/tasks/` endpoints).

## 4. Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 4.1. Prerequisites

*   Node.js (LTS version recommended) and npm/yarn
*   Python (3.8+) and pip
*   A Groq API Key (You can obtain one from [api.groq.com](https://api.groq.com/))

### 4.2. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd smart-task-manager/backend # Adjust path if your backend is in a different folder
    ```
2.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows: .\venv\Scripts\activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt # Ensure you have a requirements.txt file with requests, python-dotenv, flask/django etc.
    ```
    *(If you don't have `requirements.txt`, you'll need to `pip install requests python-dotenv` and your web framework like `Flask` or `Django`.)*
4.  **Create a `.env` file** in the backend root directory and add your Groq API Key:
    ```
    GROQ_API_KEY="your_groq_api_key_here"
    ```
5.  **Run database migrations** (if applicable for your chosen Python framework).
6.  **Start the backend server:**
    ```bash
    # Example for Flask
    flask run
    # Example for Django
    python manage.py runserver
    ```
    Ensure your backend is running on `http://127.0.0.1:8000`.

### 4.3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd smart-task-manager/frontend # Adjust path if your frontend is in a different folder
    ```
2.  **Install dependencies:**
    ```bash
    npm install # or yarn install
    ```
3.  **Start the Next.js development server:**
    ```bash
    npm run dev # or yarn dev
    ```
    The application should now be accessible at `http://localhost:3000`.

## 5. Usage

### 5.1. Adding Context

The AI's intelligence is powered by the context you provide.
1.  Navigate to the **"Add Context"** page.
2.  Enter any relevant information: notes, email snippets, WhatsApp messages, meeting summaries, etc.
3.  Select the source type (Note, Email, WhatsApp).
4.  Click "Submit Context."
    *   *Example contexts to add:*
        *   "Meeting with Professor Evans on Tuesday at 10 AM to discuss research paper topics."
        *   "Got feedback on last project: 'Excellent problem-solving, but could improve on presentation clarity.'"
        *   "Reminder: Physics mid-term exam is next Friday. Need to review Thermodynamics."
        *   "Found a recipe for a really good lentil and vegetable stew that's healthy and easy to make. Also, remember I'm trying to incorporate more plant-based meals into my diet this month."

### 5.2. Adding Tasks with AI Suggestions

1.  Navigate to the **"Add Task"** page.
2.  Start typing a **"Task Title"** (e.g., "Plan study strategy for upcoming exams" or "Prepare comprehensive update for upcoming board meeting").
3.  As you type, the AI will automatically fetch relevant context from your history and provide real-time suggestions for:
    *   **Enhanced Description**: A detailed task description enriched by your context.
    *   **Suggested Deadline**: A proposed completion date.
    *   **Priority Score**: A numerical value indicating urgency.
    *   **Suggested Category**: A category like "Career," "Personal," "Health," or "Urgent."
    *   **Contextual Suggestions**: A list of actionable sub-tasks or related ideas derived from your entire context history, demonstrating the AI's cross-referential analysis.
4.  You can then refine the suggested details or accept them as is before clicking "Add Task."

### 5.3. Viewing Context History

1.  Navigate to the **"History"** page.
2.  Here, you can see all your recorded context entries in a chronological timeline.
3.  *(Optional: If implemented)* You can also delete individual context entries from this page using the 'X' button on each entry.

## 6. AI Integration Details

The application integrates with the [Groq API](https://api.groq.com/openai/v1/chat/completions) to power its AI suggestions. The core of this intelligence resides in the `ai_module.py` file on the backend.

*   **Comprehensive Prompting**: The backend constructs a detailed prompt sent to the LLM. This prompt explicitly includes the user's task title and their entire relevant context history, formatted clearly.
*   **Cross-Contextual Analysis**: The AI is instructed through its system message and prompt examples to perform "deep and cross-referential analysis" across all provided context entries, aiming to generate actionable `contextual_suggestions` that link disparate pieces of information.
*   **Structured Output**: The AI is prompted to return suggestions in a strict JSON format, ensuring structured and reliable data for the frontend.

## 7. Future Enhancements

*   **Task Editing and Status Updates**: Extend task management with options to edit tasks and update their completion status.
*   **User Authentication**: Implement user login and registration.
*   **Advanced Context Search**: Allow users to search and filter their context history.
*   **Notification System**: Set up reminders for deadlines.
*   **Improved AI Models**: Experiment with different LLMs or fine-tune models for even more tailored suggestions.
*   **UI/UX Improvements**: Further polish the user interface and experience.

