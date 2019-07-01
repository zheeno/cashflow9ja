import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
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

import { GetData } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  MyCard,
  MiscModal
} from "../components/MiscComponents";

export default class ResponseView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      responseMessage: "",
      success: false,
      icon: ""
    };
    this.finish = this.finish.bind(this);
    this.getNavParams = this.getNavParams.bind(this);
  }

  componentDidMount() {
    this.getNavParams();
  }

  finish() {
    const { navigate } = this.props.navigation;
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })]
    });
    navigate("Home");
  }

  async getNavParams() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Home" })]
    });
    message = this.props.navigation.state.params.message || null;
    success = this.props.navigation.state.params.success || null;
    icon = this.props.navigation.state.params.icon || null;
    await this.setState({
      responseMessage: message,
      success: success,
      icon: icon
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : null}
          <Container style={[{ flex: 1 }]}>
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
              {this.state.icon != null ? <Text>{this.state.icon}</Text> : null}
              {this.state.responseMessage != null ? (
                <Text>{this.state.responseMessage}</Text>
              ) : null}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Button
                onPress={this.finish}
                block
                iconLeft
                style={[styles.bgDeepPink, { margin: 10 }]}
              >
                <Icon type={"Ionicons"} name={"ios-checkmark-circle"} />
                <Text>Done</Text>
              </Button>
            </View>
          </Container>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
