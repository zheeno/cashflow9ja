import React, { Component } from "react";
import { AsyncStorage, ScrollView, ImageBackground } from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import {
  StyleProvider,
  View,
  Text,
  Container,
  Spinner,
  Icon,
  Button,
  Form,
  InputGroup,
  Input,
  Item,
  Label,
  Right,
  Body,
  Toast
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";
import { GetData, ShowToast } from "../services/ApiCaller";

export default class SignInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      fetching: false,
      username: "",
      password: "",
      verifying: false,
      user: {},
      referer: {}
    };
    this.login = this.login.bind(this);
    this.router = this.router.bind(this);
  }

  componentDidMount() {}

  login() {
    const username = this.state.username;
    const password = this.state.password;
    if (username.length > 0 && password.length >= 6) {
      this.setState({ verifying: true });
      GetData("/account/signin?username=" + username + "&password=" + password)
        .then(result => {
          let response = result;
          if (response == "null") {
            alert("Invalid account details");
            this.setState({
              verifying: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              user: {}
            });
          } else {
            this.setState({
              verifying: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              user: response.user,
              referer: response.referer
            });
            // save user data in memory
            AsyncStorage.setItem("userId", response.user.id.toString()).done();
            AsyncStorage.setItem(
              "userFullname",
              response.user.name.toString()
            ).done();
            AsyncStorage.setItem(
              "userName",
              response.user.username.toString()
            ).done();
            AsyncStorage.setItem(
              "userEmail",
              response.user.email.toString()
            ).done();
            AsyncStorage.setItem(
              "userAvatar",
              response.user.avatar.toString()
            ).done();
            this.router();
          }
        })
        .catch(error => {
          this.setState({
            verifying: false,
            ajaxCallState: "NET_ERR",
            ajaxCallError: error.message
          });
          // notify the user
          ShowToast(error.message, "danger");
        });
    }
  }

  router() {
    const { navigate } = this.props.navigation;
    // if (this.state.user.is_initialized) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "withDrawerFlow" })]
    });
    this.props.navigation.dispatch(resetAction);
    navigate("withDrawerFlow");
    // } else {
    //   const resetAction = StackActions.reset({
    //     index: 0,
    //     actions: [
    //       NavigationActions.navigate({ routeName: "InitializeAccount" })
    //     ]
    //   });
    //   this.props.navigation.dispatch(resetAction);
    //   navigate("InitializeAccount");
    // }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <ScrollView style={[styles.flexColumn, styles.bgDeepPurple]}>
          <Container style={[styles.flexColumn]}>
            <ImageBackground
              source={require("../assets/img/bg_1.png")}
              imageStyle={{ resizeMode: "cover" }}
              style={{ width: "100%", height: "100%" }}
            >
              <View
                style={[
                  styles.bgDeepBlueLight,
                  {
                    flex: 6,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
              >
                <Text
                  style={[
                    styles.whiteText,
                    { fontFamily: "Tahoma", fontSize: 30, textAlign: "center" }
                  ]}
                >
                  Sign In
                </Text>
                <Form style={{ width: "100%", paddingHorizontal: 20 }}>
                  <Item floatingLabel>
                    <Label style={styles.whiteText}>Username</Label>
                    <Icon name="ios-person" style={styles.whiteText} />
                    <Input
                      style={styles.whiteText}
                      onChangeText={text => {
                        this.setState({ username: text });
                      }}
                    />
                  </Item>
                  <Item floatingLabel style={{ marginTop: 10 }}>
                    <Label style={styles.whiteText}>Password</Label>
                    <Icon name="ios-lock" style={styles.whiteText} />
                    <Input
                      style={styles.whiteText}
                      secureTextEntry={true}
                      onChangeText={text => {
                        this.setState({ password: text });
                      }}
                    />
                  </Item>
                  <View style={{ flex: 1, paddingTop: 30 }}>
                    <Button
                      block
                      iconRight
                      disabled={this.state.verifying}
                      style={[styles.bgDeepPink, { borderRadius: 20 }]}
                      onPress={this.login}
                    >
                      <Text style={styles.whiteText}>Login</Text>
                      {this.state.verifying ? (
                        <Spinner
                          color={styles.whiteText.color}
                          size={"small"}
                        />
                      ) : (
                        <Icon
                          style={[styles.whiteText, { fontSize: 22 }]}
                          name={"lock-open"}
                          type={"MaterialIcons"}
                        />
                      )}
                    </Button>
                  </View>
                </Form>
              </View>
              <View
                style={[
                  styles.bgDeepBlueLight,
                  {
                    flex: 2,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    paddingHorizontal: 20
                  }
                ]}
              >
                <Text note style={styles.whiteText}>
                  Don&apos;t have an account?
                </Text>
                <Button
                  disabled={this.state.verifying}
                  onPress={() => navigate("SignUp")}
                  block
                  iconRight
                  style={[{ borderRadius: 20 }]}
                >
                  <Text>Sign Up</Text>
                  <Icon type={"Ionicons"} name={"ios-lock"} />
                </Button>
              </View>
            </ImageBackground>
          </Container>
        </ScrollView>
      </StyleProvider>
    );
  }
}
