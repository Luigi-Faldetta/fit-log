// ***********************************************************
// This support file is processed and loaded automatically before
// your component tests. Use this for component testing configuration.
// ***********************************************************

import './commands';
import { mount } from 'cypress/react18';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.

Cypress.Commands.add('mount', mount);

// Import global styles if needed
import '../../src/index.css';
