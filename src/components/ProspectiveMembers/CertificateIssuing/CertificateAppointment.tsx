import React from "react";
import { CertificateAppointmentContainer } from "./CertificateIssuing.styles";
import Button from "../../Button/Button";
import {
  FormHalveInput,
  FormInput,
} from "../../../globals/styles/forms.styles";
import { useForm } from "react-hook-form";
import { ProspectiveMembersFormContainer } from "../ProspectiveMemers.styles";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../zustand/store";

const CertificateAppointment = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      time: "",
      date: "",
    },
  });
  const userData = useAuthStore.getState().user;

  if (
    !["super_user", "prospective_certificates"].includes(
      String(userData?.user_type)
    )
  ) {
    return <Navigate to="/unauthorized" />;
  }
  return (
    <>
      <CertificateAppointmentContainer>
        <h1>ABC Company Certificate Appointment Date</h1>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero in
          magnam labore ducimus porro suscipit a eaque hic nobis ratione dolore
          illum ab reiciendis fugiat, fuga cupiditate dicta unde amet? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Libero in magnam
          labore ducimus porro suscipit a eaque hic nobis ratione dolore illum
          ab reiciendis fugiat, fuga cupiditate dicta unde amet?
        </p>
        <br />

        <ProspectiveMembersFormContainer>
          <FormHalveInput>
            <FormInput>
              <label>
                <p className="darkend">Please select date</p>
                <br />
                <input type="date" {...register("date", { required: true })} />
              </label>
            </FormInput>

            <FormInput>
              <label>
                <p className="darkend">Please select time</p>
                <br />
                <input type="time" {...register("time", { required: true })} />
              </label>
            </FormInput>
          </FormHalveInput>
          <Link to={"/certificate-message"} style={{ textDecoration: "none" }}>
            <Button>Schedule</Button>
          </Link>
        </ProspectiveMembersFormContainer>
      </CertificateAppointmentContainer>
    </>
  );
};

export default CertificateAppointment;
