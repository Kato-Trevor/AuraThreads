import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getMoodLogs } from "@/lib/appwrite/moods";
import { useGlobalContext } from "@/context/GlobalProvider";

const MoodAnalyticsScreen = () => {
  const { user } = useGlobalContext();
  const [moodData, setMoodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("weekly"); // 'weekly', 'monthly', 'yearly'
  const [error, setError] = useState<any>(null);

  const screenWidth = Dimensions.get("window").width;

  // Mood color mapping
  const moodColors = {
    sad: "#6366F1", // Indigo
    angry: "#EF4444", // Red
    neutral: "#6B7280", // Gray
    happy: "#10B981", // Emerald
    excited: "#F59E0B", // Amber
  };

  // Mood icons mapping
  const moodIcons = {
    sad: "emoticon-sad",
    angry: "emoticon-angry",
    neutral: "emoticon-neutral",
    happy: "emoticon",
    excited: "emoticon-excited",
  };

  useEffect(() => {
    if (timeRange) {
      fetchMoodData();
    }
  }, [timeRange]);

  const fetchMoodData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMoodLogs(user.$id);
      const processedData = processDataByTimeRange(response, timeRange);
      setMoodData(processedData);
    } catch (err: any) {
      if (err.message) {
        setError(`Failed to load mood data: ${err.message}`);
      } else {
        setError("Failed to load mood data. Please try again.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const processDataByTimeRange = (data: any, range: string) => {
    const now = new Date();
    const labels: string[] = [];
    const moodCounts = {
      sad: 0,
      angry: 0,
      neutral: 0,
      happy: 0,
      excited: 0,
    };
    const moodValues: number[] = [];

    data.forEach((log: any) => {
      const logDate = new Date(log.$createdAt);
      const moodValue = Object.keys(moodColors).indexOf(log.mood) + 1;

      if (range === "weekly") {
        const dayOfWeek = logDate.getDay();
        if (!labels.includes(dayOfWeek.toString()))
          labels.push(dayOfWeek.toString());
        moodValues[dayOfWeek] = moodValue;
      } else if (range === "monthly") {
        const weekOfMonth = Math.ceil(logDate.getDate() / 7);
        if (!labels.includes(`Week ${weekOfMonth}`))
          labels.push(`Week ${weekOfMonth}`);
        moodValues[weekOfMonth - 1] = moodValue;
      } else if (range === "yearly") {
        const month = logDate.getMonth();
        if (!labels.includes(month.toString())) labels.push(month.toString());
        moodValues[month] = moodValue;
      }

      if (log.mood in moodCounts) {
        moodCounts[log.mood as keyof typeof moodCounts]++;
      }
    });

    return {
      labels: labels.map((label: any) =>
        range === "weekly"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][label]
          : label
      ),
      datasets: [
        {
          data: moodValues,
          color: () => "#FDF2F8",
          strokeWidth: 3,
        },
      ],
      moodCounts,
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(236, 72, 153, ${opacity})`, // Pink (secondary color)
    labelColor: () => "#6B7280",
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#EC4899", // Pink (secondary color)
    },
    propsForBackgroundLines: {
      strokeDasharray: "5, 5",
      stroke: "#F9A8D4", // Light pink (secondary-200)
    },
  };

  // Calculate most frequent mood
  const getMostFrequentMood = (): keyof typeof moodIcons => {
    if (!moodData || !moodData.moodCounts) return "neutral";

    let maxCount = 0;
    let mostFrequentMood: keyof typeof moodColors = "neutral";

    Object.entries(moodData.moodCounts).forEach(([mood, count]) => {
      if (typeof count === "number" && count > maxCount) {
        maxCount = count;
        mostFrequentMood = mood as keyof typeof moodColors;
      }
    });

    return mostFrequentMood;
  };

  function getTotalMoods() {
    if (!moodData || !moodData.moodCounts) return 0;

    return Object.values(moodData.moodCounts).reduce(
      (total: number, count) => total + (typeof count === "number" ? count : 0),
      0 as number
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-2xl font-pbold text-gray-900">
            Mood Analytics
          </Text>
          <Text className="text-sm font-pmedium text-gray-500 mt-1">
            Track your emotional patterns over time
          </Text>
        </View>
        {/* Time Range Selector */}
        <View className="flex-row justify-center px-6 py-3">
          <View className="flex-row bg-pink-50 rounded-full p-1">
            <TouchableOpacity
              onPress={() => setTimeRange("weekly")}
              className={`px-4 py-1.5 rounded-full ${
                timeRange === "weekly" ? "bg-pink-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-pbold ${
                  timeRange === "weekly" ? "text-white" : "text-pink-500"
                }`}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTimeRange("monthly")}
              className={`px-4 py-1.5 rounded-full ${
                timeRange === "monthly" ? "bg-pink-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-pbold ${
                  timeRange === "monthly" ? "text-white" : "text-pink-500"
                }`}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTimeRange("yearly")}
              className={`px-4 py-1.5 rounded-full ${
                timeRange === "yearly" ? "bg-pink-500" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs font-pbold ${
                  timeRange === "yearly" ? "text-white" : "text-pink-500"
                }`}
              >
                Yearly
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Chart */}
        <View className="px-4 py-3">
          {isLoading ? (
            <View className="items-center justify-center h-64">
              <ActivityIndicator size="large" color="#EC4899" />
            </View>
          ) : error ? (
            <View className="items-center justify-center h-64 bg-red-50 rounded-xl p-4">
              <MaterialCommunityIcons
                name="alert-circle"
                size={32}
                color="#EF4444"
              />
              <Text className="text-red-500 font-pmedium mt-2">{error}</Text>
              <TouchableOpacity
                onPress={fetchMoodData}
                className="mt-3 bg-pink-100 px-4 py-2 rounded-lg"
              >
                <Text className="text-pink-600 font-pmedium">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="bg-pink-50 rounded-xl p-4 shadow-sm">
              <Text className="text-base font-pbold text-gray-800 mb-2">
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
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    fromZero
                    yAxisSuffix=""
                    yAxisLabel=""
                    segments={5}
                  />
                )}
                {/* Mood Scale Legend */}
                <View className="flex-row justify-between w-full px-2 mt-2">
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="emoticon-sad"
                      size={18}
                      color="#6366F1"
                    />
                    <Text className="text-xs text-gray-500">Sad</Text>
                  </View>
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="emoticon-angry"
                      size={18}
                      color="#EF4444"
                    />
                    <Text className="text-xs text-gray-500">Angry</Text>
                  </View>
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="emoticon-neutral"
                      size={18}
                      color="#6B7280"
                    />
                    <Text className="text-xs text-gray-500">Neutral</Text>
                  </View>
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="emoticon"
                      size={18}
                      color="#10B981"
                    />
                    <Text className="text-xs text-gray-500">Happy</Text>
                  </View>
                  <View className="items-center">
                    <MaterialCommunityIcons
                      name="emoticon-excited"
                      size={18}
                      color="#F59E0B"
                    />
                    <Text className="text-xs text-gray-500">Excited</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
        backgroundColor: moodColors[getMostFrequentMood() as keyof typeof
        moodColors],
        {!isLoading && !error && moodData && (
          <View className="px-4 py-3">
            <View className="bg-white rounded-xl border border-pink-100 p-5 shadow-sm">
              <Text className="text-base font-pbold text-gray-800 mb-3">
                Mood Insights
              </Text>

              {/* Most Frequent Mood */}
              <View className="bg-pink-50 rounded-lg p-4 mb-3">
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

              {/* Mood Distribution */}
              <Text className="text-sm font-pmedium text-gray-700 mb-2">
                Mood Distribution
              </Text>

              {moodData.moodCounts &&
                Object.entries(moodData.moodCounts).map(([mood, count]) => (
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
                    <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          backgroundColor:
                            moodColors[mood as keyof typeof moodColors],
                          width: `${(Number(count) / getTotalMoods()) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
        {/* Recommendations */}
        {!isLoading && !error && (
          <View className="px-4 py-3 mb-6">
            <View className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-5">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-base font-pbold text-gray-800">
                  Recommendations
                </Text>
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={22}
                  color="#EC4899"
                />
              </View>

              <Text className="text-sm text-gray-700 mb-3">
                Based on your mood patterns, here are some activities that might
                help:
              </Text>

              <View className="bg-white rounded-lg p-3 mb-2 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-pink-500 items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="meditation"
                    size={20}
                    color="white"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-pbold text-gray-800">
                    5-Minute Meditation
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Helps reduce stress and anxiety
                  </Text>
                </View>
              </View>

              <View className="bg-white rounded-lg p-3 flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-pink-500 items-center justify-center mr-3">
                  <MaterialCommunityIcons
                    name="notebook"
                    size={20}
                    color="white"
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-pbold text-gray-800">
                    Gratitude Journal
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Write three things you're grateful for
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodAnalyticsScreen;
