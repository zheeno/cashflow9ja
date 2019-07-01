import React, { Component } from "react";
import { Image } from "react-native";
import { Card, CardItem, Text, Body, Icon, Button } from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";

const UtilityServiceCardItem = props => {
  const navigate = props.nav;
  const service = props.service;

  return (
    <Card
      key={service.serviceId}
      noShadow
      style={[styles.bgDeepBlueLight, { borderColor: "rgba(2, 3, 7, 0.44)" }]}
    >
      <CardItem
        style={[styles.bgDeepBlueLight]}
        button
        // onPress={() =>
        //   navigate("ComposerContent", {
        //     id: props.content.id,
        //     title: props.content.name
        //   })
        // }
      >
        <Body style={{ alignItems: "center", justifyContent: "center" }}>
          <Icon
            name="planet"
            type={"Ionicons"}
            style={{
              fontSize: 60,
              color: "#FFF"
            }}
          />
          {/* <Text style={[styles.greyText, { fontSize: 13 }]}>
               <Icon
                name="ios-musical-notes"
                style={[styles.greyText, { fontSize: 13 }]}
              /> 
               &nbsp;&middot;&nbsp;{props.content.musics.length} 
            </Text> */}
        </Body>
      </CardItem>
      <CardItem
        footer
        style={[
          styles.bgDeepBlueLight,
          { alignItems: "center", justifyContent: "center", paddingTop: 0 }
        ]}
      >
        <Text numberOfLines={1} style={[styles.whiteText, { fontSize: 14 }]}>
          {service.serviceName}
        </Text>
      </CardItem>
    </Card>
  );
};
export default UtilityServiceCardItem;
