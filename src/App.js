import { Router, Route, Switch } from "react-router-dom";
import ChatPage from "./chat/page/ChatPage";
import Detail from "./detail/container";
import NewsPage from "./news/page/NewsPage";
import HomePage from "./home/page/HomePage";
import { createBrowserHistory } from "history";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import GNBPage from "./gnb/page/GNBPage";
import DetailPage from "./detail/page/DetailPage";
import UserPage from "./user/page/UserPage";

const customHistory = createBrowserHistory();
const GlobalStyle = createGlobalStyle`
  ${reset};
  * {
    box-sizing : border-box;
    text-decoration: none;
  }
  body {
    background-color: rgb(249, 249, 249);
  }
  section {
    padding-top: 80px;
  }
`;
const AppContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
`;
// router
export default function App() {
  return (
    <AppContainer>
      <GlobalStyle />
      <Router history={customHistory}>
        <GNBPage />
        <Switch>
          <Route path="/user" component={UserPage} />
          <Route path="/detail" component={Detail} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/news/:id" component={DetailPage} />
          <Route path="/news" component={NewsPage} />
          <Route path="/" exact component={HomePage} />
        </Switch>
        <ChatPage />
      </Router>
    </AppContainer>
  );
}
