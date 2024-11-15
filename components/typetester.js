class TypeTester extends HTMLElement {
    constructor() {
        super();
        
        this.innerHTML = `
            <div class="type-tester">
                <div class="content">
                    <textarea class="text-mode">Type here...</textarea>
                    <div class="image-mode" style="display: none;"></div>
                </div>

                <div class="controls">
                    <div>
                        <input type="range" class="font-size" min="8" max="140" value="16">
                        <span class="size-value">16</span>px
                    </div>

                    <div>
                        <button data-align="left" class="active">L</button>
                        <button data-align="center">C</button>
                    </div>

                    <div>
                        <button data-mode=0 class="">1</button>
                        <button data-mode=1 class="">2</button>
                        <button data-mode=2 class="">3</button>
                        <button data-mode=3 class="">4</button>
                    </div>
                </div>
                
            </div>
        `;

        // Cache elements
        this.textArea = this.querySelector('.text-mode');
        this.imageArea = this.querySelector('.image-mode');
        this.fontSizeSlider = this.querySelector('.font-size');
        this.sizeValue = this.querySelector('.size-value');

        // Set initial state
        this.currentMode = [false,false,false,false];
        this.preloadedImages = new Map(); // Store preloaded images

        // Bind event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mode switching
        this.querySelectorAll('[data-mode]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.currentMode[e.target.dataset.mode] = !this.currentMode[e.target.dataset.mode];
                this.switchMode(this.currentMode);
                
                // Preload images for activated modes
                if (this.currentMode[e.target.dataset.mode]) {
                    this.preloadImagesForMode(parseInt(e.target.dataset.mode) + 1);
                }
                
                // Toggle active state on mode buttons
                this.querySelectorAll('[data-mode]').forEach((btn, index) => {
                    if(this.currentMode[index] == true) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            });
        });

        // Font size control
        this.fontSizeSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            this.textArea.style.fontSize = `${size}px`;
            this.sizeValue.textContent = size;
        });

        // Text alignment buttons
        this.querySelectorAll('[data-align]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.textArea.style.textAlign = e.target.dataset.align;
                // Toggle active state
                this.querySelectorAll('[data-align]').forEach(btn => 
                    btn.classList.toggle('active', btn === e.target));
            });
        });

        // Key press and keydown handler for image mode
        document.addEventListener('keydown', (e) => {
            if (JSON.stringify(this.currentMode) !== JSON.stringify([false,false,false,false])) {
                // Handle backspace
                if (e.key === 'Backspace') {
                    e.preventDefault(); // Prevent browser back navigation
                    const lastImage = this.imageArea.lastElementChild;
                    if (lastImage) {
                        lastImage.remove();
                    }
                }
                // Handle spacebar
                else if (e.key === ' ') {
                    e.preventDefault(); // Prevent page scroll
                    const spaceDiv = document.createElement('div');
                    spaceDiv.className = 'letter-space';
                    spaceDiv.style.width = '1em';
                    spaceDiv.style.display = 'inline-block';
                    this.imageArea.appendChild(spaceDiv);
                    this.imageArea.scrollLeft = this.imageArea.scrollWidth;
                }
            }
        });

        // Keep keypress for letter handling
        document.addEventListener('keypress', (e) => {
            if (JSON.stringify(this.currentMode) !== JSON.stringify([false,false,false,false])) {
                this.handleImageModeKeyPress(e);
            }
        });
    }

    preloadImagesForMode(modeNumber) {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        letters.forEach(letter => {
            const imageKey = `${letter}${modeNumber}`;
            if (!this.preloadedImages.has(imageKey)) {
                const img = new Image();
                img.src = `./assets/images/small/${imageKey}.webp`;
                this.preloadedImages.set(imageKey, img);
            }
        });
    }

    switchMode(currentMode) {
        // Show/hide content areas
        if(JSON.stringify(this.currentMode) !== JSON.stringify([false,false,false,false])) {
            this.textArea.style.display = 'none';
            this.imageArea.style.display = 'grid';
        } else {
            this.textArea.style.display = 'block';
            this.imageArea.style.display = 'none';
        }
    }

    handleImageModeKeyPress(e) {
        const letter = e.key.toUpperCase();
        if (!/[A-Z]/.test(letter)) return;

        // Randomly select one of the enabled styles
        const modes = this.currentMode.reduce((acc, state, index) => {
            if (state) acc.push(index);
            return acc;
        }, []);
        const randomStyle = modes[Math.floor(Math.random() * modes.length)] + 1;
        
        // Create and add the image, using preloaded image if available
        const imageKey = `${letter}${randomStyle}`;
        const img = document.createElement('img');
        
        if (this.preloadedImages.has(imageKey)) {
            // Use the preloaded image's src
            img.src = this.preloadedImages.get(imageKey).src;
        } else {
            // Fallback if image wasn't preloaded
            img.src = `./assets/images/small/${imageKey}.webp`;
        }
        
        img.alt = letter;
        this.imageArea.appendChild(img);
        
        // Scroll to the latest image
        this.imageArea.scrollLeft = this.imageArea.scrollWidth;
    }
}

customElements.define('type-tester', TypeTester);