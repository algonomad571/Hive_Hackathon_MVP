import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/Core/LandingPage";
import AboutSection from "./Components/Common/AboutSection";
import LoginPage from "./Components/Authentication/Login";
import SignupPage from "./Components/Authentication/Signup";
import SubscriptionPlan from "./Components/Common/SubscriptionPlan";
import AutoInvestMent from "./AiAssistant/AutoInvestMent";
import Dashboard from "./Analysis/Dashboard";
import FeatureSection from "./Components/Core/FeatureSection";
import Chatbot from "./AiAssistant/Chatbot";
import Navbar from "./Components/Common/Navbar";
import Footer from "./Components/Common/Footer";
import Profile from "./Analysis/Profile"; // Import the Profile component
import AiSimulator from "./Analysis/AiSimulator";

function App() {
  console.log('App rendering'); // Debug log
  return (
    <div className="min-h-screen bg-gray-900">
      <Chatbot/>
      <BrowserRouter>
        <Navbar/>
        <div className="pt-16"> {/* Add padding-top here to account for fixed navbar */}
          <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/about' element={<AboutSection/>}/>
            <Route path="/features" element={<FeatureSection/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/premium" element={<SubscriptionPlan/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/ai" element={<AutoInvestMent/>}/>
            <Route path="/simulator" element={<AiSimulator />} />
            <Route path="/profile" element={<Profile />}/>
          </Routes>
          <Footer/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
