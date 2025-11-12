# SmartYield Platform - Visual Gallery & Feature Guide

A comprehensive guide to all features, pages, and user interfaces of the SmartYield precision agriculture intelligence platform.

> **Note**: This guide describes each page and feature. To view them, navigate to the corresponding URLs in your running application at `http://0.0.0.0:5000`

---

## Table of Contents
1. [Homepage & Landing](#1-homepage--landing)
2. [Authentication Pages](#2-authentication-pages)
3. [User Features](#3-user-features)
4. [About & Information Pages](#4-about--information-pages)
5. [Contact & Support](#5-contact--support)
6. [Navigation & UI Components](#6-navigation--ui-components)
7. [Design System](#7-design-system--patterns)
8. [User Journeys](#8-key-user-journeys)

---

## 1. Homepage & Landing

**URL**: `/`

### Visual Description

The homepage features a striking hero section with a professional green gradient background that immediately establishes the agricultural theme.

**Header Section:**
- Clean white navigation bar
- "SmartYield" logo in green (top left)
- Navigation links: Home, Predict Yield, CalDyn, About
- Green "Profile" button (top right)

**Hero Content:**
```
SMARTYIELD PLATFORM

Precision agriculture intelligence 
built for agronomists and grower 
networks.

Discover a single pane of glass for seasonal planning, field
monitoring, and data-backed recommendations. Bring certainty to
the decisions that matter most.

[Launch Predict Yield]  [Learn more]
```

**Key Benefits Section** (Right side of hero):
```
Why agribusiness teams choose SmartYield

• Dynamic risk scoring across your portfolio of growers and
  regions.

• Scenario planning that blends weather forecasts with historical
  yields.

• Collaboration workspace for advisors, agronomists, and growers.
```

**Design Elements:**
- Large, bold typography for main headline
- Green (#2D7757) and white color scheme
- Two prominent call-to-action buttons
- Bullet points highlighting key features
- Professional, clean layout with ample white space

**Purpose**: 
Immediately communicate value proposition and encourage users to try the yield prediction feature.

---

## 2. Authentication Pages

### 2.1 Login Page

**URL**: `/login`

### Visual Layout

A centered authentication card on a light background creates a focused user experience.

**Form Card:**
```
Sign In
Welcome back to SmartYield

Email or Phone Number
[Enter your email or phone]

Password
[Enter your password]

                              Forgot password?

[Sign In]

                    or

[🔘 Continue with Google]

Don't have an account? Sign up
```

**Features:**
- **Input Fields**: 
  - Email or Phone Number (text input)
  - Password (masked input)
- **Links**:
  - "Forgot password?" → `/forgot-password`
  - "Sign up" → `/register`
- **Buttons**:
  - Primary: Green "Sign In" button
  - Alternative: White "Continue with Google" button with Google icon
- **Form Validation**:
  - Required field validation
  - Email/phone format checking
  - Password verification

**Technical Details:**
- JWT-based authentication
- Bcrypt password hashing
- OAuth 2.0 with Google
- Secure session management

---

### 2.2 Registration Page

**URL**: `/register`

### Form Layout

A comprehensive registration form collecting all necessary user information for personalized agricultural recommendations.

**Form Structure:**
```
Create Account
Join SmartYield to access yield predictions and insights

Full Name *
[Full name input]

Email *
[Email input]

Phone Number
[+91 1234567890]

Password *          Confirm Password *
[Password]          [Confirm password]

Country *           State *             District *
[Dropdown]          [Dropdown]          [Dropdown]

Gender *            Date of Birth *
[Dropdown]          [Date picker: MM-DD-YYYY]

[Create Account]

Already have an account? Sign in
```

**Field Specifications:**

1. **Personal Information:**
   - Full Name (required, text input)
   - Email (required, email validation)
   - Phone Number (optional, with country code)

2. **Security:**
   - Password (required, min length, complexity)
   - Confirm Password (required, must match)

3. **Location** (Required for location-specific predictions):
   - Country (dropdown)
   - State (dropdown, populated based on country)
   - District (dropdown, populated based on state)

4. **Profile Details:**
   - Gender (dropdown: Male/Female/Other)
   - Date of Birth (date picker)

**Validation Rules:**
- Email format: `user@example.com`
- Phone: Optional but recommended
- Password: Minimum 8 characters
- Passwords must match
- All required fields must be filled
- Location hierarchy enforced (Country → State → District)

**Success Flow:**
1. Fill form with valid data
2. Submit → Backend validates
3. Create user account
4. Hash password with bcrypt
5. Redirect to login or auto-login

---

### 2.3 Password Recovery

**URL**: `/forgot-password`

### Reset Flow

Simple, secure password reset using OTP verification.

**Form Display:**
```
Reset Password
Enter your email or phone to receive an OTP

Email or Phone Number
[Enter your email or phone]

[Send OTP]

Back to Sign In
```

**Recovery Process:**
1. User enters registered email or phone
2. System validates and generates OTP
3. OTP sent via email/SMS
4. User receives and enters OTP
5. OTP verified against database token
6. User creates new password
7. Password updated in database

**Security Features:**
- Time-limited OTP (expires after 15 minutes)
- One-time use tokens
- Secure token storage in `password_resets` table
- Bcrypt hashing for new password

---

## 3. User Features

### 3.1 Yield Prediction Tool

**URL**: `/predict-yield`

**Status**: Requires authentication (redirects to login if not authenticated)

### Expected Interface

**Section 1: Location Selection**
```
Select Your Field Location

🗺️ [Interactive Leaflet Map]
   - Click to select location
   - Displays marker at selected point
   - Shows latitude/longitude

   OR

📍 Location Dropdown
   - Country
   - State
   - District
   - Exact coordinates
```

**Section 2: Crop Parameters**
```
Crop Information

Crop Type: [Dropdown]
- Wheat
- Rice  
- Corn
- Cotton
- Soybean
- etc.

Soil Type: [Dropdown]
- Loamy
- Clay
- Sandy
- Silt
- Mixed

Irrigation: [Dropdown]
- Drip
- Sprinkler
- Flood
- Rainfed
```

**Section 3: Field Details**
```
Field Characteristics

Acreage: [___] hectares

Historical Rainfall: [___] mm/year

Fertilizer Usage: [___] kg/hectare

Sowing Date: [Date Picker]
```

**Section 4: Get Prediction**
```
[Predict Yield]
```

**Section 5: Results Display**

Once prediction is generated:
```
📊 Yield Prediction Results

Predicted Yield: 4.5 tonnes/hectare
Confidence: 85%
Baseline Yield: 4.0 tonnes/hectare

📈 Historical Trends
[Line chart showing yield over past 5 seasons]

⚠️ Risk Alerts
• Low rainfall warning for this season
• Fertilizer application below recommended

✅ Recommended Practices
• Apply additional nitrogen fertilizer
• Consider drip irrigation upgrade
• Monitor soil moisture weekly

🌤️ Weather Outlook
Temperature: Moderate (18-28°C)
Rainfall: Below average (predicted 650mm)
```

**Technologies Used:**
- **Leaflet Maps**: Interactive location selection
- **Recharts**: Data visualization for trends
- **SWR**: Efficient data fetching and caching
- **FastAPI Backend**: `/api/yield/predict` endpoint
- **Heuristic Model**: Current prediction engine

---

### 3.2 CalDyn (Crop Lifecycle Dynamics)

**URL**: `/caldyn`

**Status**: Requires authentication

### Purpose

Track and monitor crop lifecycle from planting to harvest, recording observations, interventions, and predictions.

### Expected Interface

**Dashboard View:**
```
My Crop Lifecycles

[+ New Crop Lifecycle]

Active Crops (3)
┌─────────────────────────────────────┐
│ Wheat Field - North Plot            │
│ Planted: Jan 15, 2025               │
│ Days to Harvest: 45                 │
│ Status: Growth Stage 4/6            │
│ [View Details]                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Rice Paddy - East Field             │
│ Planted: Feb 1, 2025                │
│ Days to Harvest: 90                 │
│ Status: Growth Stage 2/6            │
│ [View Details]                      │
└─────────────────────────────────────┘
```

**Detail View:**
```
Wheat Field - North Plot
━━━━━━━━━━━━━━━━━━━━━━━━━━

Timeline
Jan 15 ●━━━━━━━━━━━━━━━━○ Apr 30
       Planted         Expected Harvest

Growth Stages
✓ Stage 1: Germination (Jan 15-20)
✓ Stage 2: Vegetative (Jan 21-Feb 15)
✓ Stage 3: Tillering (Feb 16-Mar 5)
● Stage 4: Stem Extension (Current)
○ Stage 5: Flowering
○ Stage 6: Grain Fill

Observations & Interventions
━━━━━━━━━━━━━━━━━━━━━━━━━━
Mar 10 - Applied NPK fertilizer (150 kg/ha)
Mar 5  - Observed minor pest activity
Feb 20 - Irrigation completed
Feb 1  - First weeding done
Jan 15 - Sowing completed

[Add Observation]

Weather Impact
━━━━━━━━━━━━━━━━━━━━━━━━━━
Recent rainfall: 45mm (adequate)
Temperature: Optimal for growth
Forecast: Favorable for next 2 weeks

Yield Projection
━━━━━━━━━━━━━━━━━━━━━━━━━━
Expected: 4.8 tonnes/hectare
Confidence: 82%
```

**Features:**
- Create new crop lifecycles
- Track growth stages
- Record observations
- Log interventions (fertilizer, pesticide, irrigation)
- View weather impact
- Monitor harvest predictions
- Historical data comparison

---

### 3.3 User Profile

**URL**: `/profile`

**Status**: Requires authentication

### Expected Interface

```
Profile
━━━━━━━━━━━━━━━━━━━━━━━━━━

Personal Information
────────────────────
Name: John Farmer
Email: john@example.com
Phone: +91 9876543210

Location Details
────────────────
Country: India
State: Karnataka
District: Bangalore
Coordinates: 12.9716°N, 77.5946°E

Profile Details
────────────────
Gender: Male
Date of Birth: January 1, 1990
Age: 35 years

Account Information
────────────────────
Account Created: November 1, 2024
Status: Active
Email Verified: ✓ Yes

[Edit Profile]  [Change Password]

Farming Preferences
────────────────────
Primary Crops: Wheat, Rice
Preferred Soil Type: Loamy
Irrigation Method: Drip

Recent Activity
────────────────────
• Yield prediction for wheat (2 days ago)
• Updated crop lifecycle (5 days ago)  
• Registered account (10 days ago)
```

---

## 4. About & Information Pages

### 4.1 About SmartYield

**URL**: `/about`

### Page Layout

**Header:**
```
ABOUT SMARTYIELD

Building resilient food systems 
through predictive agronomy.
```

**Mission Statement:**
```
SmartYield helps agronomists, input providers, and cooperatives 
align around trusted predictions. We blend satellite data, 
historical records, and hyperlocal weather to deliver forecasts 
and advice that drive better outcomes at scale.
```

**Core Values** (3-column grid):

```
┌─────────────────────────────────────────────────────────┐
│  🌱                  🛰️                    🤝           │
│  Farmer-first       Responsible AI      Open           │
│  intelligence                          collaboration   │
│                                                         │
│  We build with      Models are         APIs and        │
│  agronomists and    explainable,       integrations    │
│  growers to make    auditable, and     let you plug    │
│  complex data       tuned with         SmartYield into │
│  actionable on      agronomic          existing farm   │
│  the ground.        experts to         management      │
│                     maintain trust.    systems.        │
└─────────────────────────────────────────────────────────┘
```

**Roadmap Section:**
```
Where we're headed
━━━━━━━━━━━━━━━━━━━━━━━━━━

2024 - Proof of Concept
       Launch heuristic model and core platform

2025 - ML Integration  
       Deploy machine learning models for better accuracy

2026 - Satellite Data
       Integrate real-time satellite imagery

2027 - Global Expansion
       Scale to multiple countries and crop types
```

---

### 4.2 Our Story

**URL**: `/our-story`

### Journey Timeline

**Header:**
```
OUR STORY

The Journey Behind SmartYield

From historical data to satellite imagery, discover how we 
built a platform that combines the past and the present to 
predict the future of agriculture.
```

**Development Phases:**

```
┌────────────────────────┐  ┌────────────────────────┐
│   🌱                   │  │   🛰️                  │
│   Phase 1              │  │   Phase 2              │
│   The Beginning of     │  │   Seeing Earth from    │
│   the Journey          │  │   Space                │
│                        │  │                        │
│   [Click to read       │  │   [Click to read       │
│    more →]             │  │    more →]             │
└────────────────────────┘  └────────────────────────┘

Phase 1 Details:
- Identified need for accurate yield predictions
- Gathered historical agricultural data
- Developed heuristic models
- Built initial platform prototype

Phase 2 Details:
- Integrated satellite imagery capabilities
- Added weather forecast integration
- Deployed machine learning models
- Expanded to multiple crop types
```

**Call-to-Action:**
```
Ready to experience the technology?

[Get Started]  [Learn More]
```

---

## 5. Contact & Support

**URL**: `/contact`

### Team Directory

```
Contact Us

Have questions or want to collaborate? Reach out to any 
of our team members.

┌─────────────────────────┐ ┌─────────────────────────┐
│ Suresh Datt Joshi       │ │ V Tilak Teja            │
│ 📧 sureshdj9632         │ │ 📧 1hk22cs182           │
│    @gmail.com           │ │    @hkbk.edu.in         │
└─────────────────────────┘ └─────────────────────────┘

┌─────────────────────────┐ ┌─────────────────────────┐
│ Swaran Raj E S          │ │ Tharun R                │
│ 📧 swaranraj733         │ │ 📧 1hk22cs179           │
│    @gmail.com           │ │    @hkbk.edu.in         │
└─────────────────────────┘ └─────────────────────────┘
```

**Contact Form** (Future Enhancement):
```
Send us a message

Name: [_________________]
Email: [_________________]
Subject: [_________________]
Message: 
[_________________________________
 _________________________________
 _________________________________]

[Send Message]
```

---

## 6. Navigation & UI Components

### 6.1 Main Navigation Bar

Present on all pages:

```
╔═══════════════════════════════════════════════════════╗
║ SmartYield    Home  Predict Yield  CalDyn  About  [Profile] ║
╚═══════════════════════════════════════════════════════╝
```

**Elements:**
- **Logo**: "SmartYield" in green (#2D7757)
- **Links**: Home, Predict Yield, CalDyn, About
- **Profile Button**: Green background, white text
- **Responsive**: Adapts to mobile screens
- **Sticky**: Fixed to top on scroll

### 6.2 Footer

```
╔═══════════════════════════════════════════════════════╗
║ © 2025 SmartYield. All rights reserved.               ║
║                            Our story  |  Contact      ║
╚═══════════════════════════════════════════════════════╝
```

---

## 7. Design System & Patterns

### Color Palette

**Primary Colors:**
- **Forest Green**: `#2D7757` - Primary buttons, headers, brand
- **Light Mint**: `#E8F5F0` - Backgrounds, accents
- **White**: `#FFFFFF` - Cards, forms, clean backgrounds

**Text Colors:**
- **Dark Gray**: `#1F2937` - Primary headings
- **Medium Gray**: `#6B7280` - Body text
- **Light Gray**: `#9CA3AF` - Placeholder text

**Status Colors:**
- **Success Green**: `#10B981` - Confirmations
- **Warning Yellow**: `#F59E0B` - Alerts
- **Error Red**: `#EF4444` - Errors
- **Info Blue**: `#3B82F6` - Information

### Typography

```
Headings:
H1: 48px, Bold, Dark Gray
H2: 36px, Bold, Dark Gray
H3: 24px, Semi-bold, Dark Gray
H4: 20px, Semi-bold, Medium Gray

Body:
Regular: 16px, Regular, Medium Gray
Small: 14px, Regular, Light Gray
Caption: 12px, Regular, Light Gray
```

### Component Patterns

**Buttons:**
```css
Primary:
- Background: #2D7757
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Hover: Darker green

Secondary:
- Background: White
- Border: 2px solid #2D7757
- Text: #2D7757
- Hover: Light green background
```

**Input Fields:**
```css
- Border: 1px solid #D1D5DB
- Padding: 12px 16px
- Border Radius: 6px
- Focus: Green border #2D7757
- Placeholder: #9CA3AF
```

**Cards:**
```css
- Background: White
- Border: 1px solid #E5E7EB
- Border Radius: 12px
- Padding: 24px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
```

---

## 8. Key User Journeys

### Journey 1: New User Registration & First Prediction

```
Step 1: Arrive at Homepage
↓
Step 2: Click "Profile" or "Sign up"
↓
Step 3: Fill Registration Form
  - Name, Email, Phone
  - Password
  - Location (Country, State, District)
  - Gender, Date of Birth
↓
Step 4: Submit & Account Created
↓
Step 5: Email Verification (optional)
↓
Step 6: Auto-login or Manual Login
↓
Step 7: Navigate to "Predict Yield"
↓
Step 8: Select Location on Map
↓
Step 9: Enter Crop Parameters
  - Crop type: Wheat
  - Soil type: Loamy
  - Irrigation: Drip
  - Acreage: 5 hectares
  - Rainfall: 800mm
  - Fertilizer: 150 kg/ha
  - Sowing date: January 15
↓
Step 10: Click "Predict Yield"
↓
Step 11: View Results
  - Predicted yield: 4.5 t/ha
  - Confidence: 85%
  - Historical trends chart
  - Risk alerts
  - Recommendations
↓
Step 12: Save or Export Results
```

### Journey 2: Existing User - Track Crop Lifecycle

```
Step 1: Login
↓
Step 2: Navigate to CalDyn
↓
Step 3: Click "New Crop Lifecycle"
↓
Step 4: Enter Crop Details
  - Crop: Rice
  - Location: East Field
  - Planting Date: February 1
  - Expected Harvest: May 15
↓
Step 5: Save Lifecycle
↓
Step 6: Add Observations Over Time
  - Week 1: Germination complete
  - Week 3: First irrigation
  - Week 5: Fertilizer application
  - Week 7: Pest control
↓
Step 7: View Progress
  - Current growth stage
  - Days to harvest
  - Weather impact
  - Yield projection
↓
Step 8: Receive Alerts
  - Irrigation reminder
  - Weather warning
  - Harvest readiness
```

### Journey 3: Password Recovery

```
Step 1: Go to Login Page
↓
Step 2: Click "Forgot password?"
↓
Step 3: Enter Email or Phone
↓
Step 4: Receive OTP
  - Email: OTP sent to inbox
  - SMS: OTP sent to phone
↓
Step 5: Enter OTP
↓
Step 6: OTP Verified
↓
Step 7: Create New Password
↓
Step 8: Password Updated
↓
Step 9: Redirect to Login
↓
Step 10: Login with New Password
```

---

## 9. API Integration

### Frontend-Backend Communication

**API Proxy Route**: `/api/[...proxy]`

All frontend API calls go through Next.js API proxy to the FastAPI backend:

```
Frontend Request → Next.js Proxy → FastAPI Backend
```

**Example API Calls:**

```javascript
// Yield Prediction
POST /api/yield/predict
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "crop_type": "wheat",
  "soil_type": "loamy",
  "irrigation_type": "drip",
  "acreage": 5.0,
  "rainfall": 800,
  "fertilizer_usage": 150,
  "sowing_date": "2025-01-15"
}

// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/reset-password

// Reference Data
GET /api/reference/crops
GET /api/reference/soil-types
GET /api/reference/irrigation-types

// Crop Lifecycle
POST /api/crop-lifecycle
GET /api/crop-lifecycle
PUT /api/crop-lifecycle/{id}
```

---

## 10. Responsive Design

### Breakpoints

```
Mobile:   320px - 767px
Tablet:   768px - 1023px
Desktop:  1024px+
```

### Mobile Adaptations

**Navigation:**
- Mobile: Hamburger menu (likely)
- Tablet: Condensed horizontal menu
- Desktop: Full horizontal menu

**Forms:**
- Mobile: Stacked fields (1 column)
- Tablet: Some side-by-side (2 columns)
- Desktop: Multi-column layout

**Cards:**
- Mobile: Full width, stacked
- Tablet: 2 columns
- Desktop: 3-4 columns

---

## 11. Accessibility

### WCAG 2.1 Compliance

**Visual:**
- Color contrast ratio: 4.5:1 minimum
- Font sizes: Minimum 14px
- Focus indicators: Visible outlines

**Keyboard Navigation:**
- Tab order: Logical flow
- Enter/Space: Button activation
- Escape: Close modals

**Screen Readers:**
- Alt text: All images
- ARIA labels: Interactive elements
- Semantic HTML: Proper heading hierarchy

**Forms:**
- Labels: All inputs labeled
- Error messages: Clear and specific
- Required fields: Marked with *

---

## 12. Performance Metrics

### Target Metrics

```
First Contentful Paint: < 1.5s
Largest Contentful Paint: < 2.5s
Time to Interactive: < 3.5s
Cumulative Layout Shift: < 0.1
```

### Optimization Strategies

**Frontend:**
- Next.js SSR for fast initial load
- Image optimization with Next/Image
- Code splitting and lazy loading
- SWR for efficient data caching

**Backend:**
- FastAPI async/await
- Database query optimization
- Connection pooling
- Response caching

---

## 13. Future Enhancements

### Planned Features

**Q1 2025:**
- [ ] Advanced ML model integration
- [ ] Real-time weather API
- [ ] Export to PDF/Excel
- [ ] Email notifications

**Q2 2025:**
- [ ] Mobile app (iOS/Android)
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Advanced analytics dashboard

**Q3 2025:**
- [ ] Satellite imagery integration
- [ ] Drone data support
- [ ] AI chatbot for advice
- [ ] Community forums

**Q4 2025:**
- [ ] Marketplace for inputs
- [ ] Financial tools integration
- [ ] Government scheme integration
- [ ] Cooperative management tools

---

## How to View Each Page

To explore the SmartYield platform:

1. **Ensure the application is running:**
   ```bash
   # Both frontend and backend should be running
   # Frontend: http://0.0.0.0:5000
   # Backend: http://0.0.0.0:8000
   ```

2. **Navigate to pages:**
   - Homepage: `http://0.0.0.0:5000/`
   - Login: `http://0.0.0.0:5000/login`
   - Register: `http://0.0.0.0:5000/register`
   - About: `http://0.0.0.0:5000/about`
   - Our Story: `http://0.0.0.0:5000/our-story`
   - Contact: `http://0.0.0.0:5000/contact`
   - Predict Yield: `http://0.0.0.0:5000/predict-yield` (requires login)
   - CalDyn: `http://0.0.0.0:5000/caldyn` (requires login)
   - Profile: `http://0.0.0.0:5000/profile` (requires login)

3. **Register an account** to access all features

4. **Use the features** as described in this guide

---

**Gallery Version**: 2.0  
**Last Updated**: November 12, 2025  
**Format**: Descriptive guide without image dependencies  
**Platform Status**: Active Development

---

## Support

For questions about features or functionality:
- Email: See [Contact Page](#5-contact--support)
- Documentation: README.md
- API Docs: `http://0.0.0.0:8000/api/docs`
