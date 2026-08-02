import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SideBar from './components/SideBar/SideBar';

// Import your components
import Facebook from './components/Platforms/Facebook';
import Instagram from './components/Platforms/Instagram';
import Tiktok from './components/Platforms/Tiktok';
import Youtube from './components/Platforms/Youtube';
import Dashboard from './components/Dashboard/Dashboard';
import User from './components/User/User';
import Register from './components/User/Register';
import Create_Instagram from './components/Platforms/Create_Instagram';
import Create_Facebook from './components/Platforms/Create_Facebook';
import Create_Tiktok from './components/Platforms/Create_Tiktok';
import Create_Youtube from './components/Platforms/Create_Youtube';
import Sm_Create_User from './components/sm_users/Sm_Create_User';
import Sm_User from './components/sm_users/Sm_User';
import Accounting from './components/Accounting/Accounting';
import Create_Accounting from './components/Accounting/Create_Accounting';
import Create_Quotation from './components/Accounting/Create_Quotation';
import FacebookCounter from './components/Counter/FacebookCounter';
import InstagramCounter from './components/Counter/InstagramCounter';
import YoutubeCounter from './components/Counter/YoutubeCounter';
import XCounter from './components/Counter/XCounter';
import TiktokCounter from './components/Counter/TiktokCounter';
import X from './components/Platforms/X';
import CreateTasks from './components/Tasks/CreateTasks';
import ViewTasks from './components/Tasks/ViewTasks';
import View_Quotations from './components/Quotation/View_Quotations';
import Edit_Accounting from './components/Accounting/Edit_Accounting';
import EditQuotations from './components/Quotation/EditQuotations';
import AccountingHistory from './components/Accounting/AccountingHistory';
import AnimatePhoto from './components/Images/AnimatePhoto';
import Snap from './components/Platforms/Snap';
import PlatformComparisonChart from './components/Chart/PlatformComparisonChart';
import View_Maintenance from './components/Maintenance/View_Maintenance';
import Create_Maintenance from './components/Maintenance/Create_Maintenance';
import EmployeeList from './components/Employees/EmployeeList';
import EmployeeForm from './components/Employees/EmployeeForm';
import ExpensivesList from './components/Expensives/ExpensivesList';
import ExpensivesForm from './components/Expensives/ExpensivesForm';
import Sm_View_User from './components/sm_users/Sm_View_User';
import AddRecoveredAccount from './components/RecoveredAccounts/AddRecoveredAccount';
import ViewRecoveredAccounts from './components/RecoveredAccounts/ViewRecoveredAccounts';
import RecoveredAccountProfile from './components/RecoveredAccounts/RecoveredAccountProfile';
import JobList from './components/Employees/JobList';
import EmployeeView from './components/Employees/EmployeeView';
import SalaryTable from './components/Employees/SalaryTable';
import ExpensivesFormUpdate from './components/Expensives/ExpensivesFormUpdate';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-toastify/dist/ReactToastify.css';
import AccountingLogs from './components/Accounting/AccountingLogs';
import ExpensesLogs from './components/Expensives/ExpensesLogs';

function AppLayout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/"; // Hide sidebar on login page

  return (
    <div className="app-layout" style={{ display: 'flex' }}>
      {/* Sidebar visible only if not on login page */}
      {!hideSidebar && <SideBar />}

      {/* Page Content */}
      <div className="content-area" style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/Invoices_History" element={<AccountingLogs/>}/>
          <Route path="/Expenses_History" element={<ExpensesLogs/>}/>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/CreateAccounting" element={<Create_Accounting />} />
          <Route path="/CreateQuotation" element={<Create_Quotation />} />
          <Route path="/quotations" element={<View_Quotations />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/Instagram/view/:id" element={<Instagram />} />
          <Route path="/Users" element={<Sm_User />} />
          <Route path="/user/:id" element={<Sm_View_User />} />
          <Route path="/viewEmployee/:id" element={<EmployeeView />} />
          <Route path="/recoverAccountProfile/:id" element={<RecoveredAccountProfile />} />
          <Route path="/CreateInstagram" element={<Create_Instagram />} />
          <Route path="/AccountingHistory" element={<AccountingHistory />} />
          <Route path="/CreateUser" element={<Sm_Create_User />} />
          <Route path="/CreateFacebook" element={<Create_Facebook />} />
          <Route path="/CreateTiktok" element={<Create_Tiktok />} />
          <Route path="/CreateYoutube" element={<Create_Youtube />} />
          <Route path="/salary" element={<SalaryTable />} />
          <Route path="/Facebook/view/:id" element={<Facebook />} />
          <Route path="/Tiktok/view/:id" element={<Tiktok />} />
          <Route path="/Youtube/view/:id" element={<Youtube />} />
          <Route path="/X/view/:id" element={<X />} />
          <Route path="/Facebook/counter/:id" element={<FacebookCounter />} />
          <Route path="/AddRecoveredAccount" element={<AddRecoveredAccount />} />
          <Route path="/view-recovered-accounts" element={<ViewRecoveredAccounts />} />
          <Route path="/snap/view/:id" element={<Snap />} />
          <Route path="/Tiktok/counter/:id" element={<TiktokCounter />} />
          <Route path="/Youtube/counter/:id" element={<YoutubeCounter />} />
          <Route path="/Instagram/counter/:id" element={<InstagramCounter />} />
          <Route path="/CreateTasks" element={<CreateTasks />} />
          <Route path="/viewtasks" element={<ViewTasks />} />
          <Route path="/X/counter/:id" element={<XCounter />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UpdateAccounting/:id" element={<Edit_Accounting />} />
          <Route path="/Images" element={<AnimatePhoto />} />
          <Route path="/PlatformComparison" element={<PlatformComparisonChart />} />
          <Route path="/maintenance" element={<View_Maintenance />} />
          <Route path="/createmaintenance" element={<Create_Maintenance />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/AddEmployees" element={<EmployeeForm />} />
          <Route path="/expensives" element={<ExpensivesList />} />
          <Route path="/EditQuotation/:id" element={<EditQuotations />} />
          <Route path="/AddExpensives" element={<ExpensivesForm />} />
          <Route path="/EditExpensives/:id" element={<ExpensivesFormUpdate />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
