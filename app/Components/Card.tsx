import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';

export interface CardProps {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'none';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'STOP';
    isFaceDown?: boolean; // Optional prop to represent face down cards
}

// These will be used as fallback if images are not available
const suitSymbols = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
    none: '0'
};

const suitColors = {
    hearts: 'red',
    diamonds: 'red',
    clubs: 'black',
    spades: 'black',
    none: 'black'
};

// Function to get the image source for a specific card
const getCardImageSource = (suit: CardProps['suit'], rank: CardProps['rank']): ImageSourcePropType | null => {
    // For the special STOP card
    if (rank === 'STOP' && suit === 'none') {
        try {
            return require('../../assets/images/cards/stop.png');
        } catch (e) {
            return null; // Return null if image not found
        }
    }
    
    // For regular playing cards
    try {
        return require(`../../assets/images/cards/${rank}_of_${suit}.png`);
    } catch (e) {
        return null; // Return null if image not found
    }
};

// Image for card back
const getCardBackImage = (): ImageSourcePropType | null => {
    try {
        return require('../../assets/images/cards/card_back.png');
    } catch (e) {
        return null; // Return null if image not found
    }
};

export const Card: React.FC<CardProps> = ({suit, rank, isFaceDown = false}) => {
    // Get the appropriate image source
    const cardImage = isFaceDown ? getCardBackImage() : getCardImageSource(suit, rank);

    // If the image is not available, fall back to the text representation
    if (cardImage === null) {
        if (isFaceDown) {
            return (
                <View style={[styles.card, styles.cardFaceDown]}>
                    <Text style={styles.cardText}>?</Text>
                </View>
            );
        }

        const symbol = suitSymbols[suit];
        const color = suitColors[suit];

        return (
            <View style={[styles.card, styles.cardFaceUp]}>
                <Text style={[styles.rank, {color}]}>{rank}</Text>
                <Text style={[styles.suit, {color}]}>{symbol}</Text>
                <Text style={[styles.rankBottom, {color}]}>{rank}</Text>
            </View>
        );
    }

    // Render the card using an image
    return (
        <View style={styles.cardContainer}>
            <Image source={cardImage} style={styles.cardImage} resizeMode="contain" />
        </View>
    );
};

const styles = StyleSheet.create({
    // Keep existing styles for fallback text representation
    card: {
        width: 80,
        height: 120,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        backgroundColor: 'white',
        padding: 8,
        margin: 5,
        justifyContent: 'space-between',
    },
    cardFaceUp: {},
    cardFaceDown: {
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 30,
    },
    rank: {
        fontSize: 20,
        textAlign: 'left',
    },
    suit: {
        fontSize: 24,
        textAlign: 'center',
    },
    rankBottom: {
        fontSize: 20,
        textAlign: 'right',
        transform: [{rotate: '180deg'}],
    },
    
    // New styles for image-based cards
    cardContainer: {
        width: 80,
        height: 120,
        margin: 5,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
});

export default Card;
