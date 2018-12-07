import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: 282,
    backgroundColor: '$primaryBackgroundColor',
  },
  safeArea: {
    backgroundColor: '$primaryBackgroundColor',
  },
  body: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '$primaryBackgroundColor',
    height: 216,
  },
  description: {
    textAlignVertical: 'center',
    color: '$primaryDarkGray',
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '$primaryDarkGray',
    marginBottom: 16,
  },
  mascot: {
    position: 'absolute',
    width: 180,
    height: 247,
    marginTop: 55,
    right: -20,
  },
  titleText: {
    alignSelf: 'center',
    marginTop: 20,
    marginLeft: 32,
    width: '$deviceWidth / 4',
  },
  headerRow: {
    width: '$deviceWidth',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '$primaryBackgroundColor',
  },
  logo: {
    width: 32,
    height: 32,
    marginLeft: 32,
    alignSelf: 'center',
  },
  headerButton: {
    margin: 10,
    marginRight: 19,
    alignSelf: 'center',
  },
});
