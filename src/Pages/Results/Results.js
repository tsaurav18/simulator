import React, {useEffect,useState} from "react";
import MainNavbar from "../../Components/Navbar";
import { Col, ShadowCol, Row } from "../../globalStyles/globalStyled";
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
  console.log("data>>>>>>>>>>>>>>>",data)
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
  Object.entries(data).forEach(([key, values]) => {
    const firstElement = key[0];
      console.log("firstElement",key[0])
    if (!groupedData[firstElement]) {
      groupedData[firstElement] = [];
    }
    groupedData[firstElement].push({
      label: key[1],
      data: values.map((item) => ({ x: item.date, y: item.pv })),
    });
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

  // // Format the final chart data
  // const modelsChartData = {
  //   labels: datasets[0].data.map((point) => point.x),
  //   datasets: datasets,
  // };

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
          wheel: {
            enabled: true, // Enable wheel zooming
          },
          mode: "x",

        
        },
      },
    },
  };
  return <Line data={{ datasets }} options={options} />;
};


export default function Results() {
  const dispatch = useDispatch()
 const [loader, setLoader] = useState(false)
  const user_info_reducer = useSelector((state) => state.loginReducer);
  const data_reducer = useSelector((state) => state.dataReducer);
  
  const [resultDataList, setResultDataList] = useState([])
  console.log("resultDataList",resultDataList)
 const getUserResults=async()=>{
    setLoader(true);
    const res = await resultAPI.fetchUserResult(user_info_reducer.user_id);
    if (res.status === 200) {
      if (res.data) {

        setResultDataList(JSON.parse(res.data))
        // dispatch(saveDataState(JSON.parse(res.data)));
      }
      
    } else if (res.status == 400) {
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
    }
    
    setLoader(false);
  };
 
  useEffect(() => {
    getUserResults()
  
    return () => {
      
    }
  }, [])
  
  return (
    <div>
      <MainNavbar />
      <Container style={{ marginTop: 20 }}>
        <ShadowCol>
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
              />:resultDataList?   <Row>
              <Col><Row >{Object.keys(resultDataList).length>0 &&<LineChart data= {resultDataList}/>}</Row></Col>
              <Col>model description</Col>
            </Row>:<Row>데이터가 없습니다. </Row>}
        
        </ShadowCol>
      </Container>
      <ToastContainer/>
    </div>
  );
}
