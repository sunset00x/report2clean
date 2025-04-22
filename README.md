
# Report2Clean

## Overview
Report2Clean is a community-driven project aimed at simplifying the process of reporting and addressing local environmental and urban issues. The app allows users to submit reports with images, videos, and location details to alert authorities and help clean up their surroundings.

## Features
- **Home Screen**: Displays a list of recent reports, real-time updates on reported issues, and a map view.
- **Report Submission**: Users can upload images/videos, add descriptions, and share their location.
- **Notifications**: Alerts for nearby incidents or updates on submitted reports.
- **User Registration & Login**: Secure sign-up, login, and social media sign-in (Google & Facebook).
- **Profile Page**: Displays user information, profile photo upload, editable fields, and a list of submitted reports.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Firebase (Authentication, Firestore, Firebase Storage)
- **State Management**: React Context API / useState, useEffect
- **Styling**: CSS ( CSS framework TailwindCSS or Material-UI)

## Setup Instructions

### Prerequisites
- Node.js
- Firebase Account (for Firebase Authentication, Firestore, and Firebase Storage)

### Install Dependencies
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/sunset00x/Report2Clean.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Report2Clean
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Firebase Setup
1. Create a Firebase project and enable Firebase Authentication (email/password, Google, Facebook) and Firestore.
2. Create a Firebase Storage bucket to handle image uploads.
3. Add your Firebase config to the project:
   ```js
   // firebase.js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```

### Running the Project
1. Start the project locally:
   ```bash
   npm start
   ```

2. Visit `http://localhost:3000` in your browser.

## Contributing
If you'd like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


