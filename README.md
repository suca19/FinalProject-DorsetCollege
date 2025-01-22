# fs-assignment-2-2024-71930

# PROJECT

# Stock Management System

A full-stack inventory management system built with React and Django, featuring inventory management, order tracking, and user profile management.

## Features

### Inventory Management
- Complete CRUD operations for products
- Real-time stock updates
- Product filtering and search
- Product categories
- Stock level tracking
- Product details view

### Order Management
- Order creation and tracking
- Order status updates (Pending, Processing, Shipped, Delivered)
- Order filtering by status
- Order history
- Customer information tracking
- Total order value calculation

### User Profile Management
- User authentication and authorization
- Profile viewing and editing
- Personal information management
- Email updates
- Password management
- User role management

### UI/UX Features
- Responsive design
- Animated transitions using Framer Motion
- Interactive tables and forms
- Status color coding
- Real-time updates
- User-friendly interface
- Form validation
- Error handling

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- Git

## Installation
`
## Backend Setup (Django) for Windows:
Clone the repository: Open Command Prompt or PowerShell, then run:

```bash

git clone https://github.com/suca19/fs-assignment-2-2024-71930/
cd fs-assignment-2-2024-71930/
```
Install Python (if not already installed): Download the latest version of Python from the official website: Python Downloads.

Make sure to check the box that says "Add Python to PATH" during installation.
Create a virtual environment (recommended): In Command Prompt or PowerShell, navigate to your project directory and create a virtual environment:
```bash
Copy code
python3 -m venv venv
```
Activate the virtual environment:
```bash
Copy code
source venv\Scripts\activate
```
Install the necessary Python dependencies: Navigate to the backend folder and install the required libraries:
```bash
Copy code
cd backend
pip install -r requirements.txt
```
Install Django and dependencies: You’ll need djangorestframework-simplejwt for authentication:
```bash
Copy code
pip install djangorestframework-simplejwt
```
Set up the database: Run the Django migrations to create the necessary tables in the database:
```bash
Copy code
python manage.py migrate
```
Start the Django server:

```bash
Copy code
python manage.py runserver
The backend server should now be running at http://127.0.0.1:8000/.
```
Front-End Setup (React) for Windows:
Install Node.js and npm: Download and install Node.js from the official website: Node.js Downloads. This will install both Node.js and npm (Node Package Manager).

Navigate to the frontend directory: Open a new Command Prompt or PowerShell window, then:

```bash
Copy code
cd frontend
Install JavaScript dependencies: You can use either npm or yarn. If you don’t have Yarn installed, use npm:
```
Using npm:

```bash
Copy code
npm install
```
If you prefer Yarn (you may need to install Yarn first):

```bash
Copy code
yarn install
```
Start the React development server:

```bash
Copy code
npm start
```
Or, if using Yarn:

```bash
Copy code
yarn start
```

`
## Backend Setup (Django) for Windows:
Clone the repository: Open Command Prompt or PowerShell, then run:

```bash
git clone https://github.com/suca19/fs-assignment-2-2024-71930/
cd fs-assignment-2-2024-71930/
```
Install Python (if not already installed): Download the latest version of Python from the official website: Python Downloads.

Make sure to check the box that says "Add Python to PATH" during installation.
Create a virtual environment (recommended): In Command Prompt or PowerShell, navigate to your project directory and create a virtual environment:

```bash
python -m venv venv
```
Activate the virtual environment:

```bash
venv\Scripts\activate
```
Install the necessary Python dependencies: Navigate to the backend folder and install the required libraries:

```bash
cd backend
pip install -r requirements.txt
```
Install Django and dependencies: You’ll need djangorestframework-simplejwt for authentication:

```bash
pip install djangorestframework-simplejwt
```
Set up the database: Run the Django migrations to create the necessary tables in the database:

```bash
python manage.py migrate
```
Start the Django server:

```bash
python manage.py runserver
The backend server should now be running at http://127.0.0.1:8000/.
```
Front-End Setup (React) for Windows:
Install Node.js and npm: Download and install Node.js from the official website: Node.js Downloads. This will install both Node.js and npm (Node Package Manager).

Navigate to the frontend directory: Open a new Command Prompt or PowerShell window, then:

```bash
cd frontend
Install JavaScript dependencies: You can use either npm or yarn. If you don’t have Yarn installed, use npm:
```
Using npm:

```bash
npm install
```
If you prefer Yarn (you may need to install Yarn first):

```bash
yarn install
```
Start the React development server:

```bash
npm start
```
Or, if using Yarn:

```bash

yarn start
```
### Mac or Linux

##Backend Setup (Django)

```bash
git clone https://github.com/suca19/fs-assignment-2-2024-71930/
```

```bash
cd fs-assignment-2-2024-71930/
```
## 2. Set Up the Back-End (Django)

install python if you don't have it, otherwise discard these steps 

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```bash
brew install python
```

```
sudo apt update
sudo apt install python3
```
```bash
sudo apt install python3-pip
```


- It's recommended to create a virtual environment to isolate your Python dependencies:

```bash
python3 -m venv venv
```

```bash
    source venv/bin/activate  # On Windows: venv\Scripts\activate
```

- Install the necessary Python dependencies using requirements.txt:

```bash
pip install -r backend/requirements.txt
```
## Set Up the Database:

# This project uses sqlite3 that is library that provides a lightweight disk-based database that doesn't require a separate server process and allows accessing the database.

- Run the migrations to create the necessary tables in the database:

```bash
cd backend
```

```bash
pip install djangorestframework-simplejwt
 ```

```bash
python3 manage.py migrate
```
- Start the Django Server:

```bash
python3 manage.py runserver
```

The back-end will now be running at http://127.0.0.1:8000.

3. Set Up the Front-End (React)
Install Node.js Dependencies:

Navigate to the front-end directory (if it's separate, e.g., frontend/):

```bash
cd frontend
```

-Install the JavaScript dependencies using either npm or yarn:

- Using npm:
    
```bash
npm install
```

- Using yarn:

```bash
 yarn install
 ```

## Start the React Development Server:

```bash
npm start   
```

# Or if you're using Yarn: 

 ```bash
yarn start
```

