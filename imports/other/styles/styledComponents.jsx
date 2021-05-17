import styled from 'styled-components'

//colours
const backgroundColour = "#f6f6f6";
const phColour = "#004578";
const basicBlueColour = "#0078d4";
const lightBlueColour = "#deeaf3";

//numeric values
const contentOffset = "10%";
const sidebarWidth = "20%";

export const MainPage = styled.div `
  font-size: 1em;
  text-align: left;
  line-height: 1.5em;

  h1, h2, h3, h4 {
    font-weight: lighter;
  }

  h2 {
    font-size: 2em;
  }

  ul {
    list-style-type: none;
    padding: 0px;
  }
`;

export const PageHeader = styled.header `
    display: flex;
    justify-content: space-between;
    align-items: center;
  height: 50px;
  background-color: ${phColour};
  padding: 0px ${contentOffset};

  h1 {
    padding-left: 0.25em;
    display: inline;
    font-size: 1.5em;
    color: white;
  }
`;

export const Content = styled.main `
  display: block;
  padding: 0px ${contentOffset};
`;


export const LinkButton = styled.button `
  color: ${(props) => props.whiteFont ? "white" : basicBlueColour};
  padding: 0px;
  height: 1em;
  background-color: transparent !important;
  outline: none !important;
  border: none !important;
  line-height: 1em;
  display: flex;
  align-items: center;
  i {
    margin-right: 0.3em;
  }
`;

export const Sidebar = styled.nav `
padding-top: 1em;
 width: ${sidebarWidth};
 display: inline-block;
 vertical-align: top;
 line-height: 2em;

 hr{
   margin-block-start: 0.5em;
    margin-block-end: 0.5em;
 }
`;

export const SidebarLink = styled.li `
  padding-left: 0.4em;
  background-color: ${(props) => props.active ? lightBlueColour : "transparent"} !important;
  color: ${basicBlueColour} !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2em;

  a, i, button {
    vertical-align: middle;
  }
`;

export const List = styled.section `
width: calc(100% - ${sidebarWidth});
padding: 1em 0em 0em 1em;
display: inline-block;
verticalAlign: top;

table {
  line-height: 2em;

  input {
    width: 100%;
  }

  th {
    font-weight: 600;
  }

  tbody>tr{
    font-size: 0.9em;
    background-color: white;
    border-bottom: 2px solid ${backgroundColour};
    td{
      padding-left: 0.4em;
    }
  }

  tbody>tr:first-child{
    background-color: transparent;
    border-bottom: 2px solid ${backgroundColour};
    td{
      padding: 0px !important;
      border-right: 2px solid ${backgroundColour};
    }
    td:last-child{
      border-right: 0px;
      input {
        padding-right: 0px;
      }
    }
  }
}
`;

export const SearchSection = styled.section `
display: flex;
justify-content: flex-start;
align-items: center;

input {
  margin-right: 1em;
}
`;

export const Input = styled.input `
background-color: white !important;
outline: none !important;
border: none !important;
width: ${(props) => props.width ? props.width : "auto"};
height: 2em;
padding-left: 0.4em;
`;