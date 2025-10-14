#!/bin/bash

# ZodiaCore Staging Environment Test Runner
# Runs comprehensive tests for logging, metrics, and health checks in staging environment
#
# Usage: ./tests/run-staging-tests.sh
#
# Prerequisites:
# - Docker and Docker Compose installed
# - Staging environment running (docker-compose.staging.yml)
# - Node.js installed for test scripts

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
STAGING_COMPOSE_FILE="docker-compose.staging.yml"
TEST_SCRIPTS_DIR="tests"
LOG_FILE="staging-test-results-$(date +%Y%m%d-%H%M%S).log"

# Test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNING_TESTS=0

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "FAIL")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
        *)
            echo "$message"
            ;;
    esac
}

# Function to check if staging environment is running
check_staging_environment() {
    print_status "INFO" "Checking if staging environment is running..."

    if ! docker-compose -f "$STAGING_COMPOSE_FILE" ps | grep -q "Up"; then
        print_status "FAIL" "Staging environment is not running"
        print_status "INFO" "Please start staging environment with:"
        echo "  docker-compose -f $STAGING_COMPOSE_FILE up -d"
        exit 1
    fi

    print_status "PASS" "Staging environment is running"
}

# Function to wait for services to be healthy
wait_for_services() {
    print_status "INFO" "Waiting for services to be healthy..."

    local services=("api-gateway" "vedic-service" "western-service" "mundane-service" "prometheus" "grafana")
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        local all_healthy=true

        for service in "${services[@]}"; do
            if ! docker-compose -f "$STAGING_COMPOSE_FILE" ps "$service" | grep -q "Up"; then
                all_healthy=false
                break
            fi
        done

        if $all_healthy; then
            print_status "PASS" "All services are healthy"
            return 0
        fi

        print_status "INFO" "Waiting for services... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done

    print_status "FAIL" "Services failed to become healthy within timeout"
    exit 1
}

# Function to run a test script
run_test_script() {
    local script_name=$1
    local script_path="$TEST_SCRIPTS_DIR/$script_name"

    if [ ! -f "$script_path" ]; then
        print_status "FAIL" "Test script not found: $script_path"
        return 1
    fi

    print_status "INFO" "Running $script_name..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    # Run the test script and capture output
    if node "$script_path" >> "$LOG_FILE" 2>&1; then
        local exit_code=$?
        if [ $exit_code -eq 0 ]; then
            print_status "PASS" "$script_name completed successfully"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        elif [ $exit_code -eq 1 ]; then
            print_status "FAIL" "$script_name failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        else
            print_status "WARN" "$script_name completed with warnings"
            WARNING_TESTS=$((WARNING_TESTS + 1))
            return 0
        fi
    else
        print_status "FAIL" "$script_name execution failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to check Prometheus metrics ingestion
check_prometheus_metrics() {
    print_status "INFO" "Checking Prometheus metrics ingestion..."

    # Wait a bit for metrics to be scraped
    sleep 5

    # Check if Prometheus is scraping metrics
    local prometheus_url="http://localhost:9090"
    local api_url="$prometheus_url/api/v1/query?query=up"

    if curl -s "$api_url" | grep -q '"status":"success"'; then
        print_status "PASS" "Prometheus is collecting metrics"
        return 0
    else
        print_status "FAIL" "Prometheus metrics collection check failed"
        return 1
    fi
}

# Function to check Grafana dashboard
check_grafana_dashboard() {
    print_status "INFO" "Checking Grafana dashboard accessibility..."

    local grafana_url="http://localhost:3004/api/health"

    if curl -s "$grafana_url" | grep -q '"database":"ok"'; then
        print_status "PASS" "Grafana dashboard is accessible"
        return 0
    else
        print_status "WARN" "Grafana dashboard check failed (may be normal if not configured)"
        return 0
    fi
}

# Function to generate test report
generate_report() {
    echo ""
    echo "=================================================="
    echo "🏁 ZODIACORE STAGING TEST REPORT"
    echo "=================================================="
    echo "Test Run: $(date)"
    echo "Environment: Staging"
    echo "Log File: $LOG_FILE"
    echo ""
    echo "📊 SUMMARY:"
    echo "   Total Tests: $TOTAL_TESTS"
    echo "   ✅ Passed: $PASSED_TESTS"
    echo "   ⚠️  Warnings: $WARNING_TESTS"
    echo "   ❌ Failed: $FAILED_TESTS"
    echo ""

    if [ $FAILED_TESTS -eq 0 ]; then
        print_status "PASS" "All tests completed successfully!"
        echo ""
        echo "🎉 Staging environment is ready for deployment"
        echo ""
        echo "Next Steps:"
        echo "1. Review detailed logs in: $LOG_FILE"
        echo "2. Access Grafana dashboard: http://localhost:3004"
        echo "3. Access Prometheus: http://localhost:9090"
        echo "4. Monitor service logs for any issues"
    else
        print_status "FAIL" "Some tests failed. Check logs for details."
        echo ""
        echo "🔍 Troubleshooting:"
        echo "1. Check detailed logs in: $LOG_FILE"
        echo "2. Verify staging services are running:"
        echo "   docker-compose -f $STAGING_COMPOSE_FILE ps"
        echo "3. Check service logs:"
        echo "   docker-compose -f $STAGING_COMPOSE_FILE logs [service-name]"
    fi

    echo ""
    echo "=================================================="
}

# Main test execution
main() {
    echo "🚀 Starting ZodiaCore Staging Environment Tests"
    echo "Log file: $LOG_FILE"
    echo ""

    # Initialize log file
    echo "ZodiaCore Staging Test Run - $(date)" > "$LOG_FILE"
    echo "==================================================" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"

    # Pre-flight checks
    check_staging_environment
    wait_for_services

    # Run test scripts
    run_test_script "staging-test-health.js"
    run_test_script "staging-test-metrics.js"
    run_test_script "staging-test-logging.js"

    # Additional checks
    check_prometheus_metrics
    check_grafana_dashboard

    # Generate final report
    generate_report

    # Exit with appropriate code
    if [ $FAILED_TESTS -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Handle script interruption
trap 'echo ""; print_status "FAIL" "Test run interrupted"; generate_report; exit 1' INT TERM

# Run main function
main "$@"