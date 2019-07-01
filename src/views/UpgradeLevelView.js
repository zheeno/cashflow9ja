import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView, RefreshControl, ImageBackground } from "react-native";
import {
  StyleProvider,
  View,
  H1,
  Text,
  Badge,
  Button,
  Container,
  Icon,
  H3
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
  NetworkError
} from "../components/MiscComponents";

export default class UpgradeLevelView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      circle: null,
      userId: null,
      user: null,
      earnings: null,
      per: null,
      serviceCharge: null,
      EAC: null
    };
    this.upgradeLevel = this.upgradeLevel.bind(this);
    this.getInitValues = this.getInitValues.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  async getInitValues() {
    const circle = this.props.navigation.state.params.circle || "Ionicons";
    const userId = this.props.navigation.state.params.userId || null;
    this.setState({
      circle: circle,
      userId: userId
    });

    this.setState({ isLoading: true });
    GetData(
      "/circles/upgradeFromParent?confirm=0&user_id=" +
        userId +
        "&circle_id=" +
        circle.circle.id +
        "&level=" +
        circle.circle.level
    )
      .then(result => {
        let response = result;
        if (Number(result) !== 0) {
          this.setState({
            isLoading: false,
            refreshControl: false,
            ajaxCallState: 200,
            ajaxCallError: null,
            user: response.user,
            circle: response.circle,
            earnings: response.earnings,
            per: response.per,
            serviceCharge: response.serviceCharge,
            EAC: response.EAC
          });
        }
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

  upgradeLevel() {
    const { navigate } = this.props.navigation;
    this.setState({ isLoading: true });
    GetData(
      "/circles/upgradeFromParent?confirm=1&user_id=" +
        this.state.user.id +
        "&circle_id=" +
        this.state.circle.id +
        "&level=" +
        this.state.circle.level
    )
      .then(result => {
        let response = result;
        if (Number(response) !== 0) {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({ routeName: "ResponseScreen" })
            ]
          });
          navigate("ResponseScreen", {
            message: response.msg,
            success: true,
            icon: (
              <Icon
                type={"Ionicons"}
                name={"ios-checkmark-circle"}
                style={[styles.wineText, { fontSize: 100 }]}
              />
            )
          });
        }
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
            <Container style={[{ flex: 1 }]}>
              <ImageBackground
                source={require("../assets/img/8b275cb35f020e5eaec4bcf93d53444a.jpg")}
                style={{ flex: 1, flexDirection: "row", padding: 10 }}
                imageStyle={{ resizeMode: "cover" }}
              >
                <View style={{ flex: 1 }}>
                  <MyCard
                    hasHeader={false}
                    body={
                      <H1 style={styles.whiteText}>
                        {this.state.circle.level}
                      </H1>
                    }
                    hasFooter={true}
                    footer={
                      <Text note style={styles.whiteText}>
                        Level
                      </Text>
                    }
                  />
                </View>
                <View
                  style={{
                    flex: 2,
                    paddingLeft: 10
                  }}
                >
                  <Badge style={[styles.bgDeepPink, { margin: 2 }]}>
                    <Text>Members: {this.state.circle.max_members}</Text>
                  </Badge>
                  <Badge style={[styles.bgDeepPink, { margin: 2 }]}>
                    <Text>Earned: &#8358;{this.state.earnings}</Text>
                  </Badge>
                </View>
              </ImageBackground>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon
                  type={"Ionicons"}
                  name={"ios-checkmark-circle"}
                  style={[{ fontSize: 100 }, styles.wineText]}
                />
              </View>
              <View
                style={[
                  { flex: 3, flexDirection: "row", padding: 5 },
                  styles.bgWhite
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 2, padding: 20 }}>
                    {/* earnings */}
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#d7d7d7",
                        borderBottomWidth: 1,
                        paddingBottom: 5
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.greyText]}>Earnings</Text>
                      </View>
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text style={[styles.greyText]}>
                          &#8358;{this.state.earnings}
                        </Text>
                      </View>
                    </View>
                    {/* service charge */}
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#d7d7d7",
                        borderBottomWidth: 1,
                        paddingBottom: 5,
                        paddingTop: 10
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={[styles.greyText]}>Service Charge</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end"
                        }}
                      >
                        <Text style={[styles.greyText]}>
                          &#8358;{this.state.serviceCharge}
                        </Text>
                        <Text note style={[styles.greyText]}>
                          {(this.state.per * 100).toString() + "%"} of Earnings
                        </Text>
                      </View>
                    </View>
                    {/* level earnings */}
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomColor: "#d7d7d7",
                        borderBottomWidth: 1,
                        paddingBottom: 10,
                        paddingTop: 10
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: "center" }}>
                        <Text style={[styles.greyText]}>Level Earnings</Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "flex-end"
                        }}
                      >
                        <H3 style={[styles.deepBlueText]}>
                          &#8358;{this.state.EAC}
                        </H3>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row"
                    }}
                  >
                    {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
                      <Button
                        onPress={() => navigate("CheckoutScreen")}
                        block
                        iconLeft
                        style={[{ margin: 5 }, styles.bgDeepBlue]}
                      >
                        <Icon type={"Ionicons"} name={"ios-checkmark-circle"} />
                        <Text>Checkout</Text>
                      </Button>
                    </View> */}
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                      <Button
                        onPress={this.upgradeLevel}
                        block
                        iconLeft
                        style={[
                          { margin: 5, borderRadius: 20 },
                          styles.bgDeepPink
                        ]}
                      >
                        <Icon type={"Ionicons"} name={"ios-arrow-up"} />
                        <Text>Upgrade</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            </Container>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
