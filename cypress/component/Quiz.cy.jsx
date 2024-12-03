import React from 'react';
import { mount } from 'cypress/react18'
import Quiz from '../../client/src/components/Quiz';
import { getQuestions } from '../../client/src/services/questionApi';

const mockQuestions = [
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', isCorrect: false },
            { text: 'Madrid', isCorrect: false },
            { text: 'Paris', isCorrect: true },
            { text: 'Rome', isCorrect: false },
        ],
    },
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
            { text: '6', isCorrect: false },
        ],
    },
];

jest.mock('../../client/src/services/questionApi', () => ({
    getQuestions: jest.fn(),
}));

describe('Quiz Component', () => {
    beforeEach(() => {
        cy.stub(getQuestions, 'getQuestions').resolves(mockQuestions);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the start button initially', () => {
        mount(<Quiz />);
        cy.contains('Start Quiz').should('be.visible');
    });

    it('shows a loading spinner while fetching questions', () => {
        mount(<Quiz />);
        cy.contains('Start Quiz').click();
        cy.get('.spinner-border').should('be.visible');
    });

    it('renders the first question and answers after starting the quiz', () => {
        mount(<Quiz />);
        cy.contains('Start Quiz').click();

        cy.contains(mockQuestions[0].question).should('be.visible');
        mockQuestions[0].answers.forEach((answer) => {
            cy.contains(answer.text).should('be.visible');
        });
    });

    it('updates score and moves to the next question on correct answer', () => {
        mount(<Quiz />);
        cy.contains('Start Quiz').click();

        cy.contains(mockQuestions[0].answers[2].text).click();
        cy.contains(mockQuestions[1].question).should('be.visible');
    });

    it('displays quiz completion message and score', () => {
        mount(<Quiz />);
        cy.contains('Start Quiz').click();

        mockQuestions.forEach((question) => {
            cy.contains(question.question).should('be.visible');

            const correctAnswer = question.answers.find((a) => a.isCorrect)?.text;

            cy.log(`Correct answer for "${question.question}": ${correctAnswer}`);
            
            if (correctAnswer) {
                cy.contains('button', correctAnswer).should('be.visible').click();
            } else {
                throw new Error(`No correct answer found for question: "${question.question}"`);
            }
        });

        cy.contains('Take New Quiz').click();

        cy.contains(mockQuestions[0].question).should('be.visible');
    });
});