import React from "react";
import { Image } from "react-native";
import { Card, CardItem, Text, Body, Icon, Thumbnail } from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";

const ServiceCard = props => {
  const navigate = props.nav;

  return (
    <Card
      key={props.content.service.id}
      noShadow={!props.hasFooter ? !props.active : false}
      style={[
        props.style,
        props.active
          ? {
              borderColor: "#ef6c00",
              shadowColor: "#ef6c00"
            }
          : null
      ]}
    >
      <CardItem
        button
        onPress={props.action != null ? props.action : null}
        style={styles.transparent}
      >
        <Body style={[{ alignItems: "center" }, styles.transparent]}>
          {/* <Image
            source={require("../assets/img/Background-Music-Icon.png")}
            style={styles.thumbnail}
          /> */}
          {props.content.service.thumbnail != null ? (
            <Thumbnail
              circular={false}
              square={true}
              large={true}
              source={{ uri: props.content.service.thumbnail }}
            />
          ) : null}
          {props.content.service.icon != null ? (
            <Icon
              name={props.content.service.icon}
              type={
                props.content.service.iconType != null &&
                props.content.service.iconType.length > 0
                  ? props.content.service.iconType
                  : "Ionicons"
              }
              style={{ fontSize: 50, color: "#FFF" }}
            />
          ) : null}
        </Body>
      </CardItem>
      {props.hasFooter ? (
        <CardItem
          footer
          style={[styles.transparent, props.active ? styles.bgOrange : null]}
        >
          <Body>
            <Text
              numberOfLines={1}
              style={
                props.active
                  ? [styles.whiteText, styles.serviceCardTitle]
                  : [styles.whiteText, styles.serviceCardTitle]
              }
            >
              {props.content.service.name}
            </Text>
          </Body>
        </CardItem>
      ) : null}
    </Card>
  );
};
export default ServiceCard;
