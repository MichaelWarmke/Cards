import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface CardProps {
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'none';
    rank: '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'STOP';
    isFaceDown?: boolean; // Optional prop to represent face down cards
}

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

export const Card: React.FC<CardProps> = ({suit, rank, isFaceDown = false}) => {

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
};

const styles = StyleSheet.create({
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
});

export default Card;
