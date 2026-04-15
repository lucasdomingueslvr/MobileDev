import React from 'react';
import { SectionList, View, Text } from 'react-native';
import scrollStyles from '../../styles/scrollStyles';
import theme from '../../styles/theme';
import { sectionListData } from '../../utils/data';

export default function SectionListScreen() {
  return (
    <View style={scrollStyles.container}>
      <Text style={[scrollStyles.title, { color: theme.colors.warning }]}>
        SectionList
      </Text>
      <SectionList
        sections={sectionListData}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={[scrollStyles.item, { backgroundColor: '#f9fbe7' }]}>
            <Text style={scrollStyles.itemText}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[scrollStyles.header, { backgroundColor: '#d0d0d0' }]}>{title}</Text>
        )}
        contentContainerStyle={scrollStyles.list}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

