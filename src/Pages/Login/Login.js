import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { loginAPI } from "../../api/index";
import { loginInfo } from "../../redux/slices/loginSlice"
import { useTitle } from "../../config/routing/DocumentNameChanger";
import { Oval } from "react-loader-spinner";
import { useResponsive } from "../../hooks/useResponsive";
import { WhiteSpace } from "../../globalStyles/globalStyled";
function Login() {
  const { responsiveValue } = useResponsive()
  useTitle("딥트레이드");
  const [loader, setLoader] = useState(false);
  const [formInput, setFormInput] = useState({
    user_id: "",
    user_pass: "",
  });
console.log("login function")
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitLogin = async (event) => {
    event.preventDefault();

    if (formInput.user_id === "") {
      toast("아이디를 입력해주세요.");
      return;
    } else if (formInput.user_pass === "") {
      toast("비밀번호를 입력해주세요.");
      return;
    }
    setLoader(true);
    const res = await loginAPI.simulatorLogin(formInput);
    if (res.status === 200) {
      if (res.data) {
        dispatch(loginInfo(res.data));
        setFormInput({ user_id: "", user_pass: "" });
        navigate("/monitoring");
      }
    } else if (res.status == 400) {
      // toast("인터넷 장애로 인하여 정보를 못 가져왔습니다. 다시 로그인하세요.");
      const res = await loginAPI.simulatorLogin(formInput);
      if (res.status === 200) {
        console.log("res.status", res.data)
        if (res.data) {
          dispatch(loginInfo(res.data));
          // toast("로그인 되었습니다.");
          setFormInput({ user_id: "", user_pass: "" });
          navigate("/monitoring");
        }
      }else if(res.status===400){
        toast("미등록된 아이디입니다.");
      }
      setLoader(false);
    } else {
      if (res.data.msg) {
        toast(res.data.msg);

        setLoader(false);
      }
    }
    
    setLoader(false);
  };

  return (
    <div className="loginContainer">
      <div style={{ width: responsiveValue(600, 500, 327),}}>
        {/* Your logo */}
        <div style={{ width: responsiveValue(600, 500, 327) ,fontSize: "80px",
    fontWeight:"900",
    textAlign: "center"}}>
        Login
        </div>
        {/* <img src="logo.png" alt="Logo" /> */}
      </div>
      <div className="formSection" style={{ width: responsiveValue(600, 500, 327) }}>
        <form onSubmit={submitLogin} className="enterprise_form_wrapper" style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div className="enterprise_form_input_group" style={{ flex: 1 }}>
            <div className="inputGroup" style={{ width: "100%" }}>
              {/* <label htmlFor="id">ID:</label> */}

              <input
                type="text"
                placeholder="아이디 입력해주세요"
                onChange={(e) => {
                  setFormInput((prevFormInput) => ({
                    ...prevFormInput,
                    user_id: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="inputGroup" style={{ width: "100%" }}>
              {/* <label htmlFor="pass">Pass:</label> */}
              <input
                type="password"
                id="pass"
                placeholder="비밀번호 입력해주세요"
                onChange={(e) => {
                  setFormInput((prevFormInput) => ({
                    ...prevFormInput,
                    user_pass: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <WhiteSpace width={10} />
          <button
            className="enterprise_login_btn"
            type="submit"
            onClick={(e) => submitLogin(e)}
            style={{ width: responsiveValue(150, 95, 85) }}
          >
            {loader == true ? (
              <Oval
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
              />
            ) : (
              "로그인"
            )}
          </button>
        </form>
      </div>
      {/* <div className="infoSection">
        <h3>서비스 안내 가이드</h3>
     
      </div> */}
      <ToastContainer />
    </div>
  );
}

export default Login;
