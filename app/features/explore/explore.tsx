import React, {JSX, useState} from 'react'
import {FlatList, StyleSheet, Text} from 'react-native';
import * as FileSystem from 'expo-file-system';
import {useFocusEffect} from 'expo-router';

interface ExploreProps {

}

export default function Explore(props: ExploreProps): JSX.Element {
  const [photos, setPhotos] = useState<string[]>([]);


  useFocusEffect(() => {
	 void listPhotos();
  });

  async function listPhotos() {
    const photoDir = FileSystem.documentDirectory!;
    const files = await FileSystem.readDirectoryAsync(photoDir);
    setPhotos(files.filter(file => file.endsWith('.jpg')));
  }

  return (
    <FlatList
	 data={photos}
	 keyExtractor={(item) => item}
	 renderItem={({item}) => (
	   <Text style={styles.photoItem}>{item}</Text>
	 )}
    />

  )
}

const styles = StyleSheet.create({
  photoItem: {
    color: 'white',
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});