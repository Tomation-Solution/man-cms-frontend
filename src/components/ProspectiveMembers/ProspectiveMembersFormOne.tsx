import React, { useState } from "react";
import { toast } from "react-toastify";

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
import { Link, json, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { getprospectiveMemberSubmissionDetail, updateRemarkOrStatus } from "../../axios/api-calls";
import Loading from "../Loading/Loading";

const ProspectiveMembersForm = () => {
  const {id} = useParams()
  const [remark,setRemark]= useState<string>()
  const {mutate,isLoading:mutating} = useMutation(updateRemarkOrStatus,{
    'onSuccess':(data)=>{
      toast.info(data.message, {
        progressClassName: "toastProgress",
        icon: false,
      });
    }
  })
  const { register, handleSubmit, control,setValue } = useForm({
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


  const {isLoading,data} =useQuery('prospective-member-detail',()=>getprospectiveMemberSubmissionDetail(id?parseInt(id):-1),{
    // refetchOnWindowFocus:false,
    enabled:typeof id==='string'?true:false,
    'onSuccess':(data)=>{
      console.log({'Gotten detaisl':data})
    // if(data.)
    setValue('name_of_company',data.name_of_company)
    setValue('cac_registration_number',data.cac_registration_number)
    if(data.form_one.length==1){
      console.log({'formone':data.form_one})
      let formone = data.form_one[0]
      // let d:any =JSON.parse(formone.all_roduct_manufactured)
      // console.log({d})
      //  if(d){
      //   //  setValue('all_roduct_manufactured',d)
      //  }
      setValue('projected_sales_turnover',formone.projected_sales_turnover)
      setValue('tax_identification_number',formone.tax_identification_number)
      setValue('corporate_office_addresse',formone.corporate_office_addresse)
      setValue('office_bus_stop',formone.office_bus_stop)
      setValue('tax_identification_number',formone.tax_identification_number)
      setValue('office_city',formone.office_city)
      setValue('office_lga',formone.office_lga)
      setValue('office_state',formone.office_state)
      setValue('postal_addresse',formone.postal_addresse)
      setValue('telephone',formone.telephone)
      setValue('email_addresse',formone.email_addresse)
      setValue('website',formone.website)
      setValue('factoru_details',formone.factoru_details)
      setValue('legal_status_of_company',formone.legal_status_of_company)
      setValue('number_of_female_permanent_staff',formone.number_of_female_permanent_staff.toString())
      setValue('number_of_male_permanent_staff',formone.number_of_male_permanent_staff.toString())
      setValue('number_of_female_expatriates',formone.number_of_female_expatriates.toString())
      setValue('local_share_capital',formone.local_share_capital)
      setValue('foreign_share_capital',formone.foreign_share_capital)
      setValue('ownership_structure_equity_local',formone.ownership_structure_equity_local)
      setValue('ownership_structure_equity_foregin',formone.ownership_structure_equity_foregin)
      setValue('total_value_of_land_asset',formone.total_value_of_land_asset)
      setValue('total_value_of_building_asset',formone.total_value_of_building_asset)
      setValue('installed_capacity',formone.installed_capacity)
      setValue('current_sales_turnover',formone.current_sales_turnover)
      setValue('are_your_product_exported',formone.are_your_product_exported)
      setValue('company_contact_infomation',formone.company_contact_infomation)
      setValue('designation',formone.designation)
      setValue('name_of_md_or_ceo_of_company',formone.name_of_md_or_ceo_of_company)
      setValue('selectdate_of_registration',formone.selectdate_of_registration)
      setValue('designation',formone.designation)
      setRemark(data.admin)
    }

    }
  })

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

  console.log({'some things':id})

  return (
    <ProspectiveMembersFormContainer>
      <Loading loading={isLoading||mutating} />
      <Form onSubmit={handleSubmit(onHandleSubmit)}>
        <FormHalveInput>
          <FormInput>
            <label>
              Name Of Company
              <br />
              <input
                type="text"
                {...register("name_of_company", { required: true,disabled:true })}
              />
            </label>
          </FormInput>

          <FormInput>
            <label>
              CAC Registration Number
              <br />
              <input
                type="text"
                {...register("cac_registration_number", { required: true,disabled:true })}
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
                {...register("tax_identification_number", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Corporate office Address
              <br />
              <input
                type="text"
                {...register("corporate_office_addresse", { required: true,disabled:true })}
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
                {...register("office_bus_stop", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Office City
              <br />
              <input
                type="text"
                {...register("office_city", { required: true,disabled:true })}
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
                {...register("office_lga", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Office State
              <br />
              <input
                type="text"
                {...register("office_state", { required: true,disabled:true })}
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
                {...register("postal_addresse", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Telephone Number(s) Inc. Mobile
              <br />
              <input
                type="text"
                {...register("telephone", { required: true,disabled:true })}
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
                {...register("email_addresse", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Website Address
              <br />
              <input type="text" {...register("website", { required: true,disabled:true })} />
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
                {...register("factoru_details", { required: true,disabled:true })}
              />
            </label>
          </FormInput>
          <FormInput>
            <label>
              Legal Status of Company
              <br />
              <input
                type="text"
                {...register("legal_status_of_company", { required: true,disabled:true })}
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
                    { required: true,disabled:true }
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
                    { required: true,disabled:true }
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
                    { required: true,disabled:true }
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
                    { required: true,disabled:true }
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
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
                  required: true,disabled:true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput>

        {/* <FormHalveInput>
          <FormInput>
            <label>
              Designation
              <br />
              <input
                type="text"
                {...register("designation", {
                  required: true,disabled:true,
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
                  required: true,disabled:true,
                })}
              />
            </label>
          </FormInput>
        </FormHalveInput> */}

        <FormHalveInput>
          <FormInput>
            <label>
              Designation
              <br />
              <input
                type="text"
                {...register("designation", {
                  required: true,disabled:true,
                })}
              />
            </label>
          </FormInput>
          <FormInput>
            Signature
            <Button
            onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_one[0].upload_signature as string
              ,'_blank')
            }}
            >Download</Button>
          </FormInput>
        </FormHalveInput>

<br></br>
<br></br>
<ProspectiveMembersFormContainer>
      {/* <Form onSubmit={handleSubmit(onSubmitHandler)}> */}
      {/* {
        data?.form_two.length==1?<>
      } */}
        <FormHalveInput>
          <FormInput>
            <p>Corporate Affairs Commission (CAC) Forms C02 and C07</p>
            <br />
            <Button
            onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_two[0].corporate_affairs_commision as string
              ,'_blank')
            }}
            >Download Document</Button>
          </FormInput>
          <br />

          <FormInput>
            <p>First Year Of Buisness Plan</p>
            <br />
            <Button
                        onClick={e=>{
                          e.preventDefault()
                          window.open(
                            data?.form_two[0].first_year_of_buisness_plan as string
                          ,'_blank')
                        }}
            
            >Download Document</Button>
          </FormInput>
        </FormHalveInput>
        <br />

        <FormHalveInput>
          <FormInput>
            <p>
              A Covering Letter on the letter head of your company applying to
              be registered as a member of MAN, stating the breakdown of
              payments made and documents attached.
            </p>
            <br />
            <Button
            onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_two[0].letter_of_breakdown_of_payment_and_docs_attached as string
              ,'_blank')
            }}
            >Download Document</Button>
          </FormInput>
          <br />

          <FormInput>
            <p>
              Copies of Duly Certified Audited Financial Statement for
              proceeding two (2) years or Business Plan for new companies
            </p>
            <br />
            <Button
             onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_two[0].first_year_of_buisness_plan as string
              ,'_blank')
            }}
            >Download Document year 1</Button>
            <div style={{'padding':'.4rem'}}></div>
                        <Button
             onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_two[0].second_year_of_buisness_plan as string
              ,'_blank')
            }}
            >Download Document year 2</Button>
          </FormInput>
        </FormHalveInput>
        <br />

        <FormInput style={{ width: "48%" }}>
          <p>
            Photocopy of your receipt issued on purchase of Application Form.
          </p>
          <br />
          <Button
            
            onClick={e=>{
              e.preventDefault()
              window.open(
                data?.form_two[0].photocopy_of_your_reciept_issued_on_purchase_of_applicant_form as string
              ,'_blank')
            }}
          >Download Document</Button>
        </FormInput>

     
      {/* </Form> */}
    </ProspectiveMembersFormContainer>
    <br></br>
<br></br>
        <CustomButtons>
          <DeclineSvg
          clickfn={()=>{
            // e.pr
            if(id){
              mutate({
                id,
                'status':'decline'
              })
            }
          }}
          styling={{ cursor: "pointer" }} />
          <ApproveSvg 
           clickfn={()=>{
            // e.pr
            if(id){
              mutate({
                id,
                'status':'final_approval'
              })
            }
          }}
          styling={{ cursor: "pointer" }} />
        </CustomButtons>

        <FormInput>
          <label>
            Remark
            <br />
            <textarea value={remark} onChange={e=>{
              setRemark(e.target.value)
            }} />
          </label>
        </FormInput>

        <NavigationBtnContainer>
          {/* <NavigationBtn isFilled={false}>Save & Continue Later</NavigationBtn> */}
            <NavigationBtn 
            
            onClick={e=>{
              e.preventDefault()
              if(id){
                mutate({id,remark})
              }
            }} 
            isFilled={true}>Submit Remark</NavigationBtn>
        </NavigationBtnContainer>
      </Form>
    </ProspectiveMembersFormContainer>
  );
};

export default ProspectiveMembersForm;
