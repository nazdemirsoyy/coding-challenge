/** Bonus/Performance: Instead of ScrollView  we should use FlatList, 
*   because FlatList renders only the items visible on the screen and it loads new data when the user scrolls
*/



import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import dayjs from 'dayjs'; // For current day check for New Tag and formatting "Posted" date in the API call


{/*LayoutAnimation for Android bc for IOS it does not need special configuraration*/}
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProductItemProps {
  name: string;
  date: string;
  image?: string;
  categories: string[];
}

const ProductItem: React.FC<ProductItemProps> =  React.memo(({ name, date, image, categories }) => {
  const [expanded, setExpanded] = useState(false);
  {/*Tried to implement React.memo bc I received the log below. Ref: https://react.dev/reference/react/memo*/}
  {/*LOG  VirtualizedList: You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. {"contentLength": 13404.1904296875, "dt": 804, "prevDt": 502}*/}
  
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
}, (prevProps, nextProps) => {
    // Only re-render if name, date, image, or categories change
    return prevProps.name === nextProps.name &&
           prevProps.date === nextProps.date &&
           prevProps.image === nextProps.image &&
           JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories);
  });

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
    backgroundColor:'#F8F9FC',
    gap:12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
   row: {
    flexDirection: 'row',
  },
  image: {
    width: 85,
    height: 70,
    marginLeft: 8,
    marginTop: 8,
    resizeMode: 'contain',

  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color:'#1B2633',
    marginLeft:5,
  },
  date: {
    fontSize: 14,
    color: '#000',
    
  },
  newBadge: {
    backgroundColor: '#333333',  
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9, 
    borderBottomRightRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    width:53,
    height:26,
    paddingTop:6,
    paddingRight:12,
    paddingBottom:6,
    paddingLeft:12,
    

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
    backgroundColor: '#D4E5FF', 
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 48,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 16,
    color: '#000',
    textAlign:'center',
    fontWeight:'400',
  },
});

export default ProductItem;
