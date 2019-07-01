import React, { Component } from "react";
import {
  ScrollView,
  RefreshControl,
  ImageBackground,
  AsyncStorage
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import {
  View,
  Text,
  Container,
  Button,
  StyleProvider,
  Icon,
  Toast,
  Drawer,
  H1,
  Card,
  CardItem,
  Body,
  Spinner
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";
import TransactOptionsScrollable from "../components/TransactOptionsScrollable";
import { GetData, ShowToast } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  TransactionsList,
  UtilityOptionsScrollable,
  LevelStatus,
  CircleScrollable,
  NetworkError
} from "../components/MiscComponents";

export default class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastExec: 0,
      isLoading: true,
      refreshing: false,
      is_breakingOut: false,
      has_pending_withdrawals: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      contact: [],
      fundWallet: {},
      user: {},
      availableBalance: null,
      ledgerBalance: null,
      levelStats: {},
      recentTransacts: [],
      circle: {}
    };
    this.initLandingPage = this.initLandingPage.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.circleBreakOut = this.circleBreakOut.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentWillMount() {
    StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })]
    });
    this.initLandingPage(true);
  }

  _onRefresh() {
    this.setState({ refreshControl: true, isLoading: false });
    this.initLandingPage(true);
  }

  async initLandingPage(showLoader) {
    this.setState({ isLoading: showLoader, refreshControl: !showLoader });
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData("/account/fetchUserHomeData?user_id=" + userId)
          .then(result => {
            let response = result;
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              user: response.user,
              recentTransacts: response.transactions,
              availableBalance: response.availableBalance,
              ledgerBalance: response.ledgerBalance,
              has_pending_withdrawals: response.has_pending_withdrawals,
              circle: response.circleObj,
              levelStats: response.levelStats
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
  }

  async restart() {
    this.setState({ isLoading: true });
    GetData("/account/restartUserLevel?user_id=" + this.state.user.id)
      .then(result => {
        alert(result.response);
        this.initLandingPage();
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
  }

  circleBreakOut() {
    const { navigate } = this.props.navigation;
    navigate("OpenCircleView", {
      circleId: this.state.circle.circle.id,
      circleParentId: this.state.circle.circle.parent_id,
      circleLevel: this.state.circle.circlecurLevel,
      positiveCallback: "Home"
    });
  }


  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          <ImageBackground
            source={require("../assets/img/orange_triangle_pattern_portrait.jpg")}
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
                style={[{ flex: 1 }, styles.transparent]}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <View
                  style={[
                    styles.flexColumn,
                    styles.transparent,
                    { padding: 10 }
                  ]}
                >
                  <View
                    style={{
                      flex: 3,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text style={[styles.deepBlueText, { fontSize: 35 }]}>
                      &#8358;
                      {this.state.availableBalance != null
                        ? this.state.availableBalance
                        : "0.00"}
                    </Text>
                    <Text style={[styles.deepBlueText, {marginTop: -8}]}>Available Balance</Text>
                    <Text style={[styles.deepBlueText, { fontSize: 20 }]}>
                      &#8358;
                      {this.state.ledgerBalance != null
                        ? this.state.ledgerBalance
                        : "0.00"}
                    </Text>
                    <Text note style={[styles.deepBlueText, {marginTop: -5}]}>Ledger Balance</Text>

                  </View>
                  <View
                    style={{ flex: 1, flexDirection: "row", paddingTop: 20 }}
                  >
                    <View
                      style={[
                        {
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "space-evenly",
                          paddingLeft: 2
                        }
                      ]}
                    >
                      <Button
                        iconLeft
                        block
                        style={[{ amargin: 5 }, styles.btnOrangeLight]}
                        onPress={() =>
                          navigate("FundWallet", {
                            userId: this.state.user.id
                          })
                        }
                      >
                        <Icon name="ios-add" />
                        <Text>Fund Wallet</Text>
                      </Button>
                    </View>
                    {this.state.user.can_request_withdrawal && this.state.has_pending_withdrawals == false ? (
                      <View
                        style={[
                          {
                            flex: 1,
                            justifyContent: "space-evenly",
                            paddingLeft: 2
                          }
                        ]}
                      >
                        <Button
                          iconLeft
                          block
                          onPress={() => navigate("WithdrawalForm")}
                          style={[{ margin: 5 }, styles.btnOrangeLight]}
                        >
                          <Icon type={"Ionicons"} name={"md-cash"} />
                          <Text>Withdraw</Text>
                        </Button>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={[{ flex: 3 }]}>
                  {/* level status */}
                  <LevelStatus
                    nav={navigate}
                    curLevel={this.state.user.curLevel}
                    levelStats={this.state.levelStats}
                  />
                  {this.state.circle.length == [].length ? (
                    this.state.levelStats.parent ? (
                      // send invite
                      <Button
                        iconLeft
                        rounded
                        style={[styles.bgDeepPurple, { alignSelf: "center" }]}
                        onPress={() =>
                          navigate("InviteUsersToCircle", {
                            userId: this.state.user.id,
                            circleLevel: this.state.user.curLevel,
                            circleId: this.state.levelStats.circle.id
                          })
                        }
                      >
                        <Icon type={"Ionicons"} name={"ios-paper-plane"} />
                        <Text style={[styles.whiteText]}>Send Invite</Text>
                      </Button>
                    ) : // check if the user has completed the maximum number of levels
                    this.state.user.curLevel >= this.state.user.maxLevel ? (
                      <View
                        style={[
                          styles.bgDeepPink,
                          {
                            flex: 1,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            marginHorizontal: 10
                          }
                        ]}
                      >
                        <Icon
                          type={"Ionicons"}
                          name={"ios-information-circle"}
                          style={[styles.whiteText]}
                        />
                        <Text
                          style={[styles.whiteText, { textAlign: "center" }]}
                        >
                          Congratulations!!!{`\n`}You have completed the maximum
                          number of levels allowed for this account.
                        </Text>
                        <Button
                          onPress={this.restart}
                          small
                          light
                          iconLeft
                          style={{ marginVertical: 5, alignSelf: "center" }}
                        >
                          <Icon type={"Ionicons"} name={"ios-refresh"} />
                          <Text>Restart</Text>
                        </Button>
                      </View>
                    ) : (
                      // join circle
                      <View
                        style={{ alignItems: "center", paddingVertical: 20 }}
                      >
                        <Button
                          iconLeft
                          rounded
                          style={[styles.bgDeepPurple, { alignSelf: "center" }]}
                          onPress={() =>
                            navigate("JoinCircle", {
                              circleLevel: this.state.user.curLevel,
                              userId: this.state.user.id
                            })
                          }
                        >
                          <Icon
                            type={"MaterialCommunityIcons"}
                            name={"circle-outline"}
                          />
                          <Text style={[styles.whiteText]}>Join Circle</Text>
                        </Button>
                      </View>
                    )
                  ) : (
                    <React.Fragment>
                      {/* circle info */}
                      {this.state.circle.length != [].length ? (
                        <React.Fragment>
                          <CircleScrollable
                            nav={navigate}
                            title={"My Circle"}
                            divider={false}
                            leftPadding={false}
                            circle={this.state.circle}
                          />
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            {this.state.circle.parent.id ==
                            this.state.user.id ? (
                              // {/* display upgrade button */}
                              <View style={{ flex: 1 }}>
                                {this.state.levelStats.circle.slots_full ? (
                                  this.state.levelStats.circle
                                    .payments_completed ? (
                                    <Button
                                      iconLeft
                                      rounded
                                      style={[
                                        styles.bgDeepPurple,
                                        { alignSelf: "center" }
                                      ]}
                                      onPress={() =>
                                        navigate("UpgradeLevel", {
                                          userId: this.state.user.id,
                                          circle: this.state.circle
                                        })
                                      }
                                    >
                                      <Icon
                                        type={"Ionicons"}
                                        name={"ios-arrow-round-up"}
                                      />
                                      <Text style={[styles.whiteText]}>
                                        Upgrade
                                      </Text>
                                    </Button>
                                  ) : null
                                ) : (
                                  // send invite
                                  <Button
                                    iconLeft
                                    rounded
                                    style={[
                                      styles.bgDeepPurple,
                                      { alignSelf: "center" }
                                    ]}
                                    onPress={() =>
                                      navigate("InviteUsersToCircle", {
                                        userId: this.state.user.id,
                                        circleLevel: this.state.user.curLevel,
                                        circleId: this.state.levelStats.circle
                                          .id
                                      })
                                    }
                                  >
                                    <Icon
                                      type={"Ionicons"}
                                      name={"ios-paper-plane"}
                                    />
                                    <Text style={[styles.whiteText]}>
                                      Send Invite
                                    </Text>
                                  </Button>
                                )}
                              </View>
                            ) : (
                              // {/* display breakout button */}
                              <View style={{ flex: 1 }}>
                                <Button
                                  iconLeft
                                  rounded
                                  disabled={this.state.is_breakingOut}
                                  style={[
                                    styles.bgDeepPurple,
                                    { alignSelf: "center" }
                                  ]}
                                  onPress={this.circleBreakOut}
                                >
                                  {this.state.is_breakingOut ? (
                                    <Spinner
                                      color={styles.whiteText.color}
                                      size={"large"}
                                    />
                                  ) : (
                                    <Icon
                                      type={"FontAwesome5"}
                                      name={"circle-notch"}
                                    />
                                  )}
                                  <Text style={[styles.whiteText]}>
                                    Breakout
                                  </Text>
                                </Button>
                              </View>
                            )}
                          </View>
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  )}
                  {/* recent transactions */}
                  <TransactionsList
                    nav={navigate}
                    padded={true}
                    padding={3}
                    title={"Recent Transactions"}
                    transactions={this.state.recentTransacts}
                  />
                </View>
              </ScrollView>
            )}
          </ImageBackground>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
