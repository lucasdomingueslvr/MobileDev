import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import scrollStyles from '../../styles/scrollStyles';
import theme from '../../styles/theme';
import { scrollViewData } from '../../utils/data';

export default function ScrollViewScreen() {
  return (
    <ScrollView style={scrollStyles.container} contentContainerStyle={scrollStyles.content}>
      <Text style={[scrollStyles.title, { color: theme.colors.primary }]}>
        ScrollView
      </Text>
      {scrollViewData.map((item) => (
        <View key={item.id} style={[scrollStyles.item, { backgroundColor: '#f0f0f0' }]}>
          <Text style={scrollStyles.itemText}>{item.name}</Text>
          <Text style={scrollStyles.description}>{item.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

