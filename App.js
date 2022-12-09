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

  const DropdownComponent = () => {
    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: "blue" }]}>
            Dropdown label
          </Text>
        );
      }
      return null;
    };
  };

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
      <View style={styles.categories}>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select a Category of Shop" : "..."}
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
            <Text style={styles.text}>Locate Shop</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.shopStuff}>
        <Text style={styles.shop}>{locationOne}</Text>
        <Text style={styles.shop}>{addOne}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  categories: {
    marginTop: 100,
    backgroundColor: "white",
    padding: 16,
  },
  container: {
    marginTop: 30,
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
  title: {
    fontSize: 30,
    marginBottom: 15,
  },
  shop: {
    fontSize: 18,
    marginBottom: 8,
  },
  shopStuff: {
    marginLeft: 20,
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
