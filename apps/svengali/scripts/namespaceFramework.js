/**
 * Namespace Dependency Management Framework
 * Provides dependency injection and namespace management for JavaScript modules
 */

(function() {
  const namespaces = {};
  const instances = {};
  const loading = {};

  /**
   * Register a namespace with its dependencies and factory function
   * @param {string} name - Unique identifier for the namespace
   * @param {object|array} dependencies - Map of namespace names to aliases, or array of names
   * @param {function} factoryFn - Factory function that creates the namespace service
   */
  window.namespace = function(name, dependencies, factoryFn) {
    if (namespaces[name]) {
      throw new Error(`Namespace '${name}' has already been registered.`);
    }

    namespaces[name] = {
      dependencies: Array.isArray(dependencies) ? 
        dependencies.reduce((acc, dep) => { acc[dep] = dep; return acc; }, {}) : 
        (dependencies || {}),
      factoryFn: factoryFn
    };
  };

  /**
   * Import a single namespace, resolving all its dependencies recursively
   * @param {string} name - Name of the namespace to import
   * @returns {*} The instantiated namespace service
   */
  window.importNamespace = function(name) {
    if (!namespaces[name]) {
      throw new Error(`Namespace '${name}' does not exist.`);
    }

    if (instances[name]) {
      return instances[name];
    }

    if (loading[name]) {
      throw new Error(`Circular dependency: ${name}`);
    }

    loading[name] = true;

    try {
      const ns = namespaces[name];
      const imports = {};

      // Resolve all dependencies
      for (const [depName, alias] of Object.entries(ns.dependencies)) {
        imports[alias] = window.importNamespace(depName);
      }

      // Create the service instance
      const service = ns.factoryFn(imports);

      if (typeof service !== 'object' && typeof service !== 'function') {
        throw new Error(`A namespace must be an object or function; it cannot be a primitive value. Namespace: '${name}'`);
      }

      instances[name] = service;
      return service;
    } finally {
      delete loading[name];
    }
  };

  /**
   * Batch import helper for importing multiple namespaces at once
   * @param {object|array} namespaceMap - Either {namespaceName: alias} or [namespaceName1, namespaceName2, ...]
   * @returns {object} Object with aliases mapped to instantiated namespace services
   */
  window.imports = function(namespaceMap) {
    const result = {};

    if (Array.isArray(namespaceMap)) {
      namespaceMap.forEach(name => {
        result[name] = window.importNamespace(name);
      });
    } else {
      for (const [name, alias] of Object.entries(namespaceMap)) {
        result[alias] = window.importNamespace(name);
      }
    }

    return result;
  };

  /**
   * List namespaces that have been registered but not instantiated yet
   * @returns {array} Sorted array of unused namespace names
   */
  window.listUnusedNamespaces = function() {
    return Object.keys(namespaces)
      .filter(name => !instances[name])
      .sort();
  };
})();
