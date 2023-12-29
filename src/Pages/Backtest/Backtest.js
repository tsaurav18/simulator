import React, { useState , useEffect} from "react";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Backtest.css";
import { backtestApi } from "../../api";
import { Oval } from "react-loader-spinner";
import MainNavbar from "../../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
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
  const user_info_reducer = useSelector((state) => state.loginReducer);
  const [filterChildStates, setFilterChildStates] = useState([]);
  console.log("filterChildStates,",filterChildStates,user_info_reducer)
  // Function to add a new FilterChild state to the array
  const addFilterChildState = () => {
    setFilterChildStates((prevStates) => [
      ...prevStates,
      createFilterChildState(), // Define createFilterChildState function accordingly
    ]);
    setshowFilterDiv(true);
  };
  const DISTRIBUTE_INVEST_LIST = ['주 단위','일 단위'];
  const [showFilterDiv, setshowFilterDiv] = useState(false);
  const MODEL_TYPE = ["개별 모델"];
  const PRED_MODEL_TYPE = ["1일", "1주", "2주", "4주", "8주"];
  const [modelType, setModelType] = useState(MODEL_TYPE[0]);
  const [predModelType, setPredModelType] = useState(PRED_MODEL_TYPE[0]);
  const [investIntervalType, setInvestIntervalType] = useState(DISTRIBUTE_INVEST_LIST[0]);
  const [modalIsOpenStartDate, setModalIsOpenStartDate] = useState(false);
  const [modalIsOpenEndDate, setModalIsOpenEndDate] = useState(false);
  const [selectedStartDate, setStartSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [simulationRunLoader, setSimulationRunLoader] = useState(false)
  
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
  

  const POST_FILTERING_LIST = ["없음", "KHK31-기본", "KHK31-완화"];
  const INVEST_STOCK_NO_LIST = [5,20];


// Function to create an initial state for FilterChild


const createFilterChildState = () => {
  return {
    filterGroupState: [
      { label: "R1 (기본 세팅 전용)", value: false },
      {
        label: "R1.1 (시가총액)",
        value: false,
        input_flg: true,
        input_val: "0",
        input_lbl: "억 (원)",
        disableStatus: false,
        inputDisableStatus:true
      },
      {
        label: "R1.2 (평균거래대금)",
        value: false,

        input_flg: true,
        input_val: "0",
        input_lbl: "억 (원)",
        disableStatus: false,
        inputDisableStatus:true
      },
      { label: "R1.3 (부채비율)", value: false ,       disableStatus: false,},
      { label: "R1.4 (잔고율)", value: false,       disableStatus: false, },
      { label: "R1.5 (비이슈종목)", value: false,       disableStatus: false, },
    ],
    filterSecondGroupState: [
      { label: "R2 (중복 섹터)", value: false },
      { label: "R3 (중복 종목)", value: false },
      { label: "우선주 제외", value: false },
    ],
    filterThirdGroupState: [
      {
        label: "포스트 필터링",
        value: POST_FILTERING_LIST[0],
        label_list: POST_FILTERING_LIST,
      },
      {
        label: "투자 종목 수",
        value: INVEST_STOCK_NO_LIST[0],
        label_list: INVEST_STOCK_NO_LIST,
      },
    
      { label: "수수료", value: 0.0, lbl: "%", label_list: null },
    ],
  };
};

// Function to update the state of a specific FilterChild

const updateFilterChildState = (index, updatedState) => {

  setFilterChildStates((prevStates) => {
    const newStates = [...prevStates];
    newStates[index] = {
      ...newStates[index],
      ...updatedState,
      filterGroupState: updatedState.filterGroupState
        ? [...updatedState.filterGroupState]
        : newStates[index].filterGroupState,
      filterSecondGroupState: updatedState.filterSecondGroupState
        ? [...updatedState.filterSecondGroupState]
        : newStates[index].filterSecondGroupState,
      filterThirdGroupState: updatedState.filterThirdGroupState
        ? [...updatedState.filterThirdGroupState]
        : newStates[index].filterThirdGroupState,
    };
    return newStates;
  });
};


  const runSimulation = async() => {
    setSimulationRunLoader(true)

    // filterChildStates.map(item=>{
    //   console.log("item", item)
    //   item.filterGroupState.map(ob=>{
    //     if(ob.label==="R1.1 (시가총액)" && ob.value==true){
    //       if(ob.input_val==="0")
    //     }
    //        console.log(ob.label)
    //   })
    // })


    try {
      let user_info={
        user_id:user_info_reducer.user_id
      }
      let model_state = {
        currentSelectedStartDate,
        currentSelectedEndDate,
        modelType,
        predModelType,
        investIntervalType
      }
      const final_state = [
        user_info,
        model_state,
        filterChildStates
       
      ];
      console.log("final_state",final_state)
      let DEBUG = false
      if(DEBUG){
        console.log("Debug mode")
        setSimulationRunLoader(false)
        return
      }else{
        const res = await backtestApi.runSimulator(final_state)
        console.log("data", res.data)
        toast("시뮤레이션 실행되었습니다.");
        setSimulationRunLoader(false)
        if(res.status===200){
  
          toast(res.data.response)
          
        }
  
        if (res.status==500){
          toast("관리자에게 문의해 주세요.");
        }
      }
    
    } catch (error) {
      toast("데이터를 불러오지 못했습니다.");
      console.log("error Invalid Json", error)
    }
    setSimulationRunLoader(false)
  };
 
 

  function FilterChild({ index,filterGroupState,filterSecondGroupState, filterThirdGroupState,updateFilterChildState}) {


   const handleCheckBoxChange = (item) => {
    const updatedFilterGroupState = filterGroupState.map((el) => {
      if (item.label === "R1 (기본 세팅 전용)") {
   if(item.value){

    return { ...el, value: !el.value, disableStatus: !el.disableStatus ,  inputDisableStatus:true};
   }else{
 
    return { ...el, value: !el.value, disableStatus: !el.disableStatus ,  inputDisableStatus:true};
   }
     
      } else if (el.label === item.label) {
        return { ...el, value: !el.value ,  inputDisableStatus:!el. inputDisableStatus };
      }
      return el;
    });

    updateFilterChildState(index,  { filterGroupState: [...updatedFilterGroupState] });
  };

  const handleFilterCheckboxChange = (item) => {
    const updatedFilterSecondGroupState = filterSecondGroupState.map((el) => {
      if (el.label === item.label) {
        return { ...el, value: !el.value };
      }
      return el;
    });

    updateFilterChildState(index, { filterSecondGroupState: updatedFilterSecondGroupState });
  };

  const handleFilterFirstGroupInputChange = (item, text) => {
    const updatedFilterGroupState = filterGroupState.map((el) => {
      if (el.label === item.label) {
        return { ...el, input_val: text.target.value };
      }
      return el;
    });

    updateFilterChildState(index, { filterGroupState: updatedFilterGroupState });
  };

  const onHandlerPostFiltering = (item, text) => {
    const updatedFilterThirdGroupState = filterThirdGroupState.map((el) => {
      if (el.label === item.label) {
        return { ...el, value: text };
      }
      return el;
    });

    updateFilterChildState(index, { filterThirdGroupState: updatedFilterThirdGroupState });
  };

  const handleFilterInputChange = (item, t) => {
    const updatedFilterThirdGroupState = filterThirdGroupState.map((el) => {
      if (el.label === item.label) {
        return { ...el, value: t.target.value };
      }
      return el;
    });

    updateFilterChildState(index, { filterThirdGroupState: updatedFilterThirdGroupState });
  };


  
  
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
          <Col >
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
                  disabled={index===0?false:item.disableStatus}
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
                    disabled={item.inputDisableStatus}
                    type="number"
                    min="0"
                      style={{ width: "84px" }}
                      name={item.input_txt}
                      onInput={(text) => {
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
  const onHandlerInvestIntervalType = (type) => {
    setInvestIntervalType(type);
  };
  const isDateDisabled = (date) => {
   const current_date = new Date()
 
    // Disable dates before the selected start date
    return date > current_date;
  };
  const isDateDisabled2 = (date) => {
    const current_date = new Date()
    // Disable dates before the selected start date
    return date > current_date;
  };

  return (
    <ThemeProvider
      breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
      minBreakpoint="xxs"
    >
      <MainNavbar/>
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
          marginBottom: "20px"
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

          <Stack gap={2} direction="horizontal">
            <div style={{ fontSize: 18, fontWeight: 600 }} className="p-2">
              분산 투자:
            </div>{" "}
            <Dropdown>
              <Dropdown.Toggle size="sm" id="dropdown-basic">
                {investIntervalType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {DISTRIBUTE_INVEST_LIST?.map((item) => (
                  <Dropdown.Item onClick={() => onHandlerInvestIntervalType(item)}>
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Stack>
        </Stack>
      </Container>

      <div style={{  marginBottom: "20px"}} className="d-flex align-items-center justify-content-center m-xl-3">
        <Button
          variant="secondary"
          size="ls"
          className="px-xl-5"
          onClick={() => {
            // renderFilterDiv();
            addFilterChildState();
          }}
        >
          추가
        </Button>
      </div>


{filterChildStates?.map((childState, index) => (
        <FilterChild   key={index}
        index={index}
        {...childState}
        updateFilterChildState={updateFilterChildState}/>
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
         {!simulationRunLoader ? "실행": <Oval
                height={50}
                width={50}
                color="#fff"
                wrapperStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#fff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              /> }   
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
            <ToastContainer />
    </ThemeProvider>
  );
}

export default Backtest;
