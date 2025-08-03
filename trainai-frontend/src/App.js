import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '', height: '', weight: '', gender: '', activity: '',
    time: '', goal: '', preference: ''
  });
  const [result, setResult] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showForm ? 'auto' : 'hidden';
  }, [showForm]);

  useEffect(() => {
    if (!result) return;
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + result.charAt(i));
      i++;
      if (i >= result.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [result]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await axios.post("https://trainai-backend.onrender.com/generate", formData);
      setResult(res.data.plan);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setResult(`Error: ${errorMsg}`);
    }
    setLoading(false);
  };

  const handleBuildClick = () => {
    setShowHero(false);
    setTimeout(() => setShowForm(true), 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="navbar">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="TrainAI Logo" className="logo" />
        <span className="logo-text">TRAINAI</span>
      </div>

      <div className="top-right-link">CALORIETRACK</div>

      <div className={`hero-section ${!showHero ? 'fade-out' : ''}`}>
        <div className="hero-text">
          Your AI personal trainer<br />
          Custom plans. Real progress.
        </div>
        <div className="button-wrapper">
          <button className="build-button" onClick={handleBuildClick}>BUILD YOUR PLAN</button>
        </div>
      </div>

      {showForm && (
        <div className="container form-appear" key={step}>
          <div className="form-step">
            <p className="step-counter">Step {step} of 6</p>

            {step === 1 && (
              <>
                <input name="age" placeholder="Age" onChange={handleChange} required />
                <input name="height" placeholder="Height (cm)" onChange={handleChange} required />
                <input name="weight" placeholder="Weight (kg or lbs)" onChange={handleChange} required />
                <select className="custom-select" name="gender" onChange={handleChange} required defaultValue="">
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <button className="next-button" onClick={() => setStep(2)}>NEXT</button>
              </>
            )}

            {step === 2 && (
              <>
                <select className="custom-select" name="activity" onChange={handleChange} required defaultValue="">
                  <option value="" disabled>Select Activity Level</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Lightly Active</option>
                  <option value="moderate">Moderately Active</option>
                  <option value="very">Very Active</option>
                </select>
                <button className="next-button" onClick={() => setStep(3)}>NEXT</button>
              </>
            )}

            {step === 3 && (
              <>
                <input name="time" placeholder="Workout time per day (e.g. 45 mins)" onChange={handleChange} required />
                <button className="next-button" onClick={() => setStep(4)}>NEXT</button>
              </>
            )}

            {step === 4 && (
              <>
                <input name="goal" placeholder="Your fitness goal (e.g. build muscle)" onChange={handleChange} required />
                <button className="next-button" onClick={() => setStep(5)}>NEXT</button>
              </>
            )}

            {step === 5 && (
              <>
                <select className="custom-select" name="preference" onChange={handleChange} required defaultValue="">
                  <option value="" disabled>Preferred Training Type</option>
                  <option value="calisthenics">Calisthenics</option>
                  <option value="gym">Gym</option>
                  <option value="both">Both</option>
                </select>
                <button className="next-button" onClick={() => setStep(6)}>NEXT</button>
              </>
            )}

            {step === 6 && (
              <>
                <h3>Ready to generate your plan?</h3>
                <button className="next-button" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'GENERATING...' : 'GENERATE'}
                </button>
              </>
            )}

            {result && (
              <div className="result-container">
                <button className="copy-button" onClick={copyToClipboard}>
                  {copied ? "Copied!" : "COPY PLAN"}
                </button>
                <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{displayedText}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
