import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import ScrapbokScreen from '../Screens/ScrapbookScreen';

const HomeScreenStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="ScrapbookScreen" component={ScrapbokScreen} />
        </Stack.Navigator> 
    )
}

export default HomeScreenStack
