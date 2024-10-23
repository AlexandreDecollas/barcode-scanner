import {StyleSheet} from 'react-native';
import Camera from '../features/camera/camera';

export default function TakeAPhotoScreen() {
  return (
      <Camera/>
    // <View><Text>test</Text></View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
