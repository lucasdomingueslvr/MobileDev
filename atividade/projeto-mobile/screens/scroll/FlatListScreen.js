import React from 'react';
import { FlatList, View, Text } from 'react-native';
import scrollStyles from '../../styles/scrollStyles';
import theme from '../../styles/theme';
import { flatListData } from '../../utils/data';

export default function FlatListScreen() {
  return (
    <View style={scrollStyles.container}>
      <Text style={[scrollStyles.title, { color: theme.colors.secondary }]}>
        FlatList
      </Text>
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[scrollStyles.item, { backgroundColor: '#e0f7fa' }]}>
            <Text style={scrollStyles.itemText}>{item.name}</Text>
          </View>
        )}
        contentContainerStyle={scrollStyles.list}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}
