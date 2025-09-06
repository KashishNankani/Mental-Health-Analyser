# Mental-Health-Analyser


## Project Overview
This is a **web-based mental health quiz application** designed to help users gain insights into their emotional awareness and learning preferences.

## Features

- 🧑‍💻 **User Accounts & Authentication**  
  Users can securely **sign up and log in** using Firebase Authentication. Each user’s data is stored separately to ensure privacy.

- 📑 **Quiz Flow**  
  The application includes **three forms (quizzes)**, each focusing on different aspects of mental health and learning styles. Users must complete the forms in order, and their results are automatically analyzed.

- 📊 **Results & Insights**  
  After completing all quizzes, users are redirected to a **results page** that shows a detailed breakdown of their scores across categories (e.g., self-awareness, empathy, learning style preferences).

- 🔁 **Retake Option**  
  Users can **retake the quiz** if they wish, which resets their previous responses.

- 💾 **Database Integration**  
  Responses and results are stored securely in **Firebase Firestore**, following best practices and security rules to protect user data.

- 🔒 **Security Features**  
  The app uses Firestore rules to ensure users can only access their own data, along with authentication checks that prevent bypassing quiz steps or viewing results without completing the quizzes.

- 🎨 **User-Friendly Interface**  
  The UI includes features like a **show/hide password toggle, colorful toast notifications instead of default browser alerts**, and smooth navigation between forms.

---

## Tech Stack
- **HTML5, CSS3, JavaScript** (Front-end)
- **Firebase** (Authentication & Firestore database)
- **Netlify** 

---

## Project Structure
- `index.html` → Login page  
- `form1.html` → Quiz page 1  
- `form2.html` → Quiz page 2  
- `form3.html` → Quiz page 3  
- `result.html` → Result page  
- `auth-guard.js` → Authentication handling  
- `script.js` → Frontend logic (UI interactions, quiz functionality)  
- `style.css` → Styling for all pages  
- `images/` → All images used in the quiz  
- `README.md` → This file  

---

## How to Run
1. Clone or download the repository:
   ```bash
   git clone https://github.com/KashishNankani/Mental-Health-Analyser
2. Open index.html in a web browser.

3. The project is ready to use; no additional backend setup is required beyond the existing Firebase configuration.

4. Netlify link:

## Notes
- The quiz logic is provided by the teacher and has not been modified.
- Database integration is implemented via Firebase as requested.
- Works on modern browsers (Chrome, Firefox, Edge).

---

## Contributors
- Kashish Nankani
- Jagrati Tripathi

---

## Screenshot
<img width="1920" height="1020" alt="Screenshot 2025-09-05 191455" src="https://github.com/user-attachments/assets/d913eaba-145b-46bf-998c-cff5ec89057f" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 191743" src="https://github.com/user-attachments/assets/4ed55801-8728-4b91-b791-15b3b9e66424" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 173645" src="https://github.com/user-attachments/assets/6c80e321-005d-4574-a272-73036af921c4" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 173810" src="https://github.com/user-attachments/assets/d62d63f4-8b7c-43a5-921b-b8a203c89491" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 173936" src="https://github.com/user-attachments/assets/bdca4027-f5d2-427a-8e32-f2702bb0179a" />
<img width="1920" height="1020" alt="Screenshot 2025-09-04 132450" src="https://github.com/user-attachments/assets/46e19313-b0cc-431b-ab3f-d56b7d9a5cff" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 174203" src="https://github.com/user-attachments/assets/41e87f3c-9d91-42d2-8a93-409fa4833fda" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 180229" src="https://github.com/user-attachments/assets/98b110e9-69db-4659-bc05-ee812014fc4c" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 173631" src="https://github.com/user-attachments/assets/f1209288-ae2a-4e8d-a2d4-17dc840af427" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 152238" src="https://github.com/user-attachments/assets/89aa0640-5c97-48ee-9a2d-dbd823f1b3ec" />
<img width="1920" height="1020" alt="Screenshot 2025-09-05 104431" src="https://github.com/user-attachments/assets/8c76bea9-7891-4fbd-94b4-34cdce897b4b" />
