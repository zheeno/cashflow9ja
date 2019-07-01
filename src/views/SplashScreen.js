import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { Image } from "react-native";
import {
  StyleProvider,
  View,
  Text,
  Container,
  Spinner,
  Icon
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";
import { GetData } from "../services/ApiCaller";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      fetching: true,
      isInitialized: false
    };
    this.signInToAcc = this.signInToAcc.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.signInToAcc();
    }, 5000);
  }

  async signInToAcc() {
    const { navigate } = this.props.navigation;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "SignIn" })]
    });
    this.props.navigation.dispatch(resetAction);
    navigate("SignIn");
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <Container style={[styles.flexColumn]}>
          <View
            style={[
              styles.bgWhite,
              { flex: 6, alignItems: "center", justifyContent: "center" }
            ]}
          >
            <Image
              source={require("../assets/img/logo_2.png")}
              resizeMode={"contain"}
              style={{
                // width: 350,
                alignSelf: "center"
              }}
            />
          </View>
          <View style={[styles.bgWhite, { flex: 1, alignItems: "center" }]}>
            {this.state.fetching ? (
              <Spinner color={styles.wineText.color} />
            ) : null}
          </View>
        </Container>
      </StyleProvider>
    );
  }
}
