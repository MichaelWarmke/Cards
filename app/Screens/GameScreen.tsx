import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import Hand from '../Components/Hand';
import ChipButton from '../../components/ChipButton';
import ActionButton from '../../components/ActionButton';
import {TableColors, TableStyles} from '../../constants/TableStyles';

// Define card types and deck generation function
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades' | 'none';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A' | 'STOP'; // Include 'STOP' for stop card
type CardType = { suit: Suit; rank: Rank }; // CardType can be regular card or stop card

const ranks: Exclude<Rank, 'STOP'>[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

const generateDeck = (deckCount: number, includeStopCard: boolean = true): CardType[] => {
    console.log("Generating new Deck")
    let deck: CardType[] = [];
    for (let i = 0; i < 4; i++) { // 4 decks by default as per standard blackjack
        suits.forEach(suit => {
            ranks.forEach(rank => {
                deck.push({ suit, rank });
            });
        });
    }
    if (includeStopCard) {
        deck.push({ suit: 'none', rank: 'STOP' }); // Add stop card to the generated deck
    }
    return shuffleDeck(deck);
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
    for (const card of hand) {
        if (card.rank === 'STOP') continue; // Stop card has no value
        let cardValue = parseInt(card.rank as string); // Type assertion here
        if (isNaN(cardValue)) {
            if (['J', 'Q', 'K'].includes(card.rank as string)) { // Type assertion here
                cardValue = 10;
            } else if (card.rank === 'A') {
                cardValue = 11;
                aces += 1;
            }
        }
        value += cardValue;
    }
    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }
    return value;
};

const isBlackjack = (hand: CardType[]): boolean => {
    if (hand.length !== 2) return false;
    return hand.some(card => card.rank === 'A') && hand.some(card => ['10', 'J', 'Q', 'K'].includes(card.rank as string)); // Type assertion here
}

const GameScreen: React.FC = () => {
    const [dealerDeckCount, setDealerDeckCount] = useState<number>(4);
    const [playerHand, setPlayerHand] = useState<CardType[]>([]);
    const [dealerHand, setDealerHand] = useState<CardType[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<string | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
    const [isDealerFinished, setIsDealerFinished] = useState<boolean>(false);
    const [playerMoney, setPlayerMoney] = useState<number>(500);
    const [currentBet, setCurrentBet] = useState<number>(0);
    const [deckState, setDeckState] = useState(() => { // Initialize deck state outside of game start
        return generateDeck(dealerDeckCount);
    });

    const stopCardReached = useRef(false);

    const dealCard = (currentDeck: CardType[]): [CardType | undefined, CardType[]] => {
        if (currentDeck.length === 0) return [undefined, currentDeck]; // Handle empty deck if needed
        const card = currentDeck[0];
        const remainingDeck = currentDeck.slice(1);

        if (card.rank === 'STOP' && !stopCardReached.current) {
            console.log("Stop card reached!")
            stopCardReached.current = true; // Set stop card as reached
            setGameStarted(false);
            setGameResult("Stop Card Reached! Round Ends in a Push.");
            handleBetOutcome('push'); // Force push when stop card is reached
            return [card, remainingDeck]; // Still return the stop card but game will handle end
        }

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

        if (deckState.length < 20) { // Check if deck is low, regenerate if needed
            setDeckState(generateDeck(dealerDeckCount)); // Replace the deck with a new shuffled deck
            stopCardReached.current = false; // Reset stop card flag for new deck
        }

        handleResetRound();

        let currentDeck = [...deckState];
        const initialPlayerHand: CardType[] = [];
        const initialDealerHand: CardType[] = [];

        let card, updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card && card.rank !== 'STOP') initialPlayerHand.push(card); // Only add if not stop card
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card && card.rank !== 'STOP') initialDealerHand.push(card);
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card && card.rank !== 'STOP') initialPlayerHand.push(card);
        currentDeck = updatedDeck;

        [card, updatedDeck] = dealCard(currentDeck);
        if (card && card.rank !== 'STOP') initialDealerHand.push(card);
        currentDeck = updatedDeck;

        if (card?.rank === 'STOP') {
            handleResetRound()
            return;
        }

        setDeckState(currentDeck);
        setGameStarted(true);
        setPlayerHand(initialPlayerHand);
        setDealerHand(initialDealerHand);
        setPlayerMoney(currentMoney => currentMoney - currentBet);
    };

    const handleResetRound = () => {
        console.log("Resetting round")
        setGameStarted(false);
        setGameResult(null);
        setIsPlayerTurn(true);
        setIsDealerFinished(false);
        stopCardReached.current = false;
    };

    const handleHit = () => {
        if (!gameStarted || !isPlayerTurn) return;
        const [newCard, updatedDeck] = dealCard(deckState); // Deal from deckState
        if (newCard && newCard.rank !== 'STOP') {
            setPlayerHand(currentHand => [...currentHand, newCard]);
            setDeckState(updatedDeck); // Update deck state
        }
    };

    const handleStand = () => {
        if (!gameStarted || !isPlayerTurn) return;
        setIsPlayerTurn(false);
        let currentDeck = [...deckState]; // Use deckState
        let dealerNewHand = [...dealerHand];

        // Simple Dealer AI: hit until hand value is 17 or more
        while (getHandValue(dealerNewHand) < 17 && !stopCardReached.current) { // Check stopCardReached in dealer logic
            const [newCard, updatedDeck] = dealCard(currentDeck);
            if (newCard && newCard.rank !== 'STOP') {
                dealerNewHand = [...dealerNewHand, newCard];
                currentDeck = updatedDeck;
            } else {
                break; // Stop card reached in dealCard
            }
        }
        setDealerHand(dealerNewHand);
        setDeckState(currentDeck); // Update deck state
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
            setIsPlayerTurn(false); // Set isPlayerTurn to false to show both dealer cards
            setGameStarted(false);
            return;
        }

        if (!isDealerFinished && !stopCardReached.current) return; // Wait for dealer to finish or stop card

        if (stopCardReached.current) {
            return; // Game already handled when stop card was dealt
        }

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
    }, [isDealerFinished, playerHand, gameStarted, stopCardReached, dealerHand]);

    return (
        <SafeAreaView style={TableStyles.tableContainer}>
            <View style={TableStyles.titleArea}>
                <Text style={TableStyles.title}>Blackjack</Text>
            </View>

            <View style={TableStyles.moneyArea}>
                <Text style={TableStyles.moneyText}>Money: ${playerMoney}</Text>
                <Text style={TableStyles.moneyText}>Bet: ${currentBet}</Text>
            </View>

            {!gameStarted && (
                <View style={TableStyles.betArea}>
                    <Text style={TableStyles.betText}>Place Your Bet</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <ChipButton 
                            title="-" 
                            onPress={decreaseBet} 
                            disabled={gameStarted || currentBet < 5} 
                            color={TableColors.chipBlue}
                        />
                        <View style={{width: 20}} />
                        <ChipButton 
                            title="+" 
                            onPress={increaseBet} 
                            disabled={gameStarted || playerMoney <= currentBet} 
                            color={TableColors.chipRed}
                        />
                    </View>
                </View>
            )}

            <View style={TableStyles.dealerArea}>
                <Text style={TableStyles.handLabel}>Dealer's Hand</Text>
                <Hand cards={dealerHand} isDealerHand={true} isDealerTurn={isPlayerTurn}/>
                {gameStarted && !isPlayerTurn && (
                    <Text style={TableStyles.handValue}>Value: {getHandValue(dealerHand)}</Text>
                )}
            </View>

            <View style={TableStyles.playerArea}>
                <Text style={TableStyles.handLabel}>Your Hand</Text>
                <Hand cards={playerHand} />
                {gameStarted && (
                    <Text style={TableStyles.handValue}>Value: {getHandValue(playerHand)}</Text>
                )}
            </View>

            <View style={TableStyles.buttonsArea}>
                {!gameStarted ? (
                    <ActionButton 
                        title="Deal Cards" 
                        onPress={startNewGame} 
                        disabled={currentBet <= 0 || currentBet > playerMoney} 
                    />
                ) : isPlayerTurn ? (
                    <>
                        <ActionButton title="Hit" onPress={handleHit} />
                        <ActionButton title="Stand" onPress={handleStand} />
                    </>
                ) : (
                    <ActionButton 
                        title="Play Again" 
                        onPress={startNewGame} 
                        disabled={currentBet <= 0 || currentBet > playerMoney} 
                    />
                )}
            </View>

            {(gameResult || (playerMoney <= 0 && gameStarted)) && (
                <View style={TableStyles.resultArea}>
                    <Text style={TableStyles.resultText}>
                        {playerMoney <= 0 && gameStarted 
                            ? "Game Over! You are out of money." 
                            : gameResult}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

// Using TableStyles imported from constants/TableStyles.ts

export default GameScreen;
