import React, { useState } from "react";
import { Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import WordCloud from "@/components/WordCloud";
import MoodAnalytics from "@/components/MoodAnalytics";

const PopularTab = () => <WordCloud />;
const ForYouTab = () => <MoodAnalytics />;

const Trending = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "popular", title: "Popular" },
    { key: "forYou", title: "For You" },
  ]);

  const renderScene = SceneMap({
    popular: PopularTab,
    forYou: ForYouTab,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={(newIndex) => {
        console.log("Tab changed to:", routes[newIndex].title);
        setIndex(newIndex);
      }}
      initialLayout={{ width: Dimensions.get("window").width }}
      lazy={true}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#588b76" }}
          style={{ backgroundColor: "white" }}
          activeColor="#588b76"
          inactiveColor="gray"
        />
      )}
    />
  );
};

export default Trending;
