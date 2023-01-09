import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Screens/ProfileScreen';
import UpdateAccountScreen from '../Screens/UpdateAccountScreen';

const HomeScreenStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
            <Stack.Screen name="UpdateAccountScreen" component={UpdateAccountScreen} />
        </Stack.Navigator> 
    )
}

export default HomeScreenStack