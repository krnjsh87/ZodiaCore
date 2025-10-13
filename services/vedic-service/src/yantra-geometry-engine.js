/**
 * ZC1.27 Yantra Sacred Geometry Generation Engine
 * Generates precise geometric coordinates and SVG representations for sacred Yantras
 */

const { PLANETARY_YANTRAS, DEITY_YANTRAS, PURPOSE_YANTRAS, GEOMETRIC_CONSTANTS, YANTRA_ERRORS } = require('./yantra-sacred-geometry-constants');

class YantraGeometryEngine {
    constructor() {
        this.cache = new Map(); // Cache for generated geometries
        this.precision = 6; // Decimal precision for coordinates
    }

    /**
     * Generate geometry for a specific Yantra type
     * @param {string} yantraType - Type of Yantra (SUN, MOON, SRI_YANTRA, etc.)
     * @param {number} size - Size of the Yantra in pixels
     * @param {Object} options - Additional generation options
     * @returns {Object} Complete geometry object
     */
    generateGeometry(yantraType, size = 400, options = {}) {
        const cacheKey = `${yantraType}_${size}_${JSON.stringify(options)}`;

        if (this.cache.has(cacheKey) && !options.forceRegenerate) {
            return this.cache.get(cacheKey);
        }

        let geometry;

        try {
            switch (yantraType) {
                case 'SRI_YANTRA':
                    geometry = this.generateSriYantra(size, options);
                    break;
                case 'SUN':
                case 'MOON':
                case 'MARS':
                case 'MERCURY':
                case 'JUPITER':
                case 'VENUS':
                case 'SATURN':
                case 'RAHU':
                case 'KETU':
                    geometry = this.generatePlanetaryYantra(yantraType, size, options);
                    break;
                case 'GANESH_YANTRA':
                case 'HANUMAN_YANTRA':
                    geometry = this.generateDeityYantra(yantraType, size, options);
                    break;
                default:
                    geometry = this.generateBasicYantra(size, options);
            }

            // Add metadata
            geometry.type = yantraType;
            geometry.size = size;
            geometry.generatedAt = new Date().toISOString();
            geometry.maxSize = size;

            // Cache the result
            this.cache.set(cacheKey, geometry);

            return geometry;

        } catch (error) {
            throw new Error(`${YANTRA_ERRORS.GEOMETRY_CALCULATION_FAILED}: ${error.message}`);
        }
    }

    /**
     * Generate Sri Yantra geometry - the most complex sacred geometry
     * @param {number} size - Size of the Yantra
     * @param {Object} options - Generation options
     * @returns {Object} Sri Yantra geometry
     */
    generateSriYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            bindu: center,
            triangles: [],
            circles: [],
            lotusPetals: [],
            outerSquare: null,
            paths: []
        };

        // Central bindu
        geometry.bindu = center;

        // Generate upward triangles (Shakti) - 4 triangles
        const upwardTriangles = this.generateTriangleSeries(center, size * 0.35, 4, 'upward', options);
        geometry.triangles.push(...upwardTriangles);

        // Generate downward triangles (Shiva) - 5 triangles
        const downwardTriangles = this.generateTriangleSeries(center, size * 0.35, 5, 'downward', options);
        geometry.triangles.push(...downwardTriangles);

        // Generate surrounding circles
        const circles = this.generateConcentricCircles(center, size * 0.4, 3, options);
        geometry.circles = circles;

        // Generate lotus petals (16 petals)
        const lotusPetals = this.generateLotusPetals(center, size * 0.45, 16, options);
        geometry.lotusPetals = lotusPetals;

        // Generate outer protective square with T-junctions
        geometry.outerSquare = this.generateOuterSquare(center, size * 0.9, options);

        return geometry;
    }

    /**
     * Generate planetary Yantra based on planet type
     * @param {string} planet - Planet name
     * @param {number} size - Size of the Yantra
     * @param {Object} options - Generation options
     * @returns {Object} Planetary Yantra geometry
     */
    generatePlanetaryYantra(planet, size, options = {}) {
        const yantraConfig = PLANETARY_YANTRAS[planet];
        if (!yantraConfig) {
            throw new Error(YANTRA_ERRORS.INVALID_PLANET);
        }

        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            circles: [],
            rays: [],
            lotus: null,
            symbols: []
        };

        switch (planet) {
            case 'SUN':
                return this.generateSuryaYantra(size, options);
            case 'MOON':
                return this.generateChandraYantra(size, options);
            case 'MARS':
                return this.generateMangalYantra(size, options);
            case 'MERCURY':
                return this.generateBudhaYantra(size, options);
            case 'JUPITER':
                return this.generateGuruYantra(size, options);
            case 'VENUS':
                return this.generateShukraYantra(size, options);
            case 'SATURN':
                return this.generateShaniYantra(size, options);
            case 'RAHU':
                return this.generateRahuYantra(size, options);
            case 'KETU':
                return this.generateKetuYantra(size, options);
            default:
                return this.generateBasicYantra(size, options);
        }
    }

    /**
     * Generate Surya Yantra (Sun Yantra)
     */
    generateSuryaYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            rays: [],
            circles: [],
            lotus: null
        };

        // Central circle
        geometry.circles.push({
            center: center,
            radius: size * 0.08,
            style: 'filled'
        });

        // 12 rays emanating from center
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * GEOMETRIC_CONSTANTS.DEGREES_TO_RADIANS;
            const ray = {
                start: center,
                end: {
                    x: center.x + size * 0.35 * Math.cos(angle),
                    y: center.y + size * 0.35 * Math.sin(angle)
                }
            };
            geometry.rays.push(ray);
        }

        // Outer circle
        geometry.circles.push({
            center: center,
            radius: size * 0.4,
            style: 'outline'
        });

        // 12-petaled lotus
        geometry.lotus = this.generateLotusPetals(center, size * 0.3, 12, options);

        return geometry;
    }

    /**
     * Generate Chandra Yantra (Moon Yantra)
     */
    generateChandraYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            circles: [],
            crescents: [],
            lotus: null
        };

        // Central circle
        geometry.circles.push({
            center: center,
            radius: size * 0.1,
            style: 'filled'
        });

        // 16-petaled lotus
        geometry.lotus = this.generateLotusPetals(center, size * 0.35, 16, options);

        // Surrounding crescent shapes
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * GEOMETRIC_CONSTANTS.DEGREES_TO_RADIANS;
            const crescent = this.generateCrescent(
                center,
                size * 0.25,
                size * 0.15,
                angle,
                options
            );
            geometry.crescents.push(crescent);
        }

        return geometry;
    }

    /**
     * Generate Mangal Yantra (Mars Yantra)
     */
    generateMangalYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            triangles: [],
            circles: [],
            hexagon: null
        };

        // Central triangle
        const triangle = this.generateTriangle(center, size * 0.15, 0, 'upward');
        geometry.triangles.push(triangle);

        // Surrounding hexagon
        geometry.hexagon = this.generatePolygon(center, size * 0.3, 6, 0);

        // Outer circle
        geometry.circles.push({
            center: center,
            radius: size * 0.4,
            style: 'outline'
        });

        return geometry;
    }

    /**
     * Generate Budha Yantra (Mercury Yantra)
     */
    generateBudhaYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            triangles: [],
            circles: [],
            octagon: null
        };

        // Interlocking upward and downward triangles
        const upwardTriangle = this.generateTriangle(center, size * 0.2, 0, 'upward');
        const downwardTriangle = this.generateTriangle(center, size * 0.2, 0, 'downward');

        geometry.triangles.push(upwardTriangle, downwardTriangle);

        // 8-petaled lotus
        geometry.lotus = this.generateLotusPetals(center, size * 0.35, 8, options);

        return geometry;
    }

    /**
     * Generate Guru Yantra (Jupiter Yantra)
     */
    generateGuruYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            grid: [],
            symbols: []
        };

        // 9x9 grid pattern
        const gridSize = size * 0.6;
        const cellSize = gridSize / 9;
        const startX = center.x - gridSize / 2;
        const startY = center.y - gridSize / 2;

        for (let i = 0; i <= 9; i++) {
            // Horizontal lines
            geometry.grid.push({
                start: { x: startX, y: startY + i * cellSize },
                end: { x: startX + gridSize, y: startY + i * cellSize }
            });
            // Vertical lines
            geometry.grid.push({
                start: { x: startX + i * cellSize, y: startY },
                end: { x: startX + i * cellSize, y: startY + gridSize }
            });
        }

        return geometry;
    }

    /**
     * Generate Shukra Yantra (Venus Yantra)
     */
    generateShukraYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            hexagram: null,
            circles: [],
            lotus: null
        };

        // Central hexagram (Star of David)
        geometry.hexagram = this.generateHexagram(center, size * 0.25);

        // 8-petaled lotus
        geometry.lotus = this.generateLotusPetals(center, size * 0.35, 8, options);

        return geometry;
    }

    /**
     * Generate Shani Yantra (Saturn Yantra)
     */
    generateShaniYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            grid: [],
            numbers: []
        };

        // 7x7 grid with number patterns
        const gridSize = size * 0.6;
        const cellSize = gridSize / 7;
        const startX = center.x - gridSize / 2;
        const startY = center.y - gridSize / 2;

        for (let i = 0; i <= 7; i++) {
            geometry.grid.push({
                start: { x: startX, y: startY + i * cellSize },
                end: { x: startX + gridSize, y: startY + i * cellSize }
            });
            geometry.grid.push({
                start: { x: startX + i * cellSize, y: startY },
                end: { x: startX + i * cellSize, y: startY + gridSize }
            });
        }

        return geometry;
    }

    /**
     * Generate Rahu Yantra (Rahu Yantra)
     */
    generateRahuYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            irregularShapes: [],
            nodes: []
        };

        // Generate irregular geometric pattern
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * GEOMETRIC_CONSTANTS.DEGREES_TO_RADIANS;
            const radius = size * (0.15 + Math.random() * 0.2);
            const node = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            };
            geometry.nodes.push(node);
        }

        return geometry;
    }

    /**
     * Generate Ketu Yantra (Ketu Yantra)
     */
    generateKetuYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        const geometry = {
            center: center,
            crescent: null,
            dot: null
        };

        // Crescent shape
        geometry.crescent = this.generateCrescent(center, size * 0.25, size * 0.15, 0, options);

        // Central dot
        geometry.dot = {
            center: center,
            radius: size * 0.05
        };

        return geometry;
    }

    /**
     * Generate deity-specific Yantras
     */
    generateDeityYantra(deityType, size, options = {}) {
        const center = { x: size / 2, y: size / 2 };

        switch (deityType) {
            case 'GANESH_YANTRA':
                return {
                    center: center,
                    elephant: this.generateElephantSymbol(center, size * 0.3),
                    grid: this.generateGrid(center, size * 0.6, 3)
                };
            case 'HANUMAN_YANTRA':
                return {
                    center: center,
                    mace: this.generateMaceSymbol(center, size * 0.4),
                    devotional: this.generateDevotionalSymbols(center, size * 0.3)
                };
            default:
                return this.generateBasicYantra(size, options);
        }
    }

    /**
     * Generate basic Yantra structure
     */
    generateBasicYantra(size, options = {}) {
        const center = { x: size / 2, y: size / 2 };
        return {
            center: center,
            circles: [{
                center: center,
                radius: size * 0.3,
                style: 'outline'
            }],
            bindu: center
        };
    }

    // Helper Methods

    /**
     * Generate a series of triangles
     */
    generateTriangleSeries(center, radius, count, direction, options = {}) {
        const triangles = [];
        const angleStep = (GEOMETRIC_CONSTANTS.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep + (direction === 'downward' ? GEOMETRIC_CONSTANTS.PI / count : 0);
            const triangle = this.generateTriangle(center, radius, angle, direction);
            triangles.push(triangle);
        }

        return triangles;
    }

    /**
     * Generate single triangle coordinates
     */
    generateTriangle(center, radius, rotation, direction) {
        const points = [];
        const height = radius * Math.sqrt(3) / 2;

        for (let i = 0; i < 3; i++) {
            const angle = (i * 2 * GEOMETRIC_CONSTANTS.PI / 3) + rotation;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + (direction === 'upward' ?
                -height/2 + radius * Math.sin(angle) :
                height/2 + radius * Math.sin(angle));
            points.push({ x: this.round(x), y: this.round(y) });
        }

        return {
            points: points,
            path: this.generatePathFromPoints(points)
        };
    }

    /**
     * Generate concentric circles
     */
    generateConcentricCircles(center, maxRadius, count, options = {}) {
        const circles = [];
        const radiusStep = maxRadius / count;

        for (let i = 1; i <= count; i++) {
            circles.push({
                center: center,
                radius: this.round(radiusStep * i),
                style: i === count ? 'outline' : 'filled'
            });
        }

        return circles;
    }

    /**
     * Generate lotus petals
     */
    generateLotusPetals(center, radius, count, options = {}) {
        const petals = [];
        const angleStep = (GEOMETRIC_CONSTANTS.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const petal = this.generatePetal(center, radius, angle, options);
            petals.push(petal);
        }

        return petals;
    }

    /**
     * Generate single petal
     */
    generatePetal(center, radius, rotation, options = {}) {
        const points = [];
        const petalRadius = radius * 0.8;

        // Generate petal curve points
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const angle = rotation + (t - 0.5) * GEOMETRIC_CONSTANTS.PI / 6;
            const r = petalRadius * (1 + 0.3 * Math.sin(t * GEOMETRIC_CONSTANTS.PI));
            const x = center.x + r * Math.cos(angle);
            const y = center.y + r * Math.sin(angle);
            points.push({ x: this.round(x), y: this.round(y) });
        }

        return {
            points: points,
            path: this.generatePathFromPoints(points, true)
        };
    }

    /**
     * Generate crescent shape
     */
    generateCrescent(center, outerRadius, innerRadius, rotation, options = {}) {
        const points = [];

        // Generate outer arc
        for (let i = 0; i <= 12; i++) {
            const angle = rotation + (i * GEOMETRIC_CONSTANTS.PI / 12);
            const x = center.x + outerRadius * Math.cos(angle);
            const y = center.y + outerRadius * Math.sin(angle);
            points.push({ x: this.round(x), y: this.round(y) });
        }

        // Generate inner arc (reverse direction)
        for (let i = 12; i >= 0; i--) {
            const angle = rotation + GEOMETRIC_CONSTANTS.PI + (i * GEOMETRIC_CONSTANTS.PI / 12);
            const x = center.x + innerRadius * Math.cos(angle);
            const y = center.y + innerRadius * Math.sin(angle);
            points.push({ x: this.round(x), y: this.round(y) });
        }

        return {
            points: points,
            path: this.generatePathFromPoints(points, true)
        };
    }

    /**
     * Generate hexagram (Star of David)
     */
    /**
     * Generate SVG representation of Yantra geometry
     * @param {Object} geometry - Yantra geometry object
     * @param {number} size - SVG size
     * @param {Object} options - SVG generation options
     * @returns {string} SVG markup
     */
    generateSVG(geometry, size = 400, options = {}) {
        try {
            let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;

            // Add background if specified
            if (options.background) {
                svg += `<rect width="100%" height="100%" fill="${options.background}"/>`;
            } else {
                svg += `<rect width="100%" height="100%" fill="#f5f5f5"/>`;
            }

            // Add bindu (central point)
            if (geometry.bindu) {
                const cx = this.scaleCoordinate(geometry.bindu.x, geometry.maxSize || size, size);
                const cy = this.scaleCoordinate(geometry.bindu.y, geometry.maxSize || size, size);
                svg += `<circle cx="${cx}" cy="${cy}" r="3" fill="#8B4513"/>`;
            }

            // Add circles
            if (geometry.circles) {
                geometry.circles.forEach(circle => {
                    const cx = this.scaleCoordinate(circle.center.x, geometry.maxSize || size, size);
                    const cy = this.scaleCoordinate(circle.center.y, geometry.maxSize || size, size);
                    const r = this.scaleCoordinate(circle.radius, geometry.maxSize || size, size);
                    const fill = circle.style === 'filled' ? '#8B4513' : 'none';
                    const stroke = '#8B4513';
                    const strokeWidth = circle.style === 'filled' ? '1' : '2';
                    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
                });
            }

            // Add triangles
            if (geometry.triangles) {
                geometry.triangles.forEach(triangle => {
                    if (triangle.points) {
                        const points = triangle.points.map(p =>
                            `${this.scaleCoordinate(p.x, geometry.maxSize || size, size)},${this.scaleCoordinate(p.y, geometry.maxSize || size, size)}`
                        ).join(' ');
                        svg += `<polygon points="${points}" fill="none" stroke="#8B4513" stroke-width="1"/>`;
                    }
                });
            }

            // Add lotus petals
            if (geometry.lotusPetals) {
                geometry.lotusPetals.forEach(petal => {
                    if (petal.path) {
                        const scaledPath = this.scalePath(petal.path, geometry.maxSize || size, size);
                        svg += `<path d="${scaledPath}" fill="#DAA520" stroke="#8B4513" stroke-width="1"/>`;
                    }
                });
            }

            // Add lotus (alternative format)
            if (geometry.lotus && geometry.lotus.petals) {
                geometry.lotus.petals.forEach(petal => {
                    if (petal.path) {
                        const scaledPath = this.scalePath(petal.path, geometry.maxSize || size, size);
                        svg += `<path d="${scaledPath}" fill="#DAA520" stroke="#8B4513" stroke-width="1"/>`;
                    }
                });
            }

            // Add rays (for Sun Yantra)
            if (geometry.rays) {
                geometry.rays.forEach(ray => {
                    const x1 = this.scaleCoordinate(ray.start.x, geometry.maxSize || size, size);
                    const y1 = this.scaleCoordinate(ray.start.y, geometry.maxSize || size, size);
                    const x2 = this.scaleCoordinate(ray.end.x, geometry.maxSize || size, size);
                    const y2 = this.scaleCoordinate(ray.end.y, geometry.maxSize || size, size);
                    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="2"/>`;
                });
            }

            // Add grid lines
            if (geometry.grid) {
                geometry.grid.forEach(line => {
                    const x1 = this.scaleCoordinate(line.start.x, geometry.maxSize || size, size);
                    const y1 = this.scaleCoordinate(line.start.y, geometry.maxSize || size, size);
                    const x2 = this.scaleCoordinate(line.end.x, geometry.maxSize || size, size);
                    const y2 = this.scaleCoordinate(line.end.y, geometry.maxSize || size, size);
                    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8B4513" stroke-width="1"/>`;
                });
            }

            // Add hexagram
            if (geometry.hexagram && geometry.hexagram.points) {
                const points = geometry.hexagram.points.map(p =>
                    `${this.scaleCoordinate(p.x, geometry.maxSize || size, size)},${this.scaleCoordinate(p.y, geometry.maxSize || size, size)}`
                ).join(' ');
                svg += `<polygon points="${points}" fill="none" stroke="#8B4513" stroke-width="2"/>`;
            }

            // Add hexagon
            if (geometry.hexagon && geometry.hexagon.points) {
                const points = geometry.hexagon.points.map(p =>
                    `${this.scaleCoordinate(p.x, geometry.maxSize || size, size)},${this.scaleCoordinate(p.y, geometry.maxSize || size, size)}`
                ).join(' ');
                svg += `<polygon points="${points}" fill="none" stroke="#8B4513" stroke-width="2"/>`;
            }

            // Add octagon
            if (geometry.octagon && geometry.octagon.points) {
                const points = geometry.octagon.points.map(p =>
                    `${this.scaleCoordinate(p.x, geometry.maxSize || size, size)},${this.scaleCoordinate(p.y, geometry.maxSize || size, size)}`
                ).join(' ');
                svg += `<polygon points="${points}" fill="none" stroke="#8B4513" stroke-width="2"/>`;
            }

            // Add outer square
            if (geometry.outerSquare) {
                const square = geometry.outerSquare;
                if (square.points) {
                    const points = square.points.map(p =>
                        `${this.scaleCoordinate(p.x, geometry.maxSize || size, size)},${this.scaleCoordinate(p.y, geometry.maxSize || size, size)}`
                    ).join(' ');
                    svg += `<polygon points="${points}" fill="none" stroke="#8B4513" stroke-width="2"/>`;
                }

                // Add T-junctions
                if (square.tJunctions) {
                    square.tJunctions.forEach(t => {
                        const x1 = this.scaleCoordinate(t.start.x, geometry.maxSize || size, size);
                        const y1 = this.scaleCoordinate(t.start.y, geometry.maxSize || size, size);
                        const x2 = this.scaleCoordinate(t.end.x, geometry.maxSize || size, size);
                        const y2 = this.scaleCoordinate(t.end.y, geometry.maxSize || size, size);
                        svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8B4513" stroke-width="2"/>`;
                    });
                }
            }

            // Add crescent
            if (geometry.crescent && geometry.crescent.path) {
                const scaledPath = this.scalePath(geometry.crescent.path, geometry.maxSize || size, size);
                svg += `<path d="${scaledPath}" fill="#C0C0C0" stroke="#8B4513" stroke-width="1"/>`;
            }

            // Add crescents array
            if (geometry.crescents) {
                geometry.crescents.forEach(crescent => {
                    if (crescent.path) {
                        const scaledPath = this.scalePath(crescent.path, geometry.maxSize || size, size);
                        svg += `<path d="${scaledPath}" fill="#C0C0C0" stroke="#8B4513" stroke-width="1"/>`;
                    }
                });
            }

            // Add dot (for Ketu)
            if (geometry.dot) {
                const cx = this.scaleCoordinate(geometry.dot.center.x, geometry.maxSize || size, size);
                const cy = this.scaleCoordinate(geometry.dot.center.y, geometry.maxSize || size, size);
                const r = this.scaleCoordinate(geometry.dot.radius, geometry.maxSize || size, size);
                svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#8B4513"/>`;
            }

            // Add irregular shapes (for Rahu)
            if (geometry.irregularShapes) {
                geometry.irregularShapes.forEach(shape => {
                    if (shape.path) {
                        const scaledPath = this.scalePath(shape.path, geometry.maxSize || size, size);
                        svg += `<path d="${scaledPath}" fill="none" stroke="#8B4513" stroke-width="1"/>`;
                    }
                });
            }

            // Add nodes (for Rahu)
            if (geometry.nodes) {
                geometry.nodes.forEach(node => {
                    const cx = this.scaleCoordinate(node.x, geometry.maxSize || size, size);
                    const cy = this.scaleCoordinate(node.y, geometry.maxSize || size, size);
                    svg += `<circle cx="${cx}" cy="${cy}" r="2" fill="#8B4513"/>`;
                });
            }

            svg += '</svg>';
            return svg;

        } catch (error) {
            throw new Error(`${YANTRA_ERRORS.SVG_GENERATION_FAILED}: ${error.message}`);
        }
    }

    /**
     * Scale coordinate from geometry space to SVG space
     * @param {number} value - Original coordinate value
     * @param {number} maxSize - Maximum size of geometry
     * @param {number} svgSize - SVG canvas size
     * @returns {number} Scaled coordinate
     */
    scaleCoordinate(value, maxSize, svgSize) {
        return this.round((value / maxSize) * svgSize);
    }

    /**
     * Scale SVG path coordinates
     * @param {string} path - Original SVG path
     * @param {number} maxSize - Maximum size of geometry
     * @param {number} svgSize - SVG canvas size
     * @returns {string} Scaled path
     */
    scalePath(path, maxSize, svgSize) {
        const scaleFactor = svgSize / maxSize;

        // Parse SVG path commands and scale coordinates properly
        const commands = path.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
        const scaledCommands = commands.map(command => {
            const cmd = command.charAt(0);
            const params = command.substring(1).trim().split(/[\s,]+/).map(p => {
                const num = parseFloat(p);
                return isNaN(num) ? p : this.round(num * scaleFactor);
            });
            return cmd + params.join(' ');
        });

        return scaledCommands.join('');
    }

    // Placeholder methods for deity symbols (to be implemented)
    generateElephantSymbol(center, size) {
        // Simplified elephant representation
        return {
            trunk: { center, radius: size * 0.3 },
            body: { center, radius: size * 0.5 }
        };
    }

    generateMaceSymbol(center, size) {
        // Simplified mace representation
        return {
            shaft: {
                start: { x: center.x, y: center.y - size * 0.4 },
                end: { x: center.x, y: center.y + size * 0.4 }
            },
            head: { center: { x: center.x, y: center.y - size * 0.4 }, radius: size * 0.1 }
        };
    }

    generateDevotionalSymbols(center, size) {
        // Simplified devotional symbols
        return {
            symbols: [
                { type: 'om', position: { x: center.x - size * 0.2, y: center.y } },
                { type: 'ram', position: { x: center.x + size * 0.2, y: center.y } }
            ]
        };
    }
    generateHexagram(center, radius) {
        const points = [];

        for (let i = 0; i < 6; i++) {
            const angle = (i * GEOMETRIC_CONSTANTS.PI / 3);
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x: this.round(x), y: this.round(y) });
        }

        return {
            points: points,
            path: this.generatePathFromPoints(points)
        };
    }

    /**
     * Generate polygon
     */
    generatePolygon(center, radius, sides, rotation = 0) {
        const points = [];
        const angleStep = (GEOMETRIC_CONSTANTS.PI * 2) / sides;

        for (let i = 0; i < sides; i++) {
            const angle = rotation + i * angleStep;
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            points.push({ x: this.round(x), y: this.round(y) });
        }

        return {
            points: points,
            path: this.generatePathFromPoints(points)
        };
    }

    /**
     * Generate outer square with T-junctions
     */
    generateOuterSquare(center, size, options = {}) {
        const halfSize = size / 2;
        const square = {
            points: [
                { x: center.x - halfSize, y: center.y - halfSize },
                { x: center.x + halfSize, y: center.y - halfSize },
                { x: center.x + halfSize, y: center.y + halfSize },
                { x: center.x - halfSize, y: center.y + halfSize }
            ],
            tJunctions: []
        };

        // Add T-junctions at each side
        const tLength = size * 0.1;
        square.tJunctions = [
            // Top
            {
                start: { x: center.x - tLength/2, y: center.y - halfSize },
                end: { x: center.x + tLength/2, y: center.y - halfSize }
            },
            // Right
            {
                start: { x: center.x + halfSize, y: center.y - tLength/2 },
                end: { x: center.x + halfSize, y: center.y + tLength/2 }
            },
            // Bottom
            {
                start: { x: center.x - tLength/2, y: center.y + halfSize },
                end: { x: center.x + tLength/2, y: center.y + halfSize }
            },
            // Left
            {
                start: { x: center.x - halfSize, y: center.y - tLength/2 },
                end: { x: center.x - halfSize, y: center.y + tLength/2 }
            }
        ];

        square.path = this.generatePathFromPoints(square.points);
        return square;
    }

    /**
     * Generate grid pattern
     */
    generateGrid(center, size, divisions) {
        const grid = [];
        const halfSize = size / 2;
        const step = size / divisions;
        const startX = center.x - halfSize;
        const startY = center.y - halfSize;

        for (let i = 0; i <= divisions; i++) {
            // Horizontal lines
            grid.push({
                start: { x: startX, y: startY + i * step },
                end: { x: startX + size, y: startY + i * step }
            });
            // Vertical lines
            grid.push({
                start: { x: startX + i * step, y: startY },
                end: { x: startX + i * step, y: startY + size }
            });
        }

        return grid;
    }

    /**
     * Generate path string from points
     */
    generatePathFromPoints(points, closed = false) {
        if (!points || points.length === 0) return '';

        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            path += ` L ${points[i].x} ${points[i].y}`;
        }
        if (closed) {
            path += ' Z';
        }
        return path;
    }

    /**
     * Round number to specified precision
     */
    round(value) {
        return Number(value.toFixed(this.precision));
    }

    /**
     * Clear geometry cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

module.exports = YantraGeometryEngine;