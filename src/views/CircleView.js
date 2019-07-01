import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import {
  ScrollView,
  FlatList,
  AsyncStorage,
  TouchableOpacity,
  RefreshControl
} from "react-native";
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
  CardItem,
  Card,
  Body,
  Spinner
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData, ShowToast, setInitialized } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  MyCard,
  MiscModal,
  PayCircleParent,
  CircleScrollable
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";
let positiveCallback = null;

export default class CircleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      showLeaveCircle: false,
      showBreakout: false,
      userId: null,
      user: {},
      circleId: null,
      circleParentId: null,
      circleLevel: null,
      is_member: false,
      has_broken_out: false,
      is_breakingOut: false,
      circle: {},
      parent: {},
      members: []
    };
    this.getInitValues = this.getInitValues.bind(this);
    this.joinCircle = this.joinCircle.bind(this);
    this.leaveCircle = this.leaveCircle.bind(this);
    this.circleBreakOut = this.circleBreakOut.bind(this);
    this.getCircleData = this.getCircleData.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  getInitValues() {
    this.setState({ isLoading: true });
    const circle_id = this.props.navigation.state.params.circleId || null;
    const circle_parent_id =
      this.props.navigation.state.params.circleParentId || null;
    const circle_level = this.props.navigation.state.params.circleLevel || null;
    const positive_callback =
      this.props.navigation.state.params.positiveCallback || null;
    if (circle_id != null) {
      this.setState({
        circleId: circle_id,
        circleParentId: circle_parent_id,
        circleLevel: circle_level,
        positiveCallback: positive_callback
      });
      // get saved user data
      AsyncStorage.getItem("userId")
        .then(userId => {
          user_id = userId;
          this.getCircleData(circle_id, user_id, false);
        })
        .done();
    }
  }

  _onRefresh() {
    this.getCircleData(this.state.circle.id, this.state.user.id, true);
  }

  async getCircleData(circle_id, user_id, showLoader) {
    this.setState({ isLoading: !showLoader, refreshing: showLoader });
    GetData("/circles/getData?id=" + circle_id + "&user_id=" + user_id)
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          refreshing: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          circle: response.circle,
          parent: response.parent,
          members: response.members,
          is_member: response.is_member,
          has_broken_out: response.has_broken_out,
          user: response.user
        });
      })
      .catch(error => {
        this.setState({
          // isLoading: false,
          refreshing: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
        // notify the user
        ShowToast(error.message, "danger");
      });
  }

  joinCircle() {
    this.setState({ isLoading: true });
    const { navigate } = this.props.navigation;
    GetData(
      "/circles/joinCircle?id=" +
        this.state.circleId +
        "&user_id=" +
        this.state.user.id
    )
      .then(result => {
        let response = result;
        if (Number(response) == 1) {
          this.setState({
            isLoading: false,
            ajaxCallState: 200,
            ajaxCallError: null
          });
          // set initialized to true
          //   async () => {
          alert("You are now a member of this circle.");
          setInitialized(this.state.user.id, "true");
          if (this.state.positiveCallback != null) {
            navigate(this.state.positiveCallback);
          }
          //   };
        } else {
          this.getCircleData(this.state.circleId, this.state.user.id);
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
        // notify the user
        ShowToast(error.message, "danger");
      });
  }

  removeMember(userId) {
    this.leaveCircle(userId);
  }

  leaveCircle(userId) {
    this.setState({ isLoading: true });
    if (userId == null) {
      userId = this.state.user.id;
    }
    GetData(
      "/circles/leaveCircle?id=" + this.state.circleId + "&user_id=" + userId
    )
      .then(result => {
        let response = result;
        this.getCircleData(this.state.circleId, this.state.user.id);
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
        // notify the user
        ShowToast(error.message, "danger");
      });
  }

  circleBreakOut() {
    const { navigate } = this.props.navigation;
    this.setState({ is_breakingOut: true });
    GetData(
      "/circles/circleBreakout?circle_id=" +
        this.state.circleId +
        "&user_id=" +
        this.state.user.id
    )
      .then(result => {
        let response = result;
        if (response.message == "success") {
          this.setState({ is_breakingOut: false });
          navigate("ResultNotifier", {
            iconType: "Ionicons",
            iconName: "md-information-circle",
            headerText: "Breakout Complete",
            message: `You have succesfully broken out and you are now
           a Parent of your own circle.\nInvite other members to join your circle
           to start getting paid.`,
            route: "Home"
          });
        } else {
          this.setState({ is_breakingOut: false });
          alert(response.message);
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
        // notify the user
        ShowToast(error.message, "danger");
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
              onRefresh={this._onRefresh}
              refreshing={this.state.refreshing}
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <Container style={[{ flex: 1 }]}>
                {/* *********************************** */}
                {/* *********************************** */}
                {/* *********************************** */}
                {/* *********************************** */}
                {/* circle parent info */}
                {/* *********************************** */}
                {/* *********************************** */}
                {/* *********************************** */}
                {/* *********************************** */}
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      paddingTop: 20
                    }}
                  >
                    {this.state.parent.avatar.length > 0 ? (
                      <Thumbnail
                        large
                        style={{ alignSelf: "flex-start" }}
                        source={{
                          uri:
                            "https://lh4.googleusercontent.com/-O5TJHK3-584/AAAAAAAAAAI/AAAAAAAAAAA/PbKvNNCrOLI/s36-c-k/photo.jpg"
                        }}
                      />
                    ) : (
                      <Icon
                        type={"Ionicons"}
                        name={"ios-contact"}
                        style={[styles.wineText, { fontSize: 100 }]}
                      />
                    )}
                    <Text style={styles.deepBlueText}>
                      {this.state.parent.name}
                    </Text>
                    <Text note style={{ marginTop: -5 }}>
                      {"@" + this.state.parent.username}
                    </Text>
                    <Badge
                      style={[
                        styles.bgDeepPurple,
                        { alignSelf: "center", marginTop: 5 }
                      ]}
                    >
                      <Text>Circle Parent</Text>
                    </Badge>
                  </View>
                  {this.state.showBreakout ? (
                    //   breakout of circle disclaimer
                    <View
                      style={{
                        flex: 2,
                        alignItems: "center",
                        paddingTop: 20,
                        paddingHorizontal: 10
                      }}
                    >
                      <Card style={{ width: "100%" }}>
                        <CardItem
                          header
                          style={[styles.bgGrey, { alignItems: "center" }]}
                        >
                          <Text style={{ textAlign: "center", fontSize: 20 }}>
                            Breakout
                          </Text>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Icon
                              type={"Ionicons"}
                              name={"md-information-circle"}
                              style={[
                                { fontSize: 50, alignSelf: "center" },
                                styles.wineText
                              ]}
                            />
                            <Text style={{ textAlign: "center" }}>
                              Move to the next level and become a Circle Parent
                              by breaking out of this circle. To breakout,
                              kindly pay the breakout fee of &#8358;
                              {this.state.circle.breakout_fee} to{" "}
                              {"@" + this.state.parent.username}
                            </Text>
                          </Body>
                        </CardItem>
                      </Card>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          marginTop: 20
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Button
                            block
                            disabled={this.state.is_breakingOut}
                            style={[
                              styles.bgDeepPink,
                              { borderRadius: 50, margin: 5 }
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
                            <Text>Breakout</Text>
                          </Button>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Button
                            block
                            disabled={this.state.is_breakingOut}
                            iconLeft
                            style={[
                              styles.bgGrey,
                              { borderRadius: 50, margin: 5 }
                            ]}
                            onPress={() =>
                              this.setState({
                                showBreakout: false,
                                showLeaveCircle: false
                              })
                            }
                          >
                            <Icon
                              style={styles.deepBlueText}
                              type={"Ionicons"}
                              name={"md-close"}
                            />
                            <Text style={styles.deepBlueText}>Cancel</Text>
                          </Button>
                        </View>
                      </View>
                    </View>
                  ) : this.state.showLeaveCircle ? (
                    <View />
                  ) : (
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    //   {/* circle info */}
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    //   {/* *********************************** */}
                    <React.Fragment>
                      <View style={{ flex: 1, padding: 10 }}>
                        {/* circle level */}
                        <View
                          style={{
                            flexDirection: "row",
                            borderBottomColor: styles.bgGrey.backgroundColor,
                            borderBottomWidth: 1
                          }}
                        >
                          <View style={{ flex: 1, padding: 5 }}>
                            <Text>Circle Level</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              alignItems: "flex-end",
                              padding: 5
                            }}
                          >
                            <Text>{this.state.circle.level}</Text>
                          </View>
                        </View>
                        {/* Members */}
                        <View
                          style={{
                            flexDirection: "row",
                            borderBottomColor: styles.bgGrey.backgroundColor,
                            borderBottomWidth: 1,
                            marginTop: 10
                          }}
                        >
                          <View style={{ flex: 1, padding: 5 }}>
                            <Text>Members</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              alignItems: "flex-end",
                              padding: 5
                            }}
                          >
                            <Text>
                              {this.state.members.length} /{" "}
                              {Number(this.state.circle.max_members).toString()}
                            </Text>
                          </View>
                        </View>
                        {/* Breakout Fee */}
                        <View
                          style={{
                            flexDirection: "row",
                            borderBottomColor: styles.bgGrey.backgroundColor,
                            borderBottomWidth: 1,
                            marginTop: 10
                          }}
                        >
                          <View style={{ flex: 1, padding: 5 }}>
                            <Text>Breakout Fee</Text>
                          </View>
                          <View
                            style={{
                              flex: 2,
                              alignItems: "flex-end",
                              padding: 5
                            }}
                          >
                            <Text>&#8358;{this.state.circle.breakout_fee}</Text>
                          </View>
                        </View>
                        {/* list of members */}
                        {this.state.user.id == this.state.parent.id ? (
                          this.state.members.length == [].length ? (
                            <View
                              style={{
                                paddingVertical: 40,
                                paddingHorizontal: 10,
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Icon
                                type={"Ionicons"}
                                name={"ios-information-circle"}
                                style={[styles.greyText, { fontSize: 50 }]}
                              />
                              <Text
                                style={[
                                  styles.greyText,
                                  { fontSize: 20, textAlign: "center" }
                                ]}
                              >
                                There are currently no members in this circle
                              </Text>
                              {/* // send invite */}
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
                                    circleId: this.state.circle.id
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
                            </View>
                          ) : (
                            <React.Fragment>
                              <Text note style={{ margin: 5 }}>
                                Members List
                              </Text>
                              {this.state.members.map(member => (
                                <View
                                  key={member[0].memberInfo.id}
                                  style={{
                                    flexDirection: "row",
                                    borderBottomColor:
                                      styles.bgGrey.backgroundColor,
                                    borderBottomWidth: 1,
                                    marginTop: 10
                                  }}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      padding: 5,
                                      justifyContent: "center",
                                      alignItems: "center"
                                    }}
                                  >
                                    <Icon
                                      type={"MaterialCommunityIcons"}
                                      name={"account-circle"}
                                      style={[
                                        styles.wineText,
                                        { fontSize: 35 }
                                      ]}
                                    />
                                  </View>
                                  <View style={{ flex: 5, padding: 5 }}>
                                    <Text numberOfLines={1}>
                                      {member[0].memberBios.name}
                                    </Text>
                                    <Text note numberOfLines={1}>
                                      {"@" + member[0].memberBios.username}
                                    </Text>
                                  </View>
                                  {member[0].memberInfo.has_paid ? (
                                    <View
                                      style={[
                                        {
                                          flex: 1,
                                          alignItems: "center",
                                          justifyContent: "center",
                                          padding: 5
                                        }
                                      ]}
                                    >
                                      <Icon
                                        type={"Ionicons"}
                                        name={"ios-checkmark-circle"}
                                        style={[
                                          { fontSize: 25, color: "#198d1f" }
                                        ]}
                                      />
                                      <Text note>Paid</Text>
                                    </View>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() =>
                                        this.removeMember(
                                          member[0].memberInfo.user_id
                                        )
                                      }
                                      style={[
                                        styles.bgDeepPink,
                                        {
                                          flex: 1,
                                          alignItems: "center",
                                          justifyContent: "center",
                                          padding: 5
                                        }
                                      ]}
                                    >
                                      <Icon
                                        type={"Ionicons"}
                                        name={"ios-remove-circle"}
                                        style={[
                                          styles.whiteText,
                                          { fontSize: 20 }
                                        ]}
                                      />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ))}
                            </React.Fragment>
                          )
                        ) : null}
                      </View>
                      {/* *********************************** */}
                      {/* *********************************** */}
                      {/* *********************************** */}
                      {/* *********************************** */}
                      {/* join, breakout or leave circle action buttons */}
                      {/* *********************************** */}
                      {/* *********************************** */}
                      {/* *********************************** */}
                      {/* *********************************** */}
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          paddingBottom: 20
                        }}
                      >
                        {this.state.is_member &&
                        this.state.user.id != this.state.parent.id ? (
                          !this.state.has_broken_out ? (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "flex-end"
                              }}
                            >
                              <View style={{ flex: 1 }}>
                                <Button
                                  block
                                  iconLeft
                                  style={[
                                    styles.bgDeepPink,
                                    { borderRadius: 50, margin: 5 }
                                  ]}
                                  onPress={() => {
                                    this.setState({ showBreakout: true });
                                  }}
                                >
                                  <Icon
                                    type={"FontAwesome5"}
                                    name={"circle-notch"}
                                  />
                                  <Text>Breakout</Text>
                                </Button>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Button
                                  block
                                  iconLeft
                                  style={[
                                    styles.bgDeepBlue,
                                    { borderRadius: 50, margin: 5 }
                                  ]}
                                  onPress={() =>
                                    this.leaveCircle(this.state.user.id)
                                  }
                                >
                                  <Icon type={"Ionicons"} name={"md-log-out"} />
                                  <Text>Leave Circle</Text>
                                </Button>
                              </View>
                            </View>
                          ) : null
                        ) : // check if circle still require members
                        this.state.members.length <
                            this.state.circle.max_members &&
                          this.state.user.can_belong_to_circle ? (
                          <Button
                            block
                            iconLeft
                            style={[
                              styles.bgDeepPink,
                              { borderRadius: 50, margin: 5 }
                            ]}
                            onPress={this.joinCircle}
                          >
                            <Icon
                              type={"MaterialCommunityIcons"}
                              name={"circle-outline"}
                            />
                            <Text>Join Circle</Text>
                          </Button>
                        ) : null}
                      </View>
                      {/* join breakout or leave circle action buttons ends here */}
                    </React.Fragment>
                  )}
                </View>
              </Container>
            </ScrollView>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
