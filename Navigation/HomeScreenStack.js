import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import ScrapbokScreen from '../Screens/ScrapbookScreen';
import UpdateScrapbookScreen from '../Screens/UpdateScrapbookScreen'
import AddTextSectionScreen from '../Screens/AddTextSectionScreen';

const HomeScreenStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="ScrapbookScreen" component={ScrapbokScreen} />
            <Stack.Screen name="UpdateScrapbookScreen" component={UpdateScrapbookScreen} />
            <Stack.Screen name="AddTextSectionScreen" component={AddTextSectionScreen} />
        </Stack.Navigator> 
    )
}

export default HomeScreenStack
