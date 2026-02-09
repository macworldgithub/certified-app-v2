import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomTabNavigator } from "./src/navigation";
import VehicleReport from "./src/Screens/VehicleReport";
import TransportCompleted from "./src/Screens/TransportCompleted";
import NewBooking from "./src/Screens/NewBooking";
import TransportActive from "./src/Screens/TransportActive";
import Splash from "./src/Screens/Splash";
import Onboarding from "./src/Screens/Onboarding";
import Signin from "./src/auth/Signin";
import Signup from "./src/auth/Signup";
import Home from "./src/Screens/Home";
import OTPVerification from "./src/auth/OTPVerification";
import Inspection from "./src/Screens/Inspection";
import InspectionDetails from "./src/Screens/InspectionDetails";
import Engineverify from "./src/Screens/Engineverify";
import Checklist from "./src/Screens/Checklist";
import ElectricalChecklist from "./src/Screens/ElectricalChecklist";
import EngineFluidsChecklist from "./src/Screens/EngineFluidsChecklist";
import OperationalChecklist from "./src/Screens/OperationalChecklist";
import FrontImage from "./src/Screens/FrontImage";
import LeftImage from "./src/Screens/LeftImage";
import RightImage from "./src/Screens/RightImage";
import RearImage from "./src/Screens/RearImage";
import LogoutAllOTPVerify from "./src/Screens/LogoutAllOTPVerify";
import AnalyzeScreen from "./src/Screens/AnalyzeScreen";
import Profile from "./src/Screens/Profile";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import InspectionList from "./src/Screens/InspectionList";
import ForgotPass from "./src/auth/ForgotPass";
import VerifyResetOTP from "./src/auth/VerifyResetOTP";
import ResetPassword from "./src/auth/ResetPassword";
import EditInspectionScreen from "./src/Screens/EditInspectionScreen";
import InspectionWizardStepTwo from "./src/Screens/InspectionWizardStepTwo";
import InspectionWizardStepThree from "./src/Screens/InspectionWizardStepThree";
import InspectionWizardStepFour from "./src/Screens/InspectionWizardStepFour";
import InspectionWizardStepFive from "./src/Screens/InspectionWizardStepFive";
import InspectionWizardStepSix from "./src/Screens/InspectionWizardStepSix";
import InspectionWizardStepOne from "./src/Screens/InspectionWizardStepOne";
import EngineImage from "./src/Screens/EngineImage";
import VINPlate from "./src/Screens/VINPlate";
import InteriorFront from "./src/Screens/InteriorFront";
import InteriorBack from "./src/Screens/InteriorBack";
import ReviewInspection from "./src/Screens/ReviewInspection";
import { KeyboardAvoidingView, View, Text } from "react-native";
import ViewInspection from "./src/Screens/ViewInspection";
import CaptureWithSilhouetteScreen from "./src/Screens/CaptureWithSilhouetteScreen";
import ImageReviewScreen from "./src/Screens/ImageReviewScreen";
enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={Splash} />
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                <Stack.Screen name="VehicleReport" component={VehicleReport} />
                <Stack.Screen
                  name="TransportActive"
                  component={TransportActive}
                />
                <Stack.Screen
                  name="TransportCompleted"
                  component={TransportCompleted}
                />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="NewBooking" component={NewBooking} />
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen
                  name="OTPVerification"
                  component={OTPVerification}
                />
                <Stack.Screen name="Inspection" component={Inspection} />
                <Stack.Screen
                  name="InspectionDetails"
                  component={InspectionDetails}
                />
                <Stack.Screen name="Engineverify" component={Engineverify} />
                <Stack.Screen name="BodyChecklist" component={Checklist} />
                <Stack.Screen
                  name="ElectricalChecklist"
                  component={ElectricalChecklist}
                />
                <Stack.Screen
                  name="EngineFluidsChecklist"
                  component={EngineFluidsChecklist}
                />
                <Stack.Screen
                  name="OperationalChecklist"
                  component={OperationalChecklist}
                />
                <Stack.Screen name="FrontImage" component={FrontImage} />
                <Stack.Screen name="LeftImage" component={LeftImage} />
                <Stack.Screen name="RightImage" component={RightImage} />
                <Stack.Screen name="RearImage" component={RearImage} />
                <Stack.Screen
                  name="LogoutAllOTPVerify"
                  component={LogoutAllOTPVerify}
                />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="AnalyzeScreen" component={AnalyzeScreen} />
                <Stack.Screen
                  name="InspectionList"
                  component={InspectionList}
                />
                <Stack.Screen name="ForgotPass" component={ForgotPass} />
                <Stack.Screen
                  name="VerifyResetOTP"
                  component={VerifyResetOTP}
                />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen
                  name="EditInspectionScreen"
                  component={EditInspectionScreen}
                />
                <Stack.Screen
                  name="InspectionWizardStepOne"
                  component={InspectionWizardStepOne}
                />
                <Stack.Screen
                  name="InspectionWizardStepTwo"
                  component={InspectionWizardStepTwo}
                />
                <Stack.Screen
                  name="InspectionWizardStepThree"
                  component={InspectionWizardStepThree}
                />
                <Stack.Screen
                  name="InspectionWizardStepFour"
                  component={InspectionWizardStepFour}
                />
                <Stack.Screen
                  name="InspectionWizardStepFive"
                  component={InspectionWizardStepFive}
                />
                <Stack.Screen
                  name="InspectionWizardStepSix"
                  component={InspectionWizardStepSix}
                />
                <Stack.Screen name="EngineImage" component={EngineImage} />
                <Stack.Screen name="VINPlate" component={VINPlate} />
                <Stack.Screen name="InteriorFront" component={InteriorFront} />
                <Stack.Screen name="InteriorBack" component={InteriorBack} />
                <Stack.Screen
                  name="ReviewInspection"
                  component={ReviewInspection}
                />
                <Stack.Screen
                  name="ViewInspection"
                  component={ViewInspection}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CaptureWithSilhouette"
                  component={CaptureWithSilhouetteScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="ImageReview"
                  component={ImageReviewScreen}
                  options={{ headerShown: false }}
                />
                {/* <Stack.Screen name="Tabs" component={BottomTabNavigator} /> */}
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Provider>
  );
}
