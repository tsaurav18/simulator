import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { useMediaQuery } from "react-responsive";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Modal from "react-modal";
import classNames from "classnames";
import { AiOutlineCalendar } from "react-icons/ai";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import "./Backtest.css";
import { backtestApi } from "../../api";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

function Backtest() {
  const [showFilterDiv, setshowFilterDiv] = useState(false);
  const MODEL_TYPE = ["개별 모델", "모델"];
  const PRED_MODEL_TYPE = ["1일", "1주", "2주", "4주", "8주"];
  const [modelType, setModelType] = useState(MODEL_TYPE[0]);
  const [predModelType, setPredModelType] = useState(PRED_MODEL_TYPE[0]);
  const [modalIsOpenStartDate, setModalIsOpenStartDate] = useState(false);
  const [modalIsOpenEndDate, setModalIsOpenEndDate] = useState(false);
  const [selectedStartDate, setStartSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const convertStartDate = () => {
    const date = new Date(selectedStartDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };
  const convertEndDate = () => {
    const date = new Date(selectedEndDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const [currentSelectedStartDate, setCurrentSelectedStartDate] = useState(
    convertStartDate()
  );
  const [currentSelectedEndDate, setCurrentSelectedEndDate] = useState(
    convertEndDate()
  );
  const [value, onChange] = useState(new Date());
  const [EndValue, onChangeEndDate] = useState(new Date());
  // for dynamic div
  const [filterContainer, setFilterContainer] = useState([]);
  const renderFilterDiv = () => {
    const temp = [...filterContainer];
    temp.push(1);
    setFilterContainer(temp);
    setshowFilterDiv(true);
  };
  const [filterGroupState, setFilterGroupState] = useState([
    { label: "R1 (기본 세팅 전용)", value: false },
    {
      label: "R1.1 (시가총액)",
      value: false,
      input_flg: true,
      input_val: "",
      input_lbl: "억 (원)",
      disableStatus:false
    },
    {
      label: "R1.2 (평균거래대금)",
      value: false,
      input_flg: true,
      input_val: "",
      input_lbl: "억 (원)",
      disableStatus:false
    },
    { label: "R1.3 (부채비율)", value: false },
    { label: "R1.4 (잔고율)", value: false },
    { label: "R1.5 (비이슈종목)", value: false },
  ]);
  const [filterSecondGroupState, setFilterSecondGroupState] = useState([
    { label: "R2 (중복 섹터)", value: false },
    { label: "R3 (중복 종목)", value: false },
    { label: "우선주 제외", value: false },
  ]);

  const POST_FILTERING_LIST = ["없음", "KHK31-기본", "KHK31-완화"];
  const INVEST_STOCK_NO_LIST = [5,20];
  const DISTRIBUTE_INVEST_LIST = ['주 단위','일 단위'];
  const [filterThirdGroupState, setFilterThirdGroupState] = useState([
    { label: "포스트 필터링", value: POST_FILTERING_LIST[0], label_list:POST_FILTERING_LIST },
    { label: "투자 종목 수", value: INVEST_STOCK_NO_LIST[0], label_list: INVEST_STOCK_NO_LIST},
    { label: "분산 투자", value: DISTRIBUTE_INVEST_LIST[0] ,label_list:DISTRIBUTE_INVEST_LIST},
    { label: "수수료", value: 0.0, lbl: "%", label_list:null},
  ]);

  const runSimulation = async() => {
    console.log("run simulation")
    try {

      const res = await backtestApi.runSimulator(filterGroupState, filterSecondGroupState, filterThirdGroupState)
      console.log("data", res.data)
    } catch (error) {
      console.log("error")
    }

  };


  function FilterChild({ index,filterGroupState,filterSecondGroupState, filterThirdGroupState,setFilterGroupState, setFilterSecondGroupState, setFilterThirdGroupState}) {
   
    const handleCheckBoxChange = (item) => {
      if (item.label === "R1 (기본 세팅 전용)") {
        // Set all checkboxes to true
        setFilterGroupState(
          filterGroupState.map((el) => ({ ...el, value: !item.value,disableStatus:!item.value }))
        );

      } else {
        // Update the clicked checkbox
        setFilterGroupState((prevFilterGroupState) => {
          return prevFilterGroupState.map((el) => {
            if (el.label === item.label) {
              return { ...el, value: !el.value };
            }
            return el;
          });
        });
      }
    };
    const handleFilterCheckboxChange = (item) => {
      setFilterSecondGroupState((prevFilterGroupState) => {
        return prevFilterGroupState.map((el) => {
          if (el.label === item.label) {
            return { ...el, value: !el.value };
          }
          return el;
        });
      });
    };


    const handleFilterFirstGroupInputChange = (item, text) => {
      console.log("item", item, text);
      setFilterGroupState((prevFilterGroupState) => {
        return prevFilterGroupState.map((el) => {
          if (el.label === item.label) {
            return { ...el, input_val: text.target.value };
          }
          return el;
        });
      });
    };
    const onHandlerPostFiltering = (item, text) => {
 
      setFilterThirdGroupState((prevFilterGroupState) => {
        return prevFilterGroupState.map((el) => {
          if (el.label === item.label) {
            return { ...el, value: text };
          }
          return el;
        });
      });
    };

    
    const handleFilterInputChange = (item, t) => {
      
      setFilterThirdGroupState((prevFilterGroupState) => {
        return prevFilterGroupState.map((el) => {
          if (el.label === item.label) {
            return { ...el, value: t.target.value };
          }
          return el;
        });
      });
    };
    

   
    console.log("FilterGroupState", filterGroupState,filterSecondGroupState, filterThirdGroupState);
    return (
      <Container
        key={index}
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #f5f5f5",
          borderRadius: "7px",
          marginBottom: 20,
          padding: 20,
        }}
      >
        <Stack
          direction="horizontal"
          className="d-flex align-items-start flex-row justify-content-start"
        >
          <Col>
            {" "}
            {filterGroupState?.map((item, index) => (
              <Stack
                direction="horizontal"
                key={index}
                style={{ width: "70%", justifyContent: "space-between" }}
                className="d-flex mb-2"
              >
                <label>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={() => handleCheckBoxChange(item)}
                  />
                  {"  "}
                  {item.label}
                </label>
                {item.input_flg && (
                  <label>
                    <input
                    value={item.input_val}
                    disabled={item.disableStatus}
                    type="number"
                    min="0"
                      style={{ width: "84px" }}
                      name={item.input_txt}
                      onChange={(text) => {
                        handleFilterFirstGroupInputChange(item, text);
                      }}
                    />
                    {"  "}
                    {item.input_lbl}
                  </label>
                )}
              </Stack>
            ))}{" "}
          </Col>
          <Col className="d-flex align-items-start flex-column">
            {" "}
            {filterSecondGroupState?.map((item, index) => (
              <Stack
                direction="horizontal"
                key={index}
                className="d-flex align-items-start mb-2"
              >
                <label>
                  <input
                    type="checkbox"
                    checked={item.value}
                    onChange={() => handleFilterCheckboxChange(item)}
                  />
                  {"  "}
                  {item.label}
                </label>
              </Stack>
            ))}{" "}
          </Col>
          <Col className="d-flex align-items-start flex-column">
            {" "}
            {filterThirdGroupState?.map((item, index) => (
              <Stack direction="horizontal" key={index} className="d-flex mb-2">
                <div className="d-flex flex-wrap justify-content-start align-items-center w-100">
                  <div
                   style={{justifyContent: "space-between",
                   display: "flex",width: "35%",
                   alignItems: "center"}}
                    className="p-2"
                  >
                    {item.label}:
                  </div>{" "}
                  {item.label_list && <Dropdown>
                    <Dropdown.Toggle size="sm" id="dropdown-basic">
                      {item.value}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {item.label_list?.map((text) => (
                        <Dropdown.Item
                          onClick={() => onHandlerPostFiltering(item, text)}
                        >
                          {text}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>}
         
                  {item.lbl && (
                    <> <input type="number" step="0.1" min="0.0" className="w-25" name={item.label} value={item.value} onChange={(text)=>{handleFilterInputChange(item, text)}}
                    /><label style={{ paddingLeft: 5 }}>{item.lbl}</label></>
                    
                  )}
                </div>
              </Stack>
            ))}{" "}
          </Col>
        </Stack>
      </Container>
    );
  }
  const handleStartDateSelection = (date) => {
    const _date = new Date(date);
    const year = _date.getFullYear();
    const month = String(_date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(_date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setCurrentSelectedStartDate(formattedDate);
    setStartSelectedDate(date);
    setModalIsOpenStartDate(false);
  };
  // console.log("currentSelectedStartDate", currentSelectedStartDate)

  const handleEndDateSelection = (date) => {
    setSelectedEndDate(date);
    const _date = new Date(date);
    const year = _date.getFullYear();
    const month = String(_date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
    const day = String(_date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setCurrentSelectedEndDate(formattedDate);
    setModalIsOpenEndDate(false);
  };

  function closeStartDateModal() {
    setModalIsOpenStartDate(false);
  }

  function closeEndDateModal() {
    setModalIsOpenEndDate(false);
  }

  const onHandlerModelType = (type) => {
    setModelType(type);
  };
  const onHandlerPredModelType = (type) => {
    setPredModelType(type);
  };
  const isDateDisabled = (date) => {
    // Disable dates before the selected start date
    return date < selectedStartDate;
  };
  const isDateDisabled2 = (date) => {
    // Disable dates before the selected start date
    return date > selectedEndDate;
  };

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <Container>
        <Row style={{ margin: "10px 0px" }}>
          Start new backtesting simulation(s)
        </Row>
      </Container>
      <Container
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #f5f5f5",
          borderRadius: "7px",
        }}
      >
        <Stack gap={2} style={{ padding: 20 }}>
          <Stack gap={4} direction="horizontal">
            <div className="p-2" style={{ fontSize: 18, fontWeight: 600 }}>
              기간:
            </div>{" "}
            <div
              className="calendar_icon p-2"
              onClick={() => setModalIsOpenStartDate(!modalIsOpenStartDate)}
            >
              {" "}
              <AiOutlineCalendar
                size={25}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              />
              {modalIsOpenStartDate ? convertStartDate() : convertStartDate()}
            </div>{" "}
            ~{" "}
            <div
              onClick={() => setModalIsOpenEndDate(!modalIsOpenEndDate)}
              className="calendar_icon p-2"
            >
              {" "}
              <AiOutlineCalendar size={25} />
              {modalIsOpenEndDate ? convertEndDate() : convertEndDate()}
            </div>
          </Stack>
          <Stack gap={2} direction="horizontal">
            <div style={{ fontSize: 18, fontWeight: 600 }} className="p-2">
              {" "}
              모델 타입:
            </div>{" "}
            <Dropdown>
              <Dropdown.Toggle size="sm" id="dropdown-basic">
                {modelType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {MODEL_TYPE?.map((item) => (
                  <Dropdown.Item onClick={() => onHandlerModelType(item)}>
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Stack>
          <Stack gap={2} direction="horizontal">
            <div style={{ fontSize: 18, fontWeight: 600 }} className="p-2">
              예측 모델:
            </div>{" "}
            <Dropdown>
              <Dropdown.Toggle size="sm" id="dropdown-basic">
                {predModelType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {PRED_MODEL_TYPE?.map((item) => (
                  <Dropdown.Item onClick={() => onHandlerPredModelType(item)}>
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Stack>
        </Stack>
      </Container>

      <div className="d-flex align-items-center justify-content-center m-xl-3">
        <Button
          variant="secondary"
          size="ls"
          className="px-xl-5"
          onClick={() => {
            renderFilterDiv();
          }}
        >
          추가
        </Button>
      </div>

      {filterContainer?.map((_, index) => (
        <FilterChild key={index} index={index} filterGroupState={filterGroupState} filterSecondGroupState={filterSecondGroupState} filterThirdGroupState={filterThirdGroupState} setFilterGroupState={setFilterGroupState}setFilterSecondGroupState={setFilterSecondGroupState} setFilterThirdGroupState={setFilterThirdGroupState}/>
      ))}
      <div className="d-flex align-items-center justify-content-center m-xl-3">
        {showFilterDiv && (
          <Button
            variant="secondary"
            size="ls"
            className="px-xl-5"
            onClick={() => {
              runSimulation();
            }}
          >
            실행
          </Button>
        )}
      </div>
      {modalIsOpenStartDate && (
        <Modal
          isOpen={modalIsOpenStartDate}
          onRequestClose={closeStartDateModal}
          style={customStyles}
        >
          <Calendar
            calendarType="US"
            locale="ko"
            defaultActiveStartDate={selectedStartDate}
            onClickDay={(value) => handleStartDateSelection(value)}
            onChange={onChange}
            value={value}
            tileDisabled={({ date }) => isDateDisabled2(date)}
            // minDate={minDate}
            // maxDate={maxDate}

            tileClassName={({ date, view }) => {
              const isHovered = view === "month" || view === "year"; // Define hoverable views (month/year)
              // console.log("date", date)
              return classNames({
                "selected-date":
                  date.toDateString() === selectedStartDate.toDateString(),
              });
            }}
          />
        </Modal>
      )}

      <Modal
        isOpen={modalIsOpenEndDate}
        onRequestClose={closeEndDateModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Calendar
          calendarType="US"
          locale="ko"
          defaultActiveStartDate={selectedEndDate}
          onClickDay={(date) => handleEndDateSelection(date)}
          onChange={onChangeEndDate}
          value={EndValue}
          // minDate={minDate}
          // maxDate={maxDate}
          tileDisabled={({ date }) => isDateDisabled(date)}
          tileClassName={({ date, view }) => {
            const isHovered = view === "month" || view === "year"; // Define hoverable views (month/year)

            return classNames({
              "selected-date":
                date.toDateString() === selectedEndDate.toDateString(),
            });
          }}
        />
      </Modal>
    </ThemeProvider>
  );
}

export default Backtest;
