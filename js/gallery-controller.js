'use strict'

function renderGallery() {
	const imgs = getImgs()

	var strHtml = imgs
		.map(img => {
			return `<div class="img-gallery">
                <img src="imgs/imgs-square/${img.url}" onclick="onImgSelect(${img.id})">
              </div>`
		})
		.join('')

	const elGallery = document.querySelector('.images-container')
	elGallery.innerHTML = strHtml
}

function openGallery() {
	document.querySelector('.gallery-container').classList.remove('none')
	document.querySelector('.main-nav .btn-gallery').classList.add('active')
}
