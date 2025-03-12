import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CardProps, Card } from './Card';

interface HandProps {
    cards: { suit: CardProps['suit']; rank: CardProps['rank'] }[];
    isDealerHand?: boolean;
    isDealerTurn?: boolean; // Optional: to potentially handle dealer's first card face down
}

const Hand: React.FC<HandProps> = ({ cards, isDealerHand = false, isDealerTurn = false }) => {
    return (
        <View style={styles.handContainer}>
            {cards.map((card, index) => (
                <View key={index} style={{ marginLeft: index > 0 ? -40 : 0 }}> {/* Overlap cards */}
                    <Card
                        suit={card.suit}
                        rank={card.rank}
                        isFaceDown={isDealerHand && isDealerTurn && index === 0} // First card of dealer hand is face down initially
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    handContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default Hand;
