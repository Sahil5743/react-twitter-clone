import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Timeline from "./pages/Timeline";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import CreateTweet from "./components/CreateTweet";
import TweetList from "./components/TweetList";
import Navbar from "./components/Navbar";

// Auth wrapper to protect routes
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  if (!user) {
    // Redirect to login, preserve intended location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function HomePage({ onTweetCreated, refreshTweets }) {
  return (
    <div>
      {/* Create Tweet box */}
      <CreateTweet onTweetCreated={onTweetCreated} />

      {/* Tweet list */}
      <TweetList refresh={refreshTweets} />
    </div>
  );
}

export default function App() {
  const [refreshTweets, setRefreshTweets] = useState(false);

  const handleTweetCreated = () => {
    setRefreshTweets((prev) => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-orange flex flex-col">
          {/* Fixed Navbar */}
          <Navbar className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-orange" />
          
          {/* Main Content */}
          <main className="flex-grow max-w-2xl mx-auto mt-16 px-4 sm:px-6 lg:px-8 w-full">
            <Routes>
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate replace to="/home" />}
                      />
                      <Route
                        path="/home"
                        element={
                          <HomePage
                            onTweetCreated={handleTweetCreated}
                            refreshTweets={refreshTweets}
                          />
                        }
                      />
                      <Route path="/timeline" element={<Timeline />} />
                      <Route path="/profile/:username" element={<Profile />} />
                      <Route path="/user/:username" element={<ProfilePage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route
                        path="*"
                        element={
                          <p className="text-center mt-20 text-orange/70 text-lg">
                            404 — Page not found
                          </p>
                        }
                      />
                    </Routes>
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
