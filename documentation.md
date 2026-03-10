# Droga Group Hub - System Documentation

This document provides a comprehensive mapping of all pages, interactive elements, and their corresponding functionalities within the Droga Group Hub (TAS) system.

---

## 1. Landing & Authentication

### Landing Page (`/`)
- **Primary View**: Highlights mission-critical job opportunities with real-time availability.
- **Interactions**:
  - **"Apply Now" Button**: Directs the user to the Job Detail page.
  - **"Find Your Role" Search**: Filters jobs based on keywords.
  - **Pagination Controls**: Navigates through available job batches.

### Login Page (`/login`)
- **Inputs**: Email and Password.
- **Interactions**:
  - **"Authorize" Button**: Processes authentication via the Core Hub API.
  - **"Forgot Password?" Link**: Initiates identity recovery protocol.
  - **"Register" Link**: Navigates to the candidate onboarding phase.

### Register Page (`/register`)
- **Inputs**: Name, Email, Password, Password Confirmation.
- **Interactions**:
  - **"Initialize Profile" Button**: Signals the system to create a new identity record.
  - **Google/LinkedIn Auth**: Fast-track authentication through external providers.

---

## 2. Candidate Interface

### Job Detail Page (`/jobs/:id`)
- **Display**: Contextual mission objectives, strategic impact, and temporal data (Posted/Deadline).
- **Interactions**:
  - **"Initiate Apply" Button**: Triggers the secure application modal.
  - **"Back to Hub" Button**: Returns to the landing page.
  - **"Submit Application" (Modal)**: Encrypts and transmits professional coordinates (including PDF CV) to the TA Pipeline.

### User Profile (`/profile`)
- **Sections**: Personal Details, Active Applications, Security Settings.
- **Interactions**:
  - **"Update Data" Button**: Synchronizes profile modifications with the database.
  - **"Withdraw" Button**: Terminates an active application entry.

---

## 3. Administrative & Oversight Dashboards

### Admin Dashboard (`/admin/users`)
- **Purpose**: High-level identity and system resource management.
- **Interactions**:
  - **"Create Identity" Button**: Adds new staff or administrative nodes.
  - **"Revoke Access" Action**: Instantly terminates active session tokens for a user.
  - **"Edit Protocol" Action**: Modifies user roles and permissions.

### TA Dashboard (`/ta/dashboard`)
- **Features**: Visual pipeline tracking of all candidate movements.
- **Interactions**:
  - **"Phase Navigation" Buttons**: Drags/Drops or updates status of candidates across columns.
  - **"Command Console" (Detail Modal)**: Used for scheduling interviews (Sync Date, Time, Venue, Maps Link).
  - **"Authorize Execution" Button**: Confirms status shifts and records history log.

### HR & CEO Approval Dashboards (`/hr/approvals`, `/ceo/approvals`)
- **Purpose**: Strategic review of recruitment requisitions.
- **Interactions**:
  - **"Authorize Requisition" Button**: High-priority approval for job posting.
  - **"Reject & Comment" Action**: Prompts for a justification log and signals the requester.
  - **"View Job Description" Button**: Downloads/Opens the attached JD file for review.

---

## 4. Operational Modules

### Manager Portal (`/manager/request`)
- **View**: Hiring Managers initiated recruitment requisitions here.
- **Interactions**:
  - **"New Requisition" Button**: Opens the operational request form.
  - **"Upload JD" Field**: Secure transmission of job specification documents.

### Job Console (`/ta/jobs`)
- **Features**: Management of all active and archival job nodes.
- **Interactions**:
  - **"Post New Node" Button**: Signals the public visibility of a requisition.
  - **"Modify Specification" Action**: Updates live job details.
  - **"Terminate Node" Button**: Closes application window.

### Notification Detail (`/notifications/:id`)
- **Content**: Dynamic operational alerts and feedback.
- **Interactions**:
  - **"Mark as Resolved" Button**: Clears the notification status.
  - **Deep-Link Navigation**: Redirects to relevant application or dashboard.

---

## 5. System Protocols

- **Security**: All transmissions are managed via standardized API tokens.
- **Branding**: System-wide identity is locked to "Droga Group Hub".
- **Communication**: Integrated email and database notifications for every strategic status change.
