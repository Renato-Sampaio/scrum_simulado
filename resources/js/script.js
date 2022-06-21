const questionsVarName = 'simScrumQuestions'; // Nome da variável local que armazenará as questões
const configVarName = 'simScrumConfig'; // Nome da variável de armazenamento local que armazenará as notas dos testes e demais necessidades
const numQuestionsTest = 80; //Número de questões do teste
const numQuestionsSuccess = 60; //Número de acertos para ser aprovado

// Cria a página principal da aplicação
const home = function () {
  let config = loadLocalVar(varName = configVarName);
  let questions = loadLocalVar(varName = questionsVarName);
  const continueButton = (questions && questions.length) ? true : false;
  const resultButton = (config && config['tests'].length) ? true : false;
  const body = document.body;
  clearElement(body);
  body.appendChild(createHomeScreen(continueButton, resultButton));
};

// Redireciona para a página principal da aplicação
const quit = function () {
  home();
};

// Adiciona a opção no cartão de pergunta para selecionar a respota
const selectAnswer = function (answer) {
  let config = loadLocalVar(varName = configVarName);
  let questions = loadLocalVar(varName = questionsVarName);
  var list = document.getElementById('answer-options');

  for (option of list.children) {
    if (option['id'] === 'answer-' + answer) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  }

  questions[config['currentQuestion']]['userAnswer'] = answer;
  // Saving changes on the local storage  
  setLocalVar(varName = questionsVarName, varObj = questions);
};

// Função para lidar com as ações dos botões do cartão de perguntas
const navButtons = function (value) {
  let config = loadLocalVar(varName = configVarName);
  let questions = loadLocalVar(varName = questionsVarName);
  const body = document.body;
  clearElement(body);
  switch (value) {
    case 'previous':
      if (config['currentQuestion'] == 0) {
        config['currentQuestion'] = questions.length - 1;
      } else {
        config['currentQuestion'] = Number(config['currentQuestion']) - 1;
      }
      body.appendChild(createCardQuestion(questions[config['currentQuestion']], Number(config['currentQuestion'] + 1), true));
      // Saving changes on the local storage
      setLocalVar(varName = configVarName, varObj = config);
      setLocalVar(varName = questionsVarName, varObj = questions);
      break;
    case 'next':
      if (config['currentQuestion'] == questions.length - 1) {
        config['currentQuestion'] = 0;
      } else {
        config['currentQuestion'] = Number(config['currentQuestion']) + 1;
      }
      body.appendChild(createCardQuestion(questions[config['currentQuestion']], Number(config['currentQuestion'] + 1), true));
      // Saving changes on the local storage
      setLocalVar(varName = configVarName, varObj = config);
      setLocalVar(varName = questionsVarName, varObj = questions);
      break;
    case 'correction':
      correction();
      break;
    case 'quit':
      quit();
      break;
  }
};

// Inicia o teste
const startTest = async function (mode) {

  let config = loadLocalVar(varName = configVarName);
  var questions;
  var cardQuestion;
  const body = document.body;

  if (!config) {
    config = {
      currentQuestion: 0,
      tests: []
    }
    setLocalVar(varName = configVarName, varObj = config);
  }

  if (mode === 'continue') {
    questions = loadLocalVar(varName = questionsVarName);
  } else if (mode === 'new') {
    const allQuestions = await makeRequest('./resources/questions.json');
    questions = sampleList(allQuestions, numQuestionsTest);
    config['currentQuestion'] = 0;
    setLocalVar(varName = questionsVarName, varObj = questions);
    setLocalVar(varName = configVarName, varObj = config);
  }

  clearElement(body);
  cardQuestion = createCardQuestion(questions[config['currentQuestion']], Number(config['currentQuestion'] + 1), true);
  body.appendChild(cardQuestion);

};

// Rotina para corrgir as questões e mostrar o resultado
const correction = function () {

  let config = loadLocalVar(varName = configVarName);
  let questions = loadLocalVar(varName = questionsVarName);
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let blankAnswers = 0;
  let grade = 0;
  var status;
  const body = document.body;

  for (let i = 0; i < questions.length; i++) {

    if (questions[i]['userAnswer'] === questions[i]['correct']) {
      correctAnswers++;
    } else if (questions[i]['userAnswer'] && questions[i]['userAnswer'] != questions[i]['correct']) {
      incorrectAnswers++;
    }
  }

  grade = Math.round(100 * correctAnswers / numQuestionsTest);
  status = (correctAnswers >= numQuestionsSuccess) ? 'Aprovado' : 'Reprovado';
  blankAnswers = numQuestionsTest - correctAnswers - incorrectAnswers;
  const result = createResult(correctAnswers, incorrectAnswers, blankAnswers, grade, status);
  body.appendChild(result);

  for (let i = 0; i < questions.length; i++) {

    const cardQuestion = createCardQuestion(questions[i], i + 1, false);
    const pResult = document.createElement('p');
    const list = cardQuestion.getElementsByTagName('ul')[0];

    cardQuestion.classList.remove('container');
    cardQuestion.classList.add('container-2');
    list.classList.remove('card-options-overable');
    pResult.classList.add('badge', 'border-rounded', 'bg-secondary', 'text-center', 'mt-2');
    if (questions[i]['userAnswer'] === questions[i]['correct']) {
      pResult.innerHTML = "Você acertou!";
    } else if (questions[i]['userAnswer'] && questions[i]['userAnswer'] != questions[i]['correct']) {
      pResult.innerHTML = "Você errou!";
    } else {
      pResult.innerHTML = "Você não respondeu!";
    }
    for (item of list.children) {
      if (item.id === 'answer-' + questions[i]['correct']) {
        item.classList.add('correct');
      }
      if (questions[i]['userAnswer']) {
        if (questions[i]['userAnswer'] != questions[i]['correct'] && item.id === 'answer-' + questions[i]['userAnswer']) {
          item.classList.add('incorrect');
        }
      }
    }
    cardQuestion.firstChild.appendChild(pResult);
    body.appendChild(cardQuestion);
  }

  config['currentQuestion'] = 0;
  config['tests'].push({ 'correctAnswers': correctAnswers, 'incorrectAnswers': incorrectAnswers });
  // Saving changes on the local storage  
  setLocalVar(varName = configVarName, varObj = config);
  removeLocalVar(varName = questionsVarName);
};

// Mostra algumas estatísticas das provas já feitas pelo usuário
const results = function () {
  let config = loadLocalVar(varName = configVarName);
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let blankAnswers = 0;
  let numSuccess = 0;
  var grade;
  var prob;
  var summaryResults;
  const body = document.body;

  for (let test of config['tests']) {
    if (test['correctAnswers'] >= numQuestionsSuccess) {
      numSuccess++;
    }
    correctAnswers += test['correctAnswers'];
    incorrectAnswers += test['incorrectAnswers'];
    blankAnswers += numQuestionsTest - test['correctAnswers'] - test['incorrectAnswers'];
  }

  grade = 100 * correctAnswers / (numQuestionsTest * config['tests'].length);
  prob = 100 * numSuccess / config['tests'].length;
  correctAnswers /= config['tests'].length;
  incorrectAnswers /= config['tests'].length;
  blankAnswers /= config['tests'].length;

  clearElement(body);
  summaryResults = createSummaryResults(config['tests'].length, Math.round(correctAnswers), Math.round(incorrectAnswers), Math.round(blankAnswers), Math.round(grade), Math.round(prob));
  body.appendChild(summaryResults);
};

document.addEventListener('DOMContentLoaded', function () {
  home();
});
