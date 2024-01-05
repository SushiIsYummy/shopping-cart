Cypress.config('defaultCommandTimeout', 20000);

it('user navigates to shop page and adds an item to cart', () => {
  cy.visit('http://localhost:5173');
  cy.wait(2000);

  // click on shop
  cy.findByRole('navigation')
    .should('be.visible')
    .findByRole('link', { name: /shop/i })
    .should('be.visible')
    .click();

  // add item to cart
  cy.get('[data-testid="items"]')
    .should('be.visible')
    .find('[data-testid="itemInfo"]')
    .should('be.visible')
    .first()
    .should('be.visible')
    .find('[data-testid="addToCartButton"]')
    .should('be.visible')
    .click();

  // close mini cart
  cy.get('[data-testid="miniCartCloseButton"]').click();

  // check notification (product added)
  cy.get('[data-testid="modalArea"]')
    .should('exist')
    .find('p')
    .first()
    .should('be.visible')
    .contains('Product added to cart');
});

it('user navigates to shop page and adds more than 3 of the same item to cart', () => {
  cy.wait(1000);
  cy.visit('http://localhost:5173');

  cy.wait(2000);
  // click on shop
  cy.findByRole('navigation').findByRole('link', { name: /shop/i }).click();

  // add item to cart
  cy.get('[data-testid="items"]')
    .should('be.visible')
    .find('[data-testid="itemInfo"]')
    .should('be.visible')
    .first()
    .should('be.visible')
    .within(() => {
      cy.get('select').should('be.visible').select('3');
      cy.get('button').should('be.visible').click();
    });

  // close mini cart
  cy.get('[data-testid="miniCartCloseButton"]').click();

  // check notification (product added)
  cy.get('[data-testid="modalArea"]')
    .should('be.visible')
    .find('p')
    .first()
    .contains('Product added to cart');

  // add item to cart (> max quantity)
  cy.get('[data-testid="items"] [data-testid="itemInfo"]')
    .should('be.visible')
    .first()
    .should('be.visible')
    .within(() => {
      cy.get('button').should('be.visible').click();
    });

  // check notification (product not added)
  cy.get('[data-testid="modalArea"]')
    .should('exist')
    .find('p')
    .eq(1)
    .contains('Max 3 quantity allowed per product');
});

it('user clicks on carousel item and adds item to cart', () => {
  cy.visit('http://localhost:5173');
  cy.wait(2000);

  // click on carousel item (navigate to product info page)
  cy.get('.swooper')
    .should('be.visible')
    .first()
    .should('be.visible')
    .find('.product-image')
    .should('be.visible')
    .first()
    .should('be.visible')
    .click();

  // add item to cart
  cy.get('.add-to-cart').should('be.visible').click();

  // check notification (product added)
  cy.get('[data-testid="modalArea"]')
    .should('exist')
    .find('p')
    .eq(0)
    .contains('Product added to cart');
});

it('user clicks on carousel item and adds item with quantity > 3 to cart', () => {
  cy.visit('http://localhost:5173');
  cy.wait(1000);

  // click on carousel item
  cy.get('.swooper')
    .should('be.visible')
    .first()
    .find('.product-image')
    .first()
    .click();

  // add item to cart
  cy.get('.add-to-cart').should('be.visible').and('be.visible').click();

  // check notification (product added)
  cy.get('[data-testid="modalArea"]')
    .find('p')
    .eq(0)
    .contains('Product added to cart');

  // close mini cart
  cy.get('[data-testid="miniCartCloseButton"]').click();

  // add item to cart with quantity 3
  cy.get('.product-info select').should('be.visible').select('3');

  // add item to cart
  cy.get('.product-info .add-to-cart').should('be.visible').click();

  // check notification (product not added)
  cy.get('[data-testid="modalArea"]')
    .should('exist')
    .find('p')
    .should('exist')
    .and('be.visible')
    .eq(1)
    .contains('Max 3 quantity allowed per product');
});

it('user clicks on carousel item, adds item, and navigates to cart page', async () => {
  cy.visit('http://localhost:5173');
  cy.wait(1000);

  // save text of first item on anime carousel
  cy.get('.swooper')
    .first()
    .find('.product-image')
    .first()
    .find('.title')
    .invoke('text')
    .as('itemTitle');

  // click first item on anime carousel
  cy.get('.swooper').first().find('.product-image').first().click();

  // add item to cart
  cy.get('.add-to-cart').should('be.visible').click();

  // click view cart button, navigate to cart page
  cy.get('[data-testid="viewCartButton"]').should('be.visible').click();

  // check that item added is on cart page
  cy.get('@itemTitle').then((myValue) => {
    cy.get('[data-testid="cartItems"] [data-testid="cartItem"]')
      .should('be.visible')
      .first()
      .should('be.visible')
      .find('[data-testid="productTitle"]')
      .should('be.visible')
      .should('have.text', myValue);
  });
});
