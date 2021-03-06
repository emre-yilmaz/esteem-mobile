import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    height: '$deviceHeight - 100',
    backgroundColor: '$primaryBackgroundColor',
  },
  userDescription: {
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: 8,
  },
  voteItemWrapper: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
  },
  voteItemWrapperGray: {
    backgroundColor: '$primaryGray',
  },
  name: {
    color: '$primaryDarkGray',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: '$primaryFont',
  },
  reputation: {
    fontWeight: 'normal',
    fontFamily: '$primaryFont',
  },
  value: {
    color: '$primaryBlue',
    fontSize: 14,
    fontFamily: '$primaryFont',
    fontWeight: 'bold',
  },
  valueGray: {
    color: '$iconColor',
  },
  rightWrapper: {
    textAlign: 'center',
    alignItems: 'center',
  },
  text: {
    color: '$iconColor',
    fontSize: 12,
    fontFamily: '$primaryFont',
  },
  avatar: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '$borderColor',
    borderRadius: 32 / 2,
  },
});
