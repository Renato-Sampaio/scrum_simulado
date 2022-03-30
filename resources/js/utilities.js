// Define uma variável de armazenamento local
const setLocalVar = function (varName, varObj) {
  localStorage.setItem(varName, JSON.stringify(varObj));
};

// Carrega uma variável armazenada localmente
const loadLocalVar = function (varName) {
  return JSON.parse(localStorage.getItem(varName));
};

// Remove uma variável de armazenamento local
const removeLocalVar = function (varName) {
  localStorage.removeItem(varName);
};

// Limpa o ceonteúdo do elemento
const clearElement = function (element) {
  element.innerHTML = '';
};

// Cria a tela inicial
const createHomeScreen = function (continueButton = false, resultButton = false) {

  // Criando os elementos
  const divContainer = document.createElement('div');
  const divCard = document.createElement('div');
  const hTitle = document.createElement('h1');
  const textTitle = document.createTextNode('Simulado SCRUM');
  const hSubTitle = document.createElement('h3');
  const textSubTitle = document.createTextNode('TESTE DE APTIDÃO');
  const buttonContinue = document.createElement('div');
  const textButtonContinue = document.createTextNode('Continuar simulado');
  const buttonNew = document.createElement('div');
  const textButtonStart = document.createTextNode('Iniciar simulado');
  const buttonResults = document.createElement('div');
  const textButtonResults = document.createTextNode('Resultados');
  // Estilizando os elementos
  divContainer.classList.add('container', 'flex-items');
  divCard.classList.add('card', 'border-rounded', 'text-center', 'bg-primary');
  hTitle.classList.add('card-title', 'mt-2');
  hSubTitle.classList.add('card-subtitle', 'mt-1', 'mb-3');
  buttonContinue.classList.add('btn', 'btn-primary', 'border-rounded', 'mtb-1', 'mrl-3');
  buttonNew.classList.add('btn', 'btn-primary', 'border-rounded', 'mtb-1', 'mrl-3');
  buttonResults.classList.add('btn', 'btn-primary', 'border-rounded', 'mtb-1', 'mrl-3');
  // Adicionando atributos
  buttonContinue.setAttribute('onclick', 'startTest("continue")');
  buttonNew.setAttribute('onclick', 'startTest("new")');
  buttonResults.setAttribute('onclick', 'results()');
  // Anexando os elementos
  hTitle.appendChild(textTitle);
  hSubTitle.appendChild(textSubTitle);
  buttonContinue.appendChild(textButtonContinue);
  buttonNew.appendChild(textButtonStart);
  buttonResults.appendChild(textButtonResults);
  divContainer.appendChild(divCard);
  divCard.appendChild(hTitle);
  divCard.appendChild(hSubTitle);
  divCard.appendChild(buttonNew);
  if (continueButton) {
    divCard.appendChild(buttonContinue);
  }
  if (resultButton) {
    divCard.appendChild(buttonResults);
  }

  return divContainer;
};

// Cria uma animação de carregamento
const createLoader = function (appendTo) {

  // Criando os elementos
  const divContainer = document.createElement('div');
  const divLoader = document.createElement('div');
  const pInfo = document.createElement('p');
  const textInfo = document.createTextNode('Carregando...');
  // Estilizando os elementos
  divContainer.classList.add('container', 'flex-items', 'flex-dir-col');
  divLoader.classList.add('loader');
  pInfo.classList.add('bg-primary', 'font-secondary', 'border-rounded', 'mtb-3', 'prl-1');
  // Anexando os elementos
  divContainer.appendChild(divLoader);
  divContainer.appendChild(pInfo);
  pInfo.appendChild(textInfo);
  appendTo.appendChild(divContainer);
};

// Cria o cartão de perguntas
const createCardQuestion = function (question, questionNumber, navigationButtons = true) {

  // Criando os elementos
  const divContainer = document.createElement('div');
  const divCard = document.createElement('div');
  const hQuestionNumber = document.createElement('h4');
  const spanQuestionNumber = document.createElement('span');
  const textQuestionNumber = document.createTextNode('Questão ' + questionNumber);
  const divFlex = document.createElement('div');
  const pQuestion = document.createElement('p');
  const textQuestion = document.createTextNode(question['question']);
  const img = document.createElement('img');
  const list = document.createElement('ul');
  const navButtons = document.createElement('nav');
  const pRef = document.createElement('p');
  const aRef = document.createElement('a');
  const textRef = document.createTextNode('Ref.: ' + question['ref']);
  // Criando as opções de resposta
  for (let key in question['options']) {
    // Criando os elementos
    const listItem = document.createElement('li');
    const textListItem = document.createTextNode(question['options'][key]);
    const spanQuestionLetter = document.createElement('span');
    const textQuestionLetter = document.createTextNode(key.toUpperCase());
    // Estilizando os elementos
    if (question['userAnswer'] === key) {
      listItem.classList.add('active');
    }
    spanQuestionLetter.classList.add('badge', 'border-rounded', 'bg-secondary');
    // Definindo atributos  
    listItem.setAttribute('id', `answer-${key}`);
    // Anexando elementos
    list.appendChild(listItem);
    listItem.appendChild(spanQuestionLetter);
    spanQuestionLetter.append(textQuestionLetter);
    listItem.appendChild(textListItem);
  }

  // Criando os botões do cartão
  const buttons = [{ name: 'Anterior', value: 'previous' }, { name: 'Próximo', value: 'next', }, { name: 'Corrigir', value: 'correction' }, { name: 'Sair', value: 'quit' }];
  for (let buttonObj of buttons) {
    // Criando o botão
    const button = document.createElement('button');
    const textButton = document.createTextNode(buttonObj['name']);
    // Estilizando o botão
    button.classList.add('btn', 'btn-primary', 'border-rounded');
    button.setAttribute('onclick', `navButtons("${buttonObj['value']}")`);
    // Anexando o botão
    button.appendChild(textButton);
    navButtons.appendChild(button);
  }

  // Estilizando os elementos
  divContainer.classList.add('container', 'flex-items', 'flex-dir-col');
  divCard.classList.add('card', 'border-rounded', 'bg-primary');
  hQuestionNumber.classList.add('mtb-2');
  divFlex.classList.add('card-flex-items', 'mtb-2');
  spanQuestionNumber.classList.add('badge', 'border-rounded', 'bg-secondary');
  img.classList.add('card-img');
  list.classList.add('card-options', 'card-options-overable');
  navButtons.classList.add('flex-items')
  pRef.classList.add('card-ref', 'mt-3');

  // Adicionando atributos
  img.setAttribute('src', question['img']);
  list.setAttribute('id', 'answer-options');
  pRef.setAttribute('id', 'question-ref');
  aRef.setAttribute('target', '_blank');
  aRef.setAttribute('href', question['ref']);
  navButtons.setAttribute('id', 'nav-buttons');

  // Anexando os elementos
  spanQuestionNumber.appendChild(textQuestionNumber);
  pQuestion.appendChild(textQuestion);

  divContainer.appendChild(divCard);
  hQuestionNumber.appendChild(spanQuestionNumber);
  divCard.appendChild(hQuestionNumber);
  divCard.appendChild(divFlex);
  divFlex.appendChild(pQuestion);
  if (question['img']) {
    divFlex.appendChild(img);
  }
  divCard.appendChild(list);
  if (question['ref']) {
    aRef.appendChild(textRef);
    pRef.appendChild(aRef)
    divCard.appendChild(pRef);
  }
  if (navigationButtons) {
    divCard.appendChild(navButtons);
    addSelectionForAnswers(list);
  }
  return divContainer;
};

// Função para a opção de marcar a resposta e salvá-la posteriormente
const addSelectionForAnswers = function (list) {
  for (let option of list.children) {
    const answer = option['id'].split('-')[1];
    option.setAttribute('onclick', `selectAnswer("${answer}")`);
  }
};

// Cria o cartão com o resumo da prova do usuário
const createResult = function (correctAnswers, incorrectAnswers, blankAnswers, grade, status) {
  // Criando os elementos
  const divContainer = document.createElement('div');
  const divCard = document.createElement('div');
  const hTitle = document.createElement('h3');
  const textTitle = document.createTextNode('Resultado');
  const divContent = document.createElement('div');
  const pCorrect = document.createElement('p');
  const textCorrect = document.createTextNode('Questões corretas: ' + correctAnswers);
  const pIncorrect = document.createElement('p');
  const textIncorrect = document.createTextNode('Questões incorretas: ' + incorrectAnswers);
  const pBlank = document.createElement('p');
  const textBlank = document.createTextNode('Questões em branco: ' + blankAnswers);
  const pGrade = document.createElement('p');
  const textGrade = document.createTextNode('Porcentagem de acerto: ' + grade + '%');
  const pStatus = document.createElement('p');
  const textStatus = document.createTextNode(status);
  const buttonHome = document.createElement('div');
  const textButton = document.createTextNode('Home');
  // Estilizando os elementos
  divContainer.classList.add('container-2', 'flex-items', 'flex-dir-col');
  divCard.classList.add('card', 'border-rounded', 'text-center', 'bg-primary');
  hTitle.classList.add('card-subtitle', 'mt-1', 'mb-2');
  divContent.classList.add('card-content');
  pStatus.classList.add('text-center', 'mtb-3', (status === 'Aprovado') ? 'bg-success' : 'bg-failure');
  buttonHome.classList.add('btn', 'btn-primary', 'border-rounded', 'mt-2');
  // Adicionando atributos
  buttonHome.setAttribute('onclick', 'home()');
  // Anexando os elementos
  hTitle.appendChild(textTitle);
  pCorrect.appendChild(textCorrect);
  pIncorrect.appendChild(textIncorrect);
  pBlank.appendChild(textBlank);
  pGrade.appendChild(textGrade);
  pStatus.appendChild(textStatus);
  buttonHome.appendChild(textButton);
  divContainer.appendChild(divCard);
  divCard.appendChild(hTitle);
  divCard.appendChild(divContent);
  divContent.appendChild(pCorrect);
  divContent.appendChild(pIncorrect);
  divContent.appendChild(pBlank);
  divContent.appendChild(pGrade);
  divCard.appendChild(pStatus);
  divCard.appendChild(buttonHome);

  return divContainer;

};

// Cria o cartão com as estatísticas das provas do usuário
const createSummaryResults = function (numTests, correctAnswers, incorrectAnswers, blankAnswers, grade, prob) {
  // Criando os elementos
  const divContainer = document.createElement('div');
  const divCard = document.createElement('div');
  const hTitle = document.createElement('h3');
  const textTitle = document.createTextNode('Resumo Dos Seus Simulados');
  const divContent = document.createElement('div');
  const pNumTests = document.createElement('p');
  const textNumTests = document.createTextNode('Número de simulados realizados: ' + numTests);
  const pCorrect = document.createElement('p');
  const textCorrect = document.createTextNode('Média de questões corretas: ' + correctAnswers);
  const pIncorrect = document.createElement('p');
  const textIncorrect = document.createTextNode('Média de questões incorretas: ' + incorrectAnswers);
  const pBlank = document.createElement('p');
  const textBlank = document.createTextNode('Média de questões em branco: ' + blankAnswers);
  const pGrade = document.createElement('p');
  const textGrade = document.createTextNode('Nota média: ' + grade + '%');
  const pProb = document.createElement('p');
  const textProb = document.createTextNode('Probabilidade de passar no teste: ' + prob + '%');
  const buttonHome = document.createElement('div');
  const textButton = document.createTextNode('Home');
  // Estilizando os elementos
  divContainer.classList.add('container', 'flex-items');
  divCard.classList.add('card', 'border-rounded', 'text-center', 'bg-primary');
  hTitle.classList.add('card-subtitle', 'mt-1', 'mb-2');
  divContent.classList.add('card-content');
  buttonHome.classList.add('btn', 'btn-primary', 'border-rounded', 'mt-2');
  // Adicionando atributos
  buttonHome.setAttribute('onclick', 'home()');
  // Anexando os elementos
  hTitle.appendChild(textTitle);
  pNumTests.appendChild(textNumTests);
  pCorrect.appendChild(textCorrect);
  pIncorrect.appendChild(textIncorrect);
  pBlank.appendChild(textBlank);
  pGrade.appendChild(textGrade);
  pProb.appendChild(textProb);
  buttonHome.appendChild(textButton);
  divContainer.appendChild(divCard);
  divCard.appendChild(hTitle);
  divCard.appendChild(divContent);
  divContent.appendChild(pNumTests)
  divContent.appendChild(pCorrect);
  divContent.appendChild(pIncorrect);
  divContent.appendChild(pBlank);
  divContent.appendChild(pGrade);
  divContent.appendChild(pProb);
  divCard.appendChild(buttonHome);

  return divContainer;

};

// Faz a consulta na URL especificada e retorna uma promise
const makeRequest = function (url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        resolve(xhr.response);
      } else {
        reject(false);
      }
    };
    xhr.send();
  });
};

// Faz a amostragem de n elementos da lista
const sampleList = function (list, numSamples) {
  copyList = list.slice(0);
  newSampledList = [];
  while (newSampledList.length < numSamples) {
    const randomNumber = Math.floor(Math.random() * copyList.length);
    newSampledList.push(copyList.splice(randomNumber, 1)[0]);
  }
  return newSampledList;
};