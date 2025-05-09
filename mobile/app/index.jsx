import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>   
      <Text style={ styles.title}>PIUMI WERAGODA</Text>
      <Link href="/(auth)/signup">Signup Page</Link>
      <Link href="/login">Login Page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "red"
}});
