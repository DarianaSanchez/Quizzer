const Question = function(id, question, options, correctAnswer) {
    this.id = id;
    this.question = question;
    this.options = options;
    this.correctAnswer = correctAnswer;
};

module.exports = {
    Question: Question
};