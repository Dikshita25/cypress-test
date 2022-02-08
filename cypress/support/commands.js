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
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { emailExtension } from '../helpers/utils/constants';
import GENERATION_BYPASS from '../helpers/bypass';

const { addMatchImageSnapshotCommand } = require('cypress-image-snapshot/command');

addMatchImageSnapshotCommand({
  failureThreshold: 0.0,
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.0 },
  capture: 'viewport',
});

/**
 * wait for all XHR, any resource type Network call to finish
 */
Cypress.Commands.add('waitForResources', function (resources = []) {
  const globalTimeout = 20000;
  const resourceCheckInterval = 1000;
  const idleTimesInit = 3;
  let idleTimes = idleTimesInit;
  let resourcesLengthPrevious;
  let timeout;

  return new Cypress.Promise((resolve, reject) => {
    const checkIfResourcesLoaded = () => {
      const resourcesLoaded = cy
        .state('window')
        .performance.getEntriesByType('resource')
        .filter(r => ['xmlhttprequest'].includes(r.initiatorType));

      const allFilesFound = resources.every((resource) => {
        const found = resourcesLoaded.filter(resourceLoaded =>
          resourceLoaded.name.includes(resource.name));
        if (found.length === 0) {
          return false;
        }
        return !resource.number || found.length >= resource.number;
      });

      if (allFilesFound) {
        if (resourcesLoaded.length === resourcesLengthPrevious) {
          idleTimes -= 1;
        } else {
          idleTimes = idleTimesInit;
          resourcesLengthPrevious = resourcesLoaded.length;
        }
      }
      if (!idleTimes) {
        resolve();
        return;
      }

      timeout = setTimeout(checkIfResourcesLoaded, resourceCheckInterval);
    };

    checkIfResourcesLoaded();
    setTimeout(() => {
      reject();
      clearTimeout(timeout);
    }, globalTimeout);
  });
});

Cypress.Commands.add('setResolution', (size) => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});

let token = null;

function request(method, endpoint, payload) {
  cy.getCookie('csrftoken').then((csrfTokenCookie) => {
    cy.request('/auth/').then(({ body }) => {
      ({ token } = body);
      const requestOptions = {
        url: endpoint,
        method,
        headers: {
          'X-CSRFToken': csrfTokenCookie.value,
          Authorization: `Token ${body.token}`,
        },
      };

      if (method.toLowerCase() === 'post') {
        requestOptions.body = payload;
      } else if (method.toLowerCase() === 'get') {
        requestOptions.qs = payload;
      } else if (method.toLowerCase() === 'put') {
        requestOptions.body = payload;
      }

      return cy.request(requestOptions);
    });
  });
}

function post(endpoint, payload) {
  return request('POST', endpoint, payload);
}

Cypress.Commands.add('bwGet', selector => cy.get(`[data-ptor='${selector}']`));

Cypress.Commands.add('bwFind', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).find(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('bwParent', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).parent(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('bwParents', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).parents(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('bwParentsUntil', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).parentsUntil(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('bwClosest', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).closest(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('bwSiblings', { prevSubject: true }, (subject, selector) => {
  cy.wrap(subject).siblings(`[data-ptor=${selector}]`);
});

Cypress.Commands.add('login', (user) => {
  let email;

  if (typeof user === 'string') {
    email = user;
  } else if (typeof user === 'object') {
    email = `${user.email}${emailExtension.BWC}`;
  }

  cy
    .request({
      url: '/testhooks/loginas/',
      qs: { email },
      method: 'GET',
    })
    .then(() =>
      cy.request('/auth/').then(({ body }) => {
        ({ token } = body);
      }));
});

Cypress.Commands.add('generate', (payload) => {
  if (token) {
    return post('/testhooks/generate/', payload);
  }

  return cy.request({
    url: '/testhooks/generate/',
    method: 'POST',
    body: payload,
  });
});

Cypress.Commands.add('update', (payload) => {
  if (token) {
    return post('/testhooks/update/', payload);
  }

  return cy.request({
    url: '/testhooks/update/',
    method: 'POST',
    body: payload,
  });
});

Cypress.Commands.add('setupOrg', () => {
  cy.teardownOrg();
  cy.request({
    url: '/testhooks/org/',
    method: 'POST',
  });
});

Cypress.Commands.add('setupCalibrationOrg', () => {
  console.log(`Read = ${GENERATION_BYPASS.read}`);
  if (!GENERATION_BYPASS.read) {
    console.log('Setting up Org.');
    cy.setupOrg();
  }
});

Cypress.Commands.add('setupComplexOrg', () => {
  const dockerComposeFile = Cypress.env('dockerComposeFile');

  cy.teardownOrg('complextestorg');
  if (dockerComposeFile) {
    cy.exec(
      `docker-compose -f ${dockerComposeFile} run --rm backend bash -c "ENABLE_TEST_HOOKS=12312312121 python manage.py create_org complextestorg --dataset=protractor"`,
    );
  } else {
    cy.exec(
      'docker-compose run --rm backend bash -c "ENABLE_TEST_HOOKS=12312312121 python ../manage.py create_org complextestorg --dataset=protractor"',
    );
  }
});

Cypress.Commands.add('setupTrialOrg', () => {
  const dockerComposeFile = Cypress.env('dockerComposeFile');

  cy.teardownOrg('trialtestorg');
  if (dockerComposeFile) {
    cy.exec(
      `docker-compose -f ${dockerComposeFile} run --rm backend bash -c "ENABLE_TEST_HOOKS=12312312121 python manage.py create_trial_org trialtestorg --domain trialtestorg.com"`,
    );
  } else {
    cy.exec(
      'docker-compose run --rm backend bash -c "ENABLE_TEST_HOOKS=12312312121 python ../manage.py create_trial_org trialtestorg --domain trialtestorg.com"',
    );
  }
});

Cypress.Commands.add('teardownOrg', (org) => {
  token = null;
  const basicUrl = '/testhooks/org/';
  const finalUrl = org ? `${basicUrl + org}/` : basicUrl;
  cy.request({
    url: finalUrl,
    method: 'DELETE',
  });
});

Cypress.Commands.add(
  'getIframe',
  { prevSubject: 'element' },
  $iframe => new Cypress.Promise(resolve => resolve($iframe.contents().find('body'))),
);

Cypress.Commands.add('isNotInViewport', (element) => {
  cy.bwGet(element).then(($el) => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
    expect(rect.top).to.be.greaterThan(bottom);
    expect(rect.bottom).to.be.greaterThan(bottom);
  });
});

Cypress.Commands.add('isInViewport', (element) => {
  cy.bwGet(element).then(($el) => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
  });
});

/**
 * Command to trigger an api request to the calibration-api. Used to generate
 * data for the calibration pages.
 *
 * @param {string} method The request method. (DELETE|GET|POST|PUT)
 * @param {string} target The target object to create. E.g. cycle-template, cycle, session, etc.
 * @param {object} data The request data.
 * @return {object} The resulting object created by the api.
 */
Cypress.Commands.add('calibrationRequest', (method, target, data) =>
  request(method, `api/calibration/${target}`, data));

/**
 * Command to trigger an api request to the insights-api. Used to generate
 * data for the calibration pages.
 *
 * @param {string} method The request method. (DELETE|GET|POST|PUT)
 * @param {string} target The target object to create. E.g. cycle-template, cycle, session, etc.
 * @param {object} data The request data.
 * @return {object} The resulting object created by the api.
 */
Cypress.Commands.add('insightsRequest', (method, target, data) =>
  request(method, `api/insights/${target}`, data));

/**
 * Command to generate missing conversation data.
 */
Cypress.Commands.add('generateMissingConversationData', () =>
  cy.log('Generating missing conversation data.').then(() =>
    cy.generate({
      model_type: 'missing_conversation_data',
      org_name: 'BetterWorks',
    })));

/**
 * Command to generate missing conversation data.
 */
Cypress.Commands.add('generateElasticsearchIndices', () =>
  cy.log('Generating elasticsearch indices.').then(() =>
    cy.generate({
      model_type: 'elasticsearch_indices',
    })));

function printAccessibilityViolations(violations) {
  cy.task(
    'table',
    violations.map(({
      id, impact, description, nodes,
    }) => ({
      impact,
      description: `${description} (${id})`,
      nodes: nodes.length,
    })),
  );
}

Cypress.Commands.add(
  'checkAccessibility',
  {
    prevSubject: 'optional',
  },
  (subject, { skipFailures = false } = {}) => {
    cy.checkA11y(subject, null, printAccessibilityViolations, skipFailures);
  },
);
