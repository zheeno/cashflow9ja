import React, { Component } from "react";
import { ScrollView, ImageBackground, RefreshControl } from "react-native";
import {
  View,
  Text,
  Container,
  Button,
  StyleProvider,
  H3,
  H1,
  Icon,
  Form,
  Input,
  Item,
  Label
} from "native-base";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { styles } from "../../../native-base-theme/variables/customStyles";

import { GetData } from "../../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  UtilityOptionsScrollable
} from "../../components/MiscComponents";

export default class BillsPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      refreshing: false,
      utilityServices: [
        {
          utilityCode: 1,
          category: "Electricity",
          services: [
            {
              serviceId: 23,
              serviceLogo: "",
              serviceName: "IEDC Bills"
            }
          ]
        },
        {
          utilityCode: 1,
          category: "Internet Subscription",
          services: [
            {
              serviceId: 13,
              serviceLogo: "",
              serviceName: "Spectranet"
            },
            {
              serviceId: 15,
              serviceLogo: "",
              serviceName: "Smile"
            }
          ]
        }
      ]
    };

    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {}

  _onRefresh() {}

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : null}
          <ImageBackground
            source={require("../../assets/img/8b275cb35f020e5eaec4bcf93d53444a.jpg")}
            imageStyle={{ resizeMode: "cover" }}
            style={{ width: "100%", height: "100%" }}
          >
            <ScrollView
              style={[{ flex: 1 }, styles.bgDeepBlueLight]}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <UtilityOptionsScrollable
                nav={navigate}
                title={null}
                divider={true}
                dividerColor={"rgba(250, 250, 250, 0.36)"}
                leftPadding={false}
                utilityServices={this.state.utilityServices}
              />
            </ScrollView>
          </ImageBackground>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
