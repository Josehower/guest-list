import { createGlobalStyle } from 'styled-components';

export const colors = {
  magenta: '#fa448c',
  yellow: '#fec859',
  green: '#e3ffe8',
  blue: '#509deb',
  grey: '#d1d1d1',
  dark: '#331a38',
  white: '#fffff4',
};

const GlobalStyle = createGlobalStyle`
 *{
   font-family: 'Quicksand', sans-serif;
   font-weight: 500;
   color: ${colors.dark};
   font-size: 16px;
  }

  #root{
    display: grid;
    justify-items: center;
  }

  body {
    margin: 0;
    padding: 0;
    background: ${colors.white};

  }

  h1{
    margin: 0;
    width: 100vw;
    text-align: center;
    font-family: Anton, sans-serif;
    font-size: 50px;
    margin-top: 10vh;
    margin-bottom: 40px;
    background: ${colors.blue};
    color: ${colors.white};
    text-shadow: 2px 2px black;
  }

  button{
    font-weight: bold;
    cursor: pointer;
    background-color:${colors.blue};
    border-radius: 5px;
    border: transparent 3px solid;
    margin: 3px;
    text-shadow: 1px 1px black;
    color: ${colors.white};
  }
  input[type="checkbox"]{
    cursor: pointer;
  }
  input{
    border-radius: 5px;
    border: 1px ${colors.grey} solid;;
  }

`;

export default GlobalStyle;
