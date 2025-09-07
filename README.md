# Clarity - Digital Mental Health Support System

[![Government of J&K](https://img.shields.io/badge/Government-Jammu%20%26%20Kashmir-blue)](https://jk.gov.in)
[![Higher Education Department](https://img.shields.io/badge/Department-Higher%20Education-green)](https://highereducationjk.gov.in)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com)

## 🎯 Overview

**Clarity** is a comprehensive digital mental health support platform developed as an initiative for the **Government of Jammu & Kashmir's Higher Education Department** as part of Smart India Hackathon 2025. The platform provides confidential, accessible mental health support specifically designed for students across universities and colleges.

## 🌟 Key Features

### 🤖 AI-Powered Chat Support

- 24/7 availability with intelligent conversational AI
- Confidential and encrypted conversations
- Crisis intervention protocols with emergency resources
- Contextual mental health guidance

### 📚 Self-Help Resources

- Curated mental health resources for students
- Coping strategies and wellness tools
- Educational content on stress management
- Downloadable guides and worksheets

### 📅 Professional Counseling

- Online appointment booking with licensed counselors
- Video/audio consultation options
- Specialized support for academic stress
- Integration with local mental health services

### 🔐 Privacy & Security

- End-to-end encryption for all communications
- Government-backed privacy protection
- Anonymous usage options
- HIPAA-compliant data handling

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ajay-Krishna00/Clarity
   cd Clarity
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory
   <!-- ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=your_api_endpoint
   CHATBOT_API_KEY=your_chatbot_api_key

   # Database Configuration
   DATABASE_URL=your_database_connection_string

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000

   # Email Service
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your_email
   EMAIL_SERVER_PASSWORD=your_app_password

   # Calendar Integration
   GOOGLE_CALENDAR_API_KEY=your_google_calendar_key
   ``` -->

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ API Endpoints

### Chat API

```javascript
POST /api/chatbot
Content-Type: application/json
{
  "message": [["user_message", "user"], ["previous_message", "model"]]
}
```

---

**Built with ❤️ for the students by students as part of Smart India Hackathon 2025**
