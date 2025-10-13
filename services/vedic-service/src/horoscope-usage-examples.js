/**
 * ZodiaCore - Vedic Horoscope System Usage Examples
 *
 * Comprehensive examples demonstrating how to use the Vedic Horoscope System
 * for generating daily, weekly, monthly, and yearly horoscopes.
 *
 * @version 1.0.0
 * @author ZodiaCore Development Team
 * @license MIT
 */

const VedicBirthChartGenerator = require('./vedic-birth-chart-generator');
const VedicHoroscopeSystem = require('./vedic-horoscope-system');

/**
 * Example 1: Basic Daily Horoscope Generation
 */
async function exampleBasicDailyHoroscope() {
    console.log('=== Example 1: Basic Daily Horoscope ===');

    try {
        // Create birth chart
        const birthData = {
            year: 1990,
            month: 5, // June (0-based: 0=Jan, 5=Jun)
            day: 15,
            hour: 14,
            minute: 30,
            second: 0,
            latitude: 28.6139,  // Delhi, India
            longitude: 77.2090,
            timezone: 5.5
        };

        const chartGenerator = new VedicBirthChartGenerator();
        const birthChart = await chartGenerator.generateBirthChart(birthData);

        // Initialize horoscope system
        const horoscopeSystem = new VedicHoroscopeSystem(birthChart);

        // Generate today's daily horoscope
        const today = new Date();
        const dailyHoroscope = await horoscopeSystem.generateHoroscope('daily', today);

        console.log('Daily Horoscope for:', today.toDateString());
        console.log('Rashi:', dailyHoroscope.rashi);
        console.log('Overall Rating:', dailyHoroscope.predictions.overall.rating);
        console.log('Summary:', dailyHoroscope.predictions.overall.summary);
        console.log('Moon Sign:', dailyHoroscope.daily.moonSign.signName);
        console.log('Tithi:', dailyHoroscope.daily.tithi.name);
        console.log('Nakshatra:', dailyHoroscope.daily.nakshatra.nakshatraName);

    } catch (error) {
        console.error('Error in basic daily horoscope example:', error.message);
    }
}

/**
 * Example 2: Generate All Horoscope Types
 */
async function exampleAllHoroscopes() {
    console.log('\n=== Example 2: Generate All Horoscope Types ===');

    try {
        // Sample birth chart (simplified for example)
        const sampleBirthChart = {
            birthData: {
                year: 1985,
                month: 3,
                day: 20
            },
            planets: {
                SUN: { longitude: 15.5, sign: 0 },
                MOON: { longitude: 125.3, sign: 4 },
                MARS: { longitude: 245.7, sign: 8 },
                MERCURY: { longitude: 35.2, sign: 1 },
                JUPITER: { longitude: 185.9, sign: 6 },
                VENUS: { longitude: 75.4, sign: 2 },
                SATURN: { longitude: 305.1, sign: 10 },
                RAHU: { longitude: 155.8, sign: 5 },
                KETU: { longitude: 335.8, sign: 11 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Generate all horoscopes for today
        const allHoroscopes = await horoscopeSystem.generateAllHoroscopes();

        console.log('Generated all horoscope types:');
        console.log('- Daily:', allHoroscopes.daily.predictions.overall.rating);
        console.log('- Weekly:', allHoroscopes.weekly.predictions.overall.rating);
        console.log('- Monthly:', allHoroscopes.monthly.predictions.overall.rating);
        console.log('- Yearly:', allHoroscopes.yearly.predictions.overall.rating);

        // Show category predictions for daily
        console.log('\nDaily Category Predictions:');
        Object.entries(allHoroscopes.daily.predictions.categories).forEach(([category, data]) => {
            console.log(`${category}: ${data.rating} - ${data.prediction}`);
        });

    } catch (error) {
        console.error('Error in all horoscopes example:', error.message);
    }
}

/**
 * Example 3: Weekly Horoscope with Peak Days
 */
async function exampleWeeklyHoroscope() {
    console.log('\n=== Example 3: Weekly Horoscope with Peak Days ===');

    try {
        // Sample birth chart
        const sampleBirthChart = {
            birthData: { year: 1992, month: 8, day: 15 },
            planets: {
                SUN: { longitude: 132.5 },
                MOON: { longitude: 45.3 },
                MARS: { longitude: 78.9 },
                MERCURY: { longitude: 125.7 },
                JUPITER: { longitude: 245.1 },
                VENUS: { longitude: 15.8 },
                SATURN: { longitude: 185.4 },
                RAHU: { longitude: 95.2 },
                KETU: { longitude: 275.2 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Generate weekly horoscope starting from last Sunday
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Last Sunday

        const weeklyHoroscope = await horoscopeSystem.generateHoroscope('weekly', weekStart);

        console.log('Weekly Horoscope Overview:');
        console.log('Week of:', weekStart.toDateString());
        console.log('Overall Rating:', weeklyHoroscope.predictions.overall.rating);
        console.log('Summary:', weeklyHoroscope.predictions.overall.summary);

        console.log('\nPeak Days:');
        weeklyHoroscope.weekly.peakDays.forEach(day => {
            console.log(`- ${day.date.toDateString()}: ${day.score.toFixed(2)} - ${day.reason}`);
        });

        console.log('\nBest Activities:');
        Object.entries(weeklyHoroscope.weekly.bestActivities).forEach(([category, days]) => {
            if (days.length > 0) {
                console.log(`${category}: ${days.map(d => d.weekday).join(', ')}`);
            }
        });

    } catch (error) {
        console.error('Error in weekly horoscope example:', error.message);
    }
}

/**
 * Example 4: Monthly Horoscope Analysis
 */
async function exampleMonthlyHoroscope() {
    console.log('\n=== Example 4: Monthly Horoscope Analysis ===');

    try {
        const sampleBirthChart = {
            birthData: { year: 1988, month: 2, day: 10 },
            planets: {
                SUN: { longitude: 320.5 },
                MOON: { longitude: 45.3 },
                MARS: { longitude: 125.7 },
                MERCURY: { longitude: 315.2 },
                JUPITER: { longitude: 185.9 },
                VENUS: { longitude: 35.4 },
                SATURN: { longitude: 245.1 },
                RAHU: { longitude: 95.8 },
                KETU: { longitude: 275.8 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Generate current month horoscope
        const now = new Date();
        const monthlyHoroscope = await horoscopeSystem.generateHoroscope('monthly', now);

        console.log('Monthly Horoscope for:', now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
        console.log('Overall Rating:', monthlyHoroscope.predictions.overall.rating);
        console.log('Summary:', monthlyHoroscope.predictions.overall.summary);

        console.log('\nSun Transit:');
        console.log('- From:', monthlyHoroscope.monthly.monthlyTransit.sunTransit.startSignName);
        console.log('- To:', monthlyHoroscope.monthly.monthlyTransit.sunTransit.endSignName);

        console.log('\nLunar Phases:');
        monthlyHoroscope.monthly.lunarPhases.forEach(phase => {
            console.log(`- ${phase.phase} on ${phase.date.toDateString()}: ${phase.significance}`);
        });

        console.log('\nAuspicious Dates:');
        monthlyHoroscope.monthly.auspiciousDates.forEach(date => {
            console.log(`- ${date.date.toDateString()}: ${date.reason}`);
        });

    } catch (error) {
        console.error('Error in monthly horoscope example:', error.message);
    }
}

/**
 * Example 5: Yearly Horoscope with Major Events
 */
async function exampleYearlyHoroscope() {
    console.log('\n=== Example 5: Yearly Horoscope with Major Events ===');

    try {
        const sampleBirthChart = {
            birthData: { year: 1995, month: 7, day: 22 },
            planets: {
                SUN: { longitude: 139.5 },
                MOON: { longitude: 125.3 },
                MARS: { longitude: 245.7 },
                MERCURY: { longitude: 135.2 },
                JUPITER: { longitude: 185.9 },
                VENUS: { longitude: 75.4 },
                SATURN: { longitude: 305.1 },
                RAHU: { longitude: 155.8 },
                KETU: { longitude: 335.8 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Generate yearly horoscope
        const currentYear = new Date().getFullYear();
        const yearlyHoroscope = await horoscopeSystem.generateHoroscope('yearly', new Date(currentYear, 0, 1));

        console.log(`Yearly Horoscope for ${currentYear}:`);
        console.log('Overall Rating:', yearlyHoroscope.predictions.overall.rating);
        console.log('Summary:', yearlyHoroscope.predictions.overall.summary);

        console.log('\nMajor Planetary Transits:');
        console.log('- Jupiter in:', yearlyHoroscope.yearly.yearlyTransit.jupiterTransit.signName);
        console.log('- Effect:', yearlyHoroscope.yearly.yearlyTransit.jupiterTransit.effect);

        console.log('- Saturn in:', yearlyHoroscope.yearly.yearlyTransit.saturnTransit.signName);
        console.log('- Effect:', yearlyHoroscope.yearly.yearlyTransit.saturnTransit.effect);

        console.log('\nMajor Events:');
        yearlyHoroscope.yearly.majorEvents.forEach(event => {
            console.log(`- ${event.type}: ${event.significance} (${event.impact} impact)`);
        });

        console.log('\nLife Areas Focus:');
        Object.entries(yearlyHoroscope.yearly.lifeAreas).forEach(([area, data]) => {
            console.log(`${area}: ${data.rating} (${data.focus})`);
        });

    } catch (error) {
        console.error('Error in yearly horoscope example:', error.message);
    }
}

/**
 * Example 6: Multiple Horoscopes Generation
 */
async function exampleMultipleHoroscopes() {
    console.log('\n=== Example 6: Multiple Horoscopes Generation ===');

    try {
        const sampleBirthChart = {
            birthData: { year: 1990, month: 0, day: 1 },
            planets: {
                SUN: { longitude: 270.5 },
                MOON: { longitude: 45.3 },
                MARS: { longitude: 125.7 },
                MERCURY: { longitude: 275.2 },
                JUPITER: { longitude: 185.9 },
                VENUS: { longitude: 35.4 },
                SATURN: { longitude: 245.1 },
                RAHU: { longitude: 95.8 },
                KETU: { longitude: 275.8 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Generate multiple horoscopes
        const requests = [
            { type: 'daily', date: new Date() },
            { type: 'daily', date: new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Tomorrow
            { type: 'weekly', date: new Date() },
            { type: 'monthly', date: new Date() }
        ];

        const results = await horoscopeSystem.generateMultipleHoroscopes(requests);

        console.log('Generated multiple horoscopes:');
        results.forEach((result, index) => {
            const request = requests[index];
            console.log(`${index + 1}. ${request.type} horoscope: ${result.predictions.overall.rating}`);
        });

    } catch (error) {
        console.error('Error in multiple horoscopes example:', error.message);
    }
}

/**
 * Example 7: System Validation and Health Check
 */
async function exampleSystemValidation() {
    console.log('\n=== Example 7: System Validation and Health Check ===');

    try {
        const sampleBirthChart = {
            birthData: { year: 1985, month: 5, day: 15 },
            planets: {
                SUN: { longitude: 75.5 },
                MOON: { longitude: 125.3 },
                MARS: { longitude: 245.7 },
                MERCURY: { longitude: 85.2 },
                JUPITER: { longitude: 185.9 },
                VENUS: { longitude: 35.4 },
                SATURN: { longitude: 305.1 },
                RAHU: { longitude: 155.8 },
                KETU: { longitude: 335.8 }
            }
        };

        const horoscopeSystem = new VedicHoroscopeSystem(sampleBirthChart);

        // Health check
        const health = horoscopeSystem.healthCheck();
        console.log('System Health:', health.status);
        console.log('Version:', health.version);
        console.log('Uptime:', Math.floor(health.uptime / 1000), 'seconds');

        // Generate and validate a horoscope
        const testHoroscope = await horoscopeSystem.generateHoroscope('daily', new Date());

        const validation = horoscopeSystem.validateHoroscope(testHoroscope, {
            rashi: testHoroscope.rashi // Use the generated rashi as reference
        });

        console.log('Horoscope Validation:');
        console.log('- Is Accurate:', validation.isAccurate);
        console.log('- Accuracy Score:', (validation.score * 100).toFixed(1) + '%');

        console.log('Validation Details:');
        Object.entries(validation.validations).forEach(([check, passed]) => {
            console.log(`- ${check}: ${passed ? '✓' : '✗'}`);
        });

    } catch (error) {
        console.error('Error in system validation example:', error.message);
    }
}

// Run all examples
async function runAllExamples() {
    console.log('Running Vedic Horoscope System Examples...\n');

    await exampleBasicDailyHoroscope();
    await exampleAllHoroscopes();
    await exampleWeeklyHoroscope();
    await exampleMonthlyHoroscope();
    await exampleYearlyHoroscope();
    await exampleMultipleHoroscopes();
    await exampleSystemValidation();

    console.log('\n=== All Examples Completed ===');
}

// Export examples for individual testing
module.exports = {
    exampleBasicDailyHoroscope,
    exampleAllHoroscopes,
    exampleWeeklyHoroscope,
    exampleMonthlyHoroscope,
    exampleYearlyHoroscope,
    exampleMultipleHoroscopes,
    exampleSystemValidation,
    runAllExamples
};

// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}