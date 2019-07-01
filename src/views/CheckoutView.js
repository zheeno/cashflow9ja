import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView, RefreshControl, ImageBackground } from "react-native";
import {
  StyleProvider,
  View,
  H1,
  Text,
  Badge,
  Button,
  Container,
  Icon,
  H3
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
  NetworkError
} from "../components/MiscComponents";

export default class CheckoutView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      curLevel: 4,
      walletBalance: "4,995.00",
      can_request_withdrawal: true
    };
  }

  componentDidMount() {}

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : this.state.ajaxCallState == "NET_ERR" ? (
            <NetworkError error={this.state.ajaxCallError} />
          ) : (
            <Container style={[{ flex: 1 }]}>
              {this.state.can_request_withdrawal ? (
                <React.Fragment>
                  <View
                    style={{ flex: 1, alignItems: "center", paddingTop: 20 }}
                  >
                    <Text style={{ marginTop: 30, fontSize: 40 }}>
                      &#8358;{this.state.walletBalance}
                    </Text>
                    <Text note>Wallet Balance</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={{ flex: 1, padding: 20 }}>
                      {/* receiving bank */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          paddingBottom: 5,
                          paddingTop: 10
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text style={[styles.greyText]}>Bank</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <Text style={[styles.greyText]}>Stanbic IBTC</Text>
                        </View>
                      </View>
                      {/* account name */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          paddingBottom: 5,
                          paddingTop: 10
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text style={[styles.greyText]}>Beneficiary</Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <Text style={[styles.greyText]}>Ukpowe Efezino</Text>
                        </View>
                      </View>
                      {/* account no */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          paddingBottom: 5,
                          paddingTop: 10
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text style={[styles.greyText]}>NUBAN</Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <Text style={[styles.greyText]}>0022614819</Text>
                        </View>
                      </View>
                      {/* bank charges */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          paddingBottom: 5,
                          paddingTop: 10
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text style={[styles.greyText]}>Bank Charges</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <H3 style={[styles.deepBlueText]}>&#8358;52.00</H3>
                        </View>
                      </View>
                      {/* total withdrawable */}
                      <View
                        style={{
                          flexDirection: "row",
                          borderBottomColor: "#d7d7d7",
                          borderBottomWidth: 1,
                          paddingBottom: 5,
                          paddingTop: 10
                        }}
                      >
                        <View style={{ flex: 1, justifyContent: "center" }}>
                          <Text style={[styles.greyText]}>Total</Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "flex-end"
                          }}
                        >
                          <H3 style={[styles.deepBlueText]}>&#8358;4,943.00</H3>
                        </View>
                      </View>
                      {/*  */}
                      <View style={{ alignItems: "center", paddingTop: 10 }}>
                        <Text
                          note
                          style={{ color: styles.bgBlue.backgroundColor }}
                        >
                          Change beneficiary account from Preferences
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingTop: 20
                    }}
                  >
                    <Button
                      block
                      iconLeft
                      style={[{ margin: 10 }, styles.bgDeepPink]}
                    >
                      <Icon type={"Ionicons"} name="ios-checkmark-circle" />
                      <Text>Checkout</Text>
                    </Button>
                  </View>
                </React.Fragment>
              ) : (
                <View />
              )}
            </Container>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
