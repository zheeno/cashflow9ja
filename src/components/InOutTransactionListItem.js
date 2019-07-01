import React from "react";
import { Text, Body, ListItem, View, Icon, Right } from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";

const InOutTransactionListItem = props => {
  const navigate = props.nav;
  const transaction = props.transactObj;
  return (
    <ListItem
      key={props.itemKey}
      style={[props.style]}
      button
      itemDivider
      androidRippleColor={"#dc4300"}
      // onPress={() =>
      //   navigate("MusicContent", {
      //     id: props.transactObj.transaction.id,
      //     title: props.transactObj.transaction.type
      //   })
      // }
    >
      <Body
        style={{
          padding: 1,
          flex: 4
        }}
      >
        <Text numberOfLines={1} style={[styles.whiteText]}>
          {/* transction type */}
          {transaction.transactType}
        </Text>
        <Text
          numberOfLines={1}
          style={[{ color: "#bbb", fontSize: 12, marginTop: -5 }]}
        >
          {/* beneficiary/sender */}
          {transaction.beneficiary}
        </Text>
        <Text
          numberOfLines={props.narLines}
          style={[
            styles.whiteText,
                {
              fontSize: 13
            }
          ]}
        >
          {/* saved date */}
          {transaction.savedDate}
        </Text>
      </Body>
      <Right style={{ flex: 2 }}>
        {/* amount */}
        <Text numberOfLines={1} style={[styles.whiteText]}>
          &#8358;{transaction.amount}
        </Text>
      </Right>
    </ListItem>
  );
};
export default InOutTransactionListItem;
