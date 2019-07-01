import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView, FlatList } from "react-native";
import {
  StyleProvider,
  View,
  H1,
  Text,
  Badge,
  Button,
  Container,
  Icon,
  H3,
  Thumbnail,
  Card,
  CardItem,
  Body,
  Spinner
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  MyCard,
  MiscModal,
  PayCircleParent
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";
import { WebView } from "react-native-webview";

export default class FundWalletView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      userId: null
    };
  }

  componentDidMount() {
    //   get user id
    user_id = this.props.navigation.state.params.userId || null;
    this.setState({ userId: user_id });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          <Container style={[{ flex: 1 }]}>
            {this.state.isLoading ? (
              <LoaderOverlay text={"Loading... Please wait"} />
            ) : null}
            <WebView
              style={[{ flex: 1 }]}
              source={{
                uri:
                  "http://cardsxchange.net/api/wallet/fundWalletForm?user_id=" +
                  this.state.userId
              }}
              showsVerticalScrollIndicator={true}
              allowsBackForwardNavigationGestures={true}
              onLoadStart={() => this.setState({ isLoading: true })}
              onLoad={() => this.setState({ isLoading: false })}
            />
          </Container>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
