import React, { Component } from "react";
import {
  ScrollView,
  ImageBackground,
  RefreshControl,
  AsyncStorage
} from "react-native";
import {
  View,
  Text,
  Container,
  Button,
  StyleProvider,
  H3,
  H1,
  Icon,
  Form,
  Input,
  Item,
  Label
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { styles } from "../../../native-base-theme/variables/customStyles";

import { GetData } from "../../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  TransactionsList,
  NetworkError
} from "../../components/MiscComponents";

export default class TransactionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      refreshing: false,
      transactions: []
    };

    this.loadTransactHistory = this.loadTransactHistory.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this.loadTransactHistory(true);
  }

  _onRefresh() {
    this.setState({ refreshControl: true, isLoading: false });
    this.loadTransactHistory(true);
  }

  async loadTransactHistory(showLoader) {
    this.setState({ isLoading: showLoader, refreshControl: !showLoader });
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData("/account/loadTransactHistory?user_id=" + userId)
          .then(result => {
            let response = result;
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              transactions: response.transactions
            });
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
          });
      })
      .done();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          <ImageBackground
            source={require("../../assets/img/bg_1.png")}
            imageStyle={{ resizeMode: "cover" }}
            style={{ width: "100%", height: "100%" }}
          >
            {this.state.isLoading ? (
              <LoaderOverlay text={"Loading... Please wait"} />
            ) : this.state.ajaxCallState == "NET_ERR" ? (
              <NetworkError
                error={this.state.ajaxCallError}
                onRefresh={this._onRefresh}
                refreshing={this.state.refreshing}
              />
            ) : (
              <ScrollView
                style={[{ flex: 1 }, styles.bgDeepBlueLight]}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <TransactionsList
                  title={null}
                  nav={navigate}
                  transactions={this.state.transactions}
                />
              </ScrollView>
            )}
          </ImageBackground>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
