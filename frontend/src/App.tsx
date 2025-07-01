import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginRegister from './pages/LoginRegister'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Dictionary from './pages/Dictionary'
import OneWord from './pages/OneWord'
import VocabularyList from './pages/VocabularyList'
import VocabularyReview from './pages/VocabularyReview' 
import ReviewSummary from '@/pages/ReviewSummary'
import PrivateRoute from './components/PrivateRoute';

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/dictionary" element={
          <PrivateRoute><Dictionary /></PrivateRoute>
        } />
        <Route path="/oneword/:word" element={
          <PrivateRoute><OneWord /></PrivateRoute>
        } />
        <Route path="/my-vocab" element={
          <PrivateRoute><VocabularyList /></PrivateRoute>
        } />
        <Route path="/vocabularyreview" element={
          <PrivateRoute><VocabularyReview /></PrivateRoute>
        } />
        <Route path="/review-summary" element={
          <PrivateRoute><ReviewSummary /></PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}