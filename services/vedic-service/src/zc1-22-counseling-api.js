/**
 * ZC1.22 Career, Finance, Business, and Medical Astrology Counseling API
 *
 * This module provides REST API endpoints for Vedic astrology counseling services
 * including career timing, financial prosperity, business success, and medical astrology analysis.
 *
 * @module ZC1.22CounselingAPI
 */

const CareerTimingAnalyzer = require('./career-timing-analyzer');
const FinancialProsperityAnalyzer = require('./financial-prosperity-analyzer');
const BusinessSuccessAnalyzer = require('./business-success-analyzer');
const MedicalAstrologyCounselor = require('./medical-astrology-counselor');
const YogaDetector = require('./yoga-detector');
const DashaAnalyzer = require('./dasha-analyzer');
const TransitAnalyzer = require('./transit-analyzer');
const { v4: uuidv4 } = require('uuid');

/**
 * ZC1.22 Counseling API Service
 * Provides REST API endpoints for astrology counseling services
 */
class ZC122CounselingAPI {
  constructor() {
    this.analyses = new Map(); // In-memory storage for demo, use DB in production
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * Analyze career timing for a birth chart
   * POST /api/v1/analysis/career-timing
   */
  async analyzeCareerTiming(request) {
    const startTime = Date.now();
    const analysisId = uuidv4();

    try {
      const { birthChart, currentDate, analysisType = 'comprehensive' } = request;

      // Validate input
      if (!birthChart) {
        throw new Error('Birth chart is required');
      }

      // Create analyzer and perform analysis
      const analyzer = new CareerTimingAnalyzer(birthChart, new Date(currentDate || Date.now()));
      const result = await analyzer.analyzeCareerTiming();

      // Generate remedies
      const remedies = this.generateCareerRemedies(result);

      // Store analysis result
      const analysisResult = {
        analysisId,
        timestamp: new Date().toISOString(),
        type: 'career',
        career: {
          timing: result.timing,
          yogas: result.yogas,
          recommendations: result.recommendations,
          dashaAnalysis: result.dashaAnalysis,
          transitAnalysis: result.transitAnalysis
        },
        overallScore: result.overallScore,
        luckyPeriods: result.luckyPeriods,
        remedies: remedies,
        success: true
      };

      this.analyses.set(analysisId, analysisResult);

      // Log performance
      this.performanceMonitor.recordMetric('career_timing_analysis', Date.now() - startTime);

      return analysisResult;

    } catch (error) {
      console.error('Career timing analysis error:', error);
      throw new Error(`Career timing analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze financial prosperity for a birth chart
   * POST /api/v1/analysis/financial-prosperity
   */
  async analyzeFinancialProsperity(request) {
    const startTime = Date.now();
    const analysisId = uuidv4();

    try {
      const { birthChart, currentDate } = request;

      if (!birthChart) {
        throw new Error('Birth chart is required');
      }

      const analyzer = new FinancialProsperityAnalyzer(birthChart, new Date(currentDate || Date.now()));
      const result = await analyzer.analyzeFinancialProsperity();

      const remedies = this.generateFinancialRemedies(result);

      const analysisResult = {
        analysisId,
        timestamp: new Date().toISOString(),
        type: 'finance',
        finance: {
          prosperity: result.prosperity,
          yogas: result.yogas,
          spendingPatterns: result.spendingPatterns,
          investmentTiming: result.investmentTiming
        },
        overallScore: result.overallScore,
        luckyPeriods: result.luckyPeriods,
        remedies: remedies,
        success: true
      };

      this.analyses.set(analysisId, analysisResult);
      this.performanceMonitor.recordMetric('financial_prosperity_analysis', Date.now() - startTime);

      return analysisResult;

    } catch (error) {
      console.error('Financial prosperity analysis error:', error);
      throw new Error(`Financial prosperity analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze business success potential
   * POST /api/v1/analysis/business-success
   */
  async analyzeBusinessSuccess(request) {
    const startTime = Date.now();
    const analysisId = uuidv4();

    try {
      const { birthChart, currentDate } = request;

      if (!birthChart) {
        throw new Error('Birth chart is required');
      }

      const analyzer = new BusinessSuccessAnalyzer(birthChart, new Date(currentDate || Date.now()));
      const result = await analyzer.analyzeBusinessSuccess();

      const remedies = this.generateBusinessRemedies(result);

      const analysisResult = {
        analysisId,
        timestamp: new Date().toISOString(),
        type: 'business',
        business: {
          potential: result.potential,
          entrepreneurialYogas: result.entrepreneurialYogas,
          timing: result.timing,
          partnershipCompatibility: result.partnershipCompatibility,
          riskAssessment: result.riskAssessment
        },
        overallScore: result.overallScore,
        luckyPeriods: result.luckyPeriods,
        remedies: remedies,
        success: true
      };

      this.analyses.set(analysisId, analysisResult);
      this.performanceMonitor.recordMetric('business_success_analysis', Date.now() - startTime);

      return analysisResult;

    } catch (error) {
      console.error('Business success analysis error:', error);
      throw new Error(`Business success analysis failed: ${error.message}`);
    }
  }

  /**
   * Provide medical astrology counseling
   * POST /api/v1/analysis/medical-counseling
   */
  async provideMedicalCounseling(request) {
    const startTime = Date.now();
    const analysisId = uuidv4();

    try {
      const { birthChart, currentDate, healthConcerns = [] } = request;

      if (!birthChart) {
        throw new Error('Birth chart is required');
      }

      const counselor = new MedicalAstrologyCounselor(birthChart, new Date(currentDate || Date.now()));
      const result = await counselor.provideMedicalCounseling(healthConcerns);

      const remedies = this.generateMedicalRemedies(result);

      const analysisResult = {
        analysisId,
        timestamp: new Date().toISOString(),
        type: 'medical',
        medical: {
          healthStatus: result.healthStatus,
          riskPeriods: result.riskPeriods,
          precautions: result.precautions,
          remedialMeasures: result.remedialMeasures,
          diseaseTiming: result.diseaseTiming,
          healingPotential: result.healingPotential
        },
        overallScore: result.overallScore,
        luckyPeriods: result.luckyPeriods,
        remedies: remedies,
        success: true
      };

      this.analyses.set(analysisId, analysisResult);
      this.performanceMonitor.recordMetric('medical_counseling_analysis', Date.now() - startTime);

      return analysisResult;

    } catch (error) {
      console.error('Medical counseling error:', error);
      throw new Error(`Medical counseling failed: ${error.message}`);
    }
  }

  /**
   * Get comprehensive analysis report
   * GET /api/v1/analysis/report/:analysisId
   */
  async getAnalysisReport(analysisId) {
    try {
      const analysis = this.analyses.get(analysisId);

      if (!analysis) {
        throw new Error('Analysis not found');
      }

      return analysis;

    } catch (error) {
      console.error('Get analysis report error:', error);
      throw new Error(`Failed to retrieve analysis report: ${error.message}`);
    }
  }

  /**
   * Perform comprehensive astrology counseling analysis
   * Combines all four analysis types into a single comprehensive report
   */
  async performComprehensiveAnalysis(request) {
    const startTime = Date.now();
    const analysisId = uuidv4();

    try {
      const { birthChart, currentDate, analysisType = 'comprehensive' } = request;

      if (!birthChart) {
        throw new Error('Birth chart is required');
      }

      const analysisDate = new Date(currentDate || Date.now());

      // Perform all analyses in parallel for efficiency
      const [careerResult, financeResult, businessResult, medicalResult] = await Promise.all([
        this.analyzeCareerTiming({ birthChart, currentDate }),
        this.analyzeFinancialProsperity({ birthChart, currentDate }),
        this.analyzeBusinessSuccess({ birthChart, currentDate }),
        this.provideMedicalCounseling({ birthChart, currentDate })
      ]);

      // Calculate overall score
      const overallScore = (
        careerResult.overallScore +
        financeResult.overallScore +
        businessResult.overallScore +
        medicalResult.overallScore
      ) / 4;

      // Combine lucky periods
      const allLuckyPeriods = [
        ...careerResult.luckyPeriods,
        ...financeResult.luckyPeriods,
        ...businessResult.luckyPeriods,
        ...medicalResult.luckyPeriods
      ];

      // Generate comprehensive remedies
      const comprehensiveRemedies = this.generateComprehensiveRemedies({
        career: careerResult,
        finance: financeResult,
        business: businessResult,
        medical: medicalResult
      });

      const comprehensiveResult = {
        analysisId,
        timestamp: new Date().toISOString(),
        type: 'comprehensive',
        career: careerResult.career,
        finance: financeResult.finance,
        business: businessResult.business,
        medical: medicalResult.medical,
        overallScore: Math.round(overallScore * 100) / 100,
        luckyPeriods: allLuckyPeriods,
        remedies: comprehensiveRemedies,
        summary: {
          strengths: this.identifyOverallStrengths(careerResult, financeResult, businessResult, medicalResult),
          challenges: this.identifyOverallChallenges(careerResult, financeResult, businessResult, medicalResult),
          recommendations: this.generateOverallRecommendations(careerResult, financeResult, businessResult, medicalResult)
        },
        success: true
      };

      this.analyses.set(analysisId, comprehensiveResult);
      this.performanceMonitor.recordMetric('comprehensive_analysis', Date.now() - startTime);

      return comprehensiveResult;

    } catch (error) {
      console.error('Comprehensive analysis error:', error);
      throw new Error(`Comprehensive analysis failed: ${error.message}`);
    }
  }

  /**
   * Identify overall strengths from all analyses
   */
  identifyOverallStrengths(career, finance, business, medical) {
    const strengths = [];

    if (career.overallScore > 0.7) strengths.push('Strong career potential');
    if (finance.overallScore > 0.7) strengths.push('Good financial stability');
    if (business.overallScore > 0.7) strengths.push('Entrepreneurial potential');
    if (medical.overallScore > 0.7) strengths.push('Good health indicators');

    return strengths;
  }

  /**
   * Identify overall challenges from all analyses
   */
  identifyOverallChallenges(career, finance, business, medical) {
    const challenges = [];

    if (career.overallScore < 0.5) challenges.push('Career challenges requiring attention');
    if (finance.overallScore < 0.5) challenges.push('Financial planning needed');
    if (business.overallScore < 0.5) challenges.push('Business risks to consider');
    if (medical.overallScore < 0.5) challenges.push('Health precautions advised');

    return challenges;
  }

  /**
   * Generate overall recommendations
   */
  generateOverallRecommendations(career, finance, business, medical) {
    const recommendations = [];

    if (career.overallScore > 0.6) {
      recommendations.push('Focus on career development during favorable periods');
    }

    if (finance.overallScore > 0.6) {
      recommendations.push('Maintain financial discipline and seek growth opportunities');
    }

    if (business.overallScore > 0.6) {
      recommendations.push('Consider entrepreneurial ventures with proper planning');
    }

    if (medical.overallScore > 0.6) {
      recommendations.push('Maintain healthy lifestyle and regular medical checkups');
    }

    recommendations.push('Consult with experienced astrologer for personalized guidance');

    return recommendations;
  }

  /**
   * Generate career remedies based on analysis results
   */
  generateCareerRemedies(analysisResult) {
    const remedies = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      preventive: []
    };

    // Immediate remedies based on current dasha and career potential
    if (analysisResult.overallScore < 0.6) {
      remedies.immediate.push({
        type: 'Mantra',
        action: 'Start chanting "Om Shreem Mahalakshmiyei Namaha" daily for career success',
        duration: 'Immediate',
        priority: 'High',
        area: 'career',
        category: 'Spiritual'
      });

      remedies.immediate.push({
        type: 'Gemstone',
        action: 'Wear Blue Sapphire (Saturn) after proper consultation',
        duration: 'Immediate',
        priority: 'High',
        area: 'career',
        category: 'Astrological'
      });
    }

    // Short-term remedies
    remedies.shortTerm.push({
      type: 'Ritual',
      action: 'Perform Saraswati Puja for knowledge and career growth',
      duration: '1-2 weeks',
      priority: 'Medium',
      area: 'career',
      category: 'Ceremonial'
    });

    // Long-term remedies
    remedies.longTerm.push({
      type: 'Practice',
      action: 'Donate to educational institutions regularly',
      duration: '3-6 months',
      priority: 'Medium',
      area: 'career',
      category: 'Charitable'
    });

    // Preventive measures
    remedies.preventive.push({
      type: 'Lifestyle',
      action: 'Maintain work-life balance and avoid career burnout',
      duration: 'Ongoing',
      priority: 'Low',
      area: 'career',
      category: 'Behavioral'
    });

    return remedies;
  }

  /**
   * Generate financial remedies based on analysis results
   */
  generateFinancialRemedies(analysisResult) {
    const remedies = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      preventive: []
    };

    // Immediate remedies for financial prosperity
    remedies.immediate.push({
      type: 'Mantra',
      action: 'Chant "Om Shreem Maha Lakshmiyei Namaha" for wealth accumulation',
      duration: 'Immediate',
      priority: 'High',
      area: 'finance',
      category: 'Spiritual'
    });

    if (analysisResult.overallScore < 0.7) {
      remedies.immediate.push({
        type: 'Gemstone',
        action: 'Wear Yellow Sapphire (Jupiter) for financial stability',
        duration: 'Immediate',
        priority: 'High',
        area: 'finance',
        category: 'Astrological'
      });
    }

    // Short-term remedies
    remedies.shortTerm.push({
      type: 'Ritual',
      action: 'Perform Lakshmi Puja on Fridays',
      duration: '1-2 weeks',
      priority: 'Medium',
      area: 'finance',
      category: 'Ceremonial'
    });

    // Long-term remedies
    remedies.longTerm.push({
      type: 'Charity',
      action: 'Donate to charitable causes related to wealth distribution',
      duration: '6-12 months',
      priority: 'Medium',
      area: 'finance',
      category: 'Charitable'
    });

    // Preventive measures
    remedies.preventive.push({
      type: 'Financial Planning',
      action: 'Maintain emergency fund and diversified investments',
      duration: 'Ongoing',
      priority: 'Medium',
      area: 'finance',
      category: 'Behavioral'
    });

    return remedies;
  }

  /**
   * Generate business remedies based on analysis results
   */
  generateBusinessRemedies(analysisResult) {
    const remedies = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      preventive: []
    };

    // Immediate remedies for business success
    remedies.immediate.push({
      type: 'Mantra',
      action: 'Chant "Om Gam Ganapataye Namaha" to remove business obstacles',
      duration: 'Immediate',
      priority: 'High',
      area: 'business',
      category: 'Spiritual'
    });

    if (analysisResult.overallScore < 0.6) {
      remedies.immediate.push({
        type: 'Gemstone',
        action: 'Wear Red Coral (Mars) for business energy and action',
        duration: 'Immediate',
        priority: 'High',
        area: 'business',
        category: 'Astrological'
      });
    }

    // Short-term remedies
    remedies.shortTerm.push({
      type: 'Ritual',
      action: 'Perform Ganesh Puja before starting new business ventures',
      duration: '1-2 weeks',
      priority: 'Medium',
      area: 'business',
      category: 'Ceremonial'
    });

    // Long-term remedies
    remedies.longTerm.push({
      type: 'Practice',
      action: 'Establish business partnerships with compatible individuals',
      duration: '3-6 months',
      priority: 'Medium',
      area: 'business',
      category: 'Strategic'
    });

    // Preventive measures
    remedies.preventive.push({
      type: 'Risk Management',
      action: 'Regular business planning and market analysis',
      duration: 'Ongoing',
      priority: 'Medium',
      area: 'business',
      category: 'Behavioral'
    });

    return remedies;
  }

  /**
   * Generate medical remedies based on analysis results
   */
  generateMedicalRemedies(analysisResult) {
    const remedies = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      preventive: []
    };

    // Immediate remedies for health
    remedies.immediate.push({
      type: 'Mantra',
      action: 'Chant "Om Dhanvantre Namaha" for healing and health',
      duration: 'Immediate',
      priority: 'High',
      area: 'medical',
      category: 'Spiritual'
    });

    if (analysisResult.overallScore < 0.7) {
      remedies.immediate.push({
        type: 'Gemstone',
        action: 'Wear Ruby (Sun) for vitality and health',
        duration: 'Immediate',
        priority: 'High',
        area: 'medical',
        category: 'Astrological'
      });
    }

    // Short-term remedies
    remedies.shortTerm.push({
      type: 'Ritual',
      action: 'Perform Dhanvantri Puja for health recovery',
      duration: '1-2 weeks',
      priority: 'Medium',
      area: 'medical',
      category: 'Ceremonial'
    });

    // Long-term remedies
    remedies.longTerm.push({
      type: 'Lifestyle',
      action: 'Adopt healthy diet and regular exercise routine',
      duration: '3-6 months',
      priority: 'Medium',
      area: 'medical',
      category: 'Behavioral'
    });

    // Preventive measures
    remedies.preventive.push({
      type: 'Health Monitoring',
      action: 'Regular medical checkups and health screenings',
      duration: 'Ongoing',
      priority: 'High',
      area: 'medical',
      category: 'Preventive'
    });

    return remedies;
  }

  /**
   * Generate comprehensive remedies combining all areas
   */
  generateComprehensiveRemedies(analysisResults) {
    const remedies = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
      preventive: []
    };

    // Combine remedies from all areas
    const areas = ['career', 'finance', 'business', 'medical'];

    areas.forEach(area => {
      const areaRemedies = this[`generate${area.charAt(0).toUpperCase() + area.slice(1)}Remedies`](analysisResults[area]);

      remedies.immediate.push(...areaRemedies.immediate);
      remedies.shortTerm.push(...areaRemedies.shortTerm);
      remedies.longTerm.push(...areaRemedies.longTerm);
      remedies.preventive.push(...areaRemedies.preventive);
    });

    // Prioritize based on overall scores
    const priorities = areas.map(area => ({
      area,
      score: analysisResults[area].overallScore
    })).sort((a, b) => a.score - b.score); // Sort by lowest score first

    // Add priority-based comprehensive remedies
    if (priorities[0].score < 0.6) {
      remedies.immediate.unshift({
        type: 'Comprehensive Ritual',
        action: 'Perform Maha Mrityunjaya Mantra chanting for overall well-being',
        duration: 'Immediate',
        priority: 'Critical',
        area: 'comprehensive',
        category: 'Spiritual'
      });
    }

    return remedies;
  }

  /**
   * Get analysis statistics and performance metrics
   */
  getAnalysisStats() {
    return {
      totalAnalyses: this.analyses.size,
      analysisTypes: {
        career: Array.from(this.analyses.values()).filter(a => a.type === 'career').length,
        finance: Array.from(this.analyses.values()).filter(a => a.type === 'finance').length,
        business: Array.from(this.analyses.values()).filter(a => a.type === 'business').length,
        medical: Array.from(this.analyses.values()).filter(a => a.type === 'medical').length,
        comprehensive: Array.from(this.analyses.values()).filter(a => a.type === 'comprehensive').length
      },
      performanceMetrics: this.performanceMonitor.getMetrics(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    };
  }

  /**
   * Health check endpoint
   */
  healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        careerTimingAnalyzer: 'available',
        financialProsperityAnalyzer: 'available',
        businessSuccessAnalyzer: 'available',
        medicalAstrologyCounselor: 'available',
        yogaDetector: 'available',
        dashaAnalyzer: 'available',
        transitAnalyzer: 'available',
        remedyGenerator: 'available'
      },
      stats: this.getAnalysisStats()
    };
  }
}

/**
 * Performance monitoring utility
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  recordMetric(name, duration) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push({
      duration,
      timestamp: Date.now()
    });

    // Keep only last 100 measurements
    const measurements = this.metrics.get(name);
    if (measurements.length > 100) {
      measurements.shift();
    }
  }

  getMetrics() {
    const result = {};
    for (const [name, measurements] of this.metrics) {
      const durations = measurements.map(m => m.duration);
      result[name] = {
        count: measurements.length,
        averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        lastMeasurement: measurements[measurements.length - 1]?.timestamp
      };
    }
    return result;
  }
}

// Export singleton instance
const zc122CounselingAPI = new ZC122CounselingAPI();

module.exports = zc122CounselingAPI;