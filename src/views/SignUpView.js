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
import { NetworkError, LoaderOverlay } from "../components/MiscComponents";

export default class SignUpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      fetching: false,
      username: "",
      password: "",
      fname: "",
      email: "",
      verifying: false,
      secureTextEntry: true,
      user: {},
      referer: {}
    };
    this.signup = this.signup.bind(this);
    this.router = this.router.bind(this);
  }

  componentDidMount() {}

  signup() {
    const username = this.state.username;
    const password = this.state.password;
    const fname = this.state.fname;
    const email = this.state.email;
    if (username.length > 0 && password.length >= 6) {
      this.setState({ isLoading: true });
      GetData(
        "/account/signup?fname=" +
          fname +
          "&email=" +
          email +
          "&username=" +
          username +
          "&password=" +
          password
      )
        .then(result => {
          let response = result;
          if (response.status == false) {
            alert(response.responseMsg);
            this.setState({
              isLoading: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              user: {}
            });
          } else {
            this.setState({
              isLoading: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              user: response.user
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
            isLoading: false,
            ajaxCallState: "NET_ERR",
            ajaxCallError: error.message
          });
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
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <ImageBackground
          source={require("../assets/img/bg_1.png")}
          imageStyle={{ resizeMode: "cover" }}
          style={{ width: "100%", height: "100%" }}
        >
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : this.state.ajaxCallState == "NET_ERR" ? (
            <NetworkError
              error={this.state.ajaxCallError}
              onRefresh={null}
              refreshing={null}
            />
          ) : (
            <ScrollView style={[styles.bgDeepBlueLight]}>
              <Container style={[styles.transparent, styles.flexColumn]}>
                <View
                  style={[
                    styles.transparent,
                    {
                      flex: 1,
                      justifyContent: "center"
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.whiteText,
                      {
                        fontFamily: "Tahoma",
                        fontSize: 30,
                        textAlign: "center"
                      }
                    ]}
                  >
                    Sign Up
                  </Text>
                </View>
                <Form
                  style={[
                    styles.transparent,
                    { flex: 3, width: "100%", paddingHorizontal: 20 }
                  ]}
                >
                  <Item floatingLabel>
                    <Label style={styles.whiteText}>Email</Label>
                    <Icon name="ios-mail" style={styles.whiteText} />
                    <Input
                      style={styles.whiteText}
                      onChangeText={text => {
                        this.setState({ email: text });
                      }}
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label style={styles.whiteText}>Full name</Label>
                    <Icon name="ios-person" style={styles.whiteText} />
                    <Input
                      style={styles.whiteText}
                      onChangeText={text => {
                        this.setState({ fname: text });
                      }}
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label style={styles.whiteText}>Username</Label>
                    <Icon name="ios-at" style={styles.whiteText} />
                    <Input
                      style={styles.whiteText}
                      onChangeText={text => {
                        this.setState({ username: text });
                      }}
                    />
                  </Item>
                  <Item floatingLabel style={{ marginTop: 10 }}>
                    <Label style={styles.whiteText}>Password</Label>
                    {this.state.password.length == 0 ? (
                      <Icon name="ios-lock" style={styles.whiteText} />
                    ) : (
                      <Icon
                        onPress={() =>
                          this.setState({
                            secureTextEntry: !this.state.secureTextEntry
                          })
                        }
                        name={
                          this.state.secureTextEntry ? "ios-eye" : "ios-eye-off"
                        }
                        style={styles.whiteText}
                      />
                    )}
                    <Input
                      style={styles.whiteText}
                      secureTextEntry={this.state.secureTextEntry}
                      onChangeText={text => {
                        this.setState({ password: text });
                      }}
                    />
                  </Item>
                </Form>
                <View
                  style={[
                    styles.transparent,
                    {
                      flex: 1,
                      justifyContent: "flex-start",
                      paddingHorizontal: 10
                    }
                  ]}
                >
                  <Button
                    block
                    iconRight
                    disabled={this.state.verifying}
                    style={[styles.bgDeepPink, { borderRadius: 20 }]}
                    onPress={this.signup}
                  >
                    <Text style={styles.whiteText}>Sign Up</Text>
                    {this.state.verifying ? (
                      <Spinner color={styles.whiteText.color} size={"small"} />
                    ) : (
                      <Icon
                        style={[styles.whiteText, { fontSize: 22 }]}
                        name={"lock-open"}
                        type={"MaterialIcons"}
                      />
                    )}
                  </Button>
                </View>
              </Container>
            </ScrollView>
          )}
        </ImageBackground>
      </StyleProvider>
    );
  }
}
