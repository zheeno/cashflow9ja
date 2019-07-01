import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import {
  View,
  Text,
  Container,
  Button,
  StyleProvider,
  Spinner,
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
import QRCode from "react-native-qrcode";

export default class ReceiveViaQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      recAddress: ""
    };
  }

  componentDidMount() {
    // generate random address
    var add = Math.random() * Math.random();
    this.setState({ recAddress: add.toString() });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          <Container style={[{ flex: 1 }, styles.bgWhite]}>
            <View
              style={{
                flex: 4,
                padding: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <QRCode
                value={this.state.recAddress}
                size={200}
                bgColor="#810038"
                fgColor="white"
              />
            </View>
            <View
              style={{
                flex: 2,
                padding: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Spinner color="#810038" />
              <Text style={[styles.greyText, { alignSelf: "center" }]}>
                Scan the QR Code
              </Text>
            </View>
          </Container>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
