# AI-Powered Digital HR Management System

## Overview

The AI-Powered Digital HR Management System is a modern web-based platform designed to streamline and automate core human resource operations through intelligent workflows and AI-assisted decision-making. The project focuses on reducing repetitive HR tasks, improving recruitment efficiency, simplifying employee management, and providing data-driven insights for organizations.

The platform simulates a scalable digital HR ecosystem where employees, HR personnel, and recruitment processes interact within a centralized interface. By combining frontend architecture with AI integration, the application demonstrates how modern HR operations can be transformed using intelligent automation.

---

## Problem Statement

Traditional HR systems often rely heavily on manual processes for recruitment, leave management, employee tracking, and performance monitoring. These workflows are time-consuming, repetitive, and prone to inconsistencies.

This project addresses these challenges by introducing:
- AI-assisted resume analysis
- Centralized employee and HR dashboards
- Automated leave management workflows
- Recruitment pipeline tracking
- Intelligent HR insights and recommendations

---

## Key Features

### Employee Dashboard
- Employee workspace with attendance and performance overview
- Leave application system with approval workflow
- Dynamic leave balance updates
- Interactive HR assistant chatbot

### HR Dashboard
- Centralized employee management interface
- Leave request approval and rejection system
- HR analytics and workforce insights
- Department and employee overview

### AI Resume Analyzer
- Resume and job description comparison
- AI-generated match scoring
- Candidate strengths and weaknesses analysis
- Recruitment recommendations
- Automatic candidate pipeline integration

### Recruitment Pipeline
- Multi-stage recruitment workflow
- Candidate tracking across hiring stages
- AI-assisted candidate evaluation
- Recruitment analytics and insights

### Attendance & Performance Management
- Attendance tracking interface
- Performance evaluation dashboards
- Workforce monitoring tools
- Employee activity insights

### AI Insights Module
- Predictive HR recommendations
- Workforce trend visualization
- Attrition and engagement indicators
- Intelligent HR notifications

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### AI Integration
- Google Gemini API
- Claude API

### Development Tools
- Node.js
- npm
- Git & GitHub

### Deployment
- Vercel

---

## System Architecture

The application follows a component-based frontend architecture using React. Different HR functionalities are modularized into reusable components and connected using centralized state management.

Key architectural concepts include:
- Shared application state using React hooks
- Role-based rendering for Employee and HR workflows
- API-driven AI integration
- Modular and scalable component structure
- Real-time UI updates through state synchronization

---

## How the AI Works

The AI functionality is primarily implemented within the Resume Analyzer module.

### Workflow:
1. The user submits:
   - Job description
   - Resume content
   - Candidate information

2. The frontend sends this data to the Google Gemini API through an HTTP POST request.

3. The AI model processes the input and evaluates:
   - Skill relevance
   - Experience alignment
   - Resume-job compatibility

4. The API returns:
   - Match score
   - Strengths
   - Weaknesses
   - Hiring recommendations

5. The application parses the response and updates:
   - Resume analysis UI
   - Recruitment pipeline

This demonstrates how Large Language Models (LLMs) can assist HR decision-making processes in real-world workflows.

---

## Scalability

The system is designed with scalability in mind and can be extended into a production-ready enterprise platform by integrating:
- Backend services (Node.js / Express)
- Cloud databases (MongoDB / PostgreSQL / Firebase)
- Authentication systems
- Real-time collaboration features
- Advanced analytics and automation

The modular architecture allows individual HR modules to scale independently based on organizational requirements.

---

## Future Improvements

Potential future enhancements include:
- Full backend and database integration
- Secure authentication and authorization
- Real PDF/DOC resume parsing
- Advanced AI-powered HR analytics
- Payroll and finance management
- AI-based interview generation
- Mobile application support
- Third-party integrations (Slack, Teams, Calendar)
- Predictive employee attrition analysis

---

## Installation

```bash
git clone <repository-url>
cd hackathon-app
npm install
npm run dev
