import './App.css';
import './style/theme.css'
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import DelegatedTasks from './pages/DelegatedTasks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { logoutAdmin } from './actions/adminLogoutAction';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { useDispatch } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import AddUser from './pages/AddUser';
import { useEffect } from 'react';
import Routing from './routing';
import ShowUsersTask from './pages/ShowUsersTask';
import TaskDetail from './pages/TaskDetail';
import Chat from './pages/Chat';
import NotesPage from './pages/NotesPage';
import EditUser from './components/EditUser';
import ManageField from './pages/ManageField';
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/logout") {
      dispatch(logoutAdmin());
      navigate("/");
    }
  }, [location.pathname, dispatch, navigate]);

  //  Pages where Sidebar and Header should NOT be shown
  const hideLayoutRoutes = ['/', '/signup'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        limit={3}
      />
      {!shouldHideLayout ? (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/delegatedtasks" element={<PrivateRoute element={<DelegatedTasks />} />} />
              <Route path="/add-user" element={<PrivateRoute element={<AddUser />} />} />
              <Route path="/update-user/:empid" element={<PrivateRoute element={<EditUser />} />} />
              <Route path="/showusertask/:empId" element={<PrivateRoute element={<ShowUsersTask />} />} />
              <Route path="/taskdeatil/:taskid" element={<PrivateRoute element={<TaskDetail />} />} />
              <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
              <Route path="/notes" element={<PrivateRoute element={<NotesPage />} />} />
              <Route path="/manage-template" element={<PrivateRoute element={<ManageField />} />} />
              <Route path="/templates" element={<PrivateRoute element={<Templates />} />} />
              <Route path="/templates/:id" element={<PrivateRoute element={<TemplateDetail />} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <Routing />
        </div>
      )}
    </div>
  );
}

export default App;
