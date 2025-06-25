// Utility Functions

/**
 * Debounce a function to limit how often it can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle a function to limit how often it can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The delay in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Format a date as a readable string
 * @param {Date} date - The date to format
 * @param {boolean} [includeTime=false] - Whether to include the time
 * @returns {string} - The formatted date string
 */
function formatDate(date, includeTime = false) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString(undefined, options);
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a unique ID
 * @returns {string} - A unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to an element
 * @param {HTMLElement} element - The element to scroll to
 * @param {number} [offset=0] - Additional offset from the top of the element
 */
function smoothScrollTo(element, offset = 0) {
    window.scrollTo({
        behavior: 'smooth',
        top: element.getBoundingClientRect().top + window.pageYOffset + offset
    });
}

/**
 * Toggle an element's visibility with a fade animation
 * @param {HTMLElement} element - The element to toggle
 * @param {number} [duration=300] - The duration of the animation in milliseconds
 */
function fadeToggle(element, duration = 300) {
    if (window.getComputedStyle(element).opacity === '0') {
        fadeIn(element, duration);
    } else {
        fadeOut(element, duration);
    }
}

/**
 * Fade in an element
 * @param {HTMLElement} element - The element to fade in
 * @param {number} [duration=300] - The duration of the animation in milliseconds
 */
function fadeIn(element, duration = 300) {
    element.style.display = '';
    element.style.opacity = '0';
    
    let last = +new Date();
    let tick = function() {
        element.style.opacity = +element.style.opacity + (new Date() - last) / duration;
        last = +new Date();
        
        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    
    tick();
}

/**
 * Fade out an element
 * @param {HTMLElement} element - The element to fade out
 * @param {number} [duration=300] - The duration of the animation in milliseconds
 */
function fadeOut(element, duration = 300) {
    element.style.opacity = '1';
    
    let last = +new Date();
    let tick = function() {
        element.style.opacity = +element.style.opacity - (new Date() - last) / duration;
        last = +new Date();
        
        if (+element.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        } else {
            element.style.display = 'none';
        }
    };
    
    tick();
}

/**
 * Get a cookie by name
 * @param {string} name - The name of the cookie
 * @returns {string|null} - The cookie value or null if not found
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/**
 * Set a cookie
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {number} [days=7] - The number of days until the cookie expires
 */
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Delete a cookie
 * @param {string} name - The name of the cookie to delete
 */
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if the device is mobile
 * @returns {boolean} - Whether the device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if the device is iOS
 * @returns {boolean} - Whether the device is iOS
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Check if the device is Android
 * @returns {boolean} - Whether the device is Android
 */
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

/**
 * Add a class to an element if it doesn't already have it
 * @param {HTMLElement} element - The element to modify
 * @param {string} className - The class to add
 */
function addClassIfNotExists(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
}

/**
 * Remove a class from an element if it exists
 * @param {HTMLElement} element - The element to modify
 * @param {string} className - The class to remove
 */
function removeClassIfExists(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

/**
 * Toggle a class on an element
 * @param {HTMLElement} element - The element to modify
 * @param {string} className - The class to toggle
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * Get the current scroll position
 * @returns {number} - The current scroll position in pixels
 */
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Check if an element has a specific class
 * @param {HTMLElement} element - The element to check
 * @param {string} className - The class to check for
 * @returns {boolean} - Whether the element has the class
 */
function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Get all siblings of an element
 * @param {HTMLElement} element - The element whose siblings to get
 * @returns {Array} - An array of sibling elements
 */
function getSiblings(element) {
    return Array.from(element.parentNode.children).filter(child => child !== element);
}

/**
 * Get the closest ancestor of an element that matches a selector
 * @param {HTMLElement} element - The starting element
 * @param {string} selector - The selector to match
 * @returns {HTMLElement|null} - The closest matching ancestor or null
 */
function closest(element, selector) {
    let el = element;
    while (el) {
        if (el.matches(selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

/**
 * Trigger a custom event
 * @param {string} eventName - The name of the event
 * @param {Object} [data={}] - Data to pass with the event
 * @param {HTMLElement} [element=document] - The element to dispatch the event on
 */
function triggerEvent(eventName, data = {}, element = document) {
    const event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent(event);
}

/**
 * Listen for a custom event
 * @param {string} eventName - The name of the event to listen for
 * @param {Function} callback - The callback function
 * @param {HTMLElement} [element=document] - The element to listen on
 */
function onEvent(eventName, callback, element = document) {
    element.addEventListener(eventName, callback);
}

/**
 * Remove an event listener
 * @param {string} eventName - The name of the event
 * @param {Function} callback - The callback function to remove
 * @param {HTMLElement} [element=document] - The element to remove the listener from
 */
function offEvent(eventName, callback, element = document) {
    element.removeEventListener(eventName, callback);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        formatDate,
        capitalize,
        generateId,
        isInViewport,
        smoothScrollTo,
        fadeToggle,
        fadeIn,
        fadeOut,
        getCookie,
        setCookie,
        deleteCookie,
        isMobile,
        isIOS,
        isAndroid,
        addClassIfNotExists,
        removeClassIfExists,
        toggleClass,
        hasClass,
        getScrollPosition,
        getSiblings,
        closest,
        triggerEvent,
        onEvent,
        offEvent
    };
}