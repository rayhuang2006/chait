# chait

[繁體中文](README.zh-TW.md)

A full-stack chat application with user authentication, character selection, and an admin panel.

## Features

*   **User Authentication:** Secure user registration and login.
*   **Real-time Chat:** Instant messaging with other users.
*   **Character Picker:** Choose a character to represent you in chat.
*   **Admin Panel:** Manage users and other aspects of the application.

## Tech Stack

*   **Frontend:** React, Vite
*   **Backend:** Node.js, Express.js
*   **Database:** SQLite

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/rayhuang2006/chait.git
    cd chait
    ```

2.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd ../client
    npm install
    ```

### Running the Application

1.  **Start the server:**

    From the `server` directory, run:

    ```bash
    npm start
    ```

    The server will start on port 3000.

2.  **Seed the database:**

    In a separate terminal, from the `server` directory, run:

    ```bash
    npm run seed
    ```

    This will populate the database with initial data.

3.  **Start the client:**

    In a separate terminal, from the `client` directory, run:

    ```bash
    npm run dev
    ```

    The client will start on port 5173.

## Usage

1.  Open your browser and navigate to `http://localhost:5173`.
2.  Register a new account or log in with an existing one.
3.  Select a character.
4.  Start chatting with other users.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
