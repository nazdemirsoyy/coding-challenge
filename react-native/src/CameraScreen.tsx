/**
 * Modified this screen because I realized that when I scan a ProductItem, it was showing twice.
 * Also checked in the API from Postman as well, it was making creating two different ID for same product.
 * To avoid duplicates I used useRef instead of useState because when I used useState I kept havingn the same issue
 * The resion behind that is useRef updates the stat of the variable immediately. 
 * 
 * Note: I made all these changes to improve performance of the app, from user perspective if we allow these duplicates it's confusing and
 * also It can harm the app performance.
 */


import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableWithoutFeedbackComponent, View } from "react-native";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { actions } from "./store/inventory";
import { StackParamList } from "./App";
import { CameraView, Camera } from "expo-camera";


export default (props: StackScreenProps<StackParamList, "Camera">) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // To avoid duplicate scanning
  const hasScannedRef = useRef(false); // Use useRef to track the scanned state, useRef updates immediately and it's does not re-render.
  
  const dispatch = useDispatch();

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    checkPermissions();
  }, []);


  const handleScanning = (code: { data: string }) => {
    if (!hasScannedRef.current) {
      hasScannedRef.current = true; // Set to true to prevent further scanning

      dispatch(
        actions.sendInventory(code.data, () => {
          props.navigation.navigate("Home");
          hasScannedRef.current = false; // Reset the ref after a successful API call
        })
      );
      
    }
  };



  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      // <CameraView
      //   style={{ flex: 1 }}
      //   onBarcodeScanned={(code) =>
      //     dispatch(
      //       actions.sendInventory(code.data, () => {
      //         props.navigation.navigate("Home");
      //       })
      //     )
      //   }
      // >

      <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={handleScanning}
      >

        <SafeAreaView style={styles.fab}>
          <FAB
            icon={() => (
              <MaterialCommunityIcons
                name="close"
                size={24}
                color="#0B5549"
              />
            )}
            label="Close Camera"
            onPress={() => props.navigation.goBack()}
          />
        </SafeAreaView>
      </CameraView>
    );
  }
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center"
  }
});
