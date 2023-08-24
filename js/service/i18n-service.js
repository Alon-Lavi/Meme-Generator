'use strict'

const DEFAULT_LANG = 'en'
var gCurrLang = DEFAULT_LANG

var gTrans = {
	'nav-gallery': {
		en: 'Gallery',
		he: 'גלריה',
	},
	'nav-memes': {
		en: 'Memes',
		he: 'התמונות שלי',
	},
	'upload-img-text': {
		en: 'Upload an image',
		he: 'העלה תמונה',
	},
	'search-placeholder': {
		en: 'search',
		he: 'חפש',
	},
	'btn-save': {
		en: 'Save',
		he: 'שמור',
	},
	'btn-download': {
		en: 'Download',
		he: 'הורדה',
	},
	'btn-share': {
		en: 'Share',
		he: 'שתף',
	},
	'btn-delete': {
		en: 'Delete',
		he: 'מחק',
	},
	'modal-text': {
		en: 'Saved!',
		he: 'נשמר!',
	},
}

function setLang(lang) {
	gCurrLang = lang
}

function doTrans() {
	const els = document.querySelectorAll('[data-trans]')

	els.forEach(el => {
		const transKey = el.dataset.trans
		if (el.nodeName === 'INPUT') {
			el.placeholder = getTrans(transKey)
		} else {
			el.innerText = getTrans(transKey)
		}
	})
}

function getTrans(transKey) {
	const tranLangsMap = gTrans[transKey]
	if (!tranLangsMap) return gTrans['UNKNOWN'][gCurrLang]

	const word = tranLangsMap[gCurrLang]

	if (!word) return tranLangsMap[DEFAULT_LANG]

	return word
}
