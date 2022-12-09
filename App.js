import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  LogBox,
} from "react-native";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { geocode } from "@esri/arcgis-rest-geocoding";
import { React, useEffect, useState } from "react";

export default function App() {
  const [categ, setCateg] = useState("");
  const [text, setText] = useState("");
  const [postal, setPostal] = useState("");
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState("");
  const [location, setLocation] = useState("");
  const [locationOne, setLocationOne] = useState("");
  const [addOne, setAddOne] = useState("");

  const apiKey =
    "YOUR_API_KEY";
  const authentication = ApiKeyManager.fromKey(apiKey);

  const getCoords = () => {
    geocode({
      address: text,
      postal: postal,
      authentication,
    })
      .then((response) => {
        setLong(Math.round(response.candidates[0].location.x * 10000) / 10000);
        setLat(Math.round(response.candidates[0].location.y * 10000) / 10000);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

  useEffect(() => {
    LogBox.ignoreAllLogs();
    if (long) {
      setLocation(`${long},${lat}`);
      testAPI();
    }
  });

  const testAPI = () => {
    geocode({
      params: {
        category: "coffee shop",
        distance: 2000,
        location: `${long},${lat}`,
        maxLocations: 3,
      },
      outFields: "*",
      authentication,
    }).then((response) => {
      setLocationOne(`Name: ${response.candidates[0].address.toString()}`);
      setAddOne(
        `Address: ${response.candidates[0].attributes.Place_addr.toString()}`
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(add) => setText(add)}
        placeholder="Enter Address"
        style={styles.textInput}
      />
      <TextInput
        onChangeText={(stuff) => setPostal(stuff)}
        placeholder="Enter Postal Code"
        style={styles.textInput}
      />
      <StatusBar style="auto" />
      <View style={styles.buttonContainer}>
        <Pressable onPress={getCoords} style={styles.press}>
          <Text style={styles.text}>Locate Address</Text>
        </Pressable>
      </View>
      <Text>{locationOne}</Text>
      <Text>{addOne}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderColor: "#000000",
    borderWidth: 1,
  },
  press: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "blue",
    margin: 30,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
