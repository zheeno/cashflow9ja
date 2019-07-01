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
  PayCircleParent
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";

export default class ResultNotifierView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      iconType: "",
      iconName: "",
      headerText: "",
      message: "",
      route: ""
    };
    this.getInitValues = this.getInitValues.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  getInitValues() {
    const iconType = this.props.navigation.state.params.iconType || "Ionicons";
    const iconName =
      this.props.navigation.state.params.iconName || "md-information-circle";
    const headerText = this.props.navigation.state.params.headerText || null;
    const message = this.props.navigation.state.params.message || null;
    const route = this.props.navigation.state.params.route || null;
    this.setState({
      iconType: iconType,
      iconName: iconName,
      headerText: headerText,
      message: message,
      route: route
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
          {/* <ScrollView> */}
          <Container style={[{ flex: 1 }]}>
            <View
              style={{
                flex: 2,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10
              }}
            >
              <Icon
                type={"Ionicons"}
                name={"md-information-circle"}
                style={[styles.wineText, { fontSize: 100 }]}
              />
              <Text
                style={[styles.wineText, { textAlign: "center", fontSize: 20 }]}
              >
                {this.state.headerText}
              </Text>
              <Text note style={[styles.wineText, { textAlign: "center" }]}>
                {this.state.message}
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Button
                onPress={() => navigate(this.state.route)}
                block
                iconRight
                style={[{ borderRadius: 20, margin: 10 }, styles.bgDeepPink]}
              >
                <Text>Done</Text>
                <Icon type={"Ionicons"} name={"ios-checkmark-circle"} />
              </Button>
            </View>
          </Container>
          {/* </ScrollView> */}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
