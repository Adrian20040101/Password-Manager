import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CustomAppBar from './components/appbar';
import LoginPage from './components/login_page';
import SignupPage from './components/signup_page';
import ResetPasswordPage from './components/reset_password_page';
import ResetPassword from './components/reset_password';
import MainPage from './components/main_page/main_page';
import ChangePassword from './components/change_password';
import { UserIdProvider } from './components/user_id_context';

function App() {
  return (
    <UserIdProvider>
    <Router>
      <div className="App">
        <CustomAppBar/>
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <Route path="/reset">
            <ResetPasswordPage />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
          <Route path="/manage-passwords">
            <MainPage />  
          </Route>
          <Route path="/change-password">
            <ChangePassword />
          </Route>
        </Switch>
      </div>
    </Router>
    </UserIdProvider>
  );
}

export default App;
  