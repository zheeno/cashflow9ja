import React, { Component } from "react";
import { ScrollView } from "react-native";
import { LoaderOverlay, MiscModal } from "../../components/MiscComponents";
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
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { styles } from "../../../native-base-theme/variables/customStyles";
import { GetData, ShowToast } from "../../services/ApiCaller";

export default class BankTransferForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      ajaxCallState: "fetching",
      ajaxCallError: null,
      selBankModalVisible: false,
      validAccount: false,
      accNo: "",
      accName: "",
      recBank: "",
      amount: "",
      narration: "",
      serviceCharge: 52.5,
      total: 0
    };
    this.handleAccNoChange = this.handleAccNoChange.bind(this);
    this.handleAccNameChange = this.handleAccNameChange.bind(this);
    this.handleAmtChange = this.handleAmtChange.bind(this);
    this.handleNarChange = this.handleNarChange.bind(this);
    this.handleRecBankChange = this.handleRecBankChange.bind(this);
  }

  componentDidMount() {}

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
    // fetch account name
    this.getAccName(this.state.accNo, _recBank);
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

  getAccName = (accNo, bankCode) => {
    this.setState({ isLoading: true, ajaxCallState: null });
    GetData("/getBankAccName/" + accNo + "/" + bankCode)
      .then(result => {
        let response = result;
        this.setState({
          isLoading: false,
          ajaxCallState: 200,
          ajaxCallError: null,
          accName: "Robert Doe"
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
          ajaxCallState: "NET_ERR",
          ajaxCallError: error.message,
          accName: "Robert Doe" //remove this line later
        });
        ShowToast(error.message, "danger");
      });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <StyleProvider style={getTheme(material)}>
        <React.Fragment>
          {this.state.isLoading ? (
            <LoaderOverlay text={"Loading... Please wait"} />
          ) : null}
          {/* modal to display list of banks */}
          <MiscModal
            hideModal={() => this.setState({ selBankModalVisible: false })}
            visible={this.state.selBankModalVisible}
            title="Select Receiving Bank"
          />
          <View style={{ flex: 1, backgroundColor: "#fdf4e7" }}>
            <View style={[{ flex: 10 }]}>
              <ScrollView style={{ flex: 1 }}>
                <Form>
                  <Item
                    stackedLabel
                    style={{ marginTop: 20 }}
                    placeholder="Account Number"
                  >
                    <Label style={[styles.wineText]}>Account Number</Label>
                    <Input
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
                      <Label style={[styles.wineText]}>Receiving Bank</Label>
                      <Picker
                        style={{ width: "100%" }}
                        mode="dropdown"
                        selectedValue={
                          this.state.recBank.length == 0
                            ? "Select Bank"
                            : this.state.recBank
                        }
                        onValueChange={this.handleRecBankChange}
                      >
                        <Picker.Item label="Select Bank" value="null" />
                        <Picker.Item
                          label="United Bank for Africa"
                          value="033"
                        />
                        <Picker.Item label="Stanbic IBTC" value="221" />
                        <Picker.Item label="GT Bank" value="058" />
                        <Picker.Item label="Access Bank" value="044" />
                      </Picker>
                    </Item>
                  ) : null}
                  {this.state.accNo.length >= 10 &&
                  this.state.recBank.length > 0 &&
                  this.state.accName.length > 0 ? (
                    <React.Fragment>
                      <Item stackedLabel style={{ marginTop: 20 }}>
                        <Label style={[styles.wineText]}>Account Name</Label>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontWeight: "bold",
                            marginTop: 5,
                            fontSize: 18,
                            color: "#666"
                          }}
                        >
                          {this.state.accName}
                        </Text>
                      </Item>
                      <Item stackedLabel style={{ marginTop: 20 }}>
                        <Label style={[styles.wineText]}>
                          How much would you like to send to{" "}
                          {this.state.accName}?
                        </Label>
                        <Input
                          autoFocus
                          defaultValue={this.state.amount}
                          onChangeText={this.handleAmtChange}
                          keyboardType="decimal-pad"
                          maxLength={16}
                          returnKeyType="next"
                          style={{ color: "#666" }}
                        />
                      </Item>
                      <Item floatingLabel style={{ marginTop: 20 }}>
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

                      <View style={[{ alignItems: "center", padding: 10 }]}>
                        <Button
                          iconRight
                          block
                          style={
                            this.state.validAccount
                              ? [styles.bgDeepPink, { paddingHorizontal: 10, paddingRight: 20 }]
                              : [styles.bgDeepPurple, { paddingHorizontal: 10, paddingRight: 20 }]
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
                {this.state.accName.length == 0 ? (
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
                      style={{ marginTop: 10, fontSize: 13, color: "#810038" }}
                    >
                      Transfer funds to friends and family with ease
                    </Text>
                  </View>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </React.Fragment>
      </StyleProvider>
    );
  }
}
