'use strict';

const logoutButtonInstanse = new LogoutButton();
const ratesInstanse = new RatesBoard();
const moneyManagerInstanse = new MoneyManager();
const favoritesWidgetInstanse = new FavoritesWidget();

const checkLogoutStatus = (status) => {
  if (status) {
    location.reload();
  }
};

logoutButtonInstanse.action = () => {
  ApiConnector.logout((response) => checkLogoutStatus(response));
};

const showUserInfo = (response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
};

ApiConnector.current((response) => showUserInfo(response));

const showStocks = (response) => {
  if (response.success) {
    ratesInstanse.clearTable();
    ratesInstanse.fillTable(response.data);
  }
};

const updateStocks = () =>
  ApiConnector.getStocks((response) => showStocks(response));
updateStocks();
setInterval(() => updateStocks(), 60000);

const addMoneyHandler = (response) => {
  console.log(response);
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
  moneyManagerInstanse.setMessage(
    response.success,
    response.error || 'Операция завершена успешно'
  );
};

moneyManagerInstanse.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => addMoneyHandler(response));
};

moneyManagerInstanse.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => addMoneyHandler(response));
};

moneyManagerInstanse.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => addMoneyHandler(response));
};

const showFavorites = (response, showMessage) => {
  if (response.success) {
    favoritesWidgetInstanse.clearTable();
    favoritesWidgetInstanse.fillTable(response.data);
    moneyManagerInstanse.updateUsersList(response.data);
  }
  if (showMessage) {
    favoritesWidgetInstanse.setMessage(
      response.success,
      response.error || 'Операция завершена успешно'
    );
  }
};

ApiConnector.getFavorites((response) => showFavorites(response, false));

favoritesWidgetInstanse.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) =>
    showFavorites(response, true)
  );
};

favoritesWidgetInstanse.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) =>
    showFavorites(response, true)
  );
};