import axios from "axios";

console.log(axios.isCancel("something"));
const productionUrl = "http://147.46.219.236:8889/";
const xpctUrl = "https://xpct.net/api/"

export const xpctInstance = axios.create({
  baseURL: xpctUrl,

  headers: {},
  validateStatus: function (status) {
    return (
      (status >= 200 && status < 300) || 401
    ); /** Will except responses without error*/
  },
});
export const instance = axios.create({
  baseURL: productionUrl,

  headers: {},
  validateStatus: function (status) {
    return (
      (status >= 200 && status < 300) || 401
    ); /** Will except responses without error*/
  },
});

instance.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
xpctInstance.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


export const backtestApi = {
  async runSimulator(
    final_state
  ) {
    let body = JSON.stringify({
      final_state: final_state
    });

    let csrf = await instance.get("backtest/get_csrf");
    console.log("body", body);
    return instance
      .post(`backtest/run_simulation/`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf.data.csrf_token,
        },
      })
      .then((res) => {
        return res;
      });
  },
};
export const monitoringApi = {
  getEngineMonitoringData(filterkey) {
    let body = JSON.stringify({ model_type: filterkey });
    return xpctInstance.post("appenginemonitoringlist/", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export const loginAPI = {
  async simulatorLogin(formdata) {
    let body = JSON.stringify({
      user_id: formdata.user_id,
      password: formdata.user_pass,
    });
    let csrf = await instance.get("backtest/get_csrf");

    return instance
      .post(`backtest/login/`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf.data["token"],
        },
      })
      .then((res) => {
        return res;
      });
  },
};
export const resultAPI = {
  async fetchUserResult(formdata) {
    console.log("formdata",formdata)
    let body = JSON.stringify({
      user_id: formdata,
    
    });

    let csrf = await instance.get("backtest/get_csrf");

    return instance
      .post(`backtest/user_result/`, body, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf.data["token"],
        },
      })
      .then((res) => {
        return res;
      });
  },
};
