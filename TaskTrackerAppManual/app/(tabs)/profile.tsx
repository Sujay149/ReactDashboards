import { Image } from 'expo-image';
import { View, Text, TextInput ,TouchableOpacity} from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export default function HomeScreen() {
  return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'#84C2B3',
    
    }}>
      <View style={{
        borderBlockColor :'black',
        borderWidth:2,
        height:450,
        width:400,
        borderRadius:25,
        marginLeft:155,
        marginTop:80
        
      }}>
      <Text style={{marginBottom:30, fontSize:25, color:'green', fontWeight:'bold',fontStyle:'italic',marginLeft:155,marginTop:30}}>TaskTrack</Text>
    <TextInput placeholder='Enter your mail'   style={{color:'black', borderBlockColor:'red',
       padding: 10,
        backgroundColor :'white',
        borderRadius:10,
        height:35,
        width:250,
        marginLeft:45,
        marginTop:20,
    }}></TextInput>
    <TextInput placeholder='Enter your password' secureTextEntry style={{color:'black', borderBlockColor:'red',
       padding: 10,
       marginVertical:20,
        backgroundColor :'white',
        borderRadius:10,
        height:35,
        width:250,
        marginLeft:45,
    }}></TextInput>

    <TouchableOpacity>
      <Text style={{color:'red',
        padding: 10,
        backgroundColor :'white',
        borderRadius:10,
        height:35,
        marginLeft:145,
        width:70,
        marginTop:20,
      }}>Login</Text>


    </TouchableOpacity>
    <TouchableOpacity>
      <Text  style={{color:'red',
        marginTop:20,
        paddingLeft:20,
        fontWeight:'semibold',
        fontStyle:'italic',
        marginLeft:125,
      }}>forgot password..?</Text>
    </TouchableOpacity>
    </View>
   </View>
  );
}


