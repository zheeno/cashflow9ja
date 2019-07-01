import React from "react";
import {
  Text,
  Body,
  ListItem,
  View,
  Icon,
  Right,
  Left,
  Thumbnail,
  Badge
} from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";

const UsersListItem = props => {
  const navigate = props.nav;
  const user = props.userObj;
  return (
    <ListItem
      key={props.itemKey}
      style={[props.style]}
      button
      itemDivider
      androidRippleColor={"#dc4300"}
      onPress={props.action}
    >
      {user.avatar.length > 0 ? (
        <Thumbnail
          style={{ alignSelf: "flex-start" }}
          source={{
            uri: user.avatar
          }}
        />
      ) : (
        <Icon
          type={"Ionicons"}
          name={"ios-contact"}
          style={[{ fontSize: 40 }, styles.wineText]}
        />
      )}
      <Body
        style={{
          padding: 1,
          flex: 4
        }}
      >
        <Text numberOfLines={1} style={[{ color: props.textColor }]}>
          {/* username */}
          {"@" + user.username}
        </Text>
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          {/* level, parent/child, members  */}
          {user.curLevel != null ? (
            <View
              style={[
                {
                  flex: 1,
                  alignItems: "flex-start"
                }
              ]}
            >
              <Text note style={styles.greyText}>
                Level&nbsp;&middot;&nbsp;{user.curLevel}
              </Text>
            </View>
          ) : null}
          {user.numMembers != null ? (
            <View
              style={[
                {
                  flex: 1,
                  alignItems: "flex-end",
                  borderLeftWidth: 1,
                  borderLeftColor: styles.bgGrey.backgroundColor
                }
              ]}
            >
              <Text note style={styles.greyText}>
                Members&nbsp;&middot;&nbsp;{user.numMembers}
              </Text>
            </View>
          ) : null}
        </View>
      </Body>
      <Right>
        <Icon
          type={"MaterialCommunityIcons"}
          name={"arrow-right"}
          style={styles.greyText}
        />
      </Right>
    </ListItem>
  );
};
export default UsersListItem;
