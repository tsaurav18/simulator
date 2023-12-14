import { WEB_APP_ROUTES } from "../constants/Routes";

import Monitoring from "../../Pages/Monitoring/Monitoring";
import Backtest from "../../Pages/Backtest/Backtest";
import Results from "../../Pages/Results/Results";

const ROUTES = [

  {
    path: WEB_APP_ROUTES.MONITORING,
    key: "monitoring",
    exact: true,
    element: <Monitoring />,
  },

  {
    path: WEB_APP_ROUTES.BACKTEST,
    key: "backtest",
    exact: true,
    element: <Backtest />,
  },

  {
    path: WEB_APP_ROUTES.RESULTS,
    key: "results",
    exact: true,
    element: <Results />,
  },
];
export default ROUTES;
