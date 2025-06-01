import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  // return <Stack screenOptions={{headerShown: false}}/>;
  return <SafeScreen>
    <Stack screenOptions={{headerShown: false}}/>
  </SafeScreen>;
}
