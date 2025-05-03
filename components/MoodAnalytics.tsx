import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getMoodLogs } from "@/lib/appwrite/moods";
import { useGlobalContext } from "@/context/GlobalProvider";
import MoodLogModal from "./MoodLog";

const MoodAnalytics = () => {
  const { user } = useGlobalContext();
  const [moodData, setMoodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("weekly");
  const [error, setError] = useState<any>(null);
  const [hasData, setHasData] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;

  const moodColors = {
    sad: "#6366F1",
    angry: "#EF4444",
    neutral: "#6B7280",
    happy: "#10B981",
    excited: "#F59E0B",
  };

  const moodIcons = {
    sad: "emoticon-sad",
    angry: "emoticon-angry",
    neutral: "emoticon-neutral",
    happy: "emoticon",
    excited: "emoticon-excited",
  };

  useEffect(() => {
    if (timeRange) fetchMoodData();
  }, [timeRange]);

  const fetchMoodData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMoodLogs(user.$id);
      console.log("Raw mood data:", response);

      if (!response || response.length === 0) {
        setHasData(false);
        setMoodData({
          labels: getDefaultLabels(timeRange),
          datasets: [
            {
              data: getEmptyDataSet(timeRange),
              color: () => "#588b76",
              strokeWidth: 3,
            },
          ],
          moodCounts: { sad: 0, angry: 0, neutral: 0, happy: 0, excited: 0 },
        });
        setIsLoading(false);
        return;
      }

      setHasData(true);
      const processedData = processDataByTimeRange(response, timeRange);
      setMoodData(processedData);
    } catch (err: any) {
      setError(err.message || "Failed to load mood data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultLabels = (range: string) => {
    if (range === "weekly")
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (range === "monthly")
      return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    if (range === "yearly")
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    return [];
  };

  const getEmptyDataSet = (range: string) =>
    getDefaultLabels(range).map(() => null);

  const processDataByTimeRange = (data: any, range: string) => {
    const moodCounts = { sad: 0, angry: 0, neutral: 0, happy: 0, excited: 0 };
    const orderedLabels = getDefaultLabels(range);
    let moodValuesMap: { [key: string]: number | null } = {};
    orderedLabels.forEach((label) => (moodValuesMap[label] = null));

    data.forEach((log: any) => {
      const logDate = new Date(log.$createdAt);
      const moodValue = Object.keys(moodColors).indexOf(log.mood) + 1;
      let label = "";

      if (range === "weekly") label = orderedLabels[logDate.getDay()];
      else if (range === "monthly")
        label = `Week ${Math.ceil(logDate.getDate() / 7)}`;
      else if (range === "yearly") label = orderedLabels[logDate.getMonth()];

      if (label) {
        const entriesCount = moodValuesMap[label] === null ? 0 : 1;
        moodValuesMap[label] =
          ((moodValuesMap[label] || 0) * entriesCount + moodValue) /
          (entriesCount + 1);
      }
      if (log.mood in moodCounts)
        moodCounts[log.mood as keyof typeof moodCounts]++;
    });

    const moodValues = orderedLabels.map((label) => moodValuesMap[label]);
    return {
      labels: orderedLabels,
      datasets: [{ data: moodValues, color: () => "#588b76", strokeWidth: 3 }],
      moodCounts,
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(88, 139, 118, ${opacity})`, // #588b76
    labelColor: () => "#6B7280",
    style: { borderRadius: 16 },
    propsForDots: { r: "6", strokeWidth: "2", stroke: "#588b76" },
    propsForBackgroundLines: { strokeDasharray: "5, 5", stroke: "#85aa9b" },
  };

  const getMostFrequentMood = (): keyof typeof moodIcons => {
    if (!moodData?.moodCounts) return "neutral";
    let maxCount = 0;
    let mostFrequentMood: keyof typeof moodColors = "neutral";
    Object.entries(moodData.moodCounts).forEach(([mood, count]) => {
      if (typeof count === "number" && count > maxCount) {
        maxCount = count;
        mostFrequentMood = mood as keyof typeof moodColors;
      }
    });
    return maxCount === 0 ? "neutral" : mostFrequentMood;
  };

  const getTotalMoods = () =>
    moodData?.moodCounts
      ? Object.values(moodData.moodCounts).reduce(
          (total: number, count) =>
            total + (typeof count === "number" ? count : 0),
          0
        )
      : 0;

  const EmptyStateView = () => (
    <View className="bg-secondary-200 rounded-xl p-6 my-4 items-center">
      <MaterialCommunityIcons
        name="emoticon-outline"
        size={60}
        color="#588b76"
      />
      <Text className="text-lg font-pbold text-secondary-dark mt-4 text-center">
        No Mood Data Yet
      </Text>
      <Text className="text-sm text-gray-600 mt-2 text-center">
        Start tracking your moods to see analytics and insights here.
      </Text>
      <TouchableOpacity
        className="mt-5 bg-secondary px-6 py-3 rounded-full"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-white font-pbold">Record Your First Mood</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-pbold text-secondary-dark">
            Mood Analytics
          </Text>
          <Text className="text-sm font-pmedium text-secondary mt-1">
            Track your emotional patterns over time
          </Text>
        </View>

        {/* Time Range Selector */}
        <View className="flex-row justify-center px-6 py-3">
          <View className="flex-row bg-secondary-200/80 rounded-full p-1">
            {["weekly", "monthly", "yearly"].map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setTimeRange(range)}
                className={`px-4 py-1.5 rounded-full ${
                  timeRange === range ? "bg-secondary" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-xs font-pbold ${
                    timeRange === range ? "text-white" : "text-secondary"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Chart Section */}
        <View className="px-4 py-3">
          {isLoading ? (
            <View className="items-center justify-center h-64">
              <ActivityIndicator size="large" color="#588b76" />
            </View>
          ) : error ? (
            <View className="items-center justify-center h-64 bg-red-100 rounded-xl p-4">
              <MaterialCommunityIcons
                name="alert-circle"
                size={32}
                color="#EF4444"
              />
              <Text className="text-red-600 font-pmedium mt-2">{error}</Text>
              <TouchableOpacity
                onPress={fetchMoodData}
                className="mt-3 bg-secondary-100 px-4 py-2 rounded-lg"
              >
                <Text className="text-secondary font-pmedium">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : !hasData ? (
            <EmptyStateView />
          ) : (
            <View className="bg-secondary-200/20 rounded-xl p-5 shadow-sm">
              <Text className="text-base font-pbold text-secondary-dark mb-2">
                Mood Trends
              </Text>
              <View className="items-center mt-1">
                {moodData && moodData.labels && (
                  <LineChart
                    data={{
                      labels: moodData.labels,
                      datasets: moodData.datasets,
                    }}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16 }}
                    fromZero
                    yAxisSuffix=""
                    yAxisLabel=""
                    segments={5}
                  />
                )}
                <View className="w-full mt-3 bg-white rounded-lg p-3 shadow-sm">
                  <Text className="text-xs font-pbold text-gray-700 mb-2">
                    Mood Scale Reference
                  </Text>
                  <View className="flex-row justify-between w-full">
                    {Object.entries(moodIcons).map(([mood, icon], index) => (
                      <View key={mood} className="items-center">
                        <View className="bg-white rounded-full p-1 border border-gray-200">
                          <MaterialCommunityIcons
                            name={icon as any}
                            size={20}
                            color={moodColors[mood as keyof typeof moodColors]}
                          />
                        </View>
                        <Text className="text-xs font-pbold text-gray-700 mt-1">
                          {index + 1}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View className="w-full mt-3 bg-white rounded-lg p-3 shadow-sm">
                  <Text className="text-xs text-gray-600">
                    This chart shows your mood changes over time. Each mood is
                    represented by a numeric value from 1 (Sad) to 5 (Excited).
                    Higher values indicate more positive moods.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {!isLoading && !error && hasData && moodData && (
          <>
            {/* Mood Insights Section */}
            <View className="px-4 py-3">
              <View className="bg-secondary-200/20 rounded-xl p-5 shadow-sm">
                <Text className="text-base font-pbold text-secondary-dark mb-3">
                  Mood Insights
                </Text>
                <View className="bg-white rounded-lg p-4 mb-3">
                  <Text className="text-sm font-pmedium text-gray-700 mb-2">
                    Most Frequent Mood
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 items-center justify-center rounded-full mr-3"
                      style={{
                        backgroundColor: moodColors[getMostFrequentMood()],
                      }}
                    >
                      <MaterialCommunityIcons
                        name={moodIcons[getMostFrequentMood()] as any}
                        size={24}
                        color="white"
                      />
                    </View>
                    <View>
                      <Text className="text-lg font-pbold text-gray-900 capitalize">
                        {getMostFrequentMood()}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {timeRange === "weekly"
                          ? "This Week"
                          : timeRange === "monthly"
                          ? "This Month"
                          : "This Year"}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text className="text-sm font-pmedium text-gray-700 mb-2">
                  Mood Distribution
                </Text>
                {Object.entries(moodData.moodCounts).map(([mood, count]) => (
                  <View key={mood} className="mb-2">
                    <View className="flex-row justify-between items-center mb-1">
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons
                          name={
                            moodIcons[mood as keyof typeof moodIcons] as any
                          }
                          size={18}
                          color={moodColors[mood as keyof typeof moodColors]}
                        />
                        <Text className="ml-2 text-sm font-pmedium text-gray-700 capitalize">
                          {mood}
                        </Text>
                      </View>
                      <Text className="text-sm text-gray-500">
                        {count as number} {count === 1 ? "time" : "times"}
                      </Text>
                    </View>
                    <View className="bg-white h-2 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            moodColors[mood as keyof typeof moodColors],
                          width: `${
                            getTotalMoods() > 0
                              ? (Number(count) / getTotalMoods()) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Recommendations Section */}
            <View className="px-4 py-3 mb-6">
              <View className="bg-secondary-200/20 rounded-xl p-5">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-base font-pbold text-secondary-dark">
                    Recommendations
                  </Text>
                  <MaterialCommunityIcons
                    name="lightbulb-on"
                    size={22}
                    color="#588b76"
                  />
                </View>
                <Text className="text-sm text-gray-700 mb-3">
                  Based on your mood patterns, here are some activities that
                  might help:
                </Text>
                {[
                  {
                    icon: "meditation",
                    title: "5-Minute Meditation",
                    desc: "Helps reduce stress and anxiety",
                  },
                  {
                    icon: "notebook",
                    title: "Gratitude Journal",
                    desc: "Write three things you're grateful for",
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="bg-white rounded-lg p-3 mb-2 flex-row items-center"
                  >
                    <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center mr-3">
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={20}
                        color="white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-pbold text-gray-800">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-gray-500">{item.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <MoodLogModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSuccess={() => {
            fetchMoodData();
            setIsModalVisible(false);
            console.log("Mood logged successfully");
          }}
        />
      </ScrollView>
    </View>
  );
};

export default MoodAnalytics;
