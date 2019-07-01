import React, { Component } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  RefreshControl
} from "react-native";
import {
  Text,
  View,
  Item,
  Form,
  Icon,
  Button,
  Input,
  Left,
  Right,
  Body,
  Container,
  Spinner,
  Row,
  List,
  Card,
  CardItem,
  H2,
  Header,
  Badge,
  H1,
  Label,
  Thumbnail
} from "native-base";
import { Col } from "react-native-easy-grid";

import { styles } from "../../native-base-theme/variables/customStyles";
import CodeInput from "react-native-confirmation-code-input";
import TransactionListItem from "./TransactionListItem";
import SavedTransactionListItem from "./SavedTransactionListItem";
import InOutTransactionListItem from "./InOutTransactionListItem";
import UtilityServiceCardItem from "./UtilityServiceCardItem";

export const LoaderOverlay = props => {
  return (
    <View
      style={[
        {
          zIndex: 20,
          width: "100%",
          height: "100%",
          position: "absolute",
          alignContent: "center",
          aliginSelf: "center"
        },
        styles.justifyCenter
      ]}
    >
      <Card
        style={{
          backgroundColor: "#FFF",
          width: "80%",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CardItem>
          <Body style={{ alignItems: "center" }}>
            <Spinner color={styles.wineText.color} />
            <Text style={[styles.greyText, { marginLeft: 5, fontSize: 13 }]}>
              {props.text}
            </Text>
          </Body>
        </CardItem>
      </Card>
    </View>
  );
};

export const GetUserPin = props => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={props.hideModal}
    >
      <View
        style={[
          {
            zIndex: 20,
            width: "100%",
            height: "100%",
            position: "absolute"
          },
          styles.justifyCenter,
          styles.bgGrey
        ]}
      >
        <View
          style={{
            flex: 1,
            fontWeight: "bold",
            color: "#666",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <H2>Wallet Pin</H2>
        </View>
        <View style={{ flex: 2, alignItems: "center", paddingTop: 30 }}>
          <Text note>Input your Wallet Pin</Text>
        </View>
        <View style={{ flex: 4, alignItems: "center", paddingTop: 0 }}>
          <CodeInput
            // ref="codeInputRef2"
            secureTextEntry
            compareWithCode={props.compareCode}
            keyboardType="numeric"
            codeLength={4}
            activeColor="#ef6c00"
            inactiveColor="#D7D7D7"
            autoFocus={true}
            ignoreCase={true}
            inputPosition="center"
            size={50}
            onFulfill={isValid => props.action(isValid)}
            containerStyle={{ marginTop: 30 }}
            codeInputStyle={{ borderWidth: 1.5 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export const MiscModal = props => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}
      onRequestClose={props.hideModal}
    >
      <View
        style={[
          styles.bgDeepPink,
          { flexDirection: "row", paddingVertical: 5 }
        ]}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Button
            onPress={props.hideModal}
            icon
            style={[styles.bgDeepPink, { borderRadius: 50 }]}
          >
            <Icon style={{ color: "#fff" }} name="md-arrow-back" />
          </Button>
        </View>
        <View style={{ flex: 6, justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontSize: 18 }}>{props.title}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>{props.children}</View>
    </Modal>
  );
};

// transactions list
export class TransactionsList extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
  }
  render() {
    return (
      <View
        style={[
          this.props.padded ? { padding: this.props.padding } : {},
          { flex: 1 }
        ]}
      >
        {this.props.title !== null ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {this.props.title}
                </Text>
              </Badge>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 5 }}
                onPress={() => {
                  navigate("TransactionHistoryScreen");
                }}
              >
                <Icon
                  style={{ color: "#0d47a1" }}
                  name={"arrow-dropright-circle"}
                  type={"Ionicons"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.props.transactions.length > 0 ? (
          <FlatList
            data={this.props.transactions}
            renderItem={({ item }) => (
              <TransactionListItem
                itemKey={item.id}
                style={[styles.bgDeepBlueLight]}
                transactObj={item}
                nav={navigate}
                narLines={3}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={[
              {
                paddingVertical: 30,
                alignItems: "center",
                justifyContent: "center",
                height: 200
              }
            ]}
          >
            <Icon
              name="md-information-circle"
              style={[styles.whiteText, { fontSize: 50 }]}
            />
            <Text style={[styles.whiteText]}>No transaction record found</Text>
          </View>
        )}
      </View>
    );
  }
}

// utility options
export class UtilityOptionsScrollable extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
    utilityServices = props.utilityServices;
  }
  render() {
    return (
      <View style={[{ padding: 3, flex: 1 }]}>
        {this.props.title !== null ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {this.props.title}
                </Text>
              </Badge>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 5 }}
                onPress={() => {
                  navigate("BillPaymentScreen");
                }}
              >
                <Icon
                  style={{ color: "#0d47a1" }}
                  name={"arrow-dropright-circle"}
                  type={"Ionicons"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {utilityServices.length > 0 ? (
          utilityServices.map(service => (
            <View
              key={service.category}
              style={[
                {
                  flex: 1,
                  marginTop: 10
                },
                this.props.divider
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: this.props.dividerColor
                    }
                  : {},
                this.props.leftPadding
                  ? {
                      paddingLeft: 10,
                      borderLeftWidth: 3,
                      borderLeftColor: "#dc4300"
                    }
                  : {}
              ]}
            >
              <Badge style={{ backgroundColor: "#0d47a1", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {service.category}
                </Text>
              </Badge>
              <ScrollView
                horizontal
                style={[styles.flexRow_1, styles.serviceRow]}
              >
                {service.services.map(thisService => (
                  <View
                    key={thisService.serviceId}
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center"
                      }
                    ]}
                  >
                    <UtilityServiceCardItem service={thisService} />
                  </View>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <Col
            style={[
              {
                alignItems: "center",
                justifyContent: "center",
                height: 200
              }
            ]}
          >
            <Icon
              name="md-information-circle"
              style={[styles.darkText, { fontSize: 50 }]}
            />
            <Text style={[styles.darkText]}>Nothing here to see</Text>
          </Col>
        )}
      </View>
    );
  }
}

// shows incoming / outgoing  transactions for the scan to pay
export class InOutTransactionsList extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
  }
  render() {
    return (
      <View
        style={[
          this.props.padded ? { padding: this.props.padding } : {},
          { flex: 1 }
        ]}
      >
        {this.props.title !== null ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {this.props.title}
                </Text>
              </Badge>
            </View>
            {/* <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 5 }}
                onPress={() => {
                  navigate("TransactionHistoryScreen");
                }}
              >
                <Icon
                  style={{ color: "#0d47a1" }}
                  name={"arrow-dropright-circle"}
                  type={"Ionicons"}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        ) : null}
        <FlatList
          data={this.props.transactions}
          renderItem={({ item }) => (
            <InOutTransactionListItem
              key={item.id}
              style={[styles.bgDeepBlueLight]}
              transactObj={item}
              nav={navigate}
              narLines={1}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

// save transactions list
export class SavedTransactionsList extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
  }
  render() {
    return (
      <View
        style={[
          this.props.padded ? { padding: this.props.padding } : {},
          { flex: 1 }
        ]}
      >
        {this.props.title !== null ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {this.props.title}
                </Text>
              </Badge>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 5 }}
                onPress={() => {
                  navigate("TransactionHistoryScreen");
                }}
              >
                <Icon
                  style={{ color: "#0d47a1" }}
                  name={"arrow-dropright-circle"}
                  type={"Ionicons"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.props.transactions.length > 0 ? (
          <FlatList
            data={this.props.transactions}
            renderItem={({ item }) => (
              <SavedTransactionListItem
                key={item.id}
                style={[styles.bgDeepBlueLight]}
                transactObj={item}
                nav={navigate}
                narLines={1}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View
            style={[
              {
                alignItems: "center",
                justifyContent: "center",
                height: 200
              }
            ]}
          >
            <Icon
              name="md-information-circle"
              style={[styles.greyText, { fontSize: 50 }]}
            />
            <Text style={[styles.greyText]}>No transaction record found</Text>
          </View>
        )}
      </View>
    );
  }
}

// level status
export class LevelStatus extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
    levelStats = props.levelStats;
    curLevel = props.curLevel;
  }
  render() {
    return (
      <View
        style={[
          {
            flex: 2,
            flexDirection: "row",
            padding: 5
          }
        ]}
      >
        <View
          style={[
            styles.bgDeepBlueLight,
            {
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              justifyContent: "center",
              marginHorizontal: 5
            }
          ]}
        >
          <H1 style={[styles.whiteText]}>{curLevel}</H1>
          <Text note>Level</Text>
        </View>
        {levelStats.circle.length != [].length ? (
          <View style={{ flex: 2 }}>
            <Badge
              style={
                levelStats.parent
                  ? { backgroundColor: "#dc4300", margin: 1 }
                  : { backgroundColor: "#0d47a1", margin: 1 }
              }
            >
              <Text>{levelStats.parent ? "Parent" : "Child"}</Text>
            </Badge>
            <Badge style={[styles.bgDeepBlueLight, { margin: 1 }]}>
              <Text numberOfLines={1}>
                Required Members: {levelStats.circle.max_members}
              </Text>
            </Badge>
            {levelStats.parent ? (
              <React.Fragment>
                <Badge style={[styles.bgDeepBlueLight, { margin: 1 }]}>
                  <Text numberOfLines={2}>
                    Expected Returns: &#8358;
                    {levelStats.circle.max_members *
                      levelStats.circle.breakout_fee}
                  </Text>
                </Badge>
              </React.Fragment>
            ) : (
              <Badge style={[styles.bgDeepBlueLight, { margin: 1 }]}>
                <Text numberOfLines={2}>
                  Breakout Fee: &#8358;{levelStats.circle.breakout_fee}
                </Text>
              </Badge>
            )}
          </View>
        ) : null}
      </View>
    );
  }
}

export class CircleScrollable extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
    circle = props.circle;
  }
  render() {
    return (
      <View style={[{ padding: 3, flex: 1 }]}>
        {this.props.title !== null && circle.members != null ? (
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 4 }}>
              <Badge style={{ backgroundColor: "#dc4300", margin: 5 }}>
                <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                  {this.props.title}
                </Text>
              </Badge>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", margin: 5 }}
                onPress={() => {
                  navigate("OpenCircleView", {
                    circleId: circle.circle.id,
                    circleParentId: circle.circle.parent_id,
                    circleLevel: circle.circlecurLevel,
                    positiveCallback: "Home"
                  });
                }}
              >
                <Icon
                  style={{ color: "#0d47a1" }}
                  name={"arrow-dropright-circle"}
                  type={"Ionicons"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {circle.members != null ? (
          <View
            style={[
              {
                flex: 1,
                marginTop: 10
              },
              this.props.divider
                ? {
                    borderBottomWidth: 1,
                    borderBottomColor: this.props.dividerColor
                  }
                : {},
              this.props.leftPadding
                ? {
                    paddingLeft: 10,
                    borderLeftWidth: 3,
                    borderLeftColor: "#dc4300"
                  }
                : {}
            ]}
          >
            {/* parent */}
            <Badge
              style={{
                backgroundColor: "#0d47a1",
                margin: 5,
                alignSelf: "center"
              }}
            >
              <Text style={[{ fontSize: 14 }, styles.whiteText]}>Parent</Text>
            </Badge>
            <View
              key={circle.parent.id}
              style={[
                {
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <MyCard
                body={
                  circle.parent.avatar != "" ? (
                    <Thumbnail
                      small
                      style={{ alignSelf: "center" }}
                      source={{
                        uri: circle.parent.avatar
                      }}
                    />
                  ) : (
                    <Icon
                      type={"Ionicons"}
                      name={"ios-contact"}
                      style={[{ fontSize: 50 }, styles.whiteText]}
                    />
                  )
                }
                hasFooter={true}
                hasHeader={false}
                footer={
                  <Text
                    numberOfLines={1}
                    style={[styles.whiteText, { fontSize: 14 }]}
                  >
                    {"@" + circle.parent.username}
                  </Text>
                }
              />
            </View>
            {circle.members.length != [].length ? (
              <React.Fragment>
                {/* members */}
                <Badge
                  style={{
                    backgroundColor: "#0d47a1",
                    margin: 5,
                    alignSelf: "center"
                  }}
                >
                  <Text style={[{ fontSize: 14 }, styles.whiteText]}>
                    Members
                  </Text>
                </Badge>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={[styles.flexRow_1, styles.serviceRow]}
                >
                  {circle.members.map(member => (
                    <View
                      key={member[0].memberInfo.id}
                      style={[
                        {
                          alignSelf: "stretch",
                          alignItems: "center",
                          justifyContent: "center"
                        }
                      ]}
                    >
                      <MyCard
                        body={
                          member[0].memberBios.avatar != "" ? (
                            <Thumbnail
                              small
                              style={{ alignSelf: "center" }}
                              source={{
                                uri: member[0].memberBios.avatar
                              }}
                            />
                          ) : (
                            <Icon
                              type={"Ionicons"}
                              name={"md-contact"}
                              style={[{ fontSize: 50 }, styles.whiteText]}
                            />
                          )
                        }
                        hasFooter={true}
                        hasHeader={false}
                        footer={
                          <Text
                            numberOfLines={1}
                            style={[styles.whiteText, { fontSize: 14 }]}
                          >
                            {"@" + member[0].memberBios.username}{" "}
                            {member[0].memberInfo.has_paid ? (
                              <Icon
                                name="ios-checkmark-circle"
                                style={[{ fontSize: 16, color: "#3df844" }]}
                              />
                            ) : null}
                          </Text>
                        }
                      />
                    </View>
                  ))}
                </ScrollView>
              </React.Fragment>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }
}

export class MyCard extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
  }
  render() {
    return (
      <Card
        noShadow
        style={[styles.bgDeepBlueLight, { borderColor: "rgba(2, 3, 7, 0.44)" }]}
      >
        {this.props.hasHeader ? (
          <CardItem
            header
            style={[
              styles.bgDeepBlueLight,
              {
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 0
              }
            ]}
          >
            {this.props.header}
          </CardItem>
        ) : null}
        <CardItem style={[styles.bgDeepBlueLight]}>
          <Body
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.props.body}
          </Body>
        </CardItem>
        {this.props.hasFooter ? (
          <CardItem
            footer
            style={[
              styles.bgDeepBlueLight,
              {
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 0
              }
            ]}
          >
            {this.props.footer}
          </CardItem>
        ) : null}
      </Card>
    );
  }
}

export class PayCircleParent extends Component {
  constructor(props) {
    super(props);
    navigate = props.nav;
    user = props.user;
    levelFee = props.levelFee;
  }
  render() {
    return (
      <React.Fragment>
        <ImageBackground
          source={require("../assets/img/161990-abstract-pattern-digital_art-geometry-orange-hexagon-artwork.jpg")}
          imageStyle={{ resizeMode: "cover" }}
          style={[{ flex: 1, flexDirection: "row", paddingTop: 10 }]}
        >
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <MyCard
              hasHeader={false}
              body={
                user.avatar.length > 0 ? (
                  <Thumbnail
                    style={{ alignSelf: "flex-start" }}
                    source={{
                      uri:
                        "https://lh4.googleusercontent.com/-O5TJHK3-584/AAAAAAAAAAI/AAAAAAAAAAA/PbKvNNCrOLI/s36-c-k/photo.jpg"
                    }}
                  />
                ) : (
                  <Icon
                    type={"Ionicons"}
                    name={"ios-contact"}
                    style={[{ fontSize: 50 }, styles.whiteText]}
                  />
                )
              }
              hasFooter={true}
              footer={
                <Text numberOfLines={1} style={styles.whiteText}>
                  {user.username}
                </Text>
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Badge style={[styles.bgBlue, { margin: 2 }]}>
              <Text>Parent</Text>
            </Badge>
            <Badge style={[styles.bgDeepBlueLight, { margin: 2 }]}>
              <Text>
                <Icon
                  type={"Ionicons"}
                  name={"ios-contact"}
                  style={[styles.whiteText, { fontSize: 16 }]}
                />
                &nbsp;
                {user.username}
              </Text>
            </Badge>
            <Badge style={[styles.bgDeepBlueLight, { margin: 2 }]}>
              <Text>
                Members&nbsp;&middot;&nbsp;
                {/* {user.numMembers} */}
              </Text>
            </Badge>
          </View>
        </ImageBackground>
        <View style={{ flex: 3 }}>
          <View
            style={{
              flex: 3,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              type={"Ionicons"}
              name={"ios-information-circle-outline"}
              style={[styles.wineText, { fontSize: 100 }]}
            />
            <Text style={[styles.deepBlueText, { fontSize: 20 }]}>
              Your current level is {user.curLevel}
            </Text>
            <Text style={[styles.deepBlueText, { fontSize: 20 }]}>
              Upgrade by paying &#8358;{levelFee}
            </Text>
            <Text style={[styles.deepBlueText, { fontSize: 20 }]}>
              to {user.username}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Button
              iconRight
              block
              style={[styles.bgDeepPurple, { borderRadius: 20, margin: 10 }]}
            >
              <Text>Pay &#8358;{levelFee}</Text>
              <Icon type={"MaterialCommunityIcons"} name={"wallet"} />
            </Button>
          </View>
        </View>
      </React.Fragment>
    );
  }
}

export class NetworkError extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <ScrollView
          style={[{ flex: 1 }, styles.transparent]}
          refreshControl={
            this.props.onRefresh != null ?
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
            : null
          }
        >
        <Container style={[{ flex: 1 }]}>
          <View
            style={[
              styles.bgDeepBlue,
              { flex: 1, justifyContent: "center", alignItems: "center" }
            ]}
          >
            <Icon
              type={"FontAwesome5"}
              name={"globe"}
              style={[styles.greyText, { fontSize: 100 }]}
            />
            <Text style={[styles.greyText, { marginTop: 20 }]}>
              {this.props.error}
            </Text>
          </View>
          </Container>
        </ScrollView>
      </React.Fragment>
    );
  }
}
