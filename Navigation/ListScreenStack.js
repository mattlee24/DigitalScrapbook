import { createStackNavigator } from '@react-navigation/stack';
import ListScreen from '../Screens/ListScreen';
import ScrapbokScreen from '../Screens/ScrapbookScreen';
import UpdateScrapbookScreen from '../Screens/UpdateScrapbookScreen'
import AddTextSectionScreen from '../Screens/AddTextSectionScreen';

const ListScreenStack = () => {
    const Stack = createStackNavigator();
    return (
    <Stack.Navigator screenOptions={() => ({headerShown: false})}>
        <Stack.Screen name="ListScreen" component={ListScreen}/>
        <Stack.Screen name="ScrapbookScreen" component={ScrapbokScreen} />
        <Stack.Screen name="UpdateScrapbookScreen" component={UpdateScrapbookScreen} />
        <Stack.Screen name="AddTextSectionScreen" component={AddTextSectionScreen} />
    </Stack.Navigator> 
    )
}

export default ListScreenStack