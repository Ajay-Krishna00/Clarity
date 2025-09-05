"use client"
import React, { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Video, MessageCircle, Shield, CheckCircle, Star, MapPin, Award, Languages } from 'lucide-react'

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("video");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    university: "",
    concerns: "",
    previousTherapy: "",
    emergencyContact: "",
    preferredLanguage: "english"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

// Generate availability relative to today
const generateAvailability = () => {
  const availability = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    // Example slots (you can customize per counselor)
    availability[dateKey] = ["09:00", "11:00", "14:00", "16:00"];
  }
  return availability;
};

  // Mock counselors data
  const counselors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      title: "Clinical Psychologist",
      specializations: ["Anxiety Disorders", "Academic Stress", "Depression"],
      experience: "8 years",
      languages: ["English", "Hindi", "Kashmiri"],
      location: "Srinagar",
      rating: 4.9,
      reviews: 127,
      education: "PhD Clinical Psychology, Kashmir University",
      about: "Specializes in helping students manage academic pressure and anxiety. Uses evidence-based approaches including CBT and mindfulness techniques.",
      availability: generateAvailability()

    },
    {
      id: 2,
      name: "Dr. Arjun Mehta",
      title: "Counseling Psychologist",
      specializations: ["Relationship Issues", "Social Anxiety", "Self-esteem"],
      experience: "6 years",
      languages: ["English", "Hindi", "Dogri"],
      location: "Jammu",
      rating: 4.8,
      reviews: 93,
      education: "MA Psychology, Jammu University",
      about: "Focuses on helping young adults navigate relationships and build confidence. Specializes in group therapy and peer counseling approaches.",
      availability: generateAvailability()
    },
    {
      id: 3,
      name: "Dr. Fatima Khan",
      title: "Licensed Therapist",
      specializations: ["Trauma Therapy", "PTSD", "Women's Mental Health"],
      experience: "10 years",
      languages: ["English", "Urdu", "Kashmiri"],
      location: "Srinagar",
      rating: 4.9,
      reviews: 156,
      education: "MSc Clinical Psychology, NIMHANS Bangalore",
      about: "Expert in trauma-informed care and culturally sensitive therapy. Helps students dealing with difficult life experiences and transitions.",
      availability: generateAvailability()
    }
  ];

  const universities = [
    "Kashmir University",
    "Jammu University",
    "NIT Srinagar",
    "IIT Jammu",
    "Islamic University of Science & Technology",
    "Cluster University Srinagar",
    "Cluster University Jammu",
    "SKUAST Kashmir",
    "SKUAST Jammu",
    "Other"
  ];

  const sessionTypes = [
    {
      id: "video",
      name: "Video Call",
      icon: <Video className="w-5 h-5" />,
      description: "Face-to-face session via secure video platform",
      duration: "45-50 minutes"
    },
    {
      id: "audio",
      name: "Audio Call",
      icon: <Phone className="w-5 h-5" />,
      description: "Voice-only session for comfort and privacy",
      duration: "45-50 minutes"
    },
    {
      id: "chat",
      name: "Text Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      description: "Written conversation for those who prefer typing",
      duration: "60 minutes"
    }
  ];

  // Generate next 7 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' })
      });
    }
    return dates;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  const getTimeSlots = () => {
    if (!selectedCounselor || !selectedDate) return [];
    return selectedCounselor.availability[selectedDate] || [];
  };

  if (submitted) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4'>
        <div className='max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-xl'>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Booking Confirmed!</h1>
          <p className='text-gray-600 mb-6'>
            Your counseling session has been scheduled. You'll receive a confirmation email with session details and joining instructions.
          </p>
          
          <div className='bg-gray-50 rounded-lg p-4 mb-6 text-left'>
            <h3 className='font-semibold text-gray-900 mb-2'>Session Details:</h3>
            <p className='text-sm text-gray-600'>
              <strong>Counselor:</strong> {selectedCounselor?.name}<br />
              <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}<br />
              <strong>Time:</strong> {selectedTime}<br />
              <strong>Type:</strong> {sessionTypes.find(t => t.id === sessionType)?.name}
            </p>
          </div>
          
          <div className='flex flex-col gap-3'>
            <a
              href="/chat"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Continue to Chat Support
            </a>
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <a 
                href='/'
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} className='text-gray-600 hover:text-gray-800'/>
              </a>
              
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Book Counseling Session</h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center bg-green-50 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-700 font-medium">Confidential</span>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8'>
        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <span className='text-sm font-medium text-gray-600'>Step {step} of 4</span>
            <span className='text-sm text-gray-500'>{step === 1 ? 'Select Counselor' : step === 2 ? 'Choose Date & Time' : step === 3 ? 'Session Type' : 'Personal Details'}</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div 
              className='bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Counselor */}
        {step === 1 && (
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Choose Your Counselor</h2>
            <div className='grid lg:grid-cols-2 gap-6'>
              {counselors.map(counselor => (
                <div 
                  key={counselor.id}
                  className={`bg-white rounded-2xl p-6 shadow-md border-2 cursor-pointer transition-all duration-300 ${
                    selectedCounselor?.id === counselor.id 
                      ? 'border-indigo-500 shadow-lg' 
                      : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedCounselor(counselor)}
                >
                  <div className='flex items-start space-x-4'>
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className='flex-1'>
                      <h3 className='text-xl font-semibold text-gray-900 mb-1'>{counselor.name}</h3>
                      <p className='text-indigo-600 font-medium mb-2'>{counselor.title}</p>
                      
                      <div className='flex items-center mb-2'>
                        <div className='flex items-center mr-4'>
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className='text-sm font-medium'>{counselor.rating}</span>
                          <span className='text-sm text-gray-500 ml-1'>({counselor.reviews} reviews)</span>
                        </div>
                        <div className='flex items-center'>
                          <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                          <span className='text-sm text-gray-600'>{counselor.location}</span>
                        </div>
                      </div>
                      
                      <div className='mb-3'>
                        <p className='text-sm text-gray-600 mb-1'><strong>Experience:</strong> {counselor.experience}</p>
                        <p className='text-sm text-gray-600'><strong>Languages:</strong> {counselor.languages.join(', ')}</p>
                      </div>
                      
                      <div className='mb-3'>
                        <p className='text-sm text-gray-700 font-medium mb-1'>Specializations:</p>
                        <div className='flex flex-wrap gap-2'>
                          {counselor.specializations.map(spec => (
                            <span key={spec} className='bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs'>
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p className='text-sm text-gray-600 line-clamp-2'>{counselor.about}</p>
                    </div>
                  </div>
                  
                  {selectedCounselor?.id === counselor.id && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                      <div className='flex items-center text-indigo-600'>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className='font-medium'>Selected</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className='mt-8 flex justify-end'>
              <button 
                onClick={() => setStep(2)}
                disabled={!selectedCounselor}
                className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300'
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Select Date & Time</h2>
            
            <div className='grid lg:grid-cols-2 gap-8'>
              {/* Date Selection */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Choose Date</h3>
                <div className='grid grid-cols-2 gap-3'>
                  {getAvailableDates().map(dateObj => (
                    <button
                      key={dateObj.date}
                      onClick={() => setSelectedDate(dateObj.date)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        selectedDate === dateObj.date
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className='font-semibold text-gray-900'>{dateObj.dayName}</div>
                      <div className='text-sm text-gray-600'>{dateObj.display}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Available Times</h3>
                {selectedDate ? (
                  <div className='grid grid-cols-2 gap-3'>
                    {getTimeSlots().map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                          selectedTime === time
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className='flex items-center justify-center'>
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-500 text-center py-8'>Please select a date first</p>
                )}
              </div>
            </div>
            
            <div className='mt-8 flex justify-between'>
              <button 
                onClick={() => setStep(1)}
                className='bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-colors'
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300'
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Session Type */}
        {step === 3 && (
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Choose Session Type</h2>
            
            <div className='grid md:grid-cols-3 gap-6 mb-8'>
              {sessionTypes.map(type => (
                <div
                  key={type.id}
                  className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 ${
                    sessionType === type.id
                      ? 'border-indigo-500 shadow-lg'
                      : 'border-gray-200 hover:shadow-lg hover:border-gray-300'
                  }`}
                  onClick={() => setSessionType(type.id)}
                >
                  <div className='text-center'>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      sessionType === type.id ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}>
                      <div className={sessionType === type.id ? 'text-indigo-600' : 'text-gray-600'}>
                        {type.icon}
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>{type.name}</h3>
                    <p className='text-sm text-gray-600 mb-2'>{type.description}</p>
                    <p className='text-xs text-gray-500'>{type.duration}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className='mt-8 flex justify-between'>
              <button 
                onClick={() => setStep(2)}
                className='bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-colors'
              >
                Back
              </button>
              <button 
                onClick={() => setStep(4)}
                className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300'
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Personal Details */}
        {step === 4 && (
          <div>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Personal Information</h2>
            
            <div className='bg-white rounded-2xl p-8 shadow-md'>
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="18"
                    min="16"
                    max="100"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className='block text-sm font-medium text-gray-700 mb-2'>University/College *</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="Enter your university/college"
                  />
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700'
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="kashmiri">Kashmiri</option>
                    <option value="urdu">Urdu</option>
                    <option value="dogri">Dogri</option>
                  </select>
                </div>
                
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Emergency Contact Number</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className='block text-sm font-medium text-gray-700 mb-2'>What would you like to discuss? *</label>
                  <textarea
                    name="concerns"
                    value={formData.concerns}
                    onChange={handleInputChange}
                    rows="4"
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                    placeholder="Please share what's on your mind or what you'd like support with..."
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Have you had therapy/counseling before?</label>
                  <select
                    name="previousTherapy"
                    value={formData.previousTherapy}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-700 focus:ring-indigo-500 focus:border-transparent'
                  >
                    <option value="">Select an option</option>
                    <option value="no">No, this is my first time</option>
                    <option value="yes-helpful">Yes, and it was helpful</option>
                    <option value="yes-mixed">Yes, but it was mixed experience</option>
                    <option value="yes-unhelpful">Yes, but it wasn't helpful</option>
                  </select>
                </div>
              </div>
              
              {/* Privacy Notice */}
              <div className='mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                <div className='flex items-start'>
                  <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className='text-sm font-medium text-blue-900 mb-1'>Privacy & Confidentiality</h4>
                    <p className='text-sm text-blue-700'>
                      All information shared is confidential and protected under government privacy policies. 
                      Your data is encrypted and only accessible to your assigned counselor and necessary medical personnel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='mt-8 flex justify-between'>
              <button 
                onClick={() => setStep(3)}
                className='bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition-colors'
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.age || !formData.university || !formData.concerns}
                className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center'
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Booking...
                  </>
                ) : (
                  'Complete Booking'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage