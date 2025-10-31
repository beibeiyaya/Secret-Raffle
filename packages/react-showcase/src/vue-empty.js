/**
 * Empty Vue module stub for React builds
 * This replaces vue imports to prevent webpack resolution errors
 * when Vue adapters are exported but not used
 * 
 * Using CommonJS format for better webpack compatibility
 */

// Export empty object and Vue functions as stubs
// These will never be called in React showcase
module.exports = {
  default: {},
  ref: function() { return { value: null }; },
  computed: function() { return { value: null }; },
  onMounted: function() {},
  watch: function() {},
  reactive: function() { return {}; },
  toRef: function() { return { value: null }; },
  toRefs: function() { return {}; },
  unref: function() { return null; },
  isRef: function() { return false; },
  nextTick: function() { return Promise.resolve(); }
};

// Also support ES module syntax for compatibility
module.exports.ref = module.exports.ref;
module.exports.computed = module.exports.computed;
module.exports.onMounted = module.exports.onMounted;
module.exports.watch = module.exports.watch;
