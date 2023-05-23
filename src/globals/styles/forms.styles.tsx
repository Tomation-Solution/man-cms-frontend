import styled from "styled-components";
import { seqBlue100, seqLightBlue, seqWhite, seqWhite100 } from "../colors";
import { Laptop, mobile, tablet } from "../../responsive";

export const Header = styled.div`
  h1 {
    font-weight: 500;
    color: ${seqBlue100};
    margin-bottom: 0.3em;
  }
  h3 {
    font-weight: 500;
  }
`;

export const FormContainer = styled.div`
  padding: 20px;
  margin-top: 3em;
  border-radius: 10px;
  border: 2px solid #d4d2d0;
  text-align: start;
  width: 35%;
  color: #2d2d2d;

  h2 {
    font-size: 30px;
    font-weight: 600;
  }

  a {
    color: ${seqLightBlue};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  p {
    margin-top: 1em;
  }

  ${Laptop({
    width: "50%",
  })}
  ${tablet({
    width: "90%",
    h2: {
      fontSize: "20px",
    },
    fontSize: "14px",
  })}
`;

export const VerificationCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 5em;
  margin-bottom: 1em;
  p {
    font-size: 20px;
    font-weight: 500;
    color: ${seqBlue100};
    font-size: 14px;
  }
`;

export const CodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    border: none;
    border: 2px solid ${seqLightBlue};
    outline: none;
    transition: all 0.5s;

    &:focus {
      border: 2px solid ${seqWhite};
      animation: 1s ease-in-out 1s 1 slidein;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* margin-top: 2em; */
`;

export const FormHalveInput = styled.div`
  display: flex;
  gap: 50px;
  ${mobile({
    flexDirection: "column",
  })}
`;

export const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  width: auto;
  flex: 1;

  label {
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  input {
    padding: 1em;
    background: rgba(242, 238, 252, 0.39);
    border: 1px solid ${seqBlue100};
    border-radius: 5px;

    outline: none;
    &:focus {
      border: 1px solid ${seqLightBlue};
      outline: none;
    }
  }

  textarea {
    padding: 1em;
    background: rgba(242, 238, 252, 0.39);
    border: 1px solid ${seqBlue100};
    border-radius: 5px;
    outline: none;
    &:focus {
      border: 2px solid ${seqLightBlue};
      outline: none;
    }
  }

  ${mobile({
    width: "100%",
    input: {
      fontSize: "14px",
    },
  })}
`;

export const FormButton = styled.button`
  padding: 0.5em;
  border: none;
  border-radius: 5px;
  background-color: ${seqLightBlue};
  color: ${seqWhite};
  font-weight: 500;
  margin-top: 1em;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  a {
    text-decoration: none;
    color: ${seqWhite};
    &:hover {
      color: ${seqLightBlue};
    }
  }
  &:hover {
    background-color: ${seqWhite};
    color: ${seqLightBlue};
    border: 1px solid ${seqLightBlue};
  }
`;

// miscelaneous styles

export const FormLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1em;
  a {
    color: ${seqLightBlue};
    font-weight: 500;
    margin-left: 0.5em;
  }
`;

export const FormError = styled.div`
  color: crimson;
  font-weight: 500;
  margin-top: 0.1em;
`;

export const FormSuccess = styled.div`
  color: green;
  font-weight: 500;
  margin-top: 0.5em;
`;

export const FormLoading = styled.div`
  color: ${seqLightBlue};
  font-weight: 500;
  margin-top: 0.5em;
`;

export const FormMessage = styled.div`
  color: ${seqLightBlue};
  font-weight: 500;
  margin-top: 0.5em;
`;

export const FormCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1em;

  input[type="checkbox"] {
    zoom: 1.5;
  }
  input {
    margin-right: 0.5em;
  }
  label {
    font-weight: 500;
  }
`;

export const FormSelect = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  flex: 1;
  width: auto;
  label {
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  select {
    padding: 1em;
    border: 1px solid ${seqBlue100};
    border-radius: 5px;
    outline: none;
  }
  ${mobile({
    width: "100%",
    input: {
      fontSize: "14px",
    },
  })}
`;

export const FormRadio = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  width: 100%;
  label {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 500;
    margin-bottom: 0.5em;
  }
  input {
    zoom: 1.5;
    margin-right: 0.5em;
  }
`;

export const FormRadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5em;
`;

export const FormRadioLabel = styled.label`
  font-weight: 500;
`;

export const FormRadioInput = styled.input`
  margin-right: 0.5em;
`;

export const FormRadioError = styled.div`
  color: red;
  font-weight: 500;
  margin-top: 0.5em;
`;

export const FormRadioSuccess = styled.div`
  color: green;
  font-weight: 500;
  margin-top: 0.5em;
`;
