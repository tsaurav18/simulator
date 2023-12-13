import "./App.css";
import Navebar from "./Components/Navebar";
import ROUTES from "./config/routing/Index";
import { BrowserRouter as RouterSwitch } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <RouterSwitch>
      <Navebar />
      <Routes>
        {ROUTES.map((route) => (
          <Route
            key={route.key}
            element={route.element}
            exact={route.exact}
            path={route.path}
          />
        ))}
      </Routes>
    </RouterSwitch>
  );
}

export default App;
