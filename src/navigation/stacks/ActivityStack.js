import React from "react";

import Stack from './stack';
import RouteNames from "../RouteNames";

import {appTheme} from "../../constants/colors";
import openDrawerButton from "../openDrawerButton";
import Activity from "../../screens/App/Activity";
import Profile from "../../screens/App/Profile";
import {defaultHeaderStyle} from "../../constants/styles";
import PackageList from "../../screens/App/Trainer/PackageList";
import PackageEdit from "../../screens/App/Trainer/PackageEdit";

const activity = () => {
  return (
    <Stack.Navigator screenOptions={defaultHeaderStyle}>
      <Stack.Screen
        name={RouteNames.Activity}
        component={PackageList}
        options={{
          title: 'Activity',
          headerLeft: openDrawerButton
        }}
      />
      <Stack.Screen
        name={RouteNames.PackageEdit}
        component={PackageEdit}
        options={{title: '', headerTransparent: true}}
      />
      <Stack.Screen name={RouteNames.Profile} component={Profile}
                    options={{title: '', headerTintColor: appTheme.brightContent, headerTransparent: true}}/>
    </Stack.Navigator>
  )
}

export default activity;