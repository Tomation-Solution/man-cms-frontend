import React from "react";
import { FormInput } from "../../globals/styles/forms.styles";
import Button from "../Button/Button";
import { SearchBannerContainer } from "./SearchBanner.styles";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBanner = () => {
  return (
    <SearchBannerContainer>
      <FormInput>
        <input placeholder="Search Items Here" />
      </FormInput>
    </SearchBannerContainer>
  );
};

export default SearchBanner;
