import React, {JSX, useRef, useState} from 'react'
import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useFocusEffect} from 'expo-router';
import * as FileSystem from 'expo-file-system';

interface IndexProps {

}

export default function Camera(props: IndexProps): JSX.Element {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const cameraRef = useRef<CameraView>(null);

  useFocusEffect(
    React.useCallback(() => {
	 // Code to run when the screen is focused
	 setIsCameraActive(true);

	 return () => {
	   // Code to run when the screen is unfocused (unmounted)
	   setIsCameraActive(false);
	 };
    }, [])
  );

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View/>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
	 <View style={styles.container}>
	   <Text style={styles.message}>We need your permission to show the camera</Text>
	   <Button onPress={requestPermission} title="grant permission"/>
	 </View>
    );
  }

  async function takeAPicture() {
    if (cameraRef.current) {
	 const photo = await cameraRef.current.takePictureAsync();
	 const fileUri = FileSystem.documentDirectory + 'photo.jpg';
	 await FileSystem.moveAsync({
	   from: photo!.uri,
	   to: fileUri,
	 });
	 console.log('Photo saved to:', fileUri);
    }
  }

  return (
    <View style={styles.container}>
	 {isCameraActive && <CameraView ref={cameraRef}  style={styles.camera} facing={facing}>
	   <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
		<AntDesign name="retweet" size={24} color="white"
				 style={styles.cameraFacingControl}/>
	   </TouchableOpacity>
	   <View style={styles.buttonContainer}>
		<TouchableOpacity style={styles.button} onPress={takeAPicture}>
		  <AntDesign name="scan1" size={24} color="white"
				   style={styles.takeAPicture}/>
		</TouchableOpacity>
	   </View>
	 </CameraView>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    marginTop: 50,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  }, cameraFacingControl: {
    marginRight: 30
  },
  takeAPicture: {
    alignSelf: 'center', // Center horizontally
    alignItems: 'center', // Center content inside the button
    justifyContent: 'center', // Center content inside the button
  }
});

