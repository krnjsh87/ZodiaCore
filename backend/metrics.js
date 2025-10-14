/**
 * Metrics Module for ZodiaCore
 *
 * This module provides Prometheus-compatible metrics collection for latency, throughput, errors,
 * system metrics, and custom business metrics. It follows the development rules for observability
 * and monitoring, ensuring centralized and reusable metrics across all microservices.
 *
 * Features:
 * - HTTP request metrics (response time, status codes, request count)
 * - System metrics (memory usage, CPU usage)
 * - Custom business metrics framework
 * - Prometheus text format output
 * - Middleware for automatic HTTP metrics collection
 *
 * Usage:
 * const metrics = require('./backend/metrics');
 * app.use(metrics.httpMetricsMiddleware());
 * app.get('/metrics', (req, res) => res.end(metrics.getMetrics()));
 */

const os = require('os');

/**
 * Metrics Registry
 * Stores all metrics in memory with their values and metadata
 */
class MetricsRegistry {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  /**
   * Register a new metric
   * @param {string} name - Metric name
   * @param {string} type - Metric type (counter, gauge, histogram)
   * @param {string} help - Help text
   * @param {Array} labels - Label names
   */
  registerMetric(name, type, help, labels = []) {
    if (this.metrics.has(name)) {
      throw new Error(`Metric ${name} already registered`);
    }

    this.metrics.set(name, {
      name,
      type,
      help,
      labels,
      values: new Map(), // key: label hash, value: metric value
    });
  }

  /**
   * Get metric by name
   * @param {string} name
   * @returns {Object} metric
   */
  getMetric(name) {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   * @returns {Map} metrics
   */
  getAllMetrics() {
    return this.metrics;
  }

  /**
   * Generate label hash for metric values
   * @param {Object} labelValues
   * @returns {string}
   */
  generateLabelHash(labelValues) {
    return Object.keys(labelValues)
      .sort()
      .map((key) => `${key}="${labelValues[key]}"`)
      .join(',');
  }
}

/**
 * Counter Metric
 * Monotonically increasing value
 */
class Counter {
  constructor(registry, name, help, labels = []) {
    this.registry = registry;
    this.name = name;
    this.help = help;
    this.labels = labels;
    registry.registerMetric(name, 'counter', help, labels);
  }

  /**
   * Increment counter
   * @param {number} value - Value to increment by (default: 1)
   * @param {Object} labelValues - Label values
   */
  inc(value = 1, labelValues = {}) {
    const metric = this.registry.getMetric(this.name);
    const hash = this.registry.generateLabelHash(labelValues);
    const current = metric.values.get(hash) || 0;
    metric.values.set(hash, current + value);
  }

  /**
   * Get current value
   * @param {Object} labelValues
   * @returns {number}
   */
  get(labelValues = {}) {
    const metric = this.registry.getMetric(this.name);
    const hash = this.registry.generateLabelHash(labelValues);
    return metric.values.get(hash) || 0;
  }
}

/**
 * Gauge Metric
 * Value that can go up and down
 */
class Gauge {
  constructor(registry, name, help, labels = []) {
    this.registry = registry;
    this.name = name;
    this.help = help;
    this.labels = labels;
    registry.registerMetric(name, 'gauge', help, labels);
  }

  /**
   * Set gauge value
   * @param {number} value
   * @param {Object} labelValues
   */
  set(value, labelValues = {}) {
    const metric = this.registry.getMetric(this.name);
    const hash = this.registry.generateLabelHash(labelValues);
    metric.values.set(hash, value);
  }

  /**
   * Increment gauge
   * @param {number} value
   * @param {Object} labelValues
   */
  inc(value = 1, labelValues = {}) {
    const metric = this.registry.getMetric(this.name);
    const hash = this.registry.generateLabelHash(labelValues);
    const current = metric.values.get(hash) || 0;
    metric.values.set(hash, current + value);
  }

  /**
   * Decrement gauge
   * @param {number} value
   * @param {Object} labelValues
   */
  dec(value = 1, labelValues = {}) {
    this.inc(-value, labelValues);
  }

  /**
   * Get current value
   * @param {Object} labelValues
   * @returns {number}
   */
  get(labelValues = {}) {
    const metric = this.registry.getMetric(this.name);
    const hash = this.registry.generateLabelHash(labelValues);
    return metric.values.get(hash) || 0;
  }
}

/**
 * Histogram Metric
 * Tracks distribution of values
 */
class Histogram {
  constructor(
    registry,
    name,
    help,
    labels = [],
    buckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
  ) {
    this.registry = registry;
    this.name = name;
    this.help = help;
    this.labels = labels;
    this.buckets = buckets;

    // Register sum and count metrics
    registry.registerMetric(`${name}_sum`, 'counter', `${help} (sum)`, labels);
    registry.registerMetric(
      `${name}_count`,
      'counter',
      `${help} (count)`,
      labels
    );

    // Register bucket metrics
    buckets.forEach((bucket) => {
      registry.registerMetric(
        `${name}_bucket`,
        'counter',
        `${help} (bucket le="${bucket}")`,
        labels.concat(['le'])
      );
    });

    // Register +Inf bucket
    registry.registerMetric(
      `${name}_bucket`,
      'counter',
      `${help} (bucket le="+Inf")`,
      labels.concat(['le'])
    );
  }

  /**
   * Observe a value
   * @param {number} value
   * @param {Object} labelValues
   */
  observe(value, labelValues = {}) {
    const sumMetric = this.registry.getMetric(`${this.name}_sum`);
    const countMetric = this.registry.getMetric(`${this.name}_count`);

    const hash = this.registry.generateLabelHash(labelValues);

    // Update sum
    const currentSum = sumMetric.values.get(hash) || 0;
    sumMetric.values.set(hash, currentSum + value);

    // Update count
    const currentCount = countMetric.values.get(hash) || 0;
    countMetric.values.set(hash, currentCount + 1);

    // Update buckets
    this.buckets.forEach((bucket) => {
      if (value <= bucket) {
        const bucketMetric = this.registry.getMetric(`${this.name}_bucket`);
        const bucketHash = this.registry.generateLabelHash({
          ...labelValues,
          le: bucket.toString(),
        });
        const currentBucket = bucketMetric.values.get(bucketHash) || 0;
        bucketMetric.values.set(bucketHash, currentBucket + 1);
      }
    });

    // Update +Inf bucket
    const infBucketMetric = this.registry.getMetric(`${this.name}_bucket`);
    const infHash = this.registry.generateLabelHash({
      ...labelValues,
      le: '+Inf',
    });
    const currentInf = infBucketMetric.values.get(infHash) || 0;
    infBucketMetric.values.set(infHash, currentInf + 1);
  }
}

// Global registry instance
const registry = new MetricsRegistry();

// Pre-defined metrics
const httpRequestsTotal = new Counter(
  registry,
  'http_requests_total',
  'Total number of HTTP requests',
  ['method', 'route', 'status_code']
);
const httpRequestDuration = new Histogram(
  registry,
  'http_request_duration_seconds',
  'HTTP request duration in seconds',
  ['method', 'route']
);
const processMemoryUsage = new Gauge(
  registry,
  'process_memory_usage_bytes',
  'Process memory usage in bytes',
  ['type']
);
const processCpuUsage = new Gauge(
  registry,
  'process_cpu_usage_percent',
  'Process CPU usage percentage'
);

/**
 * HTTP Metrics Middleware
 * Automatically collects HTTP request metrics
 * @returns {Function} Express middleware
 */
function httpMetricsMiddleware() {
  return (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const duration = Number(process.hrtime.bigint() - start) / 1e9; // Convert to seconds

      httpRequestsTotal.inc(1, {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode.toString(),
      });

      httpRequestDuration.observe(duration, {
        method: req.method,
        route: req.route ? req.route.path : req.path,
      });
    });

    next();
  };
}

/**
 * Update system metrics
 * Should be called periodically (e.g., every 30 seconds)
 */
function updateSystemMetrics() {
  // Memory usage
  const memUsage = process.memoryUsage();
  processMemoryUsage.set(memUsage.rss, { type: 'rss' });
  processMemoryUsage.set(memUsage.heapUsed, { type: 'heap_used' });
  processMemoryUsage.set(memUsage.heapTotal, { type: 'heap_total' });
  processMemoryUsage.set(memUsage.external, { type: 'external' });

  // CPU usage (simplified - percentage since last call)
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - ~~((100 * idle) / total);

  processCpuUsage.set(usage);
}

/**
 * Create custom counter metric
 * @param {string} name
 * @param {string} help
 * @param {Array} labels
 * @returns {Counter}
 */
function createCounter(name, help, labels = []) {
  return new Counter(registry, name, help, labels);
}

/**
 * Create custom gauge metric
 * @param {string} name
 * @param {string} help
 * @param {Array} labels
 * @returns {Gauge}
 */
function createGauge(name, help, labels = []) {
  return new Gauge(registry, name, help, labels);
}

/**
 * Create custom histogram metric
 * @param {string} name
 * @param {string} help
 * @param {Array} labels
 * @param {Array} buckets
 * @returns {Histogram}
 */
function createHistogram(name, help, labels = [], buckets) {
  return new Histogram(registry, name, help, labels, buckets);
}

/**
 * Get metrics in Prometheus text format
 * @returns {string}
 */
function getMetrics() {
  let output = '# ZodiaCore Metrics\n';

  registry.getAllMetrics().forEach((metric) => {
    // Help comment
    output += `# HELP ${metric.name} ${metric.help}\n`;
    // Type comment
    output += `# TYPE ${metric.name} ${metric.type}\n`;

    // Values
    metric.values.forEach((value, hash) => {
      let labels = '';
      if (hash) {
        labels = `{${hash}}`;
      }
      output += `${metric.name}${labels} ${value}\n`;
    });
  });

  return output;
}

/**
 * Get registry instance (for advanced usage)
 * @returns {MetricsRegistry}
 */
function getRegistry() {
  return registry;
}

module.exports = {
  httpMetricsMiddleware,
  updateSystemMetrics,
  createCounter,
  createGauge,
  createHistogram,
  getMetrics,
  getRegistry,
};
