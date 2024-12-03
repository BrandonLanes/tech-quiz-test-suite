describe('Quiz Component', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/questions', {
            statusCode: 200,
            body: [
                {
                    question: 'What is 2 + 2?',
                    answers: [
                        { text: '3', isCorrect: false },
                        { text: '4', isCorrect: true },
                        { text: '5', isCorrect: false },
                    ],
                },
                {
                    question: 'What is the capital of France?',
                    answers: [
                        { text: 'Berlin', isCorrect: false },
                        { text: 'Madrid', isCorrect: false },
                        { text: 'Paris', isCorrect: true },
                    ],
                },
            ],
        }).as('getQuestions');

        cy.visit('/');
    });

    it('should display the start button initially', () => {
        cy.contains('Start Quiz').should('be.visible');
    });

    it('should start the quiz and display questions', () => {
        cy.contains('Start Quiz').click();
        cy.wait('@getQuestions');
        cy.contains('What is 2 + 2?').should('be.visible');
    });
    
    it('should navigate through questions and update score', () => {
        cy.contains('Start Quiz').click();
        cy.wait('@getQuestions');
        cy.contains('3').click();
        cy.contains('What is the capital of France?').should('be.visible');
        cy.contains('Paris').click();
        cy.contains('Quiz Completed').should('be.visible');
        cy.contains('Your score: 1/2').should('be.visible');
    });

    it('should allow retaking the quiz', () => {
        cy.contains('Start Quiz').click();
        cy.wait('@getQuestions');
        cy.contains('4').click();
        cy.contains('What is the capital of France?').should('be.visible');
        cy.contains('Paris').click();
        cy.contains('Quiz Completed').should('be.visible');
        cy.contains('Take New Quiz').click();
        cy.contains('What is 2 + 2?').should('be.visible');
    });
});