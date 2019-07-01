import React, { Component } from "react";
import { StatusBar } from "react-native";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root, Button, Icon, View, Text } from "native-base";
import HomeView from "./src/views/HomeView";
import UpgradeLevelView from "./src/views/UpgradeLevelView";
import BankTransferView from "./src/views/BankTransferView";
import SideBar from "./src/components/SideBar";
import TransactionHistory from "./src/views/Transactions/HistoryView";
import BillsPayment from "./src/views/Transactions/BillsPaymentView";
import ScanToPayIndex from "./src/views/ScanToPay";
import ReceiveViaQR from "./src/views/ScanToPay/ReceiveViaQR";
import ResponseView from "./src/views/ResponseView";
import CheckoutView from "./src/views/CheckoutView";
import InitializationView from "./src/views/InitializationView";
import SplashScreen from "./src/views/SplashScreen";
import SignInView from "./src/views/SignInView";
import SignUpView from "./src/views/SignUpView";
import CircleView from "./src/views/CircleView";
import JoinCircleView from "./src/views/JoinCircleView";
import InviteUsersToCircleView from "./src/views/InviteUsersToCircleView";
import OpenUserPageView from "./src/views/OpenUserPageView";
import ResultNotifierView from "./src/views/ResultNotifierView";
import MyProfileView from "./src/views/MyProfileView";
import FundWalletView from "./src/views/FundWalletView";
import NotificationsView from "./src/views/NotificationsView";
import WithdrawalFormView from "./src/views/WithdrawalFormView";
import { styles } from "./native-base-theme/variables/customStyles";

const RootStack = createStackNavigator(
  {
    WithdrawalForm: {
      screen: WithdrawalFormView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Withdrawal"
        };
      }
    },
    Notifications: {
      screen: NotificationsView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Notifications"
        };
      }
    },
    FundWallet: {
      screen: FundWalletView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Fund Wallet"
        };
      }
    },
    MyProfile: {
      screen: MyProfileView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Profile"
        };
      }
    },
    JoinCircle: {
      screen: JoinCircleView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Join Circle"
        };
      }
    },
    InviteUsersToCircle: {
      screen: InviteUsersToCircleView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Invite Users"
        };
      }
    },
    OpenUserPage: {
      screen: OpenUserPageView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "User Profile"
        };
      }
    },
    OpenCircleView: {
      screen: CircleView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Circle"
        };
      }
    },
    ResultNotifier: {
      screen: ResultNotifierView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Notification"
        };
      }
    },
    Home: {
      screen: HomeView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Home",
          headerLeft: (
            <Button transparent style={{ marginTop: 5 }}>
              <Icon
                name="menu"
                type={"Ionicons"}
                style={{ color: "#0c1220" }}
              />
            </Button>
          ),
          headerStyle: {
            backgroundColor: "#ffe35c",
            boxShadow: "none"
          },
          headerTintColor: "#0c1220"
        };
      }
    },
    UpgradeLevel: {
      screen: UpgradeLevelView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Upgrade"
        };
      }
    },
    CheckoutScreen: {
      screen: CheckoutView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Checkout"
        };
      }
    },
    ResponseScreen: {
      screen: ResponseView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Notification"
        };
      }
    },
    BankTransfer: {
      screen: BankTransferView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Bank Transfer"
        };
      }
    },
    TransactionHistoryScreen: {
      screen: TransactionHistory,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Transaction History"
        };
      }
    },
    BillPaymentScreen: {
      screen: BillsPayment,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Bills Payment"
        };
      }
    },
    ScanToPayIndexScreen: {
      screen: ScanToPayIndex,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Scan To Pay"
        };
      }
    },
    ReceiveViaQRScreen: {
      screen: ReceiveViaQR,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Receive Funds Via QR Code"
        };
      }
    }
  },
  {
    initialRouteName: "Home",

    // transitionConfig: () => fromLeft(),
    navigationOptions: {
      headerTintColor: "#010103",
      headerStyle: {
        backgroundColor: "#0d0127"
      },
      headerTintColor: "#fff",
      boxShadow: "none"
    }
  }
);

const DrawerStack = createDrawerNavigator(
  {
    StackScreen: {
      screen: RootStack
    }
  },
  {
    contentComponent: SideBar
  }
);

const AppStack = createStackNavigator(
  {
    splash: {
      screen: SplashScreen,
      navigationOptions: () => {
        return {
          headerStyle: {
            height: 0
          }
        };
      }
    },
    SignIn: {
      screen: SignInView,
      navigationOptions: () => {
        return {
          headerTitle: null,
          headerStyle: { height: 0 }
        };
      }
    },
    SignUp: {
      screen: SignUpView,
      navigationOptions: () => {
        return {
          title: "Join the Network"
        };
      }
    },
    InitializeAccount: {
      screen: InitializationView,
      navigationOptions: ({ navigation }) => {
        return {
          title: "Account Setup"
        };
      }
    },
    withDrawerFlow: {
      screen: DrawerStack,
      navigationOptions: () => {
        return {
          headerStyle: {
            height: 0
          }
        };
      }
    }
  },
  {
    initialRouteName: "splash",
    // transitionConfig: () => fromLeft(),
    navigationOptions: {
      headerTintColor: "#010103",
      headerStyle: {
        backgroundColor: "#0d0127"
      },
      headerTintColor: "#fff",
      boxShadow: "none"
    }
  }
);

export default class App extends Component {
  render() {
    return (
      <Root>
        <StatusBar hidden={false} />
        <AppStack />
      </Root>
    );
  }
}
