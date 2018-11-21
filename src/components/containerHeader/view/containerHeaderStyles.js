import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  wrapper: {
    width: '$deviceWidth',
    height: 50,
    backgroundColor: '$primaryBackgroundColor',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hasTopBorder: {
    borderTopColor: '#cfcfcf',
    borderTopWidth: 1,
  },
  title: {
    fontFamily: '$primaryFont',
    alignSelf: 'center',
    color: '$primaryDarkGray',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 32,
    width: '$deviceWidth - 64',
  },
  centerTitle: {
    textAlign: 'center',
  },
  icon: {
    alignSelf: 'center',
    color: '$iconColor',
    fontSize: 18,
    marginRight: 32,
  },
});
