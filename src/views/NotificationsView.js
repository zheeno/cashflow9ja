import React, { Component } from "react";
import { AsyncStorage, ScrollView, RefreshControl } from "react-native";
import {
  StyleProvider,
  View,
  Text,
  Container,
  Button,
  Icon
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData, ShowToast } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  MyCard,
  MiscModal,
  NetworkError
} from "../components/MiscComponents";

export default class NotificationsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      responseMessage: "",
      notifs: []
    };
    this.getNotifs = this.getNotifs.bind(this);
  }

  componentDidMount() {
    this.getNotifs(true);
  }

  getNotifs = showLoader => {
    this.setState({ isLoading: showLoader, refreshControl: !showLoader });
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData("/account/fetchNotifications?user_id=" + userId)
          .then(result => {
            let response = result;
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              notifs: response.notifs
            });
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
            ShowToast(error.message, "danger");
          });
      })
      .done();
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : this.state.ajaxCallState == "NET_ERR" ? (
            <NetworkError
              error={this.state.ajaxCallError}
              onRefresh={() => this.getNotifs(false)}
              refreshing={this.state.refreshControl}
            />
          ) : (
            <ScrollView
              style={[{ flex: 1 }, styles.transparent]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshControl}
                  onRefresh={() => this.getNotifs(false)}
                />
              }
            >
              {this.state.notifs.length == [].length ? (
                <View
                  style={[
                    {
                      flex: 3,
                      padding: 10,
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    styles.bgWhite
                  ]}
                >
                  <Icon
                    type={"Ionicons"}
                    name={"md-information-circle"}
                    style={[styles.greyText, { fontSize: 100 }]}
                  />
                  <Text
                    style={[
                      styles.greyText,
                      { fontSize: 20, textAlign: "center" }
                    ]}
                  >
                    You have no notifications
                  </Text>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {this.state.notifs.map(notif => (
                    <View
                      key={notif.id}
                      style={[
                        {
                          padding: 10,
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          borderLeftWidth: 5
                        },
                        notif.seen
                          ? {
                              borderLeftColor:
                                styles.bgDeepPurple.backgroundColor
                            }
                          : {
                              borderLeftColor: styles.wineText.color
                            }
                      ]}
                    >
                      <Text style={{ fontSize: 14, color: "#333" }}>
                        {notif.notification}
                      </Text>
                      <Text note style={[{ fontSize: 11 }]}>
                        {notif.created_at}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
