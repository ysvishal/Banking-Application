# Banking Application

## Overview
This project is a comprehensive banking application that allows users to manage their accounts and transactions efficiently. It provides secure user authentication, transaction management, and support for multiple accounts per user.

## Features
### User Authentication with JWT
- Users can register and authenticate using JSON Web Tokens (JWT).
- Tokens are securely generated and stored in clients.
- A token blacklist is implemented to manage logouts and token expiration effectively.

### Credit/Debit Ledger Database Design
- A ledger system is established to track user transactions, including credits and debits.
- The database design optimally indexes transaction records for quick retrieval and analysis.

### Transaction Management with MongoDB Sessions
- MongoDB sessions are utilized to ensure atomic transactions, preventing data inconsistencies.
- Each transaction operation (credit or debit) is treated as an atomic unit of work.

### Dynamic Balance Calculation
- The application dynamically calculates user account balances based on the transactions recorded in the ledger.
- This ensures real-time balance availability for users.

### Multi-Account Support
- Users can create and manage multiple accounts within a single application instance.
- Each account maintains its own transaction history, facilitating organized financial management.

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Data Management:** Mongoose for MongoDB interaction

## Getting Started
1. Clone the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Access the application at `http://localhost:3000`.

## License
This project is licensed under the MIT License.

## Author
ysvishal

## Date
Last updated on 2026-04-13.