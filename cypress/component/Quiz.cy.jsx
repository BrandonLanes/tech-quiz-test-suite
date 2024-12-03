import React from 'react';
import { mount } from 'cypress/react';
import Quiz from '../../client/src/components/Quiz';
import '../fixtures/questions.json';
import { getQuestions } from '../../client/src/services/questionApi';

describe('Quiz Component', () => {
    const mockQuestions = [
        {
            question: "What is React?",
            answers: [
                { text: "A library for building user interfaces", isCorrect: true },
                { text: "A database", isCorrect: false },
                { text: "An operating system", isCorrect: false },
                { text: "A programming language", isCorrect: false },
            ],
        },
        {
            question: "What is JSX?",
            answers: [
                { text: "JavaScript XML", isCorrect: true },
                { text: "A type of JSON", isCorrect: false },
                { text: "A styling library", isCorrect: false },
                { text: "A database language", isCorrect: false },
            ],
        },
    ];

    beforeEach(() => {
        cy.stub(getQuestions, 'default').resolves(mockQuestions);
    });

    it('should start the quiz, answer questions, and show results', () => {
        mount(<Quiz />);

        cy.contains('Start Quiz').should('be.visible');
        cy.contains('Start Quiz').click();
        cy.contains(mockQuestions[0].question).should('be.visible');
        cy.contains(mockQuestions[0].answers[0].text).click();
        cy.contains(mockQuestions[1].question).should('be.visible');
        cy.contains(mockQuestions[1].answers[0].text).click();

        cy.contains('Quiz Completed').should('be.visible');
        cy.contains(`Your score: 2/${mockQuestions.length}`).should('be.visible');

        cy.contains('Take New Quiz').click();
        cy.contains('Start Quiz').should('be.visible');
    });
});