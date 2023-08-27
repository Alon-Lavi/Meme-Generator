'use strict'

function saveToStorage(key, val) {
	localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
	var val = localStorage.getItem(key)
	return JSON.parse(val)
}

function makeId(length = 6) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return txt
}

function mult(num1, num2, num3) {
	var res = num1 * num2 * num3

	return res
}
