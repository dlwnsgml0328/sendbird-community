import styled from 'styled-components';

export const HeaderWrap = styled.ul`
  padding-left: 0;
  width: 100%;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  margin-top: 0;
  margin-bottom: 0;

  li {
    margin-right: 1%;
    margin-bottom: 1%;
  }

  a {
    text-decoration: none;
    color: #000;

    :hover {
      font-weight: bold;
    }
  }

  @media screen and (max-width: 480px) {
    height: 15vh;
    overflow-y: scroll;

    li {
      width: 100%;
      border-bottom: 1px solid #000;
    }
    a {
      padding-left: 2%;
      font-size: 1.4em;
    }
  }
`;
