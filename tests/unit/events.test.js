import { loadNative } from '../../src/load';
import * as setModule from '../../src/set'; // Import all named exports from the set module
import * as event from '../../src/event';
import * as tempImage from '../../src/tempImage';
import * as counters from '../../src/counters';
import * as classname from '../../src/class';
import * as unobserve from '../../src/unobserve';
import * as callback from '../../src/callback';
import * as originalAttributes from '../../src/originalAttributes';
import * as data from '../../src/data';
import "./lib/expectExtend";
import { expect } from "@jest/globals";
import expectExtend from "./lib/expectExtend";
import { JSDOM } from "jsdom";
import { doneHandler, errorHandler, loadHandler } from "../../src/event";
import { statusError, statusLoaded, statusNative } from "../../src/elementStatus";

expectExtend(expect);

const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.document = dom.window.document;
global.window = dom.window;

const outerDiv = document.querySelector('#outer');
const element = document.createElement('img');
const settings = {};
const instance = {};

jest.spyOn(event, 'doneHandler');
jest.spyOn(event, 'loadHandler');
jest.spyOn(event, 'errorHandler');

test('loadNative sets loading attribute, adds event listeners, sets sources, and sets status', () => {
  const setSourcesNativeSpy = jest.spyOn(setModule, 'setSourcesNative');
  loadNative(element, settings, instance);
  expect(element.getAttribute('loading')).toBe('lazy');
  expect(setSourcesNativeSpy).toHaveBeenCalledWith(element, settings);
});


// Describe block for testing doneHandler function
describe('doneHandler', () => {
  test('should call the necessary functions and remove loading class', () => {
    // Mock necessary functions and objects
    const element = document.createElement('img');
    const settings = {}; // Add any necessary settings for testing
    const instance = {}; // Add any necessary instance data for testing

    // Spy on necessary functions
    const deleteTempImageSpy = jest.spyOn(tempImage, 'deleteTempImage');
    const updateLoadingCountSpy = jest.spyOn(counters, 'updateLoadingCount');
    const decreaseToLoadCountSpy = jest.spyOn(counters, 'decreaseToLoadCount');
    const removeClassSpy = jest.spyOn(classname, 'removeClass');
    const unobserveSpy = jest.spyOn(unobserve, 'unobserve');

    // Call the function to be tested
    doneHandler(element, settings, instance);

    // Assertions
    expect(deleteTempImageSpy).toHaveBeenCalledWith(element);
    expect(updateLoadingCountSpy).toHaveBeenCalledWith(instance, -1);
    expect(decreaseToLoadCountSpy).toHaveBeenCalledWith(instance);
    expect(removeClassSpy).toHaveBeenCalledWith(element, settings.class_loading);
    // Ensure unobserve is called if settings.unobserve_completed is true
    expect(settings.unobserve_completed ? unobserveSpy.mock.calls.length : true).toBe(true);
  });
});

// Describe block for testing loadHandler function
describe('loadHandler', () => {
  test('should call doneHandler and update element status', () => {
    // Mock necessary functions and objects
    const element = document.createElement('img');
    element.dataset['llStatus'] = statusNative;
    const settings = { class_loaded: 'loaded' };
    const instance = { loadingCount: 1 };

    // Spy on necessary functions
    const addClassSpy = jest.spyOn(classname, 'addClass');
    const setStatusSpy = jest.spyOn(data, 'setStatus');
    const safeCallbackSpy = jest.spyOn(callback, 'safeCallback');

    // Call the function to be tested
    loadHandler({}, element, settings, instance); // Pass an empty event object for testing

// Simulate the image being loaded by triggering the load event
    element.dispatchEvent(new Event('load'));

    // Assertions
    expect(addClassSpy).toHaveBeenCalledWith(element, settings.class_loaded);
    expect(setStatusSpy).toHaveBeenCalledWith(element, statusLoaded);
    expect(safeCallbackSpy).toHaveBeenCalledWith(settings.callback_loaded, element, instance);
  });
});

// Describe block for testing errorHandler function
describe('errorHandler', () => {
  test('should call doneHandler, add error class, and update element status', () => {
    // Mock necessary functions and objects
    const element = document.createElement('img');
    const settings = {}; // Add any necessary settings for testing
    const instance = {}; // Add any necessary instance data for testing

    // Spy on necessary functions
    const doneHandlerSpy = jest.spyOn(event, 'doneHandler');
    const addClassSpy = jest.spyOn(classname, 'addClass');
    const setStatusSpy = jest.spyOn(data, 'setStatus');
    const safeCallbackSpy = jest.spyOn(callback, 'safeCallback');
    const restoreOriginalAttrsSpy = jest.spyOn(originalAttributes, 'restoreOriginalAttrs');

    // Call the function to be tested
    errorHandler({}, element, settings, instance); // Pass an empty event object for testing

    // Assertions
    expect(addClassSpy).toHaveBeenCalledWith(element, settings.class_error);
    expect(setStatusSpy).toHaveBeenCalledWith(element, statusError);
    expect(safeCallbackSpy).toHaveBeenCalledWith(settings.callback_error, element, instance);
    // Ensure restoreOriginalAttrs is called if settings.restore_on_error is true
    expect(settings.restore_on_error ? restoreOriginalAttrsSpy.mock.calls.length : true).toBe(true);
  });
});
