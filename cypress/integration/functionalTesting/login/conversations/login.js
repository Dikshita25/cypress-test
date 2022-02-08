import BasePage from '../basePage';
import { generalMessages } from '../../utils/constants';
import GoalStatsModal from './goalStatsModal';

class GoalCreatedPage extends BasePage {
  constructor() {
    super();
    this.locators = {
      addFollowersSection: 'add-followers-body',
      addFollowersBtn: 'add-followers-button',
      dueDateLabel: 'date-picker-right',
      followersCount: 'add-followers-goal-count',
      goalCreationModal: '.modal-content',
      goalCreationHeader: 'action-header',
      goalDatesPickerDropdown: 'goal-dates-picker-preset-dropdown',
      greetingMessage: '.add-followers-header-greeting',
      header: 'add-followers-header',
      labelFollowersName: 'user-list-user-name',
      labelGoalNameInAddFollowers: 'add-followers-goal-name',
      startDateLabel: 'date-picker-left',
    };
  }

  /**
   * Press Add Followers button
   */
  addFollowers() {
    cy.bwGet(this.locators.addFollowersBtn).click();

    return new GoalStatsModal();
  }

  /**
   * Verify that goal creation modal is visible
   */
  assertGoalCreationModalIsDisplayed() {
    cy.get(this.locators.goalCreationModal).should('be.visible');
  }

  /**
   * Verify that goal creation modal is visible
   */
  assertGoalCreationModalIsNotDisplayed() {
    cy.get(this.locators.goalCreationModal).should('not.be.visible');
  }

  /**
   * Verify that goal creation page is displayed
   */
  assertGoalCreationPageIsDisplayed() {
    cy.get(this.locators.goalCreationHeader).should('exist');
  }

  /**
   * Assert goal ending date
   * @param date - string, goal start date
   */
  assertGoalEndingDateIs(date) {
    cy.bwGet(this.locators.dueDateLabel).should('have.value', date);

    return this;
  }
  /**
   * Verify that goal creation greeting message is correct
   */
  assertGreetingMessageIsDisplayed() {
    cy
      .get(this.locators.greetingMessage)
      .should('be.visible')
      .should('contain', generalMessages.success.GOAL_CREATED_CONGRATS);
  }

  /**
   * Assert Goal Has Been Created With Success
   * @param goalName - string, goal name
   */
  assertGoalHasBeenCreated(goalName) {
    this.assertGoalCreationModalIsDisplayed();
    this.assertGoalCreationModalIsNotDisplayed();
    this.assertGreetingMessageIsDisplayed();

    cy
      .bwGet(this.locators.labelGoalNameInAddFollowers)
      .should('be.visible')
      .should('contain', goalName);

    return this;
  }

  /**
   * Assert goal start date
   * @param date - string, goal start date
   */
  assertGoalStartDateIs(date) {
    cy.bwGet(this.locators.startDateLabel).should('have.value', date);

    return this;
  }

  /**
   * Verify the number of followers for a goal on goal created page
   * @param {Integer} number
   */
  assertNumberOfFollowersIs(number) {
    let label;

    if (number === 1) {
      label = `${number} Follower`;
    } else {
      label = `${number} Followers`;
    }

    cy.bwGet(this.locators.labelGoalNameInAddFollowers).should('be.visible');
    cy.bwGet(this.locators.followersCount).should('contain', label);

    return this;
  }

  /**
   * Open followers list by pressing click on followers link
   */
  openFollowersList() {
    cy.bwGet(this.locators.followersCount).click();

    return this;
  }

  /**
   * Verify that follower exists on followers list page
   * @param {String} followerName
   */
  assertFollowerExists(followerName) {
    cy
      .bwGet(this.locators.labelFollowersName, { timeout: 5000 })
      .contains(followerName)
      .should('exist');

    return this;
  }

  /**
   * Wait For Goal To Be Saved
   */
  waitForGoalToBeSaved() {
    this.assertGoalCreationModalIsDisplayed();
    this.assertGoalCreationModalIsNotDisplayed();

    return this;
  }
}
export default GoalCreatedPage;
