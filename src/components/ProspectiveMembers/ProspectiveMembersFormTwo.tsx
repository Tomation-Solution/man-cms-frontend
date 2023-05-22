import React from "react";
import {
  CustomButtons,
  NavigationBtn,
  NavigationBtnContainer,
  ProspectiveMembersFormContainer,
} from "./ProspectiveMemers.styles";
import {
  Form,
  FormHalveInput,
  FormInput,
} from "../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import Button from "../Button/Button";
import { Link, Navigate } from "react-router-dom";
import { ApproveSvg, DeclineSvg } from "../../assets/svgs";
import { useAuthStore } from "../../zustand/store";

const ProspectiveMembersFormTwo = () => {
  // const { register, handleSubmit } = useForm();

  // const onSubmitHandler = (data: any) => {
  //   console.log(data);
  // };

  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "prospective_certificates"].includes(
      String(userData?.user_type)
    )
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <ProspectiveMembersFormContainer>
      {/* <Form onSubmit={handleSubmit(onSubmitHandler)}> */}
      <FormHalveInput>
        <FormInput>
          <p>Corporate Affairs Commission (CAC) Forms C02 and C07</p>
          <br />
          <Button>Download Document</Button>
        </FormInput>
        <br />

        <FormInput>
          <p>Company’s Certificate of Incorporation</p>
          <br />
          <Button>Download Document</Button>
        </FormInput>
      </FormHalveInput>
      <br />

      <FormHalveInput>
        <FormInput>
          <p>
            A Covering Letter on the letter head of your company applying to be
            registered as a member of MAN, stating the breakdown of payments
            made and documents attached.
          </p>
          <br />
          <Button>Download Document</Button>
        </FormInput>
        <br />

        <FormInput>
          <p>
            Copies of Duly Certified Audited Financial Statement for proceeding
            two (2) years or Business Plan for new companies
          </p>
          <br />
          <Button>Download Document</Button>
        </FormInput>
      </FormHalveInput>
      <br />

      <FormInput style={{ width: "48%" }}>
        <p>Photocopy of your receipt issued on purchase of Application Form.</p>
        <br />
        <Button>Download Document</Button>
      </FormInput>

      <CustomButtons>
        <DeclineSvg styling={{ cursor: "pointer" }} />
        <ApproveSvg styling={{ cursor: "pointer" }} />
      </CustomButtons>

      <FormInput>
        <label>
          Remark
          <br />
          <textarea />
        </label>
      </FormInput>

      <NavigationBtnContainer>
        <NavigationBtn isFilled={false}>
          Send Feedback to Applicant
        </NavigationBtn>
        <Link to={"/approval-message"}>
          <NavigationBtn isFilled={true}>Approve Application</NavigationBtn>
        </Link>
      </NavigationBtnContainer>
      {/* </Form> */}
    </ProspectiveMembersFormContainer>
  );
};

export default ProspectiveMembersFormTwo;
