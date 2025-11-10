// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { getToken } from './api';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Transactions from './pages/Transactions';
// import Categories from './pages/Categories';
// import Budgets from './pages/Budgets';
// import Layout from './components/Layout';

// function ProtectedRoute({ children }) {
//   return getToken() ? children : <Navigate to="/" />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="transactions" element={<Transactions />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="budgets" element={<Budgets />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/layout/Layout/Layout';
import { Login, Dashboard, Transactions, Categories, Budgets } from './pages';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
