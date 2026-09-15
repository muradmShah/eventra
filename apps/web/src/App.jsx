import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AttendeeDashboardPage from './pages/AttendeeDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageEventsPage from './pages/ManageEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventAttendeesPage from './pages/EventAttendeesPage';
import ReportsPage from './pages/ReportsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/events/:id" element={<EventDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Attendee */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute roles={['attendee']}>
                                <AttendeeDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-registrations"
                        element={
                            <ProtectedRoute roles={['attendee']}>
                                <MyRegistrationsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Shared */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <ManageEventsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events/new"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <CreateEventPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events/:id/edit"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <EditEventPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/events/:id/attendees"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <EventAttendeesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/reports"
                        element={
                            <ProtectedRoute roles={['admin', 'organizer']}>
                                <ReportsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
