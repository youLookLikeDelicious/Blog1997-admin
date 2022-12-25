// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// Cypress.Commands.add('login', function () {
// })
import '@4tw/cypress-drag-drop'

Cypress.Commands.add('draganddrop', (dragSelector, dropSelector) => {
  // cy.get(dragSelector).should('exist')
  // cy.get(dropSelector).should('exist')

  const draggable = Cypress.$(dragSelector)[0]; // Pick up this
  const droppable = Cypress.$(dropSelector)[0] // Drop over this
console.log(draggable, '-----------')
  const coords = droppable.getBoundingClientRect()
  draggable.dispatchEvent(new DragEvent('dragstart', { dataTransfer: new DataTransfer }));
  // draggable.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 0 }));
  draggable.dispatchEvent(new DragEvent('drop', {
      dataTransfer: new DataTransfer,
      clientX: coords.left,
      clientY: coords.top + 12  // A few extra pixels to get the ordering right
  }));
  draggable.dispatchEvent(new DragEvent('dragend', { dataTransfer: new DataTransfer }));
  return cy.get(dropSelector);
})