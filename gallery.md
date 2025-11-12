# SmartYield Platform - Visual Gallery

A comprehensive visual tour of the SmartYield precision agriculture intelligence platform, showcasing all features, pages, and user interfaces.

---

## Table of Contents
1. [Homepage & Landing](#1-homepage--landing)
2. [Authentication Pages](#2-authentication-pages)
3. [User Features](#3-user-features)
4. [About & Information Pages](#4-about--information-pages)
5. [Contact & Support](#5-contact--support)
6. [Navigation & UI Components](#6-navigation--ui-components)

---

## 1. Homepage & Landing

### Main Landing Page
![Homepage - Hero Section](screenshots/homepage-hero.png)

**Features Displayed:**
- **Hero Banner**: "Precision agriculture intelligence built for agronomists and grower networks"
- **Platform Introduction**: Clear value proposition for agribusiness teams
- **Key Benefits**:
  - Dynamic risk scoring across portfolio of growers and regions
  - Scenario planning with weather forecasts and historical yields
  - Collaboration workspace for advisors, agronomists, and growers
- **Call-to-Action Buttons**:
  - "Launch Predict Yield" - Quick access to prediction tool
  - "Learn more" - Additional information
- **Navigation Bar**: Clean header with Home, Predict Yield, CalDyn, About, and Profile links
- **Color Scheme**: Professional green theme representing agriculture

**Purpose**: 
The landing page introduces visitors to SmartYield's core value proposition and encourages them to explore yield prediction capabilities. The design emphasizes trust, professionalism, and agricultural expertise.

---

## 2. Authentication Pages

### 2.1 Login Page
![Login Page](screenshots/login-page.png)

**Features:**
- **Centered Login Form**:
  - Email or Phone Number input field
  - Password input field (masked)
  - "Forgot password?" link for account recovery
- **Primary Action**: Green "Sign In" button
- **Alternative Login**: "Continue with Google" OAuth option
- **New User Link**: "Don't have an account? Sign up" for registration
- **Clean Design**: Minimalist form with clear labels and placeholders
- **Welcome Message**: "Welcome back to SmartYield"

**User Flow**:
1. Enter email/phone and password
2. Click "Sign In" to authenticate
3. Or use Google OAuth for quick login
4. Access to forgot password recovery
5. Link to registration for new users

**Security Features**:
- Password masking for privacy
- JWT token-based authentication
- Secure credential validation

---

### 2.2 Registration Page
![Registration Page - Top Section](screenshots/register-page-top.png)

**Form Fields - Personal Information:**
- **Full Name** * (Required)
- **Email** * (Required, with validation)
- **Phone Number** (Optional, with country code placeholder)
- **Password** * (Required, with strength requirements)
- **Confirm Password** * (Required, must match)

**Form Fields - Location Details:**
- **Country** * (Required dropdown)
- **State** * (Required dropdown)
- **District** * (Required dropdown)

**Form Fields - Profile Details:**
- **Gender** * (Required dropdown: Male/Female/Other)
- **Date of Birth** * (Required, date picker)

**Action Button**:
- Primary "Create Account" button in green
- Link to "Sign in" for existing users

**Purpose**: 
Comprehensive user registration collecting essential farmer/agronomist information for personalized predictions and location-specific recommendations.

**Validation Features**:
- Email format validation
- Password matching verification
- Required field indicators (*)
- Location hierarchy (Country → State → District)

---

### 2.3 Password Recovery Page
![Forgot Password Page](screenshots/forgot-password.png)

**Features:**
- **Title**: "Reset Password"
- **Instructions**: "Enter your email or phone to receive an OTP"
- **Input Field**: Email or Phone Number
- **Action Button**: "Send OTP" in green
- **Back Link**: "Back to Sign In" for navigation

**Recovery Process**:
1. User enters registered email or phone
2. System sends One-Time Password (OTP)
3. User verifies OTP
4. User sets new password

**Security**:
- OTP-based verification
- Time-limited reset tokens
- Secure password reset flow

---

## 3. User Features

### 3.1 Yield Prediction Tool
![Predict Yield Page](screenshots/predict-yield.png)

**Page Status**: Currently shows blank/loading state (requires authentication)

**Expected Features** (when authenticated):
- **Location Selection**:
  - Interactive map with Leaflet for precise location selection
  - Or dropdown-based location picker
  - Latitude/longitude coordinates
  - Location name/region
  
- **Crop Parameters**:
  - Crop type selection (wheat, rice, corn, etc.)
  - Soil type (loamy, clay, sandy, etc.)
  - Irrigation method (drip, sprinkler, flood, rainfed)
  
- **Field Details**:
  - Field acreage/size
  - Historical rainfall data
  - Fertilizer usage patterns
  - Sowing date
  
- **Prediction Results**:
  - Predicted yield (tonnes per hectare)
  - Confidence score (0-100%)
  - Baseline yield comparison
  - Historical trend charts (Recharts visualization)
  - Risk alerts and warnings
  - Recommended farming practices
  - Weather outlook

**Technology**:
- Leaflet maps for location selection
- Recharts for data visualization
- Real-time prediction API
- Heuristic/ML model integration

---

### 3.2 CalDyn (Crop Lifecycle Dynamics)
![CalDyn Page](screenshots/caldyn.png)

**Page Status**: Authentication required

**Expected Features**:
- **Crop Lifecycle Tracking**:
  - Planting date recording
  - Growth stage monitoring
  - Milestone tracking
  - Days to harvest calculation
  
- **Field Observations**:
  - Regular crop health updates
  - Intervention recording (fertilizer, pesticide)
  - Weather impact notes
  - Pest/disease observations
  
- **Timeline Visualization**:
  - Visual timeline of crop lifecycle
  - Stage transitions
  - Critical events marking
  - Harvest predictions

**Purpose**: 
Track complete crop journey from sowing to harvest, enabling data-driven decisions throughout the growing season.

---

### 3.3 User Profile
![Profile Page](screenshots/profile.png)

**Page Status**: Authentication required (shows Profile button in navigation)

**Expected Features**:
- **User Information**:
  - Name, email, phone
  - Location details (country, state, district)
  - Date of birth, gender
  - Account creation date
  
- **Account Settings**:
  - Update personal information
  - Change password
  - Email verification status
  - Account activity
  
- **Farming Details**:
  - Farm locations
  - Crop preferences
  - Historical data access
  
- **Subscription/Plan**:
  - Current plan details
  - Usage statistics
  - Upgrade options

**Profile Management**:
- Edit profile information
- Update location data
- Manage preferences
- View account history

---

## 4. About & Information Pages

### 4.1 About SmartYield
![About Page - Top Section](screenshots/about-page.png)

**Content Displayed:**
- **Page Header**: "ABOUT SMARTYIELD"
- **Main Headline**: "Building resilient food systems through predictive agronomy"

**Mission Statement**:
"SmartYield helps agronomists, input providers, and cooperatives align around trusted predictions. We blend satellite data, historical records, and hyperlocal weather to deliver forecasts and advice that drive better outcomes at scale."

**Core Values** (3-column layout):

1. **Farmer-first intelligence**
   - Icon: 🌱 Green leaf
   - Description: "We build with agronomists and growers to make complex data actionable on the ground."

2. **Responsible AI**
   - Icon: 🛰️ Satellite
   - Description: "Models are explainable, auditable, and tuned with agronomic experts to maintain trust."

3. **Open collaboration**
   - Icon: 🤝 (implied)
   - Description: "APIs and integrations let you plug SmartYield into existing farm management systems."

**Section**: "Where we're headed"
- Timeline/roadmap preview visible at bottom

**Design Elements**:
- Clean, professional layout
- Green accent colors
- Icon-based feature presentation
- Readable typography
- Ample white space

**Purpose**: 
Communicate SmartYield's mission, values, and approach to agricultural technology, building trust with potential users.

---

### 4.2 Our Story
![Our Story Page](screenshots/our-story.png)

**Content:**
- **Page Header**: "OUR STORY"
- **Title**: "The Journey Behind SmartYield"
- **Subtitle**: "From historical data to satellite imagery, discover how we built a platform that combines the past and the present to predict the future of agriculture."

**Development Phases**:

**Phase 1: The Beginning of the Journey**
- Icon: 🌱 Seedling
- Description: "The Beginning of the Journey"
- Action: "Click to read more →"

**Phase 2: Seeing Earth from Space**
- Icon: 🛰️ Satellite
- Description: "Seeing Earth from Space"
- Action: "Click to read more →"

**Call-to-Action Section**:
- **Message**: "Ready to experience the technology?"
- Encourages users to try the platform

**Storytelling Elements**:
- Visual journey presentation
- Phase-based narrative
- Expandable story sections
- Technology evolution showcase

**Purpose**: 
Build emotional connection with users by sharing the platform's development journey and technological evolution.

---

## 5. Contact & Support

### 5.1 Contact Page
![Contact Page](screenshots/contact-page.png)

**Page Header**: "Contact Us"
**Subtitle**: "Have questions or want to collaborate? Reach out to any of our team members."

**Team Members** (4-person grid):

**Row 1:**
1. **Suresh Datt Joshi**
   - 📧 Email: sureshdj9632@gmail.com
   - Role: Team Lead/Developer

2. **V Tilak Teja**
   - 📧 Email: 1hk22cs182@hkbk.edu.in
   - Role: Developer

**Row 2:**
3. **Swaran Raj E S**
   - 📧 Email: swaranraj733@gmail.com
   - Role: Developer

4. **Tharun R**
   - 📧 Email: 1hk22cs179@hkbk.edu.in
   - Role: Developer

**Design Features**:
- Grid layout with card-based design
- Email icons for easy identification
- Clean, professional presentation
- Consistent formatting
- Direct contact information

**Footer Links**:
- Our story
- Contact

**Copyright**: "© 2025 SmartYield. All rights reserved."

**Purpose**: 
Provide multiple contact points for inquiries, support, and collaboration opportunities. Shows team transparency and accessibility.

---

## 6. Navigation & UI Components

### 6.1 Main Navigation Bar

**Elements** (Present on all pages):
- **Logo/Brand**: "SmartYield" (top left, green text)
- **Navigation Links**:
  - Home
  - Predict Yield
  - CalDyn
  - About
- **Profile Button**: Green button (top right)

**Responsive Design**:
- Horizontal layout for desktop
- Sticky navigation (always visible)
- Active page indication
- Hover effects on links

**Color Scheme**:
- Primary: Forest green (#2D7757 approx)
- Background: Light mint/white
- Text: Dark gray/black
- Accent: Green for buttons and active states

---

### 6.2 Footer

**Elements**:
- **Copyright**: "© 2025 SmartYield. All rights reserved."
- **Quick Links**:
  - Our story
  - Contact

**Design**:
- Minimal, single-row footer
- Consistent across all pages
- Links aligned right
- Copyright aligned left

---

## 7. Design System & Patterns

### Color Palette
- **Primary Green**: #2D7757 (buttons, headers, branding)
- **Light Green**: #E8F5F0 (backgrounds, accents)
- **White**: #FFFFFF (cards, forms)
- **Gray**: #6B7280 (text, borders)
- **Dark**: #1F2937 (headings, primary text)

### Typography
- **Headings**: Bold, large sans-serif
- **Body Text**: Regular weight, readable size
- **Forms**: Clear labels, placeholder text
- **Buttons**: Medium weight, uppercase or sentence case

### Component Patterns

**Buttons**:
- Primary: Green background, white text, rounded corners
- Secondary: White background, green border, green text
- Large: Full-width on forms
- Small: Inline actions

**Forms**:
- Clean input fields with borders
- Clear labels above inputs
- Required field indicators (*)
- Validation messages
- Grouped related fields
- Progressive disclosure

**Cards**:
- White background
- Subtle shadow
- Rounded corners
- Consistent padding
- Hover effects

**Icons**:
- Emoji-based for features (🌱, 🛰️, 📧)
- Consistent sizing
- Meaningful representations

---

## 8. Key User Journeys

### Journey 1: New User Registration
1. Land on homepage
2. Click "Sign up" or Profile button
3. Fill registration form
4. Verify email
5. Complete profile
6. Access prediction tools

### Journey 2: Yield Prediction
1. Login to account
2. Navigate to "Predict Yield"
3. Select location (map or dropdown)
4. Enter crop and field parameters
5. Submit prediction request
6. View results with visualizations
7. Save or export predictions

### Journey 3: Crop Tracking
1. Access CalDyn feature
2. Create new crop lifecycle
3. Record planting details
4. Add observations over time
5. Track growth milestones
6. Monitor harvest timeline
7. Review historical data

---

## 9. Accessibility Features

### Design Considerations
- **High Contrast**: Text easily readable on backgrounds
- **Clear Labels**: All form fields clearly labeled
- **Button States**: Visible hover and active states
- **Error Messages**: Clear validation feedback
- **Keyboard Navigation**: Form tab order logical
- **Responsive**: Works on various screen sizes

### Form Accessibility
- Required fields marked with *
- Input placeholders provide examples
- Error states clearly indicated
- Success feedback on actions
- Password visibility toggle (standard practice)

---

## 10. Mobile Responsiveness

### Responsive Features
- **Fluid Layouts**: Content adapts to screen width
- **Touch-Friendly**: Buttons sized for touch input
- **Readable Text**: Font sizes scale appropriately
- **Simplified Navigation**: Mobile menu patterns
- **Form Optimization**: Mobile-friendly inputs

### Breakpoints
- Desktop: Full navigation, multi-column layouts
- Tablet: Adapted layouts, preserved features
- Mobile: Stacked layouts, hamburger menu (likely)

---

## 11. Performance Optimizations

### Frontend
- **Next.js**: Server-side rendering for fast initial load
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Lazy loading of routes
- **SWR Caching**: Efficient data fetching and caching
- **Tailwind CSS**: Purged, optimized stylesheets

### Backend
- **FastAPI**: Async/await for concurrent requests
- **Database**: Connection pooling, indexed queries
- **Caching**: API response caching where appropriate

---

## 12. Feature Highlights

### Completed Features ✅
- Homepage with value proposition
- User authentication (register/login)
- Password recovery system
- About page with mission/values
- Our story timeline
- Contact page with team info
- Navigation system
- Responsive design foundation

### In Development 🚧
- Yield prediction interface
- Interactive map integration
- Crop lifecycle tracking (CalDyn)
- User profile management
- Data visualization dashboards

### Planned Features 📋
- Advanced ML model integration
- Real-time weather integration
- Satellite imagery analysis
- Multi-farm portfolio management
- Export/reporting capabilities
- Mobile application
- API for third-party integrations

---

## 13. Technical Implementation

### Screenshots Show:
- **Next.js 14**: App Router architecture
- **React 18**: Modern component patterns
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type-safe development
- **Clean URLs**: RESTful routing structure
- **OAuth Ready**: Google sign-in integration

### Page Routes Identified:
```
/                    → Homepage
/login               → Sign in page
/register            → Create account
/forgot-password     → Password recovery
/predict-yield       → Yield prediction tool
/caldyn              → Crop lifecycle
/about               → About SmartYield
/our-story           → Platform journey
/contact             → Team contacts
/profile             → User profile
```

---

## Conclusion

The SmartYield platform demonstrates a well-designed, comprehensive agricultural intelligence system with:

✅ **Professional UI/UX**: Clean, consistent design across all pages
✅ **Complete Authentication**: Secure user registration and login
✅ **Clear Value Proposition**: Mission and benefits clearly communicated
✅ **User-Centric Design**: Intuitive navigation and workflows
✅ **Agricultural Focus**: Purpose-built for farming and agronomy
✅ **Scalable Architecture**: Built on modern, performant technologies
✅ **Accessibility**: Thoughtful design for all users
✅ **Responsive**: Works across devices

**Target Users**: Farmers, agronomists, agricultural cooperatives, input providers
**Primary Goal**: Data-driven yield predictions and farming recommendations
**Technology Stack**: Next.js, React, FastAPI, PostgreSQL, Leaflet, Recharts

---

**Gallery Version**: 1.0  
**Last Updated**: November 12, 2025  
**Screenshots Count**: 9 pages documented  
**Platform Status**: Active Development
