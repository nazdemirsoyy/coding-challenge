// Bonus/Performance: Instead of ScrollView  we should use FlatList, 
// because FlatList renders only the items visible on the screen.


import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { RefreshControl, ScrollView, StyleSheet, View , FlatList } from "react-native";
import { Appbar, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "./App";

import ProductItem from "./components/ProductItem "; 

export default (props: StackScreenProps<StackParamList, "Home">) => {
  const fetching = useSelector((state: RootState) => state.inventory.fetching);
  const inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(actions.fetchInventory());
    });
    return unsubscribe;
  }, [props.navigation]);

  {/* Key extractor for FlatList*/}
  const keyExtractor = (item: any) => item.id;

  {/* precompute Item layout for Flatlist */}
  const getItemLayout = (data: any, index: number) => ({
    length: 150,
    offset: 150 * index,
    index,
  });

  const renderItem = ({ item }: { item: any }) => (
    <ProductItem
      name={item.fields["Product Name"]}
      date={item.fields["Posted"]}
      image={item.fields["Product Image"]}
      categories={item.fields["Product Categories"]?.split(', ') || []}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Inventory" />
      </Appbar.Header>
      {/* <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
      >
        <SafeAreaView edges={["left", "bottom", "right"]}>
          {inventory.map((record, index) => (
            <ProductItem
              key={index}
              name={record.fields["Product Name"]}
              date={record.fields["Posted"]}
              image={record.fields["Product Image"]}
              categories={record.fields["Product Categories"]?.split(', ') || []} 
            />
          ))}
        </SafeAreaView>
      </ScrollView> */}

      {/* Render ProductItem */}
      <FlatList
              data={inventory}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={fetching}
                  onRefresh={() => dispatch(actions.fetchInventory())}
                />
              }
              initialNumToRender={10}  // Render initial 10 items for fast initial load
              windowSize={10}  // Number of items to render outside the visible window
              getItemLayout={getItemLayout}  // Precompute layout for fast rendering
            />

      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
            <MaterialCommunityIcons name="barcode" size={24} color="#0B5549" />
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
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
