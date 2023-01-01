import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../Screens/ListScreen';
import ScrapbokScreen from '../Screens/ScrapbookScreen';

const ListScreenStack = () => {
    const Stack = createStackNavigator();
    return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
        <Stack.Screen name="ListScreen" component={ListScreen}/>
        <Stack.Screen name="ScrapbookScreen" component={ScrapbokScreen} />
    </Stack.Navigator> 
    )
}

export default ListScreenStack