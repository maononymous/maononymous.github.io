/**
 * Interactive Timeline Portfolio with Vertical Divider Slider
 * Modern ES6+ JavaScript with performance optimization
 */

class TimelinePortfolio {
    constructor() {
        // Core elements
        this.timeline = document.getElementById('timeline');
        this.dividerContainer = document.getElementById('dividerContainer');
        this.dividerLine = document.getElementById('dividerLine');
        this.dividerHandle = document.getElementById('dividerHandle');
        this.dnaLabel = document.getElementById('dnaLabel');
        this.starLabel = document.getElementById('starLabel');
        
        // Collections
        this.milestones = document.querySelectorAll('.milestone');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.layers = document.querySelectorAll('.layer');
        
        // State management
        this.state = {
            isDragging: false,
            currentMilestone: 0,
            dividerPosition: 50, // percentage
            isAnimating: false,
            touchStartX: 0,
            initialDividerPosition: 50
        };
        
        // Performance optimization
        this.rafId = null;
        this.scrollTimeout = null;
        this.resizeTimeout = null;
        
        // Configuration
        this.config = {
            snapThreshold: 5, // percentage
            animationDuration: 300,
            scrollDebounceDelay: 100,
            resizeDebounceDelay: 250,
            keyboardStep: 5 // percentage step for keyboard navigation
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the timeline portfolio
     */
    init() {
        try {
            this.validateElements();
            this.setupEventListeners();
            this.setupInitialState();
            this.updateLayerVisibility();
            this.updateMilestoneState();
            console.log('Timeline Portfolio initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Timeline Portfolio:', error);
        }
    }
    
    /**
     * Validate required DOM elements exist
     */
    validateElements() {
        const requiredElements = [
            'timeline', 'dividerContainer', 'dividerLine', 'dividerHandle'
        ];
        
        for (const elementId of requiredElements) {
            if (!document.getElementById(elementId)) {
                throw new Error(`Required element #${elementId} not found`);
            }
        }
        
        if (this.milestones.length === 0) {
            throw new Error('No milestone elements found');
        }
    }
    
    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Divider drag events
        this.setupDividerEvents();
        
        // Scroll events
        this.timeline.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        
        // Navigation dot events
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.navigateToMilestone(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Window resize
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), this.config.resizeDebounceDelay));
        
        // Prevent context menu on divider handle
        this.dividerHandle.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    /**
     * Setup divider drag functionality
     */
    setupDividerEvents() {
        // Mouse events
        this.dividerHandle.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        
        // Touch events
        this.dividerHandle.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Prevent drag on images and other elements
        this.dividerHandle.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    /**
     * Setup initial state
     */
    setupInitialState() {
        this.updateDividerPosition(this.state.dividerPosition);
        this.timeline.scrollTop = 0;
        
        // Add CSS classes for initial state
        document.body.classList.add('timeline-ready');
        
        // Set initial milestone
        if (this.milestones.length > 0) {
            this.milestones[0].classList.add('active');
        }
        
        if (this.navDots.length > 0) {
            this.navDots[0].classList.add('active');
        }
    }
    
    /**
     * Handle drag start (mouse)
     */
    handleDragStart(e) {
        e.preventDefault();
        this.startDrag(e.clientX);
    }
    
    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.state.touchStartX = touch.clientX;
        this.startDrag(touch.clientX);
    }
    
    /**
     * Start drag operation
     */
    startDrag(clientX) {
        this.state.isDragging = true;
        this.state.initialDividerPosition = this.state.dividerPosition;
        
        // Add dragging class for visual feedback
        this.dividerContainer.classList.add('dragging');
        document.body.classList.add('dragging');
        
        // Disable text selection
        document.body.style.userSelect = 'none';
        
        // Cancel any ongoing animations
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
    
    /**
     * Handle drag move (mouse)
     */
    handleDragMove(e) {
        if (!this.state.isDragging) return;
        
        this.rafId = requestAnimationFrame(() => {
            this.updateDragPosition(e.clientX);
        });
    }
    
    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        if (!this.state.isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        this.rafId = requestAnimationFrame(() => {
            this.updateDragPosition(touch.clientX);
        });
    }
    
    /**
     * Update drag position
     */
    updateDragPosition(clientX) {
        const containerRect = this.dividerContainer.getBoundingClientRect();
        const relativeX = clientX - containerRect.left;
        const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
        
        this.updateDividerPosition(percentage);
    }
    
    /**
     * Handle drag end (mouse)
     */
    handleDragEnd() {
        this.endDrag();
    }
    
    /**
     * Handle touch end
     */
    handleTouchEnd() {
        this.endDrag();
    }
    
    /**
     * End drag operation
     */
    endDrag() {
        if (!this.state.isDragging) return;
        
        this.state.isDragging = false;
        
        // Remove dragging classes
        this.dividerContainer.classList.remove('dragging');
        document.body.classList.remove('dragging');
        
        // Re-enable text selection
        document.body.style.userSelect = '';
        
        // Apply snap behavior
        this.applySnapBehavior();
    }
    
    /**
     * Apply snap-to behavior for precise positioning
     */
    applySnapBehavior() {
        const { dividerPosition } = this.state;
        const { snapThreshold } = this.config;
        
        let targetPosition = dividerPosition;
        
        // Snap to center
        if (Math.abs(dividerPosition - 50) <= snapThreshold) {
            targetPosition = 50;
        }
        // Snap to edges
        else if (dividerPosition <= snapThreshold) {
            targetPosition = 0;
        }
        else if (dividerPosition >= (100 - snapThreshold)) {
            targetPosition = 100;
        }
        
        if (targetPosition !== dividerPosition) {
            this.animateDividerTo(targetPosition);
        }
    }
    
    /**
     * Animate divider to specific position
     */
    animateDividerTo(targetPosition) {
        if (this.state.isAnimating) return;
        
        this.state.isAnimating = true;
        const startPosition = this.state.dividerPosition;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.config.animationDuration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentPosition = startPosition + (distance * easeOut);
            
            this.updateDividerPosition(currentPosition);
            
            if (progress < 1) {
                this.rafId = requestAnimationFrame(animate);
            } else {
                this.state.isAnimating = false;
            }
        };
        
        this.rafId = requestAnimationFrame(animate);
    }
    
    /**
     * Update divider position and related UI
     */
    updateDividerPosition(percentage) {
        this.state.dividerPosition = percentage;
        
        // Update CSS custom property for smooth transitions
        document.documentElement.style.setProperty('--divider-position', `${percentage}%`);
        
        // Update divider line position
        this.dividerLine.style.left = `${percentage}%`;
        this.dividerHandle.style.left = `${percentage}%`;
        
        // Update layer visibility
        this.updateLayerVisibility();
        
        // Update labels
        this.updateLabels();
    }
    
    /**
     * Update layer visibility based on divider position
     */
    updateLayerVisibility() {
        const { dividerPosition } = this.state;
        
        this.layers.forEach(layer => {
            const layerType = layer.dataset.layer;
            let opacity = 1;
            
            if (layerType === 'dna') {
                // DNA layer visible on left side
                opacity = Math.max(0, Math.min(1, (100 - dividerPosition) / 50));
            } else if (layerType === 'star') {
                // Star layer visible on right side
                opacity = Math.max(0, Math.min(1, dividerPosition / 50));
            }
            
            layer.style.opacity = opacity;
            layer.style.visibility = opacity > 0.1 ? 'visible' : 'hidden';
        });
    }
    
    /**
     * Update label states
     */
    updateLabels() {
        const { dividerPosition } = this.state;
        
        if (this.dnaLabel) {
            this.dnaLabel.classList.toggle('active', dividerPosition < 50);
        }
        
        if (this.starLabel) {
            this.starLabel.classList.toggle('active', dividerPosition > 50);
        }
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            this.updateCurrentMilestone();
        }, this.config.scrollDebounceDelay);
    }
    
    /**
     * Update current milestone based on scroll position
     */
    updateCurrentMilestone() {
        const scrollTop = this.timeline.scrollTop;
        const containerHeight = this.timeline.clientHeight;
        const scrollCenter = scrollTop + containerHeight / 2;
        
        let newCurrentMilestone = 0;
        
        this.milestones.forEach((milestone, index) => {
            const milestoneTop = milestone.offsetTop;
            const milestoneHeight = milestone.offsetHeight;
            const milestoneCenter = milestoneTop + milestoneHeight / 2;
            
            if (scrollCenter >= milestoneCenter) {
                newCurrentMilestone = index;
            }
        });
        
        if (newCurrentMilestone !== this.state.currentMilestone) {
            this.state.currentMilestone = newCurrentMilestone;
            this.updateMilestoneState();
        }
    }
    
    /**
     * Update milestone and navigation states
     */
    updateMilestoneState() {
        // Update milestone classes
        this.milestones.forEach((milestone, index) => {
            milestone.classList.toggle('active', index === this.state.currentMilestone);
        });
        
        // Update navigation dots
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentMilestone);
        });
    }
    
    /**
     * Navigate to specific milestone
     */
    navigateToMilestone(index) {
        if (index < 0 || index >= this.milestones.length) return;
        
        const targetMilestone = this.milestones[index];
        const targetTop = targetMilestone.offsetTop;
        
        // Smooth scroll to milestone
        this.timeline.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
        
        // Update state immediately for responsiveness
        this.state.currentMilestone = index;
        this.updateMilestoneState();
    }
    
    /**
     * Handle keyboard navigation
     */
    handleKeydown(e) {
        // Prevent default behavior if we handle the key
        let handled = false;
        
        switch (e.key) {
            case 'ArrowUp':
                this.navigateToMilestone(this.state.currentMilestone - 1);
                handled = true;
                break;
                
            case 'ArrowDown':
            case ' ': // Spacebar
                this.navigateToMilestone(this.state.currentMilestone + 1);
                handled = true;
                break;
                
            case 'ArrowLeft':
                this.adjustDividerPosition(-this.config.keyboardStep);
                handled = true;
                break;
                
            case 'ArrowRight':
                this.adjustDividerPosition(this.config.keyboardStep);
                handled = true;
                break;
                
            case 'Home':
                this.navigateToMilestone(0);
                handled = true;
                break;
                
            case 'End':
                this.navigateToMilestone(this.milestones.length - 1);
                handled = true;
                break;
        }
        
        if (handled) {
            e.preventDefault();
        }
    }
    
    /**
     * Adjust divider position by delta
     */
    adjustDividerPosition(delta) {
        const newPosition = Math.max(0, Math.min(100, this.state.dividerPosition + delta));
        this.animateDividerTo(newPosition);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate positions after resize
        this.updateLayerVisibility();
        this.updateCurrentMilestone();
    }
    
    /**
     * Utility: Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Utility: Debounce function calls
     */
    debounce(func, delay) {
        let timeoutId;
        return function() {
            const args = arguments;
            const context = this;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    /**
     * Public API: Get current state
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Public API: Set divider position
     */
    setDividerPosition(percentage) {
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        this.animateDividerTo(clampedPercentage);
    }
    
    /**
     * Public API: Go to milestone
     */
    goToMilestone(index) {
        this.navigateToMilestone(index);
    }
    
    /**
     * Cleanup and destroy
     */
    destroy() {
        // Cancel any ongoing animations
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Clear timeouts
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Remove event listeners
        // Note: In a real implementation, you'd want to store references to bound functions
        // and remove them properly to prevent memory leaks
        
        console.log('Timeline Portfolio destroyed');
    }
}

/**
 * Initialize the timeline portfolio when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if required elements exist before initializing
    if (document.getElementById('timeline') && document.getElementById('dividerContainer')) {
        window.timelinePortfolio = new TimelinePortfolio();
    } else {
        console.warn('Timeline Portfolio: Required elements not found, skipping initialization');
    }
});

/**
 * Handle loading states
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial resize to ensure proper positioning
    if (window.timelinePortfolio) {
        window.timelinePortfolio.handleResize();
    }
});

/**
 * Export for module use (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimelinePortfolio;
}
