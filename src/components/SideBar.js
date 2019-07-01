import React, { Component } from "react";
import { ImageBackground, ScrollView, AsyncStorage } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import {
  View,
  Text,
  Body,
  Icon,
  Button,
  List,
  ListItem,
  Left,
  Right,
  Thumbnail,
  H3,
  H1
} from "native-base";
import { styles } from "../../native-base-theme/variables/customStyles";

export default class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      username: "",
      name: "",
      avatar: null
    };
    initUserBios = this.initUserBios.bind(this);
  }

  componentDidMount() {
    this.initUserBios();
  }

  componentWillUnmount() {
    this.initUserBios();
  }

  initUserBios() {
    AsyncStorage.getItem("userName")
      .then(userName => {
        this.setState({ username: userName });
      })
      .done();
    AsyncStorage.getItem("userFullname")
      .then(fullname => {
        this.setState({ name: fullname });
      })
      .done();
    AsyncStorage.getItem("userAvatar")
      .then(avatar => {
        this.setState({ avatar: avatar });
      })
      .done();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[styles.flexColumn]}>
        <ImageBackground
          source={require("../assets/img/161990-abstract-pattern-digital_art-geometry-orange-hexagon-artwork.jpg")}
          style={{ flex: 2 }}
          imageStyle={{ resizeMode: "cover" }}
        >
          <View style={[{ flex: 1, padding: 10 }, styles.bgDeepBlueLight]}>
            {this.state.avatar != null ? (
              <Thumbnail
                style={{ alignSelf: "flex-start" }}
                source={{
                  uri: this.state.avatar
                }}
              />
            ) : (
              <Icon
                type={"Ionicons"}
                name={"ios-contact"}
                style={[styles.whiteText, { fontSize: 80 }]}
              />
            )}
          </View>
          <View style={[{ flex: 1, padding: 10 }, styles.bgDeepBlueLight]}>
            <H3 numberOfLines={1} style={[styles.whiteText]}>
              {this.state.name}
            </H3>
            <Text
              numberOfLines={1}
              style={[styles.whiteText, { marginTop: -5, fontSize: 13 }]}
            >
              {"@" + this.state.username}
            </Text>
            {/* <H1
              numberOfLines={1}
              style={[
                styles.whiteText,
                { marginTop: 10, alignSelf: "flex-end" }
              ]}
            >
              &#8358;153,043.34
            </H1> */}
          </View>
        </ImageBackground>
        <View style={[{ flex: 5 }, styles.bgDeepBlue]}>
          <ScrollView>
            <List>
              {/* home */}
              <ListItem icon button onPress={() => navigate("Home")}>
                <Left>
                  <Icon
                    active
                    name="home"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Home</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>

              {/* scan to pay */}
              {/* <ListItem
                icon
                button
                onPress={() => navigate("ScanToPayIndexScreen")}
              >
                <Left>
                  <Icon
                    active
                    name="qr-scanner"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Scan to Pay</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem> */}
              {/* history */}
              <ListItem
                icon
                button
                onPress={() => navigate("TransactionHistoryScreen")}
              >
                <Left>
                  <Icon
                    active
                    name="time"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Transaction History</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
              {/* notification */}
              <ListItem icon onPress={()=>navigate("Notifications")}>
                <Left>
                  <Icon
                    active
                    name="alert"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Notifications</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
              {/* profile */}
              <ListItem icon onPress={() => navigate("MyProfile")}>
                <Left>
                  <Icon
                    active
                    name="contact"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Profile</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
              {/* settings */}
              {/* <ListItem icon>
                <Left>
                  <Icon
                    active
                    name="cog"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Preferences</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem> */}
              {/* sign out */}
              <ListItem
                icon
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <Left>
                  <Icon
                    active
                    name="log-out"
                    type={"Ionicons"}
                    style={[styles.whiteText]}
                  />
                </Left>
                <Body>
                  <Text style={[styles.whiteText]}>Sign Out</Text>
                </Body>
                <Right>
                  <Icon active name="arrow-forward" />
                </Right>
              </ListItem>
            </List>
          </ScrollView>
        </View>
      </View>
    );
  }
}
