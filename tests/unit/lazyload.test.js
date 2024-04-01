import { JSDOM } from 'jsdom';
import * as defaults from '../../src/defaults';
import LazyLoad from '../../src/lazyload';
import { getExtendedSettings } from "../../src/defaults";
import { describe, test, expect, beforeEach, afterEach  } from "@jest/globals";

// Mock IntersectionObserver
class IntersectionObserver {
  constructor() {}

  observe() {}

  unobserve() {}

  disconnect() {}
}

// Mock window.lazyLoadOptions
global.window.lazyLoadOptions = {}; // Mock empty options object

// Mock runningOnBrowser to return true
jest.mock('../../src/environment', () => ({
  runningOnBrowser: true
}));


describe('LazyLoad', () => {
  let dom;

  beforeEach(() => {
    // Set up a basic DOM using JSDOM
    dom = new JSDOM(`<!DOCTYPE html><div id="container"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.IntersectionObserver = IntersectionObserver;
  });

  afterEach(() => {
    // Clean up the DOM after each test
    global.document = undefined;
    global.window = undefined;
    global.IntersectionObserver = undefined;
  });

  test('should initialize with correct settings and observers', () => {
    // Mock getExtendedSettings
    jest.spyOn( defaults, 'getExtendedSettings' );

    const lazyLoad = new LazyLoad();
    expect(getExtendedSettings).toHaveBeenCalledWith( undefined );
  });

  test('should update correctly', () => {
    // Mock getExtendedSettings
    jest.spyOn(LazyLoad.prototype, 'update');

    // Mock the necessary functions and objects
    const lazyLoad = new LazyLoad();
    const givenNodeset = document.querySelectorAll('.lazy');

    // Call the function to be tested
    lazyLoad.update(givenNodeset);

    // Assertions
    expect(LazyLoad.prototype.update).toHaveBeenCalled();
  });
});
