import React from 'react';
import {View, Text, StyleSheet, Image, ImageSourcePropType} from 'react-native';

export interface CardProps {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'none';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'STOP';
    isFaceDown?: boolean; // Optional prop to represent face down cards
}

const suitSymbols: Record<CardProps['suit'], string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
    none: '0'
};

const suitColors: Record<CardProps['suit'], string> = {
    hearts: 'red',
    diamonds: 'red',
    clubs: 'black',
    spades: 'black',
    none: 'black'
};

// Define the type for the card images mapping
type CardImagesType = {
  [suit in CardProps['suit']]: {
    [rank in CardProps['rank']]?: any;
  };
};

// Function to get the image source for a specific card
const cardImages: CardImagesType = {
    'hearts': {
      '2': require('../../assets/images/cards/2_of_hearts.png'),
      '3': require('../../assets/images/cards/3_of_hearts.png'),
      '4': require('../../assets/images/cards/4_of_hearts.png'),
      '5': require('../../assets/images/cards/5_of_hearts.png'),
      '6': require('../../assets/images/cards/6_of_hearts.png'),
      '7': require('../../assets/images/cards/7_of_hearts.png'),
      '8': require('../../assets/images/cards/8_of_hearts.png'),
      '9': require('../../assets/images/cards/9_of_hearts.png'),
      '10': require('../../assets/images/cards/10_of_hearts.png'),
      'J': require('../../assets/images/cards/jack_of_hearts.png'),
      'Q': require('../../assets/images/cards/queen_of_hearts.png'),
      'K': require('../../assets/images/cards/king_of_hearts.png'),
      'A': require('../../assets/images/cards/ace_of_hearts.png'),
    },
    'diamonds': {
      '2': require('../../assets/images/cards/2_of_diamonds.png'),
      '3': require('../../assets/images/cards/3_of_diamonds.png'),
      '4': require('../../assets/images/cards/4_of_diamonds.png'),
      '5': require('../../assets/images/cards/5_of_diamonds.png'),
      '6': require('../../assets/images/cards/6_of_diamonds.png'),
      '7': require('../../assets/images/cards/7_of_diamonds.png'),
      '8': require('../../assets/images/cards/8_of_diamonds.png'),
      '9': require('../../assets/images/cards/9_of_diamonds.png'),
      '10': require('../../assets/images/cards/10_of_diamonds.png'),
      'J': require('../../assets/images/cards/jack_of_diamonds.png'),
      'Q': require('../../assets/images/cards/queen_of_diamonds.png'),
      'K': require('../../assets/images/cards/king_of_diamonds.png'),
      'A': require('../../assets/images/cards/ace_of_diamonds.png'),
    },
    'clubs': {
      '2': require('../../assets/images/cards/2_of_clubs.png'),
      '3': require('../../assets/images/cards/3_of_clubs.png'),
      '4': require('../../assets/images/cards/4_of_clubs.png'),
      '5': require('../../assets/images/cards/5_of_clubs.png'),
      '6': require('../../assets/images/cards/6_of_clubs.png'),
      '7': require('../../assets/images/cards/7_of_clubs.png'),
      '8': require('../../assets/images/cards/8_of_clubs.png'),
      '9': require('../../assets/images/cards/9_of_clubs.png'),
      '10': require('../../assets/images/cards/10_of_clubs.png'),
      'J': require('../../assets/images/cards/jack_of_clubs.png'),
      'Q': require('../../assets/images/cards/queen_of_clubs.png'),
      'K': require('../../assets/images/cards/king_of_clubs.png'),
      'A': require('../../assets/images/cards/ace_of_clubs.png'),
    },
    'spades': {
      '2': require('../../assets/images/cards/2_of_spades.png'),
      '3': require('../../assets/images/cards/3_of_spades.png'),
      '4': require('../../assets/images/cards/4_of_spades.png'),
      '5': require('../../assets/images/cards/5_of_spades.png'),
      '6': require('../../assets/images/cards/6_of_spades.png'),
      '7': require('../../assets/images/cards/7_of_spades.png'),
      '8': require('../../assets/images/cards/8_of_spades.png'),
      '9': require('../../assets/images/cards/9_of_spades.png'),
      '10': require('../../assets/images/cards/10_of_spades.png'),
      'J': require('../../assets/images/cards/jack_of_spades.png'),
      'Q': require('../../assets/images/cards/queen_of_spades.png'),
      'K': require('../../assets/images/cards/king_of_spades.png'),
      'A': require('../../assets/images/cards/ace_of_spades.png'),
    },
    'none': {
      'STOP': require('../../assets/images/cards/red_joker.png'),
    }
  };

  const getCardImageSource = (suit: CardProps['suit'], rank: CardProps['rank']): ImageSourcePropType | null => {
    try {
        return cardImages[suit]?.[rank];
    } catch (e) {
        return null;
    }
  }

  
// Image for card back
const getCardBackImage = (): ImageSourcePropType | null => {
    try {
        return require('../../assets/images/cards/card_back.png');
    } catch (e) {
        return null; // Return null if image not found
    }
};

export const Card: React.FC<CardProps> = ({suit, rank, isFaceDown = false}: CardProps) => {
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
