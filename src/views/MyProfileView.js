import React, { Component } from "react";
import { ScrollView, AsyncStorage, TouchableOpacity } from "react-native";
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
  Spinner,
  Form,
  Item,
  Label,
  Input
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData, ShowToast } from "../services/ApiCaller";
import {
  LoaderOverlay,
  MiscModal,
  NetworkError
} from "../components/MiscComponents";

export default class MyProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      passwordModalVisible: false,
      avatarModalVisible: false,
      verifying: false,
      user: {},
      oldPwd: "",
      pwd1: "",
      pwd2: ""
    };
    this.getProfile = this.getProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount() {
    this.getProfile();
  }

  async getProfile() {
    this.setState({ isLoading: true });
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

  changePassword() {
    if (
      this.state.oldPwd.length > 0 &&
      this.state.pwd1.length > 0 &&
      this.state.pwd2.length > 0
    ) {
      if (this.state.pwd1 == this.state.pwd2) {
        this.setState({ verifying: true });
        GetData(
          "/account/changeAccountPassword?user_id=" +
            this.state.user.id +
            "&oldPwd=" +
            this.state.oldPwd +
            "&newPwd=" +
            this.state.pwd1
        )
          .then(result => {
            let response = result;
            this.setState({
              verifying: false,
              ajaxCallState: 200,
              ajaxCallError: null
            });
            if (response.responseCode == 1) {
              // success
              this.setState({ passwordModalVisible: false });
            } else {
              // failed
            }
            alert(response.message);
          })
          .catch(error => {
            this.setState({
              verifying: false,
              refreshControl: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
            alert(error.message);
          });
      } else {
        alert("Passwords do not match");
      }
    }
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
              onRefresh={this.getProfile}
              refreshing={this.state.refreshControl}
            />
          ) : (
            // {/* <ScrollView> */}
            <React.Fragment>
              <Container style={[{ flex: 1 }]}>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flex: 2,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {this.state.user.avatar != null &&
                    this.state.user.avatar != "" ? (
                      <Thumbnail
                        large
                        style={{ alignSelf: "center" }}
                        source={{
                          uri: this.state.user.avatar
                        }}
                      />
                    ) : (
                      <Icon
                        type={"Ionicons"}
                        name={"ios-contact"}
                        style={[styles.wineText, { fontSize: 100 }]}
                      />
                    )}
                    <Text style={[styles.deepBlueText, { fontSize: 20 }]}>
                      {this.state.user.name}
                    </Text>
                    <Text note style={[{ marginTop: -5 }]}>
                      {this.state.user.email}
                    </Text>

                    <Badge
                      style={[
                        styles.bgDeepPink,
                        { margin: 5, alignSelf: "center" }
                      ]}
                    >
                      <Text>{"@" + this.state.user.username}</Text>
                    </Badge>
                  </View>
                  <View style={{ flex: 3 }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#eee",
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        borderBottomColor: "#777",
                        borderBottomWidth: 1
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: "center" }}>
                        <Icon
                          type={"Ionicons"}
                          name={"ios-contact"}
                          style={styles.wineText}
                        />
                      </View>
                      <View style={{ flex: 6, justifyContent: "center" }}>
                        <Text>Change Avatar</Text>
                      </View>
                    </TouchableOpacity>
                    {/* change password button */}
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#eee",
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        borderBottomColor: "#777",
                        borderBottomWidth: 1
                      }}
                      onPress={() => {
                        this.setState({ passwordModalVisible: true });
                      }}
                    >
                      <View style={{ flex: 1, justifyContent: "center" }}>
                        <Icon
                          type={"Ionicons"}
                          name={"ios-lock"}
                          style={styles.wineText}
                        />
                      </View>
                      <View style={{ flex: 6, justifyContent: "center" }}>
                        <Text>Change Password</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Container>
              {/* // change password modal */}
              <MiscModal
                title={"Change Your Password"}
                visible={this.state.passwordModalVisible}
                hideModal={() => {
                  this.setState({ passwordModalVisible: false });
                }}
              >
                <View style={{ flex: 1, paddingTop: 20 }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon
                      type={"Ionicons"}
                      name={"ios-lock"}
                      style={[styles.wineText, { fontSize: 100 }]}
                    />
                  </View>
                  <View style={{ flex: 3 }}>
                    <Form style={{ flex: 1, paddingHorizontal: 20 }}>
                      <Item floatingLabel>
                        <Label style={styles.wineText}>Old Password</Label>
                        <Input
                          style={styles.wineText}
                          secureTextEntry={true}
                          onChangeText={text => {
                            this.setState({ oldPwd: text });
                          }}
                        />
                      </Item>
                      <Item floatingLabel style={{ marginTop: 10 }}>
                        <Label style={styles.wineText}>New Password</Label>
                        <Input
                          style={styles.wineText}
                          secureTextEntry={true}
                          onChangeText={text => {
                            this.setState({ pwd1: text });
                          }}
                        />
                      </Item>
                      <Item floatingLabel style={{ marginTop: 10 }}>
                        <Label style={styles.wineText}>Confirm Password</Label>
                        <Input
                          style={styles.wineText}
                          secureTextEntry={true}
                          onChangeText={text => {
                            this.setState({ pwd2: text });
                          }}
                        />
                      </Item>
                      <View style={{ paddingTop: 30 }}>
                        <Button
                          block
                          iconRight
                          disabled={this.state.verifying}
                          style={[styles.bgDeepPink, { borderRadius: 20 }]}
                          onPress={this.changePassword}
                        >
                          <Text style={styles.whiteText}>Change Password</Text>
                          {this.state.verifying ? (
                            <Spinner
                              color={styles.whiteText.color}
                              size={"small"}
                            />
                          ) : (
                            <Icon
                              style={[styles.whiteText, { fontSize: 22 }]}
                              name={"check-circle"}
                              type={"MaterialIcons"}
                            />
                          )}
                        </Button>
                        <Button
                          block
                          iconRight
                          disabled={this.state.verifying}
                          light
                          style={[
                            {
                              borderRadius: 20,
                              marginTop: 20,
                              alignSelf: "center"
                            }
                          ]}
                          onPress={() => {
                            this.setState({ passwordModalVisible: false });
                          }}
                        >
                          <Text>Close</Text>
                          <Icon
                            style={[{ fontSize: 22 }]}
                            name={"close"}
                            type={"MaterialIcons"}
                          />
                        </Button>
                      </View>
                    </Form>
                  </View>
                </View>
              </MiscModal>
            </React.Fragment>
          )}
          {/* </ScrollView> */}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
