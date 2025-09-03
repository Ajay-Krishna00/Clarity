# Clarity - Digital Mental Health Support System

[![Government of J&K](https://img.shields.io/badge/Government-Jammu%20%26%20Kashmir-blue)](https://jk.gov.in)
[![Higher Education Department](https://img.shields.io/badge/Department-Higher%20Education-green)](https://highereducationjk.gov.in)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com)

## 🎯 Overview

**Clarity** is a comprehensive digital mental health support platform developed as an initiative by the **Government of Jammu & Kashmir's Higher Education Department**. The platform provides confidential, accessible mental health support specifically designed for students across universities and colleges in the J&K region.

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

### Prerequisites
- Node.js 18+ and npm/yarn
- Next.js 14+
- React 18+
- Tailwind CSS 3+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jk-govt/clarity-mental-health.git
   cd clarity-mental-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
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
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
clarity-mental-health/
├── app/
│   ├── api/
│   │   ├── chatbot/
│   │   ├── booking/
│   │   └── resources/
│   ├── chat/
│   ├── resources/
│   ├── booking/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ui/
│   ├── ChatInterface.jsx
│   ├── ResourceCard.jsx
│   └── BookingForm.jsx
├── lib/
│   ├── utils.js
│   ├── db.js
│   └── auth.js
├── public/
│   ├── images/
│   └── icons/
├── styles/
├── README.md
├── package.json
└── tailwind.config.js
```

## 🛠️ API Endpoints

### Chat API
```javascript
POST /api/chatbot
Content-Type: application/json
{
  "message": [["user_message", "user"], ["previous_message", "model"]]
}
```

### Resources API
```javascript
GET /api/resources
GET /api/resources/:category
POST /api/resources/track-usage
```

### Booking API
```javascript
GET /api/booking/availability
POST /api/booking/create
PUT /api/booking/:id
DELETE /api/booking/:id
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (600-700) - Trust, stability
- **Secondary**: Purple (600-700) - Creativity, calm
- **Success**: Green (500-600) - Positive actions
- **Warning**: Yellow (500-600) - Caution
- **Error**: Red (500-600) - Alerts
- **Neutral**: Gray (50-900) - Text, backgrounds

### Typography
- **Headings**: Inter, System fonts
- **Body**: System UI, Sans-serif
- **Monospace**: Fira Code, Consolas

### Components
- **Cards**: Rounded corners (12px), subtle shadows
- **Buttons**: Gradient backgrounds, hover states
- **Forms**: Focus rings, validation states
- **Chat**: Message bubbles, smooth animations

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configurations:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'clarity.jk.gov.in'],
  }
}
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Components and utilities
- **Integration Tests**: API endpoints
- **E2E Tests**: User workflows
- **Accessibility Tests**: WCAG compliance

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables (Production)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.clarity.jk.gov.in
DATABASE_URL=your_production_db_url
REDIS_URL=your_redis_url
```

### Deployment Platforms
- **Recommended**: Vercel, Netlify
- **Government Cloud**: NIC Cloud, AWS GovCloud
- **Self-hosted**: Docker, Kubernetes

## 📊 Analytics & Monitoring

### Built-in Analytics
- User engagement metrics
- Chat usage statistics
- Resource access tracking
- Appointment booking rates

### External Integrations
- Google Analytics 4
- Sentry (Error tracking)
- LogRocket (User sessions)
- Uptime monitoring

## 🔒 Security & Compliance

### Security Features
- **Data Encryption**: AES-256 encryption at rest
- **Transport Security**: TLS 1.3 for data in transit
- **Authentication**: Multi-factor authentication
- **Session Management**: Secure session handling
- **Input Validation**: XSS and SQL injection protection

### Compliance Standards
- **HIPAA**: Health information protection
- **GDPR**: Data privacy regulations
- **Government Standards**: J&K government IT policies
- **Accessibility**: WCAG 2.1 AA compliance

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **JavaScript**: ESLint + Prettier
- **React**: React Hooks, functional components
- **CSS**: Tailwind CSS utilities
- **Commits**: Conventional commit messages

### Review Process
- Code review by 2+ maintainers
- Automated testing must pass
- Security scan approval
- Accessibility compliance check

## 📞 Support & Contact

### Technical Support
- **Email**: tech-support@clarity.jk.gov.in
- **Phone**: +91-194-XXXX-XXX
- **Hours**: Monday-Friday, 9 AM - 6 PM IST

### Mental Health Crisis
- **National Suicide Prevention**: 988
- **J&K Helpline**: 1800-XXX-XXXX
- **Emergency Services**: 112

### Government Contacts
- **Higher Education Department**: hed@jk.gov.in
- **IT Department**: it@jk.gov.in
- **Project Lead**: project-clarity@jk.gov.in

## 📜 License

This project is developed under the **Government of Jammu & Kashmir** and is subject to government licensing terms. Unauthorized use, distribution, or modification is prohibited.

```
© 2025 Government of Jammu & Kashmir
Higher Education Department
All Rights Reserved
```

## 🏆 Acknowledgments

### Development Team
- **Project Lead**: Higher Education Department, J&K
- **Technical Team**: Government IT Department
- **Mental Health Consultants**: Regional Mental Health Board
- **UI/UX Design**: Digital India Initiative

### Special Thanks
- Students and faculty who provided feedback
- Mental health professionals who guided development
- Open source community for tools and libraries
- Government stakeholders for their support

---

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Initial release with core features
- ✅ AI chat support system
- ✅ Resource management
- ✅ Appointment booking
- ✅ Government branding integration

### v1.1.0 (Planned)
- 🔜 Multilingual support (Hindi, Urdu, Kashmiri)
- 🔜 Mobile app development
- 🔜 Advanced analytics dashboard
- 🔜 Integration with hospital systems

---

**Built with ❤️ for the students of Jammu & Kashmir as part of Smart India Hackathon 2025**