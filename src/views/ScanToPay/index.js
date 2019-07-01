import React, { Component } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
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
  UtilityOptionsScrollable,
  InOutTransactionsList
} from "../../components/MiscComponents";

export default class ScanToPayIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      transactions: [
        {
          id: 1,
          trancactTypeCode: 1,
          transactType: "Incoming",
          amount: "23,500.52",
          currency: "NGN",
          senderId: 32,
          senderName: "Ukpowe Ovie",
          narration: "Money for up keep",
          status: "Pending",
          approved: false
        },
        {
          id: 23,
          trancactTypeCode: 0,
          transactType: "Outgoing",
          amount: "3,500.00",
          currency: "NGN",
          beneficiary: "Ukpowe Ovie",
          beneficiaryId: 49,
          narration: "Funds transfer",
          status: "Approved",
          approved: true
        }
      ]
    };
  }

  componentDidMount() {}

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          <ScrollView style={{ flex: 1 }}>
            <Container style={[{ flex: 1 }, styles.bgWhite]}>
              <View style={{ flex: 1, padding: 10 }}>
                <Text style={[styles.deepBlueText]}>
                  Send and Receive money with ease using our secure QR Code
                </Text>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Button
                      iconLeft
                      block
                      style={[styles.bgDeepPurple]}
                      onPress={() => navigate("ReceiveViaQRScreen")}
                    >
                      <Icon name={"download"} type={"Ionicons"} />
                      <Text>Receive</Text>
                    </Button>
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <Button iconLeft block style={[styles.bgDeepPink]}>
                      <Icon name={"send"} type={"Ionicons"} />
                      <Text>Send</Text>
                    </Button>
                  </View>
                </View>
              </View>
              <View style={{ flex: 4 }}>
                {this.state.transactions.length > 0 ? (
                  // incoming/outgoing transacation
                  <InOutTransactionsList
                    title={null}
                    nav={navigate}
                    padded={false}
                    transactions={this.state.transactions}
                  />
                ) : (
                  // no transactions
                  <View
                    style={[
                      {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                      }
                    ]}
                  >
                    <Icon
                      type={"Ionicons"}
                      name={"swap"}
                      style={[{ fontSize: 80 }, styles.wineText]}
                    />
                    <Text style={[styles.wineText]}>
                      No Incoming/Outgoing transactions found
                    </Text>
                  </View>
                )}
              </View>
            </Container>
          </ScrollView>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
