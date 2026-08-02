import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './components/Dashboard/app.css';
import App from './App';
import './components/Dashboard/Dashboard.css';
import reportWebVitals from './reportWebVitals';
import { DarkModeProvider } from './components/DarkMode/DarkModeContext';
import { ReminderProvider } from './components/Reminder/ReminderContext';
import { UserProvider} from './components/UserRights/UserContext';
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <ReminderProvider>
        <UserProvider>
        <App />
        </UserProvider>
      </ReminderProvider>
    </DarkModeProvider>
  </React.StrictMode>
);

reportWebVitals();
