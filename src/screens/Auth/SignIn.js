import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Image,
  ScrollView,
  StatusBar
} from "react-native";
import { Item, Input } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import TripleLine from "../../../assets/images/tripleLine.png";
import RouteNames from "../../navigation/RouteNames";
import { attemptGoogleAuth, signInWithEmail } from "../../API";
import LinearGradient from "react-native-linear-gradient";
import Loader from "../../components/Loader";
import { showMessage } from "react-native-flash-message";
import strings from "../../constants/strings";
import fonts from "../../constants/fonts";
import fontSizes from '../../constants/fontSizes'
import { appTheme } from "../../constants/colors";
import { screenHeight, screenWidth } from "../../utils/screenDimensions";
import Logo from "../../../assets/images/logo.png";
import Icon from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import { showError } from "../../utils/notification";
import Dash from "react-native-dash";



export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      googleLoading: false,
      loading: false,
    };
  }

  googleLogin = async () => {
    this.setState({ loading: true });
    let res = await attemptGoogleAuth();
    this.setState({ loading: false });
    if (res) this.setState({ googleLoading: true });
    else showError(strings.LOGIN_FAILED);
  };
  signIn = async () => {
    if (this.state.email === "" || this.state.password === "") {
      showError(strings.CREDENTIAL);
      return null;
    }
    Keyboard.dismiss();
    this.setState({ loading: true });
    var result = await signInWithEmail(this.state.email, this.state.password);
    this.setState({ loading: false });
    if (result) {
    } else showError(strings.LOGIN_FAILED);
  };
  setEmail = (text) => {
    this.setState({ email: text });
  };
  setPassword = (text) => {
    this.setState({ password: text });
  };
  navigateToSignup = () => {
    this.props.navigation.navigate(RouteNames.SignUp);
  };

  renderBars = () => (
    <View
      style={{
        position: "absolute",
        right: -screenWidth / 10,
        top: -screenWidth / 10,
      }}
    >
      <Image
        style={{ height: screenWidth / 2.5, width: screenWidth / 2.5 }}
        resizeMode={"contain"}
        source={TripleLine}
      />
    </View>
  );

forgotPassword=()=>{
  this.props.navigation.navigate(RouteNames.ForgotPassword);
}
  render() {
    return (
      <>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
        style={styles.container}
      >
       <StatusBar backgroundColor='black'/>
        <Loader loading={this.state.loading} />

        <Image resizeMode={"contain"} source={Logo} style={styles.image} />
        {this.renderBars()}
        <View style={styles.itemContainer}>
          <Text style={styles.signin}>{strings.SIGN_IN}</Text>

          <View style={{ marginTop: 20 }}>

              <Text style={styles.label}>{strings.EMAIL}</Text>
              <Item rounded style={styles.item}>
                <Icon name="mail" color={appTheme.brightContent} size={25} />
                <Input
                  onChangeText={(text) => {
                    this.setEmail(text);
                  }}
                  keyboardType={'email-address'}
                  style={styles.input}
                />
              </Item>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>{strings.PASSWORD}</Text>
              <Item rounded style={styles.item}>
                <Icon name="key" color={appTheme.brightContent} size={25} />
                <Input
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={(text) => this.setPassword(text)}
                />
              </Item>
            </View>
          </View>
          <View style={styles.loginandforgot}>

              <TouchableOpacity
                style={{ marginTop: 30, marginLeft: 20 }}
                onPress={() => this.signIn()}
              >
                <View style={styles.circleButton}>
                  <Feather name="arrow-right" color="white" size={30} />
                </View>
              </TouchableOpacity>

            <View style={{ flex: 1, marginTop: 10, marginRight: 20 }}>
              <TouchableOpacity style={styles.forgotPassword} onPress={()=>this.forgotPassword()} >
                <Text style={{ fontSize: fontSizes.h3, color: appTheme.greyC }}>
                  {strings.FORGOT_PASSWORD}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <Dash
              style={{ width: "100%", height: 1 }}
              dashGap={0}
              dashColor={appTheme.brightContent}
              dashThickness={0.8}
            />
          </View>

          <View styles={{justifyContent: "center"}} >
            <TouchableOpacity
              onPress={() => this.googleLogin()}
              style={styles.googleLogin}
            >
              <View style={{ justifyContent: "center" }}>
                {this.state.googleLoading && (
                  <ActivityIndicator size="large" color="white" />
                )}
                {!this.state.googleLoading && (
                  <Icon
                    name="google-"
                    color="#c33a09"
                    size={40}

                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.signup}>
            <TouchableOpacity onPress={() => this.navigateToSignup()}>
              <Text style={{ color: appTheme.greyC }}>
                {strings.NO_ACCOUNT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.darkBackground,
    flex: 1,
  },
  image: {
    height: screenHeight * 0.1,
    width: screenWidth * 0.6,
    marginTop: "10%",
  },
  itemContainer: {
    flex: 1,
    marginTop: "10%",
    backgroundColor: appTheme.background,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingTop: "5%",
    paddingHorizontal: "8%",
    height:screenHeight*0.85

  },
  input: {
    marginLeft: "3%",
    color: "white",
  },
  loginandforgot: {
    flexDirection: "row",
    marginTop: 20,
  },
  circleButton: {
    height: 60,
    width: 60,
    backgroundColor: appTheme.brightContent,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  signin: {
    fontSize: 45,
    fontWeight: "bold",
    color: "white",
    fontFamily: fonts.CenturyGothicBold,
    marginLeft: "4%",
  },

  googleLogin: {
    marginTop:30 ,
    marginHorizontal: "30%",
    backgroundColor: appTheme.darkBackground,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    height: 50,

  },
  label: {
    fontSize: fontSizes.h3,
    color: appTheme.greyC,
    marginLeft: "10%",
    paddingBottom: "2%",
  },
  item: {
    backgroundColor: appTheme.darkBackground,
    borderColor: appTheme.darkBackground,
    paddingLeft: "8%",
    justifyContent: "center",
  },
  signup: {
    marginTop:50,
    alignSelf: "center",
    bottom: 20,
  },
});
