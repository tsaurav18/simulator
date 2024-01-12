import React, {useEffect,useState} from "react";
import "./Results.css"
import MainNavbar from "../../Components/Navbar";
import { Col, ShadowCol, Row, ShadowRow } from "../../globalStyles/globalStyled";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { saveDataState } from "../../redux/slices/UserResultSlice";
import {resultAPI} from "../../api/index"
import { Oval } from "react-loader-spinner";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  zoomPlugin
);
const LineChart = ({data}) => {
  let simulator_title='';

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
  // Group data by unique first elements of the tuple
  const groupedData = {};
  let invest_inverval_dict = {"weekly":"주 단위", "daily":"일 단위"}
  let model_type_dict= {"stock":"개별 종목"}
  let pred_days_dict = {"1":"1일", "5":"1주", "10":"2주", "20":"4주","40":"8주" }
  Object.entries(data).forEach(([key, values]) => {
    console.log("values", JSON.parse(values["data"]))
    let parsed_data = JSON.parse(values["data"])
    simulator_title = "["+ String(parsed_data["date_from"])+"~" +String(parsed_data["date_to"])+"]"+ " " + String(model_type_dict[parsed_data["model_type"]])+" - "+ String(pred_days_dict[parsed_data["pred_days"]]) + " " +"모델" + " (분산 투자: "+invest_inverval_dict[parsed_data["invest_interval"]]+")"

    let r1_1 = parsed_data["r1_1"]
    let r1_2 = parsed_data["r1_2"]
    let r1_3 = parsed_data["r1_3"]
    let r1_4 = parsed_data["r1_4"]
    let r1_5 = parsed_data["r1_5"]
    let r2 = parsed_data["r2"]
    let r3 = parsed_data["r3"]
    let r1_default = parsed_data["r1_default"]
    let remove_preferred = parsed_data["remove_preferred"]
    let transaction_fee = parsed_data["transaction_fee"]
    let post_filtering = parsed_data["post_filtering"]
    let num_stocks = parsed_data["num_stocks"]  //투자 종목 수 
    // let invest_interval = parsed_data["invest_interval"] //분산 투자
    let model_type = parsed_data["model_type"] //예측 모델 
   
    let filterLabel = `필터링: `
    if(r1_default===1){
      filterLabel=  filterLabel+ `R1, `
    }else {
      if(r1_1>0){
        filterLabel=filterLabel+ `R1.1-${r1_1}억, `
      }if(r1_2>0){
        filterLabel=filterLabel+ `R1.2-${r1_2}억, `
      }if(r1_3===1){
        filterLabel=filterLabel+ `R1.3, `
      }if(r1_4===1){
        filterLabel= filterLabel+ `R1.4, `
      }if(r1_5===1){
        filterLabel= filterLabel+ `R1.5, `
      }
    }
    if(r2===1){
      filterLabel=filterLabel+ `R2, `
    }if(r3===1){
      filterLabel=filterLabel+ `R3, `
    }

    if(remove_preferred===1){
      filterLabel= filterLabel+ `우선주 제외, `
    }
    if(post_filtering!=="" && post_filtering!==null){
      filterLabel = filterLabel + `${post_filtering}, `
    }
    if(num_stocks!=="" && num_stocks!==null){
      filterLabel= filterLabel+ `투자 종목 수: Top ${num_stocks}, `
    }
    // if(invest_interval!==""){
    //   filterLabel= filterLabel+ `분산 투자: ${invest_inverval_dict[invest_interval]}, `
    // }
    if(transaction_fee!==null){
      filterLabel= filterLabel+ `수수료: ${transaction_fee}%`
    }
  // console.log("filterLabel", filterLabel)
    let firstElement = key[0];
      // console.log("firstElement",key[0])
    if (!groupedData[firstElement]) {
      groupedData[firstElement] = [];
    }
    groupedData[firstElement].push({
      label:filterLabel,
      data: values["chart_data"].map((item) => ({ x: item.date, y: item.pv })),
    });
    console.log("groupedData",groupedData)
  });
  

 
  // Format datasets
  const datasets = Object.values(groupedData).map((group, index) => {
    return {
      label: group[0].label, // Assuming all labels in the group are the same
      data: group.reduce((acc, item) => acc.concat(item.data), []), // Flatten the data
      borderColor: _borderColorList[index],
      backgroundColor: _backgoundColor[index],
      borderWidth: 1.5,
      pointRadius: 1, // Reduce the point size here
      pointHoverRadius: 4,
      fill: false,
      tension: 0.4,
    };
  });


  // Chart configuration
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
          // wheel: {
          //   enabled: true, // Enable wheel zooming
          // },
          mode: "x",
        },
      },
      legend: {
        display:true,
        position: "bottom",
        align:"start", 
        fullSize:true,
        labels:{
          font:{
          size:16, 
          color:"#000",
          family:"sans-serif",
          weight:"bold", 
           
        }}
        
        
      },
    
      
    },
  };
  return <Col style={{width:"100%", padding:"10px"}}>
    <div style={{fontSize: "18px",
    fontWeight: "600", textAlign: "left",
    width: "100%",
    padding: "18px 10px"}}>{simulator_title}</div>
    <Line data={{ datasets }} options={options}/></Col>
};


export default function Results() {
  // const dispatch = useDispatch()
 const [loader, setLoader] = useState(false)
  const user_info_reducer = useSelector((state) => state.loginReducer);
  // const data_reducer = useSelector((state) => state.dataReducer);
  
  const [resultDataList, setResultDataList] = useState([])
  console.log("resultDataList",resultDataList)
 const getUserResults=async()=>{
    setLoader(true);
    try{ const res = await resultAPI.fetchUserResult(user_info_reducer.user_id);
      if (res.status === 200) {
        if (res.data) {
  
          setResultDataList(JSON.parse(res.data))
          // dispatch(saveDataState(JSON.parse(res.data)));
        }
        
      } else if (res.status === 400) {
        // toast("인터넷 장애로 인하여 정보를 못 가져왔습니다. 다시 로그인하세요.");
        const res = await resultAPI.fetchUserResult(user_info_reducer.user_id);
        if (res.status === 200) {
  
          if (res.data) {
            setResultDataList(JSON.parse(res.data))
            // dispatch(saveDataState(res.data));
  
            
          }
        }else if(res.status===400){
          toast("데이터가 없습니다.");
        }
     
      } else {
        if (res.data.msg) {
          toast(res.data.msg);
  
          setLoader(false);
        }
      }}
   catch{
    toast("서버 접속 에러. 관리자에게 문의하세요. ")
   }
    
    setLoader(false);
  };
 
  useEffect(() => {
    getUserResults()
  
    return () => {
      
    }
  }, [])
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <MainNavbar />
 
      <Container style={{ marginTop: 20}}>
      <div className="filter_box" onClick={()=>handleClick()} style={{width:"100%"}}>
       <div style={{ fontWeight:"700"}}> 필터 옵션 설명</div>
        {isOpen && <div style={{marginTop:"10px"}}>
          
          <p><span style={{fontWeight:"700"}}> R1:</span> <span>기본 세팅 전용 (R1.1, R1.2, R1.3, R1.4, R1.5)</span></p>
          <p><span style={{fontWeight:"700"}}>R1.1: </span><span>시가총액 (억)</span></p>
          <p><span style={{fontWeight:"700"}}>R1.2: </span><span>평균거래대금 (억)</span></p>
          <p><span style={{fontWeight:"700"}}>R1.3:</span> <span>부채비율</span></p>
          <p><span style={{fontWeight:"700"}}>R1.4:</span> <span>잔고율 </span></p>
          <p><span style={{fontWeight:"700"}}>R1.5:</span> <span>비이슈종목</span></p>
        
          <p><span style={{fontWeight:"700"}}>R2:</span> <span>중복 섹터</span></p>
          <p><span style={{fontWeight:"700"}}>R3: </span><span>중복 종목</span></p>
          
    
          </div> }
         
        </div>
          {loader?  <Oval
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
              />:resultDataList?   <Row style={{width:"100%"}}>
              <Col style={{ height:"100%"}}>{Object.keys(resultDataList).length>0 &&<Col>{Object.keys(resultDataList).map(k=>
                <ShadowCol style={{  height:"100%", marginBottom:20, backgroundColor:"#eee"}}>  <LineChart data= {resultDataList[k]}/></ShadowCol>)}</Col>}</Col>
              {/* <Col>model description</Col> */}
            </Row>:<Row>데이터가 없습니다. </Row>}
        
  
      </Container>
      <ToastContainer/>
    </div>
  );
}


{/* <ShadowCol style={{ width:"700px", height:"100%", marginBottom:20}}> */}
               