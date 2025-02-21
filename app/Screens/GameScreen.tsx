import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Hand from '../../../mikescards/app/Components/Hand';

// Define card types and deck generation function
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type CardType = { suit: Suit; rank: Rank };

const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const generateDeck = (): CardType[] => {
    const deck: CardType[] = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ suit, rank });
        });
    });
    return deck;
};

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
const shuffleDeck = (deck: CardType[]): CardType[] => {
    let currentIndex = deck.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }

    return deck;
}

// Function to calculate hand value (basic Blackjack rules)
const getHandValue = (hand: CardType[]): number => {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
        let cardValue = parseInt(card.rank);
        if (isNaN(cardValue)) {
            if (['J', 'Q', 'K'].includes(card.rank)) {
                cardValue = 10;
            } else if (card.rank === 'A') {
                cardValue = 11;
                aces += 1;
            }
        }
        value += cardValue;
    });
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }
    return value;
};

const isBlackjack = (hand: CardType[]): boolean => {
    if (hand.length !== 2) return false;
    const hasAce = hand.some(card => card.rank === 'A');
    const hasTenValue = hand.some(card => ['10', 'J', 'Q', 'K'].includes(card.rank));
    return hasAce && hasTenValue;
}



const GameScreen: React.FC = () => {
    const [deck, setDeck] = useState<CardType[]>(generateDeck());
    const [playerHand, setPlayerHand] = useState<CardType[]>([]);
    const [dealerHand, setDealerHand] = useState<CardType[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<string | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
    const [isDealerFinished, setIsDealerFinished] = useState<boolean>(false);
    const [dealerDeckCount, setDealerDeckCount] = useState<number>(4);
    const [playerMoney, setPlayerMoney] = useState<number>(500);
    const [currentBet, setCurrentBet] = useState<number>(0);


    const dealCard = (currentDeck: CardType[]): [CardType | undefined, CardType[]] => {
        if (currentDeck.length === 0) return [undefined, currentDeck]; // Handle empty deck if needed
        const card = currentDeck[0];
        const remainingDeck = currentDeck.slice(1);
        return [card, remainingDeck];
    };

    const startNewGame = () => {
        if (currentBet <= 0) {
            alert("Please place a bet before starting a new game.");
            return;
        }
        if (currentBet > playerMoney) {
            alert("You cannot bet more money than you have.");
            return;
        }
        handleResetRound();

        let currentDeck = [...generateDeck()];
        for(let i = 0; i > dealerDeckCount - 1; i++) {
            console.log("Adding deck");
            currentDeck.push(...generateDeck());
        }
        currentDeck = shuffleDeck(currentDeck);

        const initialPlayerHand: CardType[] = [];
        const initialDealerHand: CardType[] = [];

        let card, updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card) initialPlayerHand.push(card);
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card) initialDealerHand.push(card);
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card) initialPlayerHand.push(card);
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card) initialDealerHand.push(card);
        currentDeck = updatedDeck;

        setDeck(currentDeck);
        setGameStarted(true);
        setPlayerHand(initialPlayerHand);
        setDealerHand(initialDealerHand);
        setPlayerMoney(currentMoney => currentMoney - currentBet);
    };

    const handleResetRound = () => {
        setGameStarted(false);
        setGameResult(null);
        setIsPlayerTurn(true);
        setIsDealerFinished(false);
    };

    const handleHit = () => {
        if (!gameStarted || !isPlayerTurn) return;
        const [newCard, updatedDeck] = dealCard(deck);
        if (newCard) {
            setPlayerHand(currentHand => [...currentHand, newCard]);
            setDeck(updatedDeck);
        }
    };

    const handleStand = () => {
        if (!gameStarted || !isPlayerTurn) return;
        setIsPlayerTurn(false);
        let currentDeck = [...deck];
        let dealerNewHand = [...dealerHand];

        // Simple Dealer AI: hit until hand value is 17 or more
        while (getHandValue(dealerNewHand) < 17) {
            const [newCard, updatedDeck] = dealCard(currentDeck);
            if (newCard) {
                dealerNewHand = [...dealerNewHand, newCard];
                currentDeck = updatedDeck;
            } else {
                break; // No more cards in deck
            }
        }
        setDealerHand(dealerNewHand);
        setDeck(currentDeck);
        setIsDealerFinished(true);
    };

    const handleBetOutcome = (outcome: 'player' | 'dealer' | 'push' | 'blackjack' | null) => {
        if (outcome === 'player') {
            setPlayerMoney(currentMoney => currentMoney + currentBet * 2);
        } else if (outcome === 'blackjack') {
            setPlayerMoney(currentMoney => currentMoney + currentBet * 2.5);
        } else if (outcome === 'push') {
            setPlayerMoney(currentMoney => currentMoney + currentBet); // Return the bet
        }
        // 'dealer' outcome: player already lost bet when game started
    };

    const increaseBet = () => {
        if (!gameStarted && playerMoney >= currentBet + 5) {
            setCurrentBet(currentBet + 5);
        }
    };

    const decreaseBet = () => {
        if (!gameStarted && currentBet >= 5) {
            setCurrentBet(currentBet - 5);
        }
    };

    useEffect(() => {
        if (!gameStarted) return;
        if (isPlayerTurn && getHandValue(playerHand) > 21) {
            setGameResult("Player Busts! Dealer Wins.");
            handleBetOutcome('dealer');
            setGameStarted(false);
            return;
        }

        if (isBlackjack(playerHand)) {
            setGameResult("Blackjack! Player Wins!");
            handleBetOutcome('blackjack');
            setGameStarted(false);
            return;
        }

        if (isBlackjack(dealerHand)) {
            setGameResult("Dealer Blackjack! Dealer Wins.");
            handleBetOutcome('dealer'); // Player loses bet when dealer has blackjack
            setGameStarted(false);
            return;
        }

        if (!isDealerFinished) return;

        const playerValue = getHandValue(playerHand);
        const dealerValue = getHandValue(dealerHand);

        let resultMessage = '';
        let gameOutcome: 'player' | 'dealer' | 'push' | 'blackjack' | null = null;
        if (dealerValue > 21) {
            resultMessage = "Dealer Busts! Player Wins!";
            gameOutcome = 'player';
        } else if (dealerValue === playerValue) {
            resultMessage = "Push! It's a tie.";
            gameOutcome = 'push';
        } else if (dealerValue > playerValue) {
            resultMessage = "Dealer Wins.";
            gameOutcome = 'dealer';
        } else {
            resultMessage = "Player Wins!";
            gameOutcome = 'player';
        }
        setGameResult(resultMessage);
        handleBetOutcome(gameOutcome);
        setGameStarted(false);
    }, [isDealerFinished, playerHand, gameStarted]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Blackjack</Text>

            <View style={styles.moneyArea}>
                <Text style={styles.moneyText}>Money: ${playerMoney}</Text>
            </View>

            <View style={styles.betArea}>
                <Text style={styles.betText}>Bet: ${currentBet}</Text>
                {!gameStarted && (
                    <View style={styles.betButtons}>
                        <Button title="-" onPress={decreaseBet} disabled={gameStarted || currentBet < 5} />
                        <Button title="+" onPress={increaseBet} disabled={gameStarted || playerMoney <= currentBet} />
                    </View>
                )}
            </View>

            <View style={styles.handArea}>
                <Text style={styles.handLabel}>Dealer Hand:</Text>
                <Hand cards={dealerHand} isDealerHand={gameStarted && !isPlayerTurn} />
                {gameStarted && !isPlayerTurn && <Text>Dealer Hand Value: {getHandValue(dealerHand)}</Text>}
            </View>

            <View style={styles.handArea}>
                <Text style={styles.handLabel}>Your Hand:</Text>
                <Hand cards={playerHand} />
                {gameStarted && <Text>Your Hand Value: {getHandValue(playerHand)}</Text>}
            </View>

            <View style={styles.buttonsArea}>
                {!gameStarted ? (
                    <Button title="Start New Game" onPress={startNewGame} disabled={currentBet <= 0 || currentBet > playerMoney} />
                ) : isPlayerTurn ? (
                    <>
                        <Button title="Hit" onPress={handleHit} />
                        <Button title="Stand" onPress={handleStand} />
                    </>
                ) : (
                    <Button title="Play Again" onPress={startNewGame} disabled={currentBet <= 0 || currentBet > playerMoney} />
                )}
            </View>

            {gameResult && <Text style={styles.resultText}>{gameResult}</Text>}
            {playerMoney <= 0 && gameStarted && <Text style={styles.resultText}>Game Over! You are out of money.</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    moneyArea: {
        marginBottom: 10,
    },
    moneyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    betArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    betText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    betButtons: {
        flexDirection: 'row',
    },
    handArea: {
        marginBottom: 20,
        alignItems: 'center',
    },
    handLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default GameScreen;
