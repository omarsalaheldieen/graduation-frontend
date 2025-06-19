// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create UserContext
// export const UserContext = createContext();

// // Create a custom hook to access the UserContext
// export const useUserContext = () => {
//   return React.useContext(UserContext);
// };

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);  // Store user data (null if not logged in)
//   const [loading, setLoading] = useState(true);  // Loading state for initial app load
//   const [error, setError] = useState(null);  // Error state to manage authentication errors

//   // Check user session when the app loads
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/auth/me', {
//           withCredentials: true,  // Include cookies (for session-based auth)
//         });

//         if (response.data.user) {
//           setUser(response.data.user);  // Set user data from the response
//         } else {
//           setUser(null);  // No user found (not logged in)
//         }
//       } catch (err) {
//         setError('Failed to fetch user data');
//         setUser(null);
//       } finally {
//         setLoading(false);  // Set loading to false after checking user session
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Login function
//   const login = (userData) => {
//     setUser(userData);  // Set user data after successful login
//   };

//   // Logout function
//   const logout = async () => {
//     try {
//       await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
//       setUser(null);  // Clear user data on logout
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Pass context to children components
//   return (
//     <UserContext.Provider value={{ user, login, logout, loading, error }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserProvider;
