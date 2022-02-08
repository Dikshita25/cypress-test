import HeaderPage from './headerPage';

class BasePage {
  static get generalLocators() {
    return {
      analyticsIframe: 'analytics-dashboard-iframe',
      anchorElement: 'a',
      arrowPickerLeft: 'period-picker-left',
      arrowPickerRight: 'period-picker-right',
      buttonClearMessage: '[ng-click="clearMessage()"]',
      buttonElement: 'button',
      cssAlertWarning: '.alert.alert-warning',
      cssCheckboxChecked: 'option-input-checked',
      cssCheckBoxSelector: '[type="checkbox"]',
      cssCheckboxSkined: '.option-input-skinned',
      cssChosenItem: '#select2-chosen-2',
      cssDatePickerCentralButton: '.btn.btn-default.btn-sm.uib-title',
      cssDatePickerNextButton: '.btn.btn-default.btn-sm.pull-right.uib-right',
      cssDropdownMenu: '.dropdown-menu',
      cssRadioButtonChecked: 'radio-input-checked',
      cssRadioInputSkinned: '.radio-input-skinned',
      cssRadioSelector: '[type="radio"]',
      cssSelectArrow: '.select2-arrow',
      cssSelect2Result: '.select2-result-label',
      cssSelect2ChosenOption: '.select2-chosen',
      inputDatePickerLeft: 'date-picker-left',
      inputDatePickerRight: 'date-picker-right',
      inputElement: 'input',
      inputSearchDropdown: '.dropdown-search',
      inputSelect2: '.select2-input',
      flashMessageText: 'flash-message-text',
      flashMessageCrossIcon: 'button.icon-cross',
      goalModeButton: 'goal-mode-notice-button',
      labelBlockError: '.block-error',
      labelCsvError: '.csv-list-error',
      labelInlineError: '.inline-error',
      labelInfoError: '[ng-bind-html="info.error"]',
      labelNavBarLogoImage: 'navbar-logo-img',
      labelNavBarProfileImage: 'navbar-profile-img',
      listElement: 'li',
      loadingIndicator: 'loading-indicator',
      pageContainer: 'page-container',
      peoplePickerList: 'people-picker-list',
      periodPicker: 'period-picker-label',
      radioInput: 'radio-input',
      repeaterItemsInItems: '[ng-repeat="item in items"]',
      repeaterOptionsInDatePicker: '[ng-repeat="dt in row"]',
      repeaterValueInRawValues: '[ng-repeat="value in row.values"]',
      searchField: 'search-field',
      settingSearchInput: 'setting-search-input',
      settingSearchInputWrapper: 'setting-search-input-wrapper',
      settingSearchResults: 'setting-search-results',
      textareaElement: 'textarea',
      textStrong: '.text-strong',
      toggleSwitch: 'toggle-switch',
      tooltip: '.tooltip-inner',
      trialFirstTimeModal: 'feedback-ftu-modal',
      trialInviteBtn: 'trial-invite-button',
      trialInviteModal: 'trial-invite-modal',
      tutorialBubble: 'tutorial-bubble',
      uploadInput: '.upload',
      userSearchList: 'user-name-list',
      warningModal: {
        btnCancel: 'warning-modal-decline',
        btnConfirm: 'warning-modal-accept',
        body: 'warning-modal-body',
        btnClose: 'notifications-modal-close',
      },
    };
  }

  static get getInput() {
    return {
      CHECKBOX: 'checkbox',
      RADIO: 'radio',
    };
  }

  constructor() {
    this.basicLocators = BasePage.generalLocators;

    this.inputType = BasePage.getInput;
  }

  /**
   *  Assert alert with text is displayed
   * @param alert - string, aler text
   */
  assertAlertWarningTextIs(alert) {
    cy
      .get(BasePage.generalLocators.cssAlertWarning)
      .should('be.visible')
      .and('contain', alert);

    return this;
  }

  /**
   * Verify the text in the csv error displayed is
   * @param {String} message
   */
  assertCsvErrorIs(message) {
    cy.get(BasePage.generalLocators.labelCsvError).should('contain', message);

    return this;
  }

  /**
   * Verify that no error is displayed
   */
  assertErrorIsNotDisplayed() {
    cy.get(BasePage.generalLocators.labelInlineError).should('not.be.visible');

    return this;
  }

  /**
   * Verify the text in the inline error displayed is
   * @param {String} message
   */
  assertInlineErrorIs(message) {
    cy.get(BasePage.generalLocators.labelInlineError).should('contain', message);

    return this;
  }

  /**
   * Verify the text in the info error displayed is
   * @param {String} message
   */
  assertInfoErrorIs(message) {
    cy.get(BasePage.generalLocators.labelInfoError).should('contain', message);

    return this;
  }

  /**
   * Verify the value of the top flash message once an action is completed
   * @param {String} message
   */
  assertFlashMessageIs(message) {
    cy.bwGet(BasePage.generalLocators.flashMessageText).should('contain', message);
    this.closeFlashMessage();

    return this;
  }

  /**
   * Assert select2 dropdown option exist in list
   * @param {String} option
   */
  assertSelect2DropdownOptionExistInList(option) {
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(option)
      .should('exist');

    return this;
  }

  /**
   *  Assert warning alert is not displayed
   */
  assertNoAlertWarningIsDisplayed() {
    cy.get(BasePage.generalLocators.cssAlertWarning).should('not.exist');

    return this;
  }

  /**
   *  Assert flash message is not displayed
   */
  assertNoflashMessageIsDisplayed() {
    cy.bwGet(BasePage.generalLocators.flashMessageText).should('not.be.visible');

    return this;
  }

  /**
   * Verify that an item does NOT exist in a dropdown
   * @param locator - dropdown locator
   * @param item - item we are looking for
   */
  assertDropdownItemDoesNotExist(locator, item) {
    this.openDropdown(locator);
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(item)
      .should('not.exist');
  }

  /**
   * Verify that an item does exist in a dropdown
   * @param locator - dropdown locator
   * @param item - item we are looking for
   */
  assertDropdownItemExists(locator, item) {
    this.openDropdown(locator);
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(item)
      .should('exist');
  }

  /**
   * Verify that a dropdown has a specific option selected
   * @param dropdownLocator - element locator used for select dropdown element
   * @param option - option that we are expecting to be selected
   */
  assertDropdownSelectedOptionIs(dropdownLocator, option) {
    cy
      .bwGet(dropdownLocator)
      .first()
      .get(BasePage.generalLocators.cssSelect2ChosenOption)
      .contains(option)
      .should('exist');

    return this;
  }

  /**
   *  Assert element to be visible or not present
   * @param editor - user/department name
   * @param present - true/false
   */
  assertElementVisibleOrNotPresent($el, present) {
    cy.wrap($el).should(present ? 'be.visible' : 'not.exist');

    return this;
  }

  /**
   * Verify that a dropdown has more than one option available
   */
  assertDropdownHasOptions() {
    cy.get(BasePage.generalLocators.cssSelect2Result).should('have.length.greaterThan', 1);

    return this;
  }

  /**
   * Assert no error in link modal
   */
  assertNoErrorInAddLinkModal() {
    cy.bwGet(BasePage.generalLocators.labelInlineError).should('not.exist');

    return this;
  }

  /**
   * Verify that an option exists in a dropdown - when dropdown needs to be handled differently
   * @param {String} option
   */
  assertOptionExists(option) {
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(option)
      .should('exist');

    return this;
  }

  /**
   * Verify that value of a tooltip is correct
   * @param {String} tooltip
   */
  assertTooltipIs(tooltip) {
    cy.get(BasePage.generalLocators.tooltip).should('contain', tooltip);

    return this;
  }

  /**
   * Verify that trial first time user modal is displayed
   */
  assertTrialFirstTimeUserModalIsDisplayed() {
    cy.bwGet(BasePage.generalLocators.trialFirstTimeModal).should('exist');

    return this;
  }

  /**
   * Verify that trial first time user modal is not displayed
   */
  assertTrialFirstTimeUserModalIsNotDisplayed() {
    cy.bwGet(BasePage.generalLocators.trialFirstTimeModal).should('not.exist');

    return this;
  }

  /**
   * Verify that invite modal is displayed
   */
  assertTrialInviteModalExists() {
    cy.bwGet(BasePage.generalLocators.trialInviteModal).should('exist');

    return this;
  }

  /**
   * Verify that tutorial bubble is  displayed
   */
  assertTutorialBubbleIsDisplayed() {
    cy.bwGet(BasePage.generalLocators.tutorialBubble).should('be.visible');

    return this;
  }

  /**
   * Verify that tutorial bubble is not displayed
   */
  assertTutorialBubbleIsNotDisplayed() {
    cy.bwGet(BasePage.generalLocators.tutorialBubble).should('not.be.visible');

    return this;
  }

  /**
   * Assert url contains
   * @param {String} url
   */
  assertUrlContains(url) {
    cy.url().should('include', url);

    return this;
  }

  /**
   * Assert url does not contain an url
   * @param {String} url
   */
  assertUrlDoesNotContain(url) {
    cy.url().should('not.include', url);

    return this;
  }

  /**
   * Assert warning modal is displayed
   */
  assertWarningModalIsDisplayed() {
    cy.bwGet(BasePage.generalLocators.warningModal.body).should('be.visible');

    return this;
  }

  /**
   *  Press confirm in warning modal
   */
  confirmInWarningModal() {
    cy.bwGet(BasePage.generalLocators.warningModal.btnConfirm).click();

    return this;
  }

  /**
   *  Press confirm in goal mode modal
   */
  confirmInGoalModeModal() {
    cy.bwGet(BasePage.generalLocators.goalModeButton).click();

    return this;
  }

  /**
   *  Press cancel in warning modal
   */
  cancelInWarningModal() {
    cy.bwGet(BasePage.generalLocators.warningModal.btnCancel).click();

    return this;
  }

  /**
   * Close the alert message shown
   */
  closeFlashMessage() {
    cy
      .bwGet(BasePage.generalLocators.flashMessageText)
      .siblings(BasePage.generalLocators.flashMessageCrossIcon)
      .click({ force: true });

    return this;
  }

  /**
   *  Press ok in warning modal
   */
  closeInWarningModal() {
    cy.bwGet(BasePage.generalLocators.warningModal.btnClose).click();

    return this;
  }

  /**
   * Close flash message displayed
   * @param {String} message
   */
  clearFlashMessage(message) {
    cy
      .bwGet(BasePage.generalLocators.flashMessageText)
      .contains(message)
      .parent()
      .find(BasePage.generalLocators.buttonClearMessage)
      .click();

    return this;
  }

  /**
   *  Get NavBar Component Into Base
   */
  fromNavBar() {
    return new HeaderPage();
  }

  getIframeBody() {
    return this.getIframeDocument()
      .its('body')
      .should('not.be.undefined')
      .then(cy.wrap);
  }

  getIframeDocument() {
    return cy
      .bwGet(BasePage.generalLocators.analyticsIframe)
      .last()
      .its('0.contentDocument')
      .should('exist');
  }

  /**
   *  Click on selectbox and on desired option from dropdown list
   * @param dropdownLocator - element locator used for select dropdown element
   * @param option - option that needs to be selected from the list
   */
  getItemFromSelect2Dropdown(dropdownLocator, option) {
    cy
      .bwGet(dropdownLocator)
      .first()
      .click();
    return cy.get(BasePage.generalLocators.cssSelect2Result).contains(option);
  }

  /**
   *  Click on selectbox and search for option
   * @param dropdownLocator - element locator used for select dropdown element
   * @param option - option that needs to be selected from the list
   */
  getItemFromSelect2DropdownWithSearch(dropdownLocator, option) {
    cy
      .bwGet(dropdownLocator)
      .first()
      .click();
    cy
      .get(BasePage.generalLocators.inputSelect2)
      .last()
      .type(option, { force: true });
    return cy.get(BasePage.generalLocators.cssSelect2Result).contains(option);
  }

  /**
   * Get the selected option from a dropdown as a String
   */
  getSelectedOption(locator) {
    return cy
      .bwGet(locator)
      .first()
      .get(BasePage.generalLocators.cssSelect2ChosenOption)
      .invoke('text');
  }

  /**
   * Navigate back
   */
  goBack() {
    cy.go('back');

    return this;
  }

  /**
   * Logout current user
   */
  logout() {
    this.fromNavBar().navigateToDropdownOption('Log Out');
  }

  /**
   * Click on a dropdown in order to see its options
   * @param {Locator} dropdownLocator
   */
  openDropdown(dropdownLocator, parent) {
    if (parent) {
      parent
        .bwFind(dropdownLocator)
        .first()
        .click();
    } else {
      cy
        .bwGet(dropdownLocator)
        .first()
        .click();
    }
    return this;
  }

  assertDropDownExist(status, dropdownLocator, parent) {
    if (parent) {
      parent
        .bwFind(dropdownLocator)
        .first()
        .should(status ? 'exist' : 'not.exist');
    } else {
      cy
        .bwGet(dropdownLocator)
        .first()
        .should(status ? 'exist' : 'not.exist');
    }
    return this;
  }

  /**
   * Press trial invites button (email icon)
   */
  openInvites() {
    cy.bwGet(BasePage.generalLocators.trialInviteBtn).click();

    return this;
  }

  /**
   *  Press logo from top header navbar
   */
  openStartingPage() {
    cy
      .bwGet(BasePage.generalLocators.labelNavBarLogoImage)
      .first()
      .click();

    return this;
  }

  /**
   * General function to populate input fields
   * @param locator - input locator
   * @param item - text to be typed
   */
  populateInputFields(locator, item) {
    cy.bwGet(locator).click();
    cy.bwGet(locator).clear();
    cy.bwGet(locator).type(item);

    return this;
  }

  /**
   * Refresh page, needed in order to see some settings being applied
   */
  refresh() {
    cy.reload(true).waitForResources();

    return this;
  }

  /**
   * Scroll to the top of the window
   */
  scrollToTop() {
    cy.scrollTo('top');

    return this;
  }

  /**
   * Generic method to select a radio button or a checkbox
   * @param {Locator} locator - locator for radio-input or option-input elemenbt
   * @param {Boolean} state - true to enable, false to disable (applicable only for checkboxes)
   * @param {Input} type - checkbox or radio
   */
  select(locator, state, type) {
    this.selectUsingWebElement(cy.bwGet(locator), state, type);
  }

  /**
   *  Generic function to select radio button or select/unselect checkbox
   *    using parent web element in the application
   * @param webElem - parent web element for checkbox/radio element
   * @param state - boolean, states if checkbox should be checked or not
   * @param {Input} type - checkbox or radio
   */
  selectUsingWebElement(webElem, state, type) {
    let inputLocator;
    let selectedClass;
    let selector;

    webElem
      .then(() => {
        if (type === BasePage.getInput.RADIO) {
          selector = BasePage.generalLocators.cssRadioSelector;
          inputLocator = BasePage.generalLocators.cssRadioInputSkinned;
          selectedClass = BasePage.generalLocators.cssRadioButtonChecked;
        } else if (type === BasePage.getInput.CHECKBOX) {
          selector = BasePage.generalLocators.cssCheckBoxSelector;
          inputLocator = BasePage.generalLocators.cssCheckboxSkined;
          selectedClass = BasePage.generalLocators.cssCheckboxChecked;
        }
      })
      .then(($element) => {
        cy
          .wrap($element)
          .find(inputLocator)
          .first()
          .then(($el) => {
            const isSelected = $el.get(0).classList.contains(selectedClass);
            if (isSelected !== state) {
              webElem
                .find(selector)
                .parent()
                .click();
            }
          });
      });
  }

  /**
   *  Click on selectbox and on desired option from dropdown list
   * @param dropdownLocator - element locator used for select dropdown element
   * @param option - option that needs to be selected from the list
   * @param parent - optional, parent web element if is needed
   */
  selectItemFromSelect2Dropdown(dropdownLocator, option, parent) {
    this.openDropdown(dropdownLocator, parent)
      .assertSelect2DropdownOptionExistInList(option)
      .waitForLoadingToHide();
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(option)
      .click({ force: true });
    cy.get(BasePage.generalLocators.cssSelect2Result).should('not.be.visible');

    return this;
  }

  /**
   *  Click on selectbox and on desired option from dropdown list
   * @param dropdownLocator - element locator used for select dropdown element
   * @param option - option that needs to be selected from the list
   */
  selectItemFromSelect2DropdownUsingSearch(dropdownLocator, option) {
    this.openDropdown(dropdownLocator);
    cy
      .get(BasePage.generalLocators.inputSelect2)
      .last()
      .type(option, { force: true });
    cy
      .get(BasePage.generalLocators.cssSelect2Result)
      .contains(option)
      .click({ force: true });
    cy.get(BasePage.generalLocators.cssSelect2Result).should('not.be.visible');

    return this;
  }

  /**
   *  Select custom date from date picker
   * @param dropdownLocator - element locator used for date picker dropdown element
   * @param date - date object {month, year, date}
   */
  selectDateFromCustomDatePicker(dropdownLocator, date) {
    cy
      .bwGet(dropdownLocator)
      .first()
      .click();
    this.setDateInCustomDatePicker(date);

    return this;
  }

  /**
   *  Select custom date from date picker
   * @param dropdownLocator - element locator used for date picker dropdown element
   * @param date - date object {month, year, date}
   */
  selectDateFromCustomDatePickerUsingWebElement(webElement, date) {
    webElement.click();
    this.setDateInCustomDatePicker(date);

    return this;
  }

  /**
   *  Set custom date in date picker
   * @param date - date object {month, year, date}
   */
  setDateInCustomDatePicker(date) {
    cy
      .get(BasePage.generalLocators.cssDatePickerCentralButton)
      .first()
      .click();
    cy
      .get(BasePage.generalLocators.cssDatePickerCentralButton)
      .first()
      .click();

    if (!(Cypress.moment().format('YYYY') % 20) && Cypress.moment().format('YYYY') < date.year) {
      cy
        .get(BasePage.generalLocators.cssDatePickerNextButton)
        .first()
        .click();
    }

    cy
      .get(BasePage.generalLocators.repeaterOptionsInDatePicker)
      .contains(date.year)
      .click();
    cy
      .get(BasePage.generalLocators.repeaterOptionsInDatePicker)
      .contains(date.month)
      .click();
    cy
      .get(BasePage.generalLocators.repeaterOptionsInDatePicker)
      .find('span')
      .not('.text-muted')
      .contains(date.day)
      .click();

    return this;
  }

  /**
   * General function to slow populate input fields
   * @param input - input web element
   * @param item - text to be typed
   */
  slowPopulateInputFields(input, item) {
    input.clear({ force: true });
    input.click();
    input.type('{selectall}{del}');
    input.type(item, { delay: 25 });

    return this;
  }

  /**
   * Upload file
   * @param {Locator} locator - locator of the area containing the input,
   * @param {String} fileName - including file extension
   */
  uploadFile(locator, fileName) {
    // eslint-disable-next-line no-unused-vars
    let input;

    cy
      .wrap(null)
      .then(() => {
        if (locator != null) {
          input = cy.bwGet(locator).find(this.basicLocators.inputElement);
        } else {
          input = cy.get(this.basicLocators.uploadInput, { force: true });
        }
      })
      .then(($input) => {
        cy
          .fixture(fileName, 'base64')
          .then((base64String) => {
            Cypress.Blob.base64StringToBlob(base64String, 'image/png').then(function (blob) {
              const testfile = new File([blob], fileName, { type: 'image/png' });
              const dataTransfer = new DataTransfer();
              const fileInput = $input[0];

              dataTransfer.items.add(testfile);
              // This triggers the @change event on the input
              fileInput.files = dataTransfer.files;

              $input.trigger('change');
            });
          })
          .then(() => {
            cy.wait(1000); // wait for image to get uploaded
          });
      });
  }

  /**
   * Wait For Flash Message To Appear And Disappear
   * @param {String} message
   */
  waitForFlashMessage(message) {
    cy.bwGet(BasePage.generalLocators.flashMessageText).should('contain', message);
    cy.bwGet(BasePage.generalLocators.flashMessageText).should('not.contain', message);
    return this;
  }

  /**
   * Wait For Loading indicator to Disappear
   */
  waitForLoadingToHide() {
    cy.bwGet(BasePage.generalLocators.loadingIndicator).should('not.be.visible');
    cy.wait(250);

    return this;
  }

  /**
   * Wait For modal to close
   */
  waitForModalToClose() {
    cy.bwGet(BasePage.generalLocators.warningModal.body).should('not.be.visible');
    return this;
  }

  /**
   * Wait for page to be loaded
   */
  waitForPageToBeLoaded() {
    cy
      .get('.loading-indicator-content')
      .should('exist')
      .and('not.exist');

    return this;
  }

  /**
   * Search for setting
   * @param {String} settingName
   */
  searchSetting(settingName) {
    cy
      .bwGet(BasePage.generalLocators.settingSearchInput)
      .clear()
      .type(settingName);

    return this;
  }

  /**
   * Verify searched setting is available
   * @param {String} settingName
   */
  assertSettingIsAvailable(settingName) {
    cy.bwGet(BasePage.generalLocators.settingSearchResults).should('contain', settingName);

    return this;
  }

  /**
   * Click on searched setting to open it
   * @param {String} settingName
   */
  clickOnSearchedSetting(settingName) {
    cy
      .bwGet(BasePage.generalLocators.settingSearchResults)
      .contains(settingName)
      .click();
  }
}

export default BasePage;
