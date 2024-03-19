const collection = document.querySelectorAll('input')
function voice() {
  const dataUse = {
    lang: collection[0].value.replace(/[А-яё/ ]/gi, ''),
    speed: collection[1].value,
    voice: collection[2].value.replace(/[А-яёЁ/ ]/gi, ''),
    emotion: collection[3].value.replace(/[А-яёЁ/ ]/gi, ''),
    text: document.getElementById('VoiceSpeech_text').value
  }
  fetch('http://127.0.0.1:3000/test', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(dataUse)
  }).then(r => r)
  const timerReload = setTimeout(() => {
    location.reload();
    clearTimeout(timerReload)
  },1000)
}

function select (arr, target) {
  let myArr = []
  if (!document.getElementById('modal')) {
    const modal = document.createElement('div')

    if (target.placeholder === 'Голос' || target.placeholder === 'Тип голоса') {
      switch (collection[0].value) {
        case 'Русский / ru_ru':
          myItemModal('ru_ru')
          break
        case 'Казахский / kk-kz':
          myItemModal('kk-kz')
          break
        case 'Узбекский / uz-uz':
          myItemModal('uz-uz')
          break
        case 'Английский / en-us':
          myItemModal('en-us')
          break
        case 'Немецкий / de-de':
          myItemModal('de-de')
          break
      }
    } else {
      myItemModal()
    }
    function myItemModal (lang) {
      myArr = arr.filter(i => i.lang === lang)
      for (let i of myArr) {
        modal.className = 'modal'
        modal.id = 'modal'
        const div = document.createElement('div')
        div.className = 'modalItem'
        target.value === i.value ? div.classList.add('modalItemActive') : div.classList.remove('modalItemActive')
        div.innerText = i.value
        modal.appendChild(div)
      }
    }
    const modalEvent = (event) => {
      target.value = event.target.innerText
      if (target.placeholder === 'Язык') {
        collection[2].value = ''
        collection[3].value = ''
      }
      if (collection[0].value === 'Русский / ru_ru') {
        collection[3].style.display = 'block'
      } else {
        collection[3].style.display = 'none'
      }
      modal.removeEventListener('click', modalEvent)
    }
    modal.addEventListener('click', modalEvent)
    target.parentNode.appendChild(modal)
  } else {
    if (target.parentNode.children.length > 1) {
      target.parentNode.removeChild(target.parentNode.children[1])
    } else {
      document.getElementById('modal').remove()
    }
  }
}
