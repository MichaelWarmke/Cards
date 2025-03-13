import { StyleSheet } from 'react-native';

// Colors for the blackjack table
export const TableColors = {
  feltGreen: '#0B6623', // Dark green for the main table felt
  feltGreenDark: '#074d1b', // Darker green for borders and accents
  feltGreenLight: '#0d7a2a', // Lighter green for highlights
  woodBrown: '#8B4513', // Brown for the table edge/rim
  goldAccent: '#FFD700', // Gold for decorative elements
  chipRed: '#E81C0D', // Red for poker chips
  chipBlue: '#0C4DA0', // Blue for poker chips
  chipGreen: '#097053', // Green for poker chips
  chipBlack: '#000000', // Black for poker chips
  white: '#FFFFFF', // White for text and highlights
};

// Styles for the blackjack table
export const TableStyles = StyleSheet.create({
  // Main container with felt background
  tableContainer: {
    flex: 1,
    backgroundColor: TableColors.feltGreen,
    padding: 20,
    borderWidth: 10,
    borderColor: TableColors.woodBrown,
  },
  
  // Title area with decorative elements
  titleArea: {
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: TableColors.goldAccent,
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: TableColors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Money display area
  moneyArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: TableColors.feltGreenDark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: TableColors.goldAccent,
  },
  
  moneyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TableColors.white,
  },
  
  // Betting area with chip-like styling
  betArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: TableColors.feltGreenLight,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: TableColors.goldAccent,
  },
  
  betText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TableColors.white,
    marginRight: 15,
  },
  
  betButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  
  betButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: TableColors.chipRed,
    borderWidth: 2,
    borderColor: TableColors.white,
  },
  
  betButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TableColors.white,
  },
  
  // Hand areas with decorative borders
  dealerArea: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: TableColors.feltGreenLight,
    borderWidth: 1,
    borderColor: TableColors.goldAccent,
    alignItems: 'center',
  },
  
  playerArea: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: TableColors.feltGreenLight,
    borderWidth: 1,
    borderColor: TableColors.goldAccent,
    alignItems: 'center',
  },
  
  handLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TableColors.white,
    marginBottom: 10,
  },
  
  handValue: {
    fontSize: 16,
    color: TableColors.white,
    marginTop: 5,
  },
  
  // Game control buttons
  buttonsArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: TableColors.woodBrown,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: TableColors.goldAccent,
  },
  
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TableColors.white,
  },
  
  // Game result display
  resultArea: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
  },
  
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TableColors.white,
    textAlign: 'center',
  },
});