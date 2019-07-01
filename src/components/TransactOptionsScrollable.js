import React from "react";
import { ScrollView } from "react-native";
import { View, Text, Badge } from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";
import ServiceCard from "./ServiceCard";

const TransactOptionsScrollable = props => {
  const navigate = props.nav;

  return (
    <React.Fragment>
      <View>
        <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
          <Text style={[{ fontSize: 14 }, styles.whiteText]}>Quick Links</Text>
        </Badge>
      </View>
      {/* row 1 */}
      <ScrollView horizontal style={[styles.flexRow_1, styles.serviceRow]}>
        {/* Wallet Transfer */}
        <View
          style={[
            {
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <ServiceCard
            key="mobTrns"
            style={[
              { width: "98%", borderColor: "#000" },
              styles.serviceCard,
              styles.bgYellowLight
            ]}
            hasFooter={true}
            content={{
              service: {
                id: "mobTrns",
                name: "Wallet Transfer",
                icon: "wallet",
                iconType: "Entypo"
              }
            }}
          />
        </View>
        {/* Bank Transfer */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ServiceCard
            hasFooter={true}
            style={[{ width: "98%" }, styles.serviceCard, styles.bgYellowLight]}
            key="bankTrns"
            content={{
              service: {
                id: "bankTrns",
                name: "Bank Transfer",
                icon: "bank",
                iconType: "FontAwesome"
              }
            }}
            action={() => navigate("BankTransfer")}
          />
        </View>
        {/* buy airtime */}
        <View
          style={[
            {
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <ServiceCard
            hasFooter={true}
            style={[{ width: "98%" }, styles.serviceCard, styles.bgYellowLight]}
            key="buyAirtime"
            content={{
              service: {
                id: "buyAirtime",
                name: "Buy Airtime",
                icon: "mobile",
                iconType: "Entypo"
              }
            }}
            action={() => navigate("BuyAirtime")}
          />
        </View>
        {/* shopping */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ServiceCard
            hasFooter={true}
            style={[{ width: "98%" }, styles.serviceCard, styles.bgYellowLight]}
            key="shop"
            content={{
              service: {
                id: "shop",
                name: "Go Shopping",
                icon: "cart",
                iconType: "MaterialCommunityIcons"
              }
            }}
          />
        </View>
      </ScrollView>
    </React.Fragment>
  );
};
export default TransactOptionsScrollable;
