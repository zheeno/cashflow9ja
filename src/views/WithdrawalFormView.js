import React, { Component } from "react";
import { ScrollView, AsyncStorage } from "react-native";
import {
  LoaderOverlay,
  MiscModal,
  NetworkError
} from "../components/MiscComponents";
import {
  StyleProvider,
  Form,
  Item,
  View,
  InputGroup,
  Label,
  Input,
  Text,
  Button,
  Icon,
  Right,
  Left,
  Picker,
  Body
} from "native-base";
import getTheme from "../../native-base-theme/components";
import material from "../../native-base-theme/variables/material";
import { styles } from "../../native-base-theme/variables/customStyles";
import { GetData, ShowToast } from "../services/ApiCaller";

export default class WithdrawalFormView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      withdrawalAccess: false,
      validAccount: false,
      accNo: "",
      accName: "",
      recBank: "",
      amount: "",
      narration: "",
      banks: [],
      requestedWithdrawal: false,
      requestResponse: "",
      requestStatus: false,
      serviceCharge: 52.5,
      total: 0
    };
    this.handleAccNoChange = this.handleAccNoChange.bind(this);
    this.handleAccNameChange = this.handleAccNameChange.bind(this);
    this.handleAmtChange = this.handleAmtChange.bind(this);
    this.handleNarChange = this.handleNarChange.bind(this);
    this.handleRecBankChange = this.handleRecBankChange.bind(this);
    this.getWithdrawalAccess = this.getWithdrawalAccess.bind(this);
    this.requestWithdrawal = this.requestWithdrawal.bind(this);
  }

  componentDidMount() {
    this.getWithdrawalAccess();
  }

  handleAccNoChange(_accNo) {
    this.setState({
      accNo: _accNo,
      recBank: "",
      accName: "",
      amount: "",
      narration: ""
    });
  }

  handleRecBankChange(_recBank) {
    this.setState({ recBank: _recBank });
  }

  handleAccNameChange(_accName) {
    this.setState({ accName: _accName });
  }

  handleAmtChange(_amt) {
    this.setState({ amount: _amt });
  }

  handleNarChange(_narration) {
    this.setState({ narration: _narration });
    if (
      this.state.accName.length > 0 &&
      this.state.accNo.length >= 10 &&
      this.state.recBank.length > 0 &&
      parseInt(this.state.amount) > 0
    ) {
      this.setState({ validAccount: true });
    } else {
      this.setState({ validAccount: false });
    }
  }

  getWithdrawalAccess() {
    this.setState({
      isLoading: true
    });
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData("/account/getWithdrawalAccess?user_id=" + userId)
          .then(result => {
            let response = result;
            this.setState({
              isLoading: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              requestedWithdrawal: false,
              withdrawalAccess: response.access,
              banks: response.banks
            });
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
          });
      })
      .done();
  }

  requestWithdrawal() {
    this.setState({ isLoading: true });
    AsyncStorage.getItem("userId")
      .then(userId => {
        GetData(
          "/account/requestWithdrawal?user_id=" +
            userId +
            "&accNo=" +
            this.state.accNo +
            "&accName=" +
            this.state.accName +
            "&recBank=" +
            this.state.recBank +
            "&amount=" +
            this.state.amount +
            "&narration=" +
            this.state.narration
        )
          .then(result => {
            let response = result;
            this.setState({
              isLoading: false,
              ajaxCallState: 200,
              ajaxCallError: null,
              requestedWithdrawal: true,
              requestStatus: response.status,
              requestResponse: response.response
            });
          })
          .catch(error => {
            this.setState({
              isLoading: false,
              ajaxCallState: "NET_ERR",
              ajaxCallError: error.message
            });
          });
      })
      .done();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : this.state.ajaxCallState == "NET_ERR" ? (
            <NetworkError
              error={this.state.ajaxCallError}
              onRefresh={() => this.getWithdrawalAccess()}
              refreshing={this.state.isLoading}
            />
          ) : this.state.requestedWithdrawal == false ? (
            this.state.withdrawalAccess == false ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  paddingHorizontal: 20
                }}
              >
                <Icon
                  type={"Ionicons"}
                  name={"information-circle"}
                  style={[{ fontSize: 100 }, styles.greyText]}
                />
                <Text
                  style={[
                    styles.greyText,
                    { textAlign: "center", fontSize: 20 }
                  ]}
                >
                  Sorry, You can not put out a withdrawal request at the moment.
                  {`\n`}
                  Kindly try again some other time.
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1, backgroundColor: "#fdf4e7" }}>
                <View style={[{ flex: 10 }]}>
                  <ScrollView style={{ flex: 1, paddingRight: 10 }}>
                    <Form>
                      <Item
                        stackedLabel
                        style={{ marginTop: 20 }}
                        placeholder="Account Number"
                      >
                        <Label style={[styles.wineText]}>Account Number</Label>
                        <Input
                          autoFocus
                          defaultValue={this.state.accNo}
                          onChangeText={this.handleAccNoChange}
                          keyboardType="numeric"
                          maxLength={10}
                          returnKeyType="next"
                          style={{ color: "#666" }}
                        />
                      </Item>
                      {this.state.accNo.length >= 10 ? (
                        <Item
                          stackedLabel
                          style={{ marginTop: 20 }}
                          bordered={false}
                        >
                          <Label style={[styles.wineText]}>
                            Receiving Bank
                          </Label>
                          <Picker
                            style={[styles.greyText, { width: "100%" }]}
                            mode="dropdown"
                            selectedValue={
                              this.state.recBank.length == 0
                                ? "Select Bank"
                                : this.state.recBank
                            }
                            onValueChange={this.handleRecBankChange}
                          >
                            <Picker.Item label="Select Bank" value="null" />
                            {this.state.banks.map(bank => (
                              <Picker.Item
                                key={bank.id}
                                label={bank.bank_name}
                                value={bank.cbn_code}
                              />
                            ))}
                          </Picker>
                        </Item>
                      ) : null}
                      {this.state.accNo.length >= 10 &&
                      this.state.recBank.length > 0 ? (
                        <React.Fragment>
                          <Item stackedLabel style={{ marginTop: 20 }}>
                            <Label style={[styles.wineText]}>
                              Account Name
                            </Label>
                            <Input
                              autoFocus
                              autoCompleteType={"off"}
                              defaultValue={this.state.accName}
                              onChangeText={this.handleAccNameChange}
                              keyboardType="default"
                              maxLength={50}
                              returnKeyType="done"
                              style={{ color: "#666" }}
                            />
                          </Item>
                          <Item stackedLabel style={{ marginTop: 20 }}>
                            <Label style={[styles.wineText]}>
                              How much would you like?
                            </Label>
                            <Input
                              defaultValue={this.state.amount}
                              onChangeText={this.handleAmtChange}
                              keyboardType="decimal-pad"
                              maxLength={16}
                              returnKeyType="next"
                              style={{ color: "#666" }}
                            />
                          </Item>
                          <Item stackedLabel style={{ marginTop: 20 }}>
                            <Label style={[styles.wineText]}>Narration</Label>
                            <Input
                              defaultValue={this.state.narration}
                              onChangeText={this.handleNarChange}
                              keyboardType="default"
                              maxLength={50}
                              returnKeyType="done"
                              style={{ color: "#666" }}
                            />
                          </Item>

                          <View
                            style={[
                              {
                                height: 100,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                padding: 10
                              }
                            ]}
                          >
                            <Button
                              iconRight
                              block
                              onPress={this.requestWithdrawal}
                              disabled={
                                this.state.accNo.length >= 10 &&
                                this.state.recBank.length > 0 &&
                                this.state.accName.length > 0 &&
                                parseFloat(this.state.amount) > 0
                                  ? false
                                  : true
                              }
                              style={
                                this.state.accNo.length >= 10 &&
                                this.state.recBank.length > 0 &&
                                this.state.accName.length > 0 &&
                                parseFloat(this.state.amount) > 0
                                  ? [
                                      styles.bgDeepPink,
                                      {
                                        paddingHorizontal: 10,
                                        paddingRight: 20,
                                        borderRadius: 20
                                      }
                                    ]
                                  : [
                                      styles.bgDeepPurple,
                                      {
                                        paddingHorizontal: 10,
                                        paddingRight: 20,
                                        borderRadius: 20
                                      }
                                    ]
                              }
                            >
                              <Text style={styles.whiteText}>Proceed</Text>
                              <Icon
                                name="md-arrow-forward"
                                style={styles.whiteText}
                              />
                            </Button>
                          </View>
                        </React.Fragment>
                      ) : null}
                    </Form>
                    {this.state.accNo.length == 0 ? (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          height: 300
                        }}
                      >
                        <Icon
                          name="bank"
                          type="FontAwesome"
                          style={[{ fontSize: 50, color: "#810038" }]}
                        />
                        <Text
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: "#810038"
                          }}
                        >
                          Withdraw funds to your bank account
                        </Text>
                      </View>
                    ) : null}
                  </ScrollView>
                </View>
              </View>
            )
          ) : (
            // handle withdrawal request response
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon
                name={
                  this.state.requestStatus
                    ? "ios-checkmark-circle"
                    : "ios-information-circle"
                }
                style={[
                  { fontSize: 100 },
                  this.state.requestStatus
                    ? { color: "green" }
                    : styles.greyText
                ]}
              />
              <Text
                style={{ fontSize: 20, marginTop: 20, textAlign: "center" }}
              >
                {this.state.requestResponse}
              </Text>
              {this.state.requestStatus ? (
                <Button
                block
                  style={[
                    styles.bgDeepPink,
                    { marginHorizontal: 10, marginTop: 20, borderRadius: 20 }
                  ]}
                  iconLeft
                  onPress={() => navigate("Home")}
                >
                  <Icon
                    type={"Ionicons"}
                    name={"ios-checkmark-circle"}
                    style={styles.whiteText}
                  />
                  <Text style={styles.whiteText}>Done</Text>
                </Button>
              ) : (
                <Button
                block
                  style={[
                    styles.bgDeepPink,
                    { marginHorizontal: 10, marginTop: 20, borderRadius: 20 }
                  ]}
                  iconLeft
                  onPress={this.getWithdrawalAccess}
                >
                  <Icon
                    type={"Ionicons"}
                    name={"ios-refresh"}
                    style={styles.whiteText}
                  />
                  <Text style={styles.whiteText}>Try Again</Text>
                </Button>
              )}
            </View>
          )}
        </React.Fragment>
      </StyleProvider>
    );
  }
}
