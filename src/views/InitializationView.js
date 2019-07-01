import React, { Component } from "react";
import { StackActions, NavigationActions } from "react-navigation";
import { ScrollView, FlatList, AsyncStorage } from "react-native";
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
  Thumbnail,
  Card,
  CardItem,
  Body,
  Textarea
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";

import { GetData, ShowToast } from "../services/ApiCaller";
import {
  LoaderOverlay,
  ErrorOverlay,
  MyCard,
  MiscModal,
  PayCircleParent
} from "../components/MiscComponents";
import UsersListItem from "../components/UsersListItem";
import ResponseView from "./ResponseView";

export default class InitializationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      user: {},
      referer: {},
      level_1_users_no_members: [],
      levelFee: "500.00"
    };
    this.getInitValues = this.getInitValues.bind(this);
    this.getCircles = this.getCircles.bind(this);
  }

  componentDidMount() {
    this.getInitValues();
  }

  async getInitValues() {
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData("/account/getInitializationData?user_id=" + userId)
          .then(result => {
            let response = result;
            this.setState({
              ajaxCallState: 200,
              ajaxCallError: null,
              user: response.user,
              referer: response.referer
            });
            if (!response.user.was_referred) {
              //   check for level 1 users that require members
              this.getCircles();
            } else {
              this.setState({ isLoading: false });
            }
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              refreshControl: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
          });
      })
      .done();
  }

  async getCircles() {
    this.setState({ isLoading: true });
    GetData("/circles/incomplete?level=1")
      .then(result => {
        let response = result;
        if (response.length == 0) {
          this.setState({
            isLoading: false,
            ajaxCallState: 200,
            ajaxCallError: null
          });
        } else {
          this.setState({
            isLoading: false,
            ajaxCallState: 200,
            ajaxCallError: null,
            level_1_users_no_members: response
          });
        }
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message
        });
        // notify the user
        ShowToast(error.message, "danger");
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
            <React.Fragment>
              {this.state.user.was_referred ? (
                // display user who invited the current user
                <Container style={[{ flex: 1 }]}>
                  <View style={{ flex: 1 }}>
                    <PayCircleParent
                      user={this.state.referer}
                      levelFee={this.state.levelFee}
                    />
                  </View>
                </Container>
              ) : this.state.level_1_users_no_members.length > 0 ? (
                // display list of users to pair with

                <ScrollView>
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
                          name={"circle-outline"}
                          style={[styles.wineText, { fontSize: 100 }]}
                        />
                        <Badge
                          style={[
                            styles.bgDeepPink,
                            { margin: 5, alignSelf: "center" }
                          ]}
                        >
                          <Text>Join a Circle</Text>
                        </Badge>
                      </View>
                      <View style={{ flex: 3, paddingHorizontal: 5 }}>
                        <FlatList
                          data={this.state.level_1_users_no_members}
                          renderItem={({ item }) => (
                            <UsersListItem
                              itemKey={item.circle.id}
                              style={[
                                styles.bgWhite,
                                {
                                  borderBottomWidth: 1,
                                  borderBottomColor: styles.wineText.color
                                }
                              ]}
                              textColor={styles.bgDark.backgroundColor}
                              userObj={item.parent}
                              nav={navigate}
                              narLines={1}
                              action={() => {
                                navigate("OpenCircleView", {
                                  circleId: item.circle.id,
                                  circleParentId: item.parent.id,
                                  circleLevel: item.circle.curLevel,
                                  positiveCallback: "Home"
                                });
                              }}
                            />
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    </View>
                  </Container>
                </ScrollView>
              ) : (
                //   {/* pay network N500 */}
                <Container style={[{ flex: 1 }]}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 2,
                        padding: 10,
                        alignItems: "center"
                      }}
                    >
                      <Icon
                        type={"Ionicons"}
                        name={"ios-information-circle"}
                        style={[styles.wineText, { fontSize: 100 }]}
                      />
                      <Card style={{ width: "100%" }}>
                        <CardItem>
                          <Body>
                            <Text style={{ alignSelf: "center", fontSize: 20 }}>
                              Congratulations!
                            </Text>
                            <Text style={{ textAlign: "center" }}>
                              You are one of the few lucky users to be granted
                              an instant upgrade.{`\n`}This means you only get
                              to pay &#8358;500.00 and you'd be upgraded
                              instantly to a Circle Parent in level 1.
                              {`\n`}This implies that you'd get &#8358;1,000.00
                              each from the members of your circle.{`\n`}How
                              cool is that?
                            </Text>
                          </Body>
                        </CardItem>
                      </Card>
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Button
                        block
                        iconRight
                        style={[
                          styles.bgDeepPink,
                          { borderRadius: 20, margin: 10 }
                        ]}
                      >
                        <Text>Pay &#8358;500.00</Text>
                        <Icon
                          type={"MaterialCommunityIcons"}
                          name={"credit-card"}
                        />
                      </Button>
                    </View>
                  </View>
                </Container>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
