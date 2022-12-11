import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  LogBox,
  Keyboard,
} from "react-native";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { geocode } from "@esri/arcgis-rest-geocoding";
import { React, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

export default function App() {
  const [text, setText] = useState("");
  const [postal, setPostal] = useState("");
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState("");
  const [locationOne, setLocationOne] = useState("");
  const [addOne, setAddOne] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { label: "Coffee shop", value: "1" },
    { label: "Pizza", value: "2" },
  ];

  const apiKey =
    "YOUR_API_KEY";
  const authentication = ApiKeyManager.fromKey(apiKey);

  const getCoords = () => {
    Keyboard.dismiss();
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
      testAPI();
    }
  }, [long, lat, label]);

  const testAPI = () => {
    geocode({
      params: {
        category: label,
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
    <>
      <View style={styles.container}>
        <Text style={styles.theTitle}>Find a Place App</Text>
        <Text style={styles.otherTitle}>using ArcGIS REST JS</Text>
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
      </View>
      <View style={styles.categories}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          search
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Place Category" : "..."}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
            setLabel(item.label);
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable onPress={getCoords} style={styles.press}>
          <Text style={styles.text}>Locate Place</Text>
        </Pressable>
      </View>
      <View style={styles.shopStuff}>
        <Text style={styles.shop}>{locationOne}</Text>
        <Text style={styles.shop}>{addOne}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  theTitle: {
    fontSize: 30
  },
  otherTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    borderColor: "#000000",
    borderWidth: 1,
    width: 250,
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
  shop: {
    fontSize: 20,
    marginBottom: 8,
  },
  shopStuff: {
    margin: 20,
    padding: 10,
    borderRadius: 7,
  },
  categories: {
    backgroundColor: "white",
    alignItems: "center",
  },
  dropdown: {
    width: 250,
    borderColor: "black",
    borderWidth: 1,
    padding: 7,
    fontSize: 22,
  },
  placeholderStyle: {
    fontSize: 18,
    color: "gray"
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 18,
  },
});
