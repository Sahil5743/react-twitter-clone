import React, { useState, useContext, useEffect } from "react";
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
  const [showBackendNotice, setShowBackendNotice] = useState(true);

  useEffect(() => {
    // Optionally, auto-hide after a few seconds:
    // const timer = setTimeout(() => setShowBackendNotice(false), 10000);
    // return () => clearTimeout(timer);
  }, []);

  const handleTweetCreated = () => {
    setRefreshTweets((prev) => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-orange flex flex-col">
          {/* Backend deployment notice */}
          {showBackendNotice && (
            <div
              className="fixed top-0 left-0 right-0 z-50 bg-red-700 text-white text-center py-3 font-semibold shadow-lg"
              style={{ marginTop: 50 }} // Ensure no margin
            >
              The backend is currently deployed locally and not accessible online.<br />
              You will not be able to use the app until the backend is deployed.<br />
              Please check back in a few days when the backend is live.
              <button
                className="ml-4 px-3 py-1 bg-black bg-opacity-30 rounded hover:bg-opacity-50 transition"
                onClick={() => setShowBackendNotice(false)}
              >
                Dismiss
              </button>
            </div>
          )}
          {/* Add padding to main content to avoid overlap */}
          <Navbar className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-orange" />
          <main className="flex-grow max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ marginTop: showBackendNotice ? 128 : 64 }}>
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
