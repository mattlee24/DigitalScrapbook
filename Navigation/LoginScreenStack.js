import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/LoginScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen'

const LoginScreenStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={() => ({headerShown: false})}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        </Stack.Navigator> 
    )
}

export default LoginScreenStack
