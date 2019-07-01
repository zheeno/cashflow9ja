import React, { Component } from "react";
import { ScrollView, RefreshControl } from "react-native";
import {
  StyleProvider,
  Tabs,
  Tab
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  TransactionsList,
  SavedTransactionsList
} from "../components/MiscComponents";
import ServiceCard from "../components/ServiceCard";
import AirtimePurchaseForm from "./Airtime/AirtimePurchaseForm";

export default class BuyAirtimeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      transactions: [
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
  }

  componentDidMount() {}

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
              heading="Airtime"
              activeTabStyle={{ backgroundColor: "#810038" }}
              tabStyle={{ backgroundColor: "#810038" }}
            >
              <AirtimePurchaseForm navigation={navigate} />
            </Tab>
            {/* saved transactions tab */}
            <Tab
              heading="Saved"
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
                <SavedTransactionsList
                  title={null}
                  nav={navigate}
                  padded={false}
                  transactions={this.state.transactions}
                />
              </ScrollView>
            </Tab>
            {/* transaction history tab */}
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
