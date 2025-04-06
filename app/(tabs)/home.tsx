import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  // Dummy dynamic data – in a real app these would be fetched from an API or local store.
  const dailyAffirmation = "Every day is a new chance to grow.";
  const dailyChallenge = "Take a 10-minute walk.";
  const weeklyChallenge = "Try a new healthy recipe.";
  const monthlyChallenge = "Set one long-term personal goal.";

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      {/* Dynamic Daily Affirmation */}
      <View className="bg-[#F5F5F5] p-4 rounded-2xl shadow-sm mb-6">
        <Text className="text-base text-[#333333] italic">
          “{dailyAffirmation}”
        </Text>
      </View>

      {/* Journal Access with Write Icon */}
      <View className="flex-row justify-end mb-6">
        <TouchableOpacity className="bg-[#333333] p-3 rounded-full">
          <Ionicons name="create" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Goal Tracking */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-[#333333]">Your Goals</Text>
        <View className="bg-[#F5F5F5] p-4 rounded-xl">
          {/* Replace these with dynamic goal data */}
          <Text className="text-sm text-[#333333] mb-1">
            Daily Goal: Drink 8 glasses of water
          </Text>
          <Text className="text-sm text-[#333333] mb-1">
            Weekly Goal: Exercise 4 times
          </Text>
          <Text className="text-sm text-[#333333]">
            Monthly Goal: Read 2 books
          </Text>
        </View>
      </View>

      {/* Challenges Section */}
      <View className="mb-10">
        <Text className="text-lg font-bold mb-2 text-[#333333]">Challenges</Text>

        {/* Daily Challenge */}
        <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1] mb-4">
          <Text className="text-sm text-[#333333] font-semibold mb-1">
            Daily Challenge
          </Text>
          <Text className="text-sm text-[#333333] mb-2">
            {dailyChallenge}
          </Text>
          <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
            <Text className="text-white text-sm">Join</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Challenge */}
        <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1] mb-4">
          <Text className="text-sm text-[#333333] font-semibold mb-1">
            Weekly Challenge
          </Text>
          <Text className="text-sm text-[#333333] mb-2">
            {weeklyChallenge}
          </Text>
          <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
            <Text className="text-white text-sm">Join</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Challenge */}
        <View className="bg-[#F5F5F5] p-4 rounded-xl border border-[#D1D1D1]">
          <Text className="text-sm text-[#333333] font-semibold mb-1">
            Monthly Challenge
          </Text>
          <Text className="text-sm text-[#333333] mb-2">
            {monthlyChallenge}
          </Text>
          <TouchableOpacity className="mt-1 bg-[#333333] rounded-md py-1 px-3 self-start">
            <Text className="text-white text-sm">Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
