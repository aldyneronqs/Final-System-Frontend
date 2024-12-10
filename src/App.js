import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from './components/AppNavbar';
import Banner from './pages/Banner';
import CourseCard from './components/CourseCard';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import Course from './pages/Course';
import AddCourse from './pages/AddCourse';
import Profile from './pages/Profile'; 


function App() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return; 
    }

    // Fetch user details
    fetch("http://localhost:4000/users/details", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        if (data && data.result) {
          setUser({
            id: data.result._id,
            firstName: data.result.firstName,
            middleName: data.result.middleName,
            lastName: data.result.lastName,
            email: data.result.email,
            contactNumber: data.result.contactNumber,
            isAdmin: data.result.isAdmin,
          });
        } else {
          setUser(null); 
        }
      })
      .catch((error) => console.error("Error fetching user details:", error))
      .finally(() => setLoading(false)); 
  }, []);

  if (loading) {
    return <p>Loading...</p>; 
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <Container fluid>
          <AppNavbar />
          <Routes>
            <Route path="/" element={<Banner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/courses" element={<Course />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
