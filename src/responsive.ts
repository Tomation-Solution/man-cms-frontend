import { css, CSSProp } from "styled-components";

export const mobileSm = (props: CSSProp) => {
  return css`
    @media (max-width: 400px) {
      ${props}
    }
  `;
};

export const mobile = (props: CSSProp) => {
  return css`
    @media (max-width: 550px) {
      ${props}
    }
  `;
};

export const tablet = (props: CSSProp) => {
  return css`
    @media (max-width: 768px) {
      ${props}
    }
  `;
};

export const Laptop = (props: CSSProp) => {
  return css`
    @media (max-width: 1024px) {
      ${props}
    }
  `;
};

export const Desktop = (props: CSSProp) => {
  return css`
    @media (max-width: 1440px) {
      ${props}
    }
  `;
};

export const K4 = (props: CSSProp) => {
  return css`
    @media (max-width: 2560px) {
      ${props}
    }
  `;
};
