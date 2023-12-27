import "./App.css";

import ROUTES from "./config/routing/Index";
import { BrowserRouter as RouterSwitch } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import authRoles from "./config/constants/authRoles";
import { VerifyAuth } from "./config/routing/VerifyAuth";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const user_info_reducer = useSelector((state) => state.loginReducer);
  return (
    <RouterSwitch>
  
      <Routes>
        {ROUTES.map((route) => (
          <Route
            key={route.key}
            element= {<VerifyAuth auth_info={user_info_reducer} ComponentElement={route.element}/> } //route.element
            exact={route.exact}
            path={route.path}
          />
        ))}
      </Routes>
    </RouterSwitch>
  );
}

export default App;
