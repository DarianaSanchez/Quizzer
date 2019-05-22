const fetch = require('node-fetch');
const config = require('../config.json');
const utils = require('./utils');
const question_model = require('./models/question');

const dummyQuestion = new question_model.Question(
    -1,
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    ["It was popularised in the 1960s with the release of Letraset sheets",
     "It's not simply random text.",
     "It has roots in a piece of classical Latin literature from 45 BC.", 
     "Many web page editors now use Lorem Ipsum"],
     ""
 );

function formatJsonToObject(json){
    let questions = [];

    // TODO: decode texts to render special characters correctly in the frontend
    for(const[index, value] of json.results.entries()){
        let question = new question_model.Question(
            index,
            value.question,
            value.incorrect_answers.concat(value.correct_answer),
            value.correct_answer
        );

        questions.push(question);
    }

    return questions;
}

const getTriviaQuestions = async() => {
     //TODO: make category selectable but in the meantime it'll be set randomly
    const category = Math.round(Math.random() * (33 - 9));

    const response = await fetch(utils.injectString(config.app.api_url, [category])); 
    const jsonData = await response.json();  
    const apiQuestions = formatJsonToObject(jsonData);
    return apiQuestions;
};

module.exports = {
    dummyQuestion: dummyQuestion,
    getTriviaQuestions: getTriviaQuestions
};