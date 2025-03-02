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

function App() {
  return (
    <div className="">
      <Chatbot/>
      <BrowserRouter>
      <Navbar/>
        <Routes>
            <Route path='/' element={<LandingPage/>}/>
            <Route path='/about' element={<AboutSection/>}/>
            <Route path="/allFeatures" element={<FeatureSection/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/premium" element={<SubscriptionPlan/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/ai" element={<AutoInvestMent/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
