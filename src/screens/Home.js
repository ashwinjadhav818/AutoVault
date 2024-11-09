import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import AppBar from "../components/AppBar.js"
import Overview from "./Overview.js";
import Cars from "./Cars.js";
import People from "./People.js";
import Search from "./Search.js";
import Account from "./Account.js";

export default Home = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", focusedIcon: "home", unfocusedIcon: "home-outline" },
    { key: "cars", title: "Cars", focusedIcon: "car", unfocusedIcon: "car-outline" },
    { key: "people", title: "People", focusedIcon: "card-account-details", unfocusedIcon: "card-account-details-outline" },
    { key: "search", title: "Search", focusedIcon: "magnify-close", unfocusedIcon: "magnify" },
    { key: "account", title: "Account", focusedIcon: "account-circle", unfocusedIcon: "account-circle-outline" }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Overview,
    cars: Cars,
    people: People,
    search: Search,
    account: Account
  });

  return (
    <>
      <AppBar title={routes[index].title} index={index} />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        key={routes[index].key}
      />
    </>
  );
};
