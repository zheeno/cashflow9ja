import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView, FlatList } from "react-native";
import {
  StyleProvider,
  View,
  H1,
  Text,
  Badge,
  Button,
  Container,
  Icon,
  H3,
  Thumbnail
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
  PayCircleParent
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";

export default class InviteUsersToCircleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      circleLevel: null,
      userId: null,
      circles: [],
      circleId: null
    };
    this.getInitValues = this.getInitValues.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  getInitValues() {
    const circleLevel = this.props.navigation.state.params.circleLevel || "0";
    const circleId = this.props.navigation.state.params.circleId || null;
    const userId = this.props.navigation.state.params.userId || null;
    this.setState({
      circleLevel: circleLevel,
      userId: userId,
      circleId: circleId
    });

    GetData("/circles/userWithoutCircles?level=" + circleLevel)
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          refreshControl: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          circles: response
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          refreshControl: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
      });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : (
            // {/* <ScrollView> */}
            <Container style={[{ flex: 1 }]}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Icon
                    type={"MaterialCommunityIcons"}
                    name={"account-group"}
                    style={[styles.wineText, { fontSize: 100 }]}
                  />
                  <Badge
                    style={[
                      styles.bgDeepPink,
                      { margin: 5, alignSelf: "center" }
                    ]}
                  >
                    <Text>Invite users to join your Circle</Text>
                  </Badge>
                </View>
                <View style={{ flex: 3, paddingHorizontal: 5 }}>
                  {this.state.circles.length == 0 ? (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        paddingVertical: 50
                      }}
                    >
                      <Text
                        style={[
                          { textAlign: "center", fontSize: 25 },
                          styles.greyText
                        ]}
                      >
                        Unfortunately there are no Users for the level you
                        require.{`\n`}Kindly check back shortly.
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={this.state.circles}
                      renderItem={({ item }) => (
                        <UsersListItem
                          itemKey={item.id}
                          style={[
                            styles.bgWhite,
                            {
                              borderBottomWidth: 1,
                              borderBottomColor: styles.wineText.color
                            }
                          ]}
                          textColor={styles.bgDark.backgroundColor}
                          userObj={item}
                          nav={navigate}
                          narLines={1}
                          action={() =>
                            navigate("OpenUserPage", {
                              userId: item.id,
                              circleId: this.state.circleId,
                              positiveCallback: "InviteUsersToCircle"
                            })
                          }
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  )}
                </View>
              </View>
            </Container>
          )}
          {/* </ScrollView> */}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
