import React from 'react';
import styled from 'styled-components';

const Main = () => (
  <>
    <h1>provided by eazel</h1>
    <MainWrap>
      <a href="https://eazel.net/" rel="noopener noreferrer" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 114.3 60.7">
          <path d="M113.05,59.18l-2-.41c-42.82-8.89-65-8.89-107.82,0l-2,.41v-51l1.32-.27C45.42-1,68.89-1,111.74,7.92l1.31.27Z" />
        </svg>
      </a>
    </MainWrap>
  </>
);

const MainWrap = styled.div`
  width: 30%;
  margin: 0 auto;

  svg {
    cursor: pointer;
  }

  path {
    stroke: #88beff;
    fill: #fff;
    transition: 100ms ease-in 100ms;

    :hover {
      fill: #88beff;
    }
  }
`;

export default Main;
