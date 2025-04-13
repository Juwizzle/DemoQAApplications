/// <reference types = 'cypress'/>

describe('QA web application', ()=>{
    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('https://demoqa.com', 
            {failOnStatusCode: false});
    });

    describe('Element Category', () => {
        beforeEach(() => {
            cy.get('.category-cards > :nth-child(1)').click();    
    });

        describe('Element"s Functionality', () => {
            it('Text Box"s Feature', () => {
                cy.contains('Text Box').click();
                cy.url().should('include','/text-box');
                cy.get('h1.text-center').should('contain','Text Box');
                            
                cy.get('#userName').type('Ronaldo Casamigo');
                cy.get('#userEmail').type('ronaldo.casamigo@info.com');
                cy.get('#currentAddress').type('611 N Alta Dr, Beverly Hills, CA 90210');
                cy.get('#permanentAddress').type('1127 Miradero Rd, Beverly Hills, CA 90210');
                cy.get('#submit').click();

                cy.get('p#name').should('be.visible').and('contain','Ronaldo Casamigo');
                cy.get('p#email').should('exist').and('contain','ronaldo.casamigo@info.com');
                cy.get('p#currentAddress').should('be.visible').and('contain','611 N Alta Dr, Beverly Hills, CA 90210');
                cy.get('p#permanentAddress').should('be.visible').and('contain','1127 Miradero Rd, Beverly Hills, CA 90210')
            });

            it('Button"s Feature',() =>{
                cy.contains('Buttons').click();
                cy.url().should('include','/buttons');
                cy.get('h1.text-center').should('contain','Buttons');

                cy.get('#doubleClickBtn').dblclick();
                cy.get('.btn.btn-primary').rightclick({multiple:true}); // OR cy.get('#rightClickBtn').rightclick();
                cy.get('button.btn.btn-primary').click({multiple:true});

                cy.get('p#doubleClickMessage').should('be.visible').and('contain','You have done a double click');
                cy.get('p#rightClickMessage').should('exist').and('contain','You have done a right click');
                cy.get('p#dynamicClickMessage').should('be.visible').and('contain','You have done a dynamic click');
            });

        });
    });

    describe('Alerts, Frame & Windows Functionality', () => {
        beforeEach(() => {
            cy.contains('Alerts, Frame & Windows').click();
            
        });

        describe('Windows Functionality', () =>{
            beforeEach(() => {
                cy.contains('Browser Windows').click();

                cy.url().should('include','/browser-windows');
                cy.get('h1.text-center').should('contain','Browser Windows');
            });
        
            it('New Tab Feature', () => {
                cy.get('#tabButton').invoke('removeAttr','target').click();
                cy.get('#tabButton').then(($a)=>{
                    const newTaburl = $a.prop('href');
                    cy.visit('https://demoqa.com/sample');
                })
                cy.url().should('include','https://demoqa.com/sample');
            });

            it('New Windows Feature', () =>{
                cy.get('button#windowButton').invoke('removeAttr','target').click();
                cy.get('button#windowButton').then(($el)=>{
                    const newWindowURL = $el.prop('href');

                    cy.visit('https://demoqa.com/sample');
                })
                cy.url().should('include','https://demoqa.com/sample')
            });
            
            it('Window Message Feature', () => {
                cy.window().then(win => {
                  cy.stub(win, 'open').callsFake((url, target) => ({ 
                    document: { write: (c) => expect(c).to.include('Knowledge increases by sharing but not by saving') } 
                  }));
                  cy.get('#messageWindowButton').click().should(() => 
                    expect(win.open).calledWith('', 'MsgWindow', 'width=500,height=200')
                  );
                });
            });
        });

        describe('Alerts Functionality', () => {
            beforeEach(() =>{
                cy.contains('Alerts').click();
                cy.url().should('include','/alerts');
                cy.get('.text').should('contain','Alerts');
            });

            it('Click Button to see Alert',()=>{
               cy.get('button').eq(0).click({force:true});
               cy.on('window:alert',(text) => {
                expect(text).to.equal('You clicked a button');
               });
            });

            it('Delay Alert Button', () => {
                cy.get('button').click({force:true});
                cy.wait(5000);
                cy.on('window:alert',(text) =>{
                    expect(text).to.equal('This alert appeared after 5 seconds');
                });
            });

            it('confirm Button', () => {
                
                cy.get('button').click({force:true});
                cy.on('window:confirm',(text) => {
                    expect(text).to.include('Do you confirm action?');
                    return true;
                });
            });

            it('Prompt Button', () => {
                cy.get('button').click({force:true});
                cy.on('window:prompt',(text) => {
                    expect(text).to.include('Please enter your name');
                    return 'Elon Musk';
                });
            });

        });

        describe('Frames Functionality', () => {
            beforeEach(() => {
                cy.contains('Frames').click();
                cy.url().should('include','frames');
                cy.get('h1.text-center').should('contain','Frames');

            })
            it('Frame 1 Feature', () => {
            cy.iframe('iframe#frame1').should('exist').and('be.visible');
            cy.iframe('iframe#frame1').find('h1#sampleHeading').should('contain','This is a sample page'); // Specific Element Check
            //cy.iframe('iframe#frame1').should('contain','This is a sample page'); // Check Broadly (Entire Iframe Content Check)
            });
            it('Frame 2 Features',() => {
                cy.get('iframe#frame2').should('exist').and('be.visible');
                cy.iframe('iframe#frame2').find('h1#sampleHeading').should('contain','This is a sample page');
            });
        });
    });
});