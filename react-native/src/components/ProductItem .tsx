import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs'; // For current day check for New Tag and formatting "Posted" date in the API call

{/*LayoutAnimation for Android*/}
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProductItemProps {
  name: string;
  date: string;
  image?: string;
  categories: string[];
}

const ProductItem: React.FC<ProductItemProps> = ({ name, date, image, categories }) => {
  const [expanded, setExpanded] = useState(false);

  {/*New Tag Check*/}
  const isNew = dayjs().diff(dayjs(date), 'day') <= 7;

  {/*Animation*/}
  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
            <Image
            style={styles.image}
            source={image ? { uri: image } : { uri: 'https://fakeimg.pl/600x400' }} 
            />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.date}>{dayjs(date).format('DD.MM.YYYY')}</Text>
        </View>
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}

        {/*Toggle up & Down */}
        <TouchableOpacity onPress={toggleExpand}>
          <MaterialCommunityIcons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#555" 
          />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={styles.details}>
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#000',
  },
  newBadge: {
    backgroundColor: '#000',  
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,  
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  newText: {
    color: '#fff',  
    fontWeight: 'bold',
    fontSize: 12,
  },
  details: {
    marginTop: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f0ff', 
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 16,
    color: '#000',
  },
});

export default ProductItem;
