import s from "./Admin.module.css";

import React, { useEffect, useState, useRef } from "react";

import { message } from "antd";
import Container from "react-bootstrap/Container";
import { Oval } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { monitoringApi } from "../../api";
import MainNavbar from "../../Components/Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,

  Tooltip,
  Legend,
  zoomPlugin
);

const MainLineChart = ({ data }) => {
  const today = new Date();
  const last20Days = new Date();
  last20Days.setDate(today.getDate() - 20); // Calculate the date 20 days ago
  const formattedToday = today.toISOString().split("T")[0];
  const formattedLast20Days = last20Days.toISOString().split("T")[0];

  const obj_keys = Object.keys(data);

  let lable_mapping = {
    kospi_index: "코스피 인덱스",
    eugene_1d: "유진 1일",
    eugene_1w: "유진 1주",
    xpct_1d: "XP 1일",
    xpct_1w: "XP 1주",
    xpct_2w: "XP 2주",
    xpct_4w: "XP 4주",
    xpct_8w: "XP 8주",
    samsung_index_alpha: "삼성증권 인덱스 알파",
    ratb_1: "RATB 1차 (공격형)",
    ratb_3: "RATB 3차",
    korea_invest_1w_top5: "한투 1주 top5",
    korea_invest_1w_top20: "한투 1주 top20",
    korea_invest_2w_top5: "한투 2주 top5",
    korea_invest_2w_top20: "한투 2주 top20",
    korea_invest_4w_top5: "한투 4주 top5",
    korea_invest_4w_top20: "한투 4주 top20",
    korea_invest_8w_top5: "한투 8주 top5",
    korea_invest_8w_top20: "한투 8주 top20",
    s_m_khk31_0_1d: "S-M-강31-0억 1일",
    s_m_khk31_10_1d: "S-M-강31-10억 1일",
    s_m_khk31_0_1w: "S-M-강31-0억 1주",
    s_m_khk31_10_1w: "S-M-강31-10억 1주",
    s_m_khk31_0_2w: "S-M-강31-0억 2주",
    s_m_khk31_10_2w: "S-M-강31-10억 2주",
    s_m_khk31_0_4w: "S-M-강31-0억 4주",
    s_m_khk31_10_4w: "S-M-강31-10억 4주",
    s_m_khk31_0_8w: "S-M-강31-0억 8주",
    s_m_khk31_10_8w: "S-M-강31-10억 8주",
    risk_6_3c: "위험-한국-6.3c",
    risk_us_l: "위험-미국-L",
  };

  let _borderColorList = [
    "rgb(53, 162, 235)",
    "rgb(255, 99, 132)",
    "rgb(124, 252, 0)",
    "rgb(160, 32, 240)",
    "rgb(0, 128, 128)",
    "rgb(255, 69, 0)",
    "rgb(102, 51, 51)",
    "rgb(191, 23, 158)",
  ];
  let _backgoundColor = [
    "rgba(53, 162, 235, 0.5)",
    "rgba(255, 99, 132, 0.5)",
    "rgba(124, 252, 0, 0.5)",
    "rgba(160, 32, 240, 0.5)",
    "rgba(0, 128, 128, 0.5)",
    "rgb(255, 69, 0, 0.5)",
    "rgb(102, 51, 51, 0.5)",
    "rgb(191, 23, 158, 0.5)",
  ];

  let _datasets = [];
  let index = 0;
  let curr_label = "";

  for (const key in data) {
    for (const d in obj_keys) {
      if (key == obj_keys[d]) {
        curr_label = lable_mapping[obj_keys[d]];
      }
    }

    if (key == "date") {
      continue;
    } else {
      _datasets.push({
        label: curr_label,
        data: data[key],
        borderColor: _borderColorList[index],
        backgroundColor: _backgoundColor[index],
        borderWidth: 1.5,

        pointRadius: 1, // Reduce the point size here
        pointHoverRadius: 4,
        fill: false,
        tension: 0.4,
      });
    }
    index++;
  }

  const models_chart_data = {
    labels: data.date,
    datasets: _datasets,
  };
  const options = {
    responsive: true,

    plugins: {
      datalabels: {
        display: false, // Set to false to remove data labels
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",

          limits: {
            x: {
              min: data.date.slice(-25), // Adjust the initial visible range start
              max: data.date.slice(-1), // Adjust the initial visible range end
            },
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={models_chart_data} options={options} />
    </div>
  );
};

const Monitoring = (props) => {
  const chartRef = useRef();
  const [users, setUsers] = React.useState([]);
  const [selectedModel, setSelectedModel] = useState({
    xpct_1d: true,
    xpct_1w: false,
    xpct_2w: false,
    xpct_4w: false,
    xpct_8w: false,
    kospi_index: false,
    eugene_1d: false,
    eugene_1w: false,
    samsung_index_alpha: false,
    ratb_1: false,
    ratb_3: false,
    korea_invest_1w_top5: false,
    korea_invest_1w_top20: false,
    korea_invest_2w_top5: false,
    korea_invest_2w_top20: false,
    korea_invest_4w_top5: false,
    korea_invest_4w_top20: false,
    korea_invest_8w_top5: false,
    korea_invest_8w_top20: false,
    s_m_khk31_0_1d: false,
    s_m_khk31_10_1d: false,
    s_m_khk31_0_1w: false,
    s_m_khk31_10_1w: false,
    s_m_khk31_0_2w: false,
    s_m_khk31_10_2w: false,
    s_m_khk31_0_4w: false,
    s_m_khk31_10_4w: false,
    s_m_khk31_0_8w: false,
    s_m_khk31_10_8w: false,
    risk_6_3c: false,
    risk_us_l: false,
  });

  const [chartData, setChartData] = useState(null);

  const [Loader, setLoader] = useState(false);
  const getEngineMonitorData = async () => {
    setLoader(true);

    const trueValues = Object.keys(selectedModel).filter(
      (key) => selectedModel[key] === true
    );

    let res = await monitoringApi.getEngineMonitoringData(trueValues);
    if (res.status == 200) {
      console.log("status: 200");

      let chart_data = {};

      Object.entries(res.data).forEach(([key, value]) => {
        chart_data[key] = value;
      });
      setChartData(chart_data);

      setLoader(false);
    } else if (res.status == 400) {
      console.log("status: 400 DB connection failed");
      getEngineMonitorData();
    } else {
      console.log("status: 500 Server Connection failed");
      message.info("데이터를 가져오지 못했습니다.");
    }
    setLoader(false);
  };

  // useEffect(() => {
  //   getEngineMonitorData();
  // }, []);

  useEffect(() => {
    getEngineMonitorData();

    return () => {};
  }, [selectedModel]);

  return (
    <>  <MainNavbar/>
        <Container>
    
      <div
        className={s.list_container}
        style={{
          height: "auto",
          overflow: props.isSummary ? "scroll" : "visible",
          overflowX: "auto", // Enable horizontal scrolling
          whiteSpace: "nowrap",
        }}
      >
        <div className={s.title} style={{ marginBottom: "4px" }}>
          Engine Monitoring{" "}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <div
            className={`${s.button} ${
              selectedModel.xpct_1d
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );

              if (trueValues.length == 1 && trueValues.includes("xpct_1d")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("xpct_1d")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    xpct_1d: !prevSelectedModel.xpct_1d,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            XP 1일
          </div>
          <div
            className={`${s.button} ${
              selectedModel.xpct_1w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("xpct_1w")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("xpct_1w")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    xpct_1w: !prevSelectedModel.xpct_1w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            XP 1주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.xpct_2w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("xpct_2w")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("xpct_2w")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    xpct_2w: !prevSelectedModel.xpct_2w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            XP 2주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.xpct_4w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("xpct_4w")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("xpct_4w")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    xpct_4w: !prevSelectedModel.xpct_4w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            XP 4주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.xpct_8w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("xpct_8w")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("xpct_8w")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    xpct_8w: !prevSelectedModel.xpct_8w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            XP 8주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.eugene_1d
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("eugene_1d")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("eugene_1d")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    eugene_1d: !prevSelectedModel.eugene_1d,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            유진 1일
          </div>
          <div
            className={`${s.button} ${
              selectedModel.eugene_1w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("eugene_1w")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("eugene_1w")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    eugene_1w: !prevSelectedModel.eugene_1w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            유진 1주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.ratb_1
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("ratb_1")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("ratb_1")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    ratb_1: !prevSelectedModel.ratb_1,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            RATB 1차 (공격형)
          </div>
          <div
            className={`${s.button} ${
              selectedModel.ratb_3
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (trueValues.length == 1 && trueValues.includes("ratb_3")) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (trueValues.length <= 8 || trueValues.includes("ratb_3")) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    ratb_3: !prevSelectedModel.ratb_3,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            RATB 3차
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_1w_top5
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_1w_top5")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_1w_top5")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_1w_top5:
                      !prevSelectedModel.korea_invest_1w_top5,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 1주 Top5
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_1w_top20
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_1w_top20")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_1w_top20")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_1w_top20:
                      !prevSelectedModel.korea_invest_1w_top20,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 1주 Top20
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_2w_top5
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_2w_top5")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_2w_top5")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_2w_top5:
                      !prevSelectedModel.korea_invest_2w_top5,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 2주 Top5
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_2w_top20
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_2w_top20")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_2w_top20")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_2w_top20:
                      !prevSelectedModel.korea_invest_2w_top20,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 2주 Top20
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_4w_top5
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_4w_top5")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_4w_top5")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_4w_top5:
                      !prevSelectedModel.korea_invest_4w_top5,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 4주 Top5
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_4w_top20
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_4w_top20")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_4w_top20")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_4w_top20:
                      !prevSelectedModel.korea_invest_4w_top20,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 4주 Top20
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_8w_top5
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_8w_top5")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_8w_top5")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_8w_top5:
                      !prevSelectedModel.korea_invest_8w_top5,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 8주 Top5
          </div>
          <div
            className={`${s.button} ${
              selectedModel.korea_invest_8w_top20
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("korea_invest_8w_top20")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("korea_invest_8w_top20")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    korea_invest_8w_top20:
                      !prevSelectedModel.korea_invest_8w_top20,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            한투 8주 Top20
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_0_1d
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_0_1d")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_0_1d")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_0_1d: !prevSelectedModel.s_m_khk31_0_1d,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-0억 1일
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_10_1d
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_10_1d")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_10_1d")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_10_1d: !prevSelectedModel.s_m_khk31_10_1d,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-10억 1주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_0_1w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_0_1w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_0_1w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_0_1w: !prevSelectedModel.s_m_khk31_0_1w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-0억 1주
          </div>

          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_10_1w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_10_1w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_10_1w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_10_1w: !prevSelectedModel.s_m_khk31_10_1w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-10억 1주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_0_2w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_0_2w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_0_2w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_0_2w: !prevSelectedModel.s_m_khk31_0_2w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-0억 2주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_10_2w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_10_2w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_10_2w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_10_2w: !prevSelectedModel.s_m_khk31_10_2w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-10억 2주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_0_4w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_0_4w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_0_4w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_0_4w: !prevSelectedModel.s_m_khk31_0_4w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-0억 4주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_10_4w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_10_4w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_10_4w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_10_4w: !prevSelectedModel.s_m_khk31_10_4w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-10억 4주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_0_8w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_0_8w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_0_8w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_0_8w: !prevSelectedModel.s_m_khk31_0_8w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-0억 8주
          </div>
          <div
            className={`${s.button} ${
              selectedModel.s_m_khk31_10_8w
                ? s.active_selected_model
                : s.deactive_selected_model
            }`}
            onClick={() => {
              const trueValues = Object.keys(selectedModel).filter(
                (key) => selectedModel[key] === true
              );
              if (
                trueValues.length == 1 &&
                trueValues.includes("s_m_khk31_10_8w")
              ) {
                toast("최소한 1개 이상 선택되어 있어야 합니다.");
                return;
              }
              if (
                trueValues.length <= 8 ||
                trueValues.includes("s_m_khk31_10_8w")
              ) {
                setSelectedModel((prevSelectedModel) => {
                  return {
                    ...prevSelectedModel,
                    s_m_khk31_10_8w: !prevSelectedModel.s_m_khk31_10_8w,
                  };
                });
              } else {
                toast("9 개만 비교할 수 있습니다.");
              }
            }}
          >
            S-M-강31-10억 8주
          </div>

          {/* last row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <div
              className={`${s.button} ${
                selectedModel.risk_6_3c
                  ? s.active_selected_model
                  : s.deactive_selected_model
              }`}
              onClick={() => {
                const trueValues = Object.keys(selectedModel).filter(
                  (key) => selectedModel[key] === true
                );
                if (
                  trueValues.length == 1 &&
                  trueValues.includes("risk_6_3c")
                ) {
                  toast("최소한 1개 이상 선택되어 있어야 합니다.");
                  return;
                }
                if (
                  trueValues.length <= 8 ||
                  trueValues.includes("risk_6_3c")
                ) {
                  setSelectedModel((prevSelectedModel) => {
                    return {
                      ...prevSelectedModel,
                      risk_6_3c: !prevSelectedModel.risk_6_3c,
                    };
                  });
                } else {
                  toast("9 개만 비교할 수 있습니다.");
                }
              }}
            >
              위험-한국-6.3c
            </div>
            <div
              className={`${s.button} ${
                selectedModel.risk_us_l
                  ? s.active_selected_model
                  : s.deactive_selected_model
              }`}
              onClick={() => {
                const trueValues = Object.keys(selectedModel).filter(
                  (key) => selectedModel[key] === true
                );
                if (
                  trueValues.length == 1 &&
                  trueValues.includes("risk_us_l")
                ) {
                  toast("최소한 1개 이상 선택되어 있어야 합니다.");
                  return;
                }
                if (
                  trueValues.length <= 8 ||
                  trueValues.includes("risk_us_l")
                ) {
                  setSelectedModel((prevSelectedModel) => {
                    return {
                      ...prevSelectedModel,
                      risk_us_l: !prevSelectedModel.risk_us_l,
                    };
                  });
                } else {
                  toast("9 개만 비교할 수 있습니다.");
                }
              }}
            >
              위험-미국-L
            </div>
            <div
              className={`${s.button} ${
                selectedModel.samsung_index_alpha
                  ? s.active_selected_model
                  : s.deactive_selected_model
              }`}
              onClick={() => {
                const trueValues = Object.keys(selectedModel).filter(
                  (key) => selectedModel[key] === true
                );
                if (
                  trueValues.length == 1 &&
                  trueValues.includes("samsung_index_alpha")
                ) {
                  toast("최소한 1개 이상 선택되어 있어야 합니다.");
                  return;
                }
                if (
                  trueValues.length <= 8 ||
                  trueValues.includes("samsung_index_alpha")
                ) {
                  setSelectedModel((prevSelectedModel) => {
                    return {
                      ...prevSelectedModel,
                      samsung_index_alpha:
                        !prevSelectedModel.samsung_index_alpha,
                    };
                  });
                } else {
                  toast("9 개만 비교할 수 있습니다.");
                }
              }}
            >
              삼성증권 인덱스
            </div>
            <div
              className={`${s.button} ${
                selectedModel.kospi_index
                  ? s.active_selected_model
                  : s.deactive_selected_model
              }`}
              onClick={() => {
                const trueValues = Object.keys(selectedModel).filter(
                  (key) => selectedModel[key] === true
                );
                if (
                  trueValues.length == 1 &&
                  trueValues.includes("kospi_index")
                ) {
                  toast("최소한 1개 이상 선택되어 있어야 합니다.");
                  return;
                }
                if (
                  trueValues.length <= 8 ||
                  trueValues.includes("kospi_index")
                ) {
                  setSelectedModel((prevSelectedModel) => {
                    return {
                      ...prevSelectedModel,
                      kospi_index: !prevSelectedModel.kospi_index,
                    };
                  });
                } else {
                  toast("9 개만 비교할 수 있습니다.");
                }
              }}
            >
              코스피 인덱스
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            borderTop: "1px solid #cecece",
            marginTop: 18,
            padding: "20px 0px",
          }}
        ></div>
        {Loader ? (
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{ alignItems: "center", justifyContent: "center" }}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        ) : (
          <>{chartData && <MainLineChart data={chartData} />}</>
        )}
      </div>
      <Toaster />
    </Container>
    </>

  );
};

export default Monitoring;
