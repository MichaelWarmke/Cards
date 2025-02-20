import GameScreen from '../Screens/GameScreen'
import {SafeAreaProvider} from "react-native-safe-area-context";
export default function Blackjack() {
    return <SafeAreaProvider>
        <GameScreen/>
    </SafeAreaProvider>;
}
