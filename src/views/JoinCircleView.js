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
  Body
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

export default class JoinCircleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      circleLevel: 0,
      userId: null,
      circles: [],
      user_has_paid_upgrade_fee: false,
      instant_upgrade_response: "",
      instant_upgrade_successful: false
    };
    this.getInitValues = this.getInitValues.bind(this);
    this.getCircles = this.getCircles.bind(this);
    this.payInstantUpgradeFee = this.payInstantUpgradeFee.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  getInitValues() {
    const circleLevel = this.props.navigation.state.params.circleLevel || "0";
    const userId = this.props.navigation.state.params.userId || null;
    this.setState({
      circleLevel: circleLevel,
      userId: userId
    });
    this.getCircles(parseFloat(circleLevel) + 0.5);
  }

  async getCircles(circleLevel) {
    this.setState({ isLoading: true });
    GetData("/circles/incomplete?level=" + circleLevel)
      .then(result => {
        let response = result;
        if (response.length == 0) {
          this.setState({
            isLoading: false,
            ajaxCallState: 200,
            ajaxCallError: null
          });
        } else {
          this.setState({
            isLoading: false,
            ajaxCallState: 200,
            ajaxCallError: null,
            circles: response
          });
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
      });
  }

  async payInstantUpgradeFee() {
    this.setState({ isLoading: true });
    level = parseFloat(parseFloat(this.state.circleLevel)+ 0.5);
    GetData(
      "/circles/payInstantUpgradeFee?level=" +level +
        "&user_id=" +
        this.state.userId
    )
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          user_has_paid_upgrade_fee: true,
          instant_upgrade_response: response.responseMsg,
          instant_upgrade_successful: response.status
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
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
              onRefresh={() => this.getCircles(true)}
              refreshing={this.state.isLoading}
            />
          ) : (
            // {/* <ScrollView> */}
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
                    name={"circle-outline"}
                    style={[styles.wineText, { fontSize: 100 }]}
                  />
                  <Badge
                    style={[
                      styles.bgDeepPink,
                      { margin: 5, alignSelf: "center" }
                    ]}
                  >
                    <Text>Join a Circle</Text>
                  </Badge>
                </View>
                <View style={{ flex: 3, paddingHorizontal: 5 }}>
                  {this.state.circles.length == [].length ? (
                    this.state.user_has_paid_upgrade_fee ? (
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 2,
                            padding: 10,
                            alignItems: "center",
                            paddingTop: 30
                          }}
                        >
                          <Card style={{ width: "100%" }}>
                            <CardItem>
                              <Body>
                                <Icon
                                  name={
                                    this.state.instant_upgrade_successful
                                      ? "ios-checkmark-circle"
                                      : "ios-information-circle"
                                  }
                                  style={[
                                    {
                                      fontSize: 70,
                                      alignSelf: "center",
                                      marginBottom: 10
                                    },
                                    this.state.instant_upgrade_successful
                                      ? { color: "green" }
                                      : styles.greyText
                                  ]}
                                />
                                <Text style={{ textAlign: "center" }}>
                                  {this.state.instant_upgrade_response}
                                </Text>
                              </Body>
                            </CardItem>
                          </Card>
                        </View>
                      </View>
                    ) : (
                      //   {/* pay network N500 */}
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 2,
                            padding: 10,
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Card style={{ width: "100%" }}>
                            <CardItem>
                              <Body>
                                <Text
                                  style={{ alignSelf: "center", fontSize: 20 }}
                                >
                                  Congratulations!
                                </Text>
                                <Text style={{ textAlign: "center" }}>
                                  You are one of the few lucky users to be
                                  granted an instant upgrade.{`\n`}This means
                                  you only get to pay &#8358;500.00 and you'd be
                                  upgraded instantly to a Circle Parent.{`\n`}
                                  How cool is that?
                                </Text>
                              </Body>
                            </CardItem>
                          </Card>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Button
                            block
                            iconRight
                            style={[
                              styles.bgDeepPink,
                              { borderRadius: 20, margin: 10 }
                            ]}
                            onPress={this.payInstantUpgradeFee}
                          >
                            <Text>Pay &#8358;500.00</Text>
                            <Icon
                              type={"MaterialCommunityIcons"}
                              name={"credit-card"}
                            />
                          </Button>
                        </View>
                      </View>
                    )
                  ) : (
                    <FlatList
                      data={this.state.circles}
                      renderItem={({ item }) => (
                        <UsersListItem
                          itemKey={item.id}
                          style={[
                            styles.bgWhite,
                            {
                              borderBottomWidth: 1,
                              borderBottomColor: styles.wineText.color
                            }
                          ]}
                          textColor={styles.bgDark.backgroundColor}
                          userObj={item.parent}
                          nav={navigate}
                          narLines={1}
                          action={() =>
                            navigate("OpenCircleView", {
                              circleParentId: item.parent.id,
                              circleLevel: item.circle.level,
                              circleId: item.circle.id,
                              positiveCallback: "Home"
                            })
                          }
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
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
