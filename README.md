# Banking Application

## Overview

This project is a comprehensive banking application that allows users to manage their accounts and transactions efficiently. It provides secure user authentication, transaction management, and support for multiple accounts per user.

## Features

### User Authentication with JWT

* Users can register and authenticate using JSON Web Tokens (JWT).
* Tokens are securely generated and stored on the client side.
* A token blacklist is implemented to handle logout and token expiration securely.

### OAuth Email Notification Service

* Integrated OAuth-based email service to send automated notifications.
* Emails are triggered when:

  * A new user registers.
  * A transaction (credit/debit) is performed.
* Enhances user engagement and real-time activity tracking.

### Credit/Debit Ledger Database Design

* Implemented a ledger-based system to track all financial transactions.
* Maintains a complete history of credits and debits.
* Optimized indexing ensures fast querying and efficient data retrieval.

### Transaction Management with MongoDB Sessions

* Used MongoDB sessions to enable atomic transactions.
* Ensures consistency and reliability during concurrent operations.
* Prevents partial updates and maintains data integrity.

### Dynamic Balance Calculation

* Account balances are calculated dynamically from transaction history.
* Eliminates redundancy and ensures accurate real-time balances.

### Multi-Account Support

* Users can create and manage multiple accounts.
* Each account maintains its own independent transaction history.

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **Email Service:** OAuth-based email integration
* **Data Management:** Mongoose

## Deployment

* The application is deployed on Render and can be accessed here:
  👉 [https://banking-application-n9h6.onrender.com](https://banking-application-n9h6.onrender.com)

## Getting Started

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the application:

   ```bash
   npm start
   ```
4. Open in browser:

   ```
   http://localhost:3000
   ```

## License

This project is licensed under the MIT License.

## Author

**ysvishal**

## Date

Last updated on 2026-04-13
