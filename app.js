const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

let data = null;

try {
  data = JSON.parse(sourceJson);
} catch (error) {
  data = null;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const selection = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked
  };

  const items = services
    .filter(function (service) {
      return selection[service.id] === true;
    })
    .map(function (service) {
      const { title, price } = service;
      return { title: title.trim(), price: price };
    });

  const total = items.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  return {
    count: items.length,
    total: total,
    items: items
  };
}

function hideResult() {
  resultBlock.hidden = true;
  reportJsonBlock.hidden = true;
}

function handleShowProgram() {
  programBlock.innerHTML = data.event.meeting;
  programBlock.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked
  );

  if (report.count === 0) {
    choiceError.hidden = false;
    hideResult();
    return;
  }

  choiceError.hidden = true;

  const reportJson = JSON.stringify(report);

  try {
    JSON.parse(reportJson);
  } catch (error) {
    dataError.hidden = false;
    hideResult();
    return;
  }

  const titles = report.items.map(function (item) {
    return item.title;
  });

  resultBlock.innerHTML =
    'Выбрано услуг: ' + report.count +
    '<br>Итого: ' + report.total + ' руб.' +
    '<br>' + titles.join('<br>');

  reportJsonBlock.textContent = reportJson;

  resultBlock.hidden = false;
  reportJsonBlock.hidden = false;
}

if (data === null) {
  dataError.hidden = false;
  serviceForm.hidden = true;
} else {
  serviceForm.hidden = false;
  showProgramButton.addEventListener('click', handleShowProgram);
  serviceForm.addEventListener('submit', handleSubmit);
}