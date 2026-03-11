# Employee Management System (EMS)

A comprehensive Employee Management System built with React, Node.js, and MongoDB for managing employees, salaries, leaves, and departments.

## 🚀 Features

### **Employee Management**
- ✅ Add, Edit, Delete employees
- ✅ Employee profile management
- ✅ Search and filter employees
- ✅ Employee data persistence in MongoDB

### **Salary Management**
- ✅ Create and manage salary records
- ✅ Salary request workflow (employee → admin approval)
- ✅ Automatic net salary calculations
- ✅ Payment method tracking

### **Leave Management**
- ✅ Leave request submission
- ✅ Admin approval/rejection workflow
- ✅ Leave balance tracking
- ✅ Leave status management

### **Admin Dashboard**
- ✅ Comprehensive admin interface
- ✅ Real-time data synchronization
- ✅ Multi-role access control
- ✅ Department management

### **Employee Dashboard**
- ✅ Personal employee dashboard
- ✅ Salary and leave history
- ✅ Profile management
- ✅ Server connection status

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Icon library
- **Axios/Fetch** - HTTP client

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

### **Database**
- **MongoDB** - Document database
- **Collections**: employees, salaries, leaves, departments, users

## 📁 Project Structure

```
EMS/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/      # API service layer
│   │   ├── context/       # React context
│   │   └── data/          # Local data store
│   └── public/             # Static assets
├── server/                  # Node.js backend
│   ├── controllers/          # API route handlers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/           # Express middleware
│   └── db/                  # Database connection
└── README.md               # This file
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (running on localhost:27017)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/sallachandrakala/EMS.git
   cd EMS
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in server directory
   cd server
   cp .env.example .env
   
   # Edit .env with your configuration
   MONGODB_URL="mongodb://localhost:27017/ems"
   JWT_KEY="your-secret-jwt-key"
   PORT=5000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

5. **Start the application**
   ```bash
   # Start backend server (in server directory)
   cd server
   npm start
   
   # Start frontend (in another terminal, in frontend directory)
   cd ../frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin-dashboard
   - Employee Dashboard: http://localhost:5173/employee-dashboard

## 🎯 Usage

### **Default Login Credentials**
- **Admin**: admin@company.com / admin123
- **Employee**: employee@company.com / employee123

### **Key Workflows**

#### **1. Employee Management**
1. Navigate to Admin Dashboard → Employees
2. Add new employees with details (name, email, department, etc.)
3. Edit existing employee information
4. Delete employees (with confirmation)
5. All changes are saved to MongoDB database

#### **2. Salary Management**
1. **Employees**: Submit salary change requests via Employee Dashboard
2. **Admins**: Review and approve/reject requests in Admin Dashboard
3. Approved requests automatically become salary records
4. Manage salary history and payments

#### **3. Leave Management**
1. **Employees**: Submit leave requests with dates and reason
2. **Admins**: Approve/reject leave requests
3. Track leave balances and history
4. Automatic status updates

#### **4. Department Management**
1. Create and manage departments
2. Assign employees to departments
3. Department-based reporting

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the `server` directory:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/ems

# Server Configuration
PORT=5000

# Authentication
JWT_KEY=your-secret-jwt-key-here

# Frontend URL (optional)
FRONTEND_URL=http://localhost:5173
```

### **Database Schema**

#### **Employee Model**
```javascript
{
  employeeId: String (unique),
  name: String,
  email: String,
  department: String,
  role: String,
  status: String,
  joinDate: Date,
  basicSalary: Number,
  image: String
}
```

#### **Salary Model**
```javascript
{
  employeeId: String,
  employeeName: String,
  email: String,
  department: String,
  basicSalary: Number,
  allowances: Number,
  deductions: Number,
  netSalary: Number,
  effectiveDate: Date,
  status: String,
  submittedBy: String
}
```

#### **Leave Model**
```javascript
{
  employeeId: String,
  employeeName: String,
  leaveType: String,
  fromDate: Date,
  toDate: Date,
  reason: String,
  status: String,
  approvedBy: String,
  approvedDate: Date
}
```

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Employees**
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/employee/:employeeId` - Get employee by ID

### **Salaries**
- `GET /api/salaries` - Get all salary records
- `POST /api/salaries` - Create salary record
- `PUT /api/salaries/:id` - Update salary record
- `DELETE /api/salaries/:id` - Delete salary record
- `GET /api/salaries/employee/:employeeId` - Get employee salaries

### **Leaves**
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id` - Update leave request
- `DELETE /api/leaves/:id` - Delete leave request
- `GET /api/leaves/employee/:employeeId` - Get employee leaves

### **Departments**
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

## 🎨 UI Components

### **Key Features**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Real-time Updates**: Instant data synchronization
- **Status Indicators**: Visual feedback for all operations
- **Search & Filter**: Advanced data filtering capabilities
- **Role-based Access**: Different interfaces for admins and employees

### **Color Scheme**
- **Primary**: Teal (#14b8a6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

## 🧪 Testing

### **Run Tests**
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if available)
cd server
npm test
```

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Employee CRUD operations
- [ ] Salary management workflow
- [ ] Leave request process
- [ ] Admin dashboard functionality
- [ ] Data persistence in MongoDB
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 🐛 Troubleshooting

### **Common Issues**

#### **Server Won't Start**
```bash
# Check if MongoDB is running
mongod

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID [PROCESS_ID] /F
```

#### **Database Connection Issues**
```bash
# Verify MongoDB connection
node server/test-mongo.js

# Check .env file
cat server/.env
```

#### **Frontend Build Errors**
```bash
# Clear node modules
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### **Data Not Persisting**
1. Check server console logs for API errors
2. Verify MongoDB is running and accessible
3. Check browser network tab for failed API calls
4. Ensure API endpoints are correctly configured

## 📝 Development Notes

### **Code Style**
- Uses ESLint for code consistency
- Follows React best practices
- Component-based architecture
- RESTful API design

### **Security Features**
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Password hashing

### **Performance Optimizations**
- React hooks for efficient state management
- Lazy loading of components
- Optimized database queries
- Component memoization where applicable

## 🤝 Contributing

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow existing code patterns
- Write meaningful commit messages
- Update documentation for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the GitHub repository
- Check existing documentation and issues
- Review troubleshooting section above

---

**Built with ❤️ using modern web technologies for efficient employee management**
