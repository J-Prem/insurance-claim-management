# Insurance Claim Management System

A comprehensive Full-Stack Insurance Claim Management System built with **Spring Boot** and **React**. This platform facilitates seamless communication between customers, administrators, and surveyors for managing insurance policies and claims.

## 🚀 Features

- **Role-Based Access Control**: Secure login and registration for Customers, Admins, and Surveyors using JWT.
- **Policy Management**: Admins can create and manage insurance policies; Customers can browse and apply for them.
- **Claim Lifecycle**: Customers can raise claims, which are then assigned to Surveyors by Admins for review and approval.
- **Real-time Validations**: Prevents duplicate claims, enforces policy coverage limits, and manages surveyor availability.
- **Modern UI**: A responsive, premium dashboard built with React and advanced CSS (Glassmorphism, animations).

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, React Router, Hot Toast.
- **Backend**: Java, Spring Boot, Spring Data JPA, Spring Security, JWT.
- **Database**: PostgreSQL / MySQL (JPA-compatible).

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Spring Boot backend application.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven
- Database (PostgreSQL/MySQL)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/J-Prem/insurance-claim-management.git
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   - Update `src/main/resources/application.properties` with your database credentials.
   - Run the application using your IDE or Maven:
   ```bash
   cd server
   mvn spring-boot:run
   ```

## 🛡️ Security
Standard JWT-based authentication is implemented to protect API endpoints and ensure data privacy across all roles.
