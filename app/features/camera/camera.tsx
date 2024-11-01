import React, {JSX, useRef, useState} from 'react';
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
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const [scannedUrl, setScannedUrl] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
	 setIsCameraActive(true);
	 listPhotos();
	 return () => {
	   setIsCameraActive(false);
	 };
    }, [])
  );

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function listPhotos() {
    const photoDir = FileSystem.documentDirectory!;
    const files = await FileSystem.readDirectoryAsync(photoDir);
    setPhotos(files.filter(file => file.endsWith('.jpg')));
  }

  if (!permission) {
    return <View/>;
  }

  if (!permission.granted) {
    return (
	 <View style={styles.container}>
	   <Text style={styles.message}>We need your permission to show the camera</Text>
	   <Button onPress={requestPermission} title="grant permission"/>
	 </View>
    );
  }

  async function takeAPicture() {
    console.log('Scanned URL:', scannedUrl);
    if (cameraRef.current) {
	 const photo = await cameraRef.current.takePictureAsync();
	 const fileUri = FileSystem.documentDirectory + 'photo_' + Date.now() + '_' + scannedUrl + '_' + '.jpg';
	 await FileSystem.moveAsync({
	   from: photo!.uri,
	   to: fileUri,
	 });
	 console.log('Photo saved to:', fileUri);
	 listPhotos();
    }
    setScannedUrl('');
  }

  function handleBarCodeScanned({type, data}: { type: string; data: string }) {
    setScannedUrl(data);
  }

  return (
    <View style={styles.container}>
	 {isCameraActive && (
	   <CameraView
		ref={cameraRef}
		style={styles.camera}
		facing={facing}
		onBarcodeScanned={handleBarCodeScanned}
		barcodeScannerSettings={{
		  barcodeTypes: ['code128', 'qr'],
		}}
	   >
		<TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
		  <AntDesign name="retweet" size={24} color="white"
				   style={styles.cameraFacingControl}/>
		</TouchableOpacity>
		<View style={styles.buttonContainer}>
		  <TouchableOpacity style={styles.button} onPress={takeAPicture}>
		    <AntDesign name="scan1" size={24} color="white"
					style={styles.takeAPicture}
					onPress={scannedUrl ? takeAPicture : undefined}/>

		    {scannedUrl &&
                  <TouchableOpacity style={styles.scanButton}>
                      <View style={styles.buttonContent}>
                          <Text
                              style={styles.buttonText}>{`Validate ${scannedUrl}`}</Text>
                      </View>
                  </TouchableOpacity>}

		    {!scannedUrl && (<>
			   <Text style={styles.takeAPictureText}>Waiting to detect a code...</Text>
			 </>

		    )}
		  </TouchableOpacity>
		</View>
	   </CameraView>
	 )}
    </View>
  );
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
  cameraFacingControl: {
    marginRight: 30,
  },
  takeAPicture: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeAPictureText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  scanButton: {
    color: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    paddingLeft: 5,
    fontSize: 16,
    marginRight: 8,
  },
  icon: {
    color: 'white',
  },
});
