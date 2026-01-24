# AI Study Planner

An intelligent study planning application that generates personalized study schedules using AI algorithms.

## Features

- **User Authentication**: Secure login and registration
- **Subject Management**: Add and manage study subjects with difficulty levels
- **Smart Scheduling**: AI-powered timetable generation based on subject difficulty and study hours
- **Progress Tracking**: Monitor your learning progress for each subject
- **Settings**: Customize study duration, break duration, and notifications
- **Responsive UI**: User-friendly interface built with React

## Project Structure

### Frontend
- **React.js**: UI framework
- **Components**: Navbar, SubjectForm, Timetable, Progress
- **Pages**: Login, Dashboard, Settings
- **API Integration**: Axios/Fetch for backend communication

### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: Database
- **Models**: User, Subject, StudyPlan
- **Routes**: Authentication, Subjects, Study Plans
- **Logic**: Intelligent scheduler

## Installation

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/study-planner
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Run the backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/settings` - Update settings
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Add subject
- `GET /api/studyplan` - Get study plan
- `POST /api/studyplan/regenerate` - Regenerate schedule

## Contributing

Feel free to submit pull requests or open issues.

## License

MIT License
