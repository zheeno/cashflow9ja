import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { Text, StyleProvider, Tabs, Tab } from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";
import { GetData } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  TransactionsList
} from "../components/MiscComponents";
import BankTransferForm from "./Bank/BankTransferForm";

export default class BankTransferView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      // transaction history
      transactions: [
        {
          id: 1,
          trancactTypeCode: 1,
          transactType: "Bank Transfer",
          amount: "23,500.52",
          currency: "NGN",
          beneficiary: "Ukpowe Ovie",
          bank: "GTB",
          narration: "Funds transfer to Ovie for up-keep"
        },
        {
          id: 1,
          trancactTypeCode: 1,
          transactType: "Bank Transfer",
          amount: "23,500.52",
          currency: "NGN",
          beneficiary: "Ukpowe Ovie",
          bank: "GTB",
          narration: "Funds transfer to Ovie for up-keep"
        },
        {
          id: 2,
          trancactTypeCode: 5,
          transactType: "Airtime Recharge",
          amount: "1,000",
          currency: "NGN",
          beneficiary: "08147757475 (MTN)",
          serviceProvider: "MTN",
          narration: "Airtime purchase for 08147757475"
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
          <Tabs>
            <Tab
              heading="Transfer"
              activeTabStyle={{ backgroundColor: "#810038" }}
              tabStyle={{ backgroundColor: "#810038" }}
            >
              <BankTransferForm navigation={navigate} />
            </Tab>
            <Tab
              heading="Saved"
              activeTabStyle={{ backgroundColor: "#810038" }}
              tabStyle={{ backgroundColor: "#810038" }}
            >
              <Text>Tab 2 </Text>
            </Tab>
            <Tab
              heading="History"
              activeTabStyle={{ backgroundColor: "#810038" }}
              tabStyle={{ backgroundColor: "#810038" }}
            >
              <ScrollView
                style={[{ flex: 1 }, styles.bgDeepPurple]}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
                <TransactionsList
                  title={null}
                  nav={navigate}
                  padded={false}
                  transactions={this.state.transactions}
                />
              </ScrollView>
            </Tab>
          </Tabs>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
