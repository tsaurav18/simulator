import styled from "styled-components";

const parser = (value) => {
  if (typeof value === "string") {
    if (value.substring(value.length - 2, value.length) == "px") {
      return value;
    } else if (value.substring(value.length - 1, value.length) === "%") {
      return value;
    } else {
      return value + "px";
    }
  } else {
    return value + "px";
  }
};

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.width ? parser(props.width) : "100%")};
  height: ${(props) => (props.height ? parser(props.height) : "100%")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "center"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  box-sizing: border-box;
`;
// export const GlobalStyled = {

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: ${(props) => (props.width ? parser(props.width) : "100%")};
  height: ${(props) => (props.height ? parser(props.height) : "100%")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "center"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "center")};
  box-sizing: border-box;
`;
export const WhiteSpace = styled.div`
  height: ${(props) => (props.height ? parser(props.height) : "10px")};
  width: ${(props) => (props.width ? parser(props.width) : "10px")};
`;

export const ShadowCol = styled(Col)`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 6px 0px rgba(163, 161, 255, 0.16);

`;

export const ShadowRow = styled(Row)`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 6px 0px rgba(163, 161, 255, 0.16);
`;
