'use strict';

angular.module('insight.currency').controller('CurrencyController',
  function($scope, $rootScope, Currency) {
    $rootScope.currency.symbol = defaultCurrency;

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;

      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    var _commaDelimit = function(str) {
        var delimiter = '.';
        var splitedNum = String(str).toString().split(delimiter); 
        if(splitedNum[1] !== undefined){
          return splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,') + delimiter + splitedNum[1];
        }else{
          return splitedNum[0].replace(/(\d)(?=(\d{3})+$)/g , '$1,');
        }
    };

    $rootScope.currency.getConvertion = function(value) {
      value = value * 1; // Convert to number

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'Mocha') {
          this.factor = 10000;
          response = _roundFloat((value * this.factor), 0);
        } else if (this.symbol === 'mXPC') {
          this.factor = 1000;
          response = _roundFloat((value * this.factor), 1);
        } else { // assumes symbol is XPC
          this.factor = 1;
          response = _roundFloat((value * this.factor), 4);
        }
        // prevent sci notation
        if (response < 1e-3) response=response.toFixed(4);

        return _commaDelimit(response) + ' ' + this.symbol;
      }

      return 'value error';
    };

    $rootScope.currency.getSignConvertion = function(value) {
      value = value * 1; // Convert to number
      isminus = false;
      if(value < 0){
        isminus = true;
        value = Math.abs(value);
      }

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'Mocha') {
          this.factor = 10000;
          response = _roundFloat((value * this.factor), 0);
        } else if (this.symbol === 'mXPC') {
          this.factor = 1000;
          response = _roundFloat((value * this.factor), 1);
        } else { // assumes symbol is XPC
          this.factor = 1;
          response = _roundFloat((value * this.factor), 4);
        }
        // prevent sci notation
        if (response < 1e-3) response=response.toFixed(4);

        if(!isminus){
          return '+ ' + _commaDelimit(response) + ' ' + this.symbol;
        }else{
          return '- ' + _commaDelimit(response) + ' ' + this.symbol;
        }
      }

      return 'value error';
    };

    $scope.setCurrency = function(currency) {
      $rootScope.currency.symbol = currency;
      localStorage.setItem('insight-currency', currency);

      if (currency === 'USD') {
        Currency.get({}, function(res) {
          $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
        });
      } else if (currency === 'Mocha') {
        $rootScope.currency.factor = 10000;
      } else if (currency === 'mXPC') {
        $rootScope.currency.factor = 1000;
      } else {
        $rootScope.currency.factor = 1;
      }
    };

    // Get initial value
    Currency.get({}, function(res) {
      $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
    });

  });
