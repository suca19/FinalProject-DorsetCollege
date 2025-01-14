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

### Backend Setup (Django)

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

