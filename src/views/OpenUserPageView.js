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
  Thumbnail
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
  PayCircleParent,
  NetworkError
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";

export default class OpenUserPageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      positiveCallback: null,
      userId: null,
      circleId: null,
      user: {}
    };
    this.getInitValues = this.getInitValues.bind(this);
    this.addUserToCircle = this.addUserToCircle.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  getInitValues() {
    const userId = this.props.navigation.state.params.userId || null;
    const positiveCallback =
      this.props.navigation.state.params.positiveCallback || null;
    const circleId = this.props.navigation.state.params.circleId || null;
    this.setState({
      userId: userId,
      circleId: circleId,
      positiveCallback: positiveCallback
    });

    GetData("/account/getUserData?user_id=" + userId)
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          refreshControl: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          user: response.user
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
  }

  addUserToCircle() {
    const { navigate } = this.props.navigation;
    this.setState({ isLoading: true });
    GetData(
      "/circles/joinCircle?id=" +
        this.state.circleId +
        "&user_id=" +
        this.state.userId
    )
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          refreshControl: false,
          ajaxCallState: 200,
          ajaxCallError: null
        });
        alert("You have successfully added this user to your circle");
        this.props.navigation.goBack();
        // navigate("InviteUsersToCircle", {
        //   userId: this.state.userId,
        //   // circleLevel: this.state.user.curLevel,
        //   circleId: this.state.circleId
        // });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          refreshControl: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
      });
  }

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
              onRefresh={this.getInitValues}
              refreshing={this.state.isLoading}
            />
          ) : (
            //   {/* <ScrollView> */}
            <Container style={[{ flex: 1 }]}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Icon
                    type={"MaterialCommunityIcons"}
                    name={"account-circle"}
                    style={[styles.wineText, { fontSize: 100 }]}
                  />
                  <Text style={[styles.deepBlueText]}>
                    {this.state.user.name}
                  </Text>
                  <Text note style={{ marginTop: -5 }}>
                    {"@" + this.state.user.username}
                  </Text>
                  <Badge
                    style={[
                      styles.bgDeepBlue,
                      { alignSelf: "center", margin: 2 }
                    ]}
                  >
                    <Text>
                      Level&nbsp;&middot;&nbsp;{this.state.user.curLevel}
                    </Text>
                  </Badge>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={[
                      { textAlign: "center", fontSize: 25 },
                      styles.greyText
                    ]}
                  >
                    Invite users to join your circle and start getting paid
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                  {this.state.user.can_belong_to_circle &&
                  this.state.user.can_accept_pair_request ? (
                    <Button
                      onPress={this.addUserToCircle}
                      block
                      iconLeft
                      style={[
                        { margin: 5, borderRadius: 20 },
                        styles.bgDeepPink
                      ]}
                    >
                      <Icon
                        type={"MaterialCommunityIcons"}
                        name={"account-plus"}
                      />
                      <Text>Add to Circle</Text>
                    </Button>
                  ) : null}
                </View>
              </View>
            </Container>
          )}
          {/* </ScrollView> */}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
