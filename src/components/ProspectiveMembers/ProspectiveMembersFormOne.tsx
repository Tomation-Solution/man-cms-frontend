import React from "react";
import {
  Form,
  FormHalveInput,
  FormInput,
} from "../../globals/styles/forms.styles";
import { useForm, useFieldArray } from "react-hook-form";
import {
  CustomButtons,
  NavigationBtn,
  NavigationBtnContainer,
  ProspectiveMembersFormContainer,
} from "./ProspectiveMemers.styles";
import Button from "../Button/Button";
import { ApproveSvg, DeclineSvg } from "../../assets/svgs";
import { Link } from "react-router-dom";

const ProspectiveMembersForm = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name_of_company: "",
      cac_registration_number: "",
      tax_identification_number: "",
      corporate_office_addresse: "",
      office_bus_stop: "",
      office_city: "",
      office_lga: "",
      office_state: "",
      postal_addresse: "",
      telephone: "",
      email_addresse: "",
      website: "",
      factoru_details: "",
      legal_status_of_company: "",
      number_of_female_permanent_staff: "",
      number_of_male_permanent_staff: "",
      number_of_male_expatriates: "",
      number_of_female_expatriates: "",
      local_share_capital: "",
      foreign_share_capital: "",
      ownership_structure_equity_local: "",
      ownership_structure_equity_foregin: "",
      total_value_of_land_asset: "",
      total_value_of_building_asset: "",
      total_value_of_other_asset: "",
      installed_capacity: "",
      current_sales_turnover: "",
      projected_sales_turnover: "",
      are_your_product_exported: "",
      company_contact_infomation: "",
      designation: "",
      name_of_md_or_ceo_of_company: "",
      selectdate_of_registration: "",
      all_roduct_manufactured: [
        { product_manufactured: "product name", certificates: "value info" },
      ],
      all_raw_materials_used: [
        {
          major_raw_materials: "materials_name",
          major_raw_materials2: "materails_value",
        },
      ],
    },
  });

  const { fields: productfields } = useFieldArray({
    control,
    name: "all_roduct_manufactured",
  });
  const { fields: rawfields } = useFieldArray({
    control,
    name: "all_raw_materials_used",
  });

  const onHandleSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <ProspectiveMembersFormContainer>
      <Form onSubmit={handleSubmit(onHandleSubmit)}>
        <FormHalveInput>
          <FormInput>
            <label>
              Name Of Company
              <br />
              <input
                type="text"
                {...register("name_of_company", { required: true })}
              />
            </label>
          </FormInput>

          <FormInput>
            <label>
              CAC Registration Number
              <br />
              <input
                type="text"
                {...register("cac_registration_number", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Tax Identification Number (TIN)
              <br />
              <input
                type="text"
                {...register("tax_identification_number", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Corporate office Address
              <br />
              <input
                type="text"
                {...register("corporate_office_addresse", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Office Bus stop
              <br />
              <input
                type="text"
                {...register("office_bus_stop", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Office City
              <br />
              <input
                type="text"
                {...register("office_city", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Office LGA
              <br />
              <input
                type="text"
                {...register("office_lga", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Office State
              <br />
              <input
                type="text"
                {...register("office_state", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Postal Address (If Any)
              <br />
              <input
                type="text"
                {...register("postal_addresse", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Telephone Number(s) Inc. Mobile
              <br />
              <input
                type="text"
                {...register("telephone", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Email Address
              <br />
              <input
                type="text"
                {...register("email_addresse", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Website Address
              <br />
              <input type="text" {...register("website", { required: true })} />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Factory Details(Phone No., Email)
              <br />
              <input
                type="text"
                {...register("factoru_details", { required: true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Legal Status of Company
              <br />
              <input
                type="text"
                {...register("legal_status_of_company", { required: true })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        {productfields.map((fields, index) => (
          <FormHalveInput key={fields.id}>
            <FormInput>
              <label>
                Products Manufactured
                <br />
                <input
                  type="text"
                  {...register(
                    `all_roduct_manufactured.${index}.product_manufactured`,
                    { required: true }
                  )}
                />
              </label>
            </FormInput>
            <FormInput>
              <label>
                SON/ ISON/NAFDAC Certificates (If Any)
                <br />
                <input
                  type="text"
                  {...register(
                    `all_roduct_manufactured.${index}.certificates`,
                    { required: true }
                  )}
                />
              </label>
            </FormInput>
          </FormHalveInput>
        ))}

        {rawfields.map((fields, index) => (
          <FormHalveInput key={fields.id}>
            <FormInput>
              <label>
                Major Raw Materials Used(Indicate if Impoted/HS Code)
                <br />
                <input
                  type="text"
                  {...register(
                    `all_raw_materials_used.${index}.major_raw_materials`,
                    { required: true }
                  )}
                />
              </label>
            </FormInput>
            <FormInput>
              <label>
                % of Local Raw Materials
                <br />
                <input
                  type="text"
                  {...register(
                    `all_raw_materials_used.${index}.major_raw_materials2`,
                    { required: true }
                  )}
                />
              </label>
            </FormInput>
          </FormHalveInput>
        ))}

        <FormHalveInput>
          <FormInput>
            <label>
              Number of Male Permanent Staff
              <br />
              <input
                type="text"
                {...register("number_of_male_permanent_staff", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Number of Female Permanent Staff
              <br />
              <input
                type="text"
                {...register("number_of_female_permanent_staff", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Number of Male Expatriates
              <br />
              <input
                type="text"
                {...register("number_of_male_expatriates", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Number of Female Expatriates
              <br />
              <input
                type="text"
                {...register("number_of_female_expatriates", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Local Share Capital
              <br />
              <input
                type="text"
                {...register("local_share_capital", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Foreign Share Capital
              <br />
              <input
                type="text"
                {...register("foreign_share_capital", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Ownership Structure Equity(local)
              <br />
              <input
                type="text"
                {...register("ownership_structure_equity_local", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Ownership Structure Equity(Foreign)
              <br />
              <input
                type="text"
                {...register("ownership_structure_equity_foregin", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Total Value of Land Asset
              <br />
              <input
                type="text"
                {...register("total_value_of_land_asset", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Total Value of Building Asset
              <br />
              <input
                type="text"
                {...register("total_value_of_building_asset", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Total Value of Other Asset
              <br />
              <input
                type="text"
                {...register("total_value_of_other_asset", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Installed capacity(In tons, Kg, etc)
              <br />
              <input
                type="text"
                {...register("installed_capacity", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Current Sales Turnover
              <br />
              <input
                type="text"
                {...register("current_sales_turnover", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Projected Sales Turnover
              <br />
              <input
                type="text"
                {...register("projected_sales_turnover", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Are your products exported?
              <br />
              <input
                type="text"
                {...register("are_your_product_exported", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Company’s contact information
              <br />
              <input
                type="text"
                {...register("company_contact_infomation", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Designation
              <br />
              <input
                type="text"
                {...register("designation", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Name of MD/CEO of Comoany
              <br />
              <input
                type="text"
                {...register("name_of_md_or_ceo_of_company", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        <FormHalveInput>
          <FormInput>
            <label>
              Date of Resignation
              <br />
              <input
                type="text"
                {...register("designation", {
                  required: true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            Signature
            <Button>Download</Button>
          </FormInput>
        </FormHalveInput>

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
          <NavigationBtn isFilled={false}>Save & Continue Later</NavigationBtn>
          <Link to={"/prospective-members/form-two"}>
            <NavigationBtn isFilled={true}>Next</NavigationBtn>
          </Link>
        </NavigationBtnContainer>
      </Form>
    </ProspectiveMembersFormContainer>
  );
};

export default ProspectiveMembersForm;
