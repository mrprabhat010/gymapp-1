/**
 * @author Yatanvesh Bhardwaj <yatan.vesh@gmail.com>
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native'
import {connect} from "react-redux";
import cuid from 'cuid';
import {spacing} from "../../constants/dimension";
import * as actionCreators from "../../store/actions";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import colors, {appTheme} from "../../constants/colors";
import strings, {subscribedSuccessBuilder} from "../../constants/strings";
import fontSizes from "../../constants/fontSizes";
import fonts from "../../constants/fonts";

import Slot from "../../components/Slot";
import {findMissingDays, groupBy} from "../../utils/utils";
import {showError, showSuccess} from "../../utils/notification";
import FontAwesome from "react-native-vector-icons/FontAwesome";

class Enroll extends Component {

  state = {
    slots: [],
    selectedDays: {},
    selectedTime: '',
    selectedSlotId: '',
    subscribeLoading: false
  }

  componentDidMount() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const {slots} = this.getUser();

    if (slots && slots.length > 0) {
      const filteredSlots = slots.filter(slot => slot.subscriptionId === null);
      const localSlots = this.mapSlotsToLocal(filteredSlots);
      const selectedDays = {};
      localSlots.map(slot => {
        selectedDays[slot._id] = [];
      });
      this.setState({selectedDays, slots: localSlots});
    }
  }

  getUser = () => {
    const {route, users} = this.props;
    const {userId} = route.params;
    return users[userId];
  }

  mapSlotsToLocal = (slots) => {
    const localSlots = [];
    const slotsByTime = groupBy(slots, 'time');
    Object.keys(slotsByTime).map(time => {
      let slotsAtT = slotsByTime[time];
      const slotObj = slotsAtT[0];
      let days = [];
      slotsAtT.map(slotAtT => days.push(slotAtT.dayOfWeek));
      slotObj.days = days;
      localSlots.push(slotObj);
    })
    return localSlots;
  }

  enroll = async () => {
    this.setState({subscribeLoading: true});
    const {route, navigation} = this.props;
    const {userId, packageId, trainerName, sessionCount} = route.params;
    const {selectedDays, selectedTime, selectedSlotId} = this.state;
    const days = selectedDays[selectedSlotId];

    let result = await this.props.subscribePackage(userId, packageId, selectedTime, days);
    this.setState({subscribeLoading: false});
    if (result) {
      showSuccess(subscribedSuccessBuilder(trainerName, sessionCount));
      navigation.goBack(); //TODO:go to my slots screen
    } else showError(strings.SLOT_BOOKING_ERROR);
  }

  changeActiveDays = (slotId, days, selectedTime) => {
    const selectedDays = {...this.state.selectedDays};
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Object.keys(selectedDays).map(day => selectedDays[day] = []);
    selectedDays[slotId] = days;
    this.setState({selectedDays, selectedTime, selectedSlotId: slotId});
  }

  renderSlot = (slot, index) => (
    <View style={styles.slotContainer}>
      <Slot
        days={this.state.selectedDays[slot._id]}
        disabledDays={findMissingDays(slot.days)}
        duration={slot.duration}
        index={index + 1}
        time={slot.time}
        // onEnroll={() => this.enroll(slot.time, this.state.selectedDays[slot._id])}
        // enrollDisabled={this.state.selectedDays[slot._id].length === 0}
        onDaysChange={(days) => this.changeActiveDays(slot._id, days, slot.time)}
      />
    </View>
  )

  renderSlots = () => {
    return (
      <FlatList
        data={this.state.slots || []}
        renderItem={({item, index}) => this.renderSlot(item, index)}
        keyExtractor={item => item.time}
      />);

  }

  fab = () => {
    const {selectedDays, selectedSlotId} = this.state;
    const days = selectedDays[selectedSlotId];
    if (!days || days.length === 0)
      return null;
    return (
      <TouchableOpacity style={[styles.fab, styles.fabPosition]} onPress={this.enroll}>
        {
          this.state.subscribeLoading && (
            <ActivityIndicator size={28} color={'white'}/>
          )
        }
        {
          !this.state.subscribeLoading && (
            <FontAwesome
              name={'check'}
              color={'white'}
              size={22}
            />
          )
        }
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>

        <StatusBar backgroundColor={appTheme.darkBackground}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{strings.SLOTS}</Text>
        </View>
        <View style={styles.listContainer}>
          <this.renderSlots/>
        </View>
        <this.fab/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appTheme.background,
  },
  listContainer: {
    // justifyContent: 'center',
    marginLeft: spacing.medium_lg,
    marginRight: spacing.medium_lg,
    flex: 1,
  },
  slotContainer: {
    marginBottom: spacing.medium_lg
  },
  titleContainer: {
    paddingTop: spacing.medium_sm,
    paddingLeft: spacing.large,
    paddingRight: spacing.large,
    paddingBottom: spacing.medium_sm,
    marginBottom: spacing.medium_sm,
    backgroundColor: appTheme.darkBackground,
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: fontSizes.h0,
    fontFamily: fonts.PoppinsRegular
  },
  addButtonContainer: {
    paddingTop: spacing.medium,
    paddingBottom: spacing.medium_sm,
    alignItems: 'center',
  },
  fab: {
    height: spacing.thumbnailMini,
    width: spacing.thumbnailMini,
    borderRadius: spacing.thumbnailMini / 2,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.acceptGreen,
  },
  fabPosition: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  fabText: {
    fontSize: 40,
    alignContent: "center",
    textAlign: "center",
    color: "white",
    lineHeight: 50,
  },
});

const mapStateToProps = (state) => ({
  users: state.app.users
});

const mapDispatchToProps = (dispatch) => ({
  subscribePackage: (trainerId, packageId, time, days) => dispatch(actionCreators.subscribePackage(trainerId, packageId, time, days))
});

export default connect(mapStateToProps, mapDispatchToProps)(Enroll);

