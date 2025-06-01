import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={{ color: "blue" }}>Edit app/index.tsx to edit this uououscreen.</Text>
      <Link href={"/about"}>
        about
      </Link>

      {/* <Image
        source={{ uri: "https://i.pinimg.com/736x/93/e9/cc/93e9cc9ea37b6c2babf03c29108c3973.jpg" }}
        style={{ width: 200, height: 200 }}
        contentFit="cover"
        transition={1000}
      /> */}
      {/* <Image
        source={require("../assets/images/favicon.png")}
        style={{ width: 100, height: 100 }}
      /> */}
      <View><Text>j</Text></View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray"
  },
  text: {
    color: "red",
  },
});
