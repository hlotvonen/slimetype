class TypeTester extends HTMLElement {
    constructor() {
        super();
        
        this.innerHTML = `
            <div class="type-tester">
                <div class="content-container">
                    <div class="text-mode" contenteditable></div>
                    <div class="image-mode"></div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .type-tester .content-container {
                display: flex;
                width: 100%;
                height:100%;
                height: 50dvh;
            }

            .type-tester .text-mode {
                flex: 1;
                padding: 0.25rem;
                font-size: 1rem;
                background:black;
                color:white;
                text-transform: uppercase;
                overflow-y: auto;
                position:relative;
            }
            .type-tester .image-mode {
                flex:1;
                padding: 0.25rem;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                gap: 0.25rem;
                align-content:flex-start;
            }
            .type-tester .image-mode img {
                height:1.5rem;
                width: auto;
            }
            .type-tester .letter-space {
                width: 0.5em;
                display: inline-block;
            }
            .type-tester .text-mode:not(:focus)::before {
                content: "";
                width: 17px;
                height: 1rem;
                top:calc(0.25rem + 7px);
                left:calc(0.25rem - 8px);
                position: absolute;
                background:
                    linear-gradient(white 0 1px, transparent 0 calc(100% - 1px), white 0 100%),
                    linear-gradient(to left, transparent 0 8px, white 0 9px, transparent 0 100%)
                ;
            }
        `;
        this.appendChild(style);

        // Cache elements
        this.textArea = this.querySelector('.text-mode');
        this.imageArea = this.querySelector('.image-mode');
        
        // Initialize image preloading
        this.preloadedImages = new Map();
        this.preloadImages();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle text input
        this.textArea.addEventListener('input', (e) => {
            e.preventDefault();
            this.updateImageDisplay(e.target.textContent);
        });
    }

    preloadImages() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for(let i = 1; i > 4; i++) {
            letters.forEach(letter => {
                const img = new Image();
                img.src = `./assets/images/small/${letter}${i}.webp`;
                this.preloadedImages.set(letter, img);
            });
        }
    }

    updateImageDisplay(text) {
        // Clear existing images
        this.imageArea.innerHTML = '';
        
        // Convert text to uppercase and process each character
        text.toUpperCase().split('').forEach(char => {
            if (char === ' ') {
                const spaceDiv = document.createElement('div');
                spaceDiv.className = 'letter-space';
                this.imageArea.appendChild(spaceDiv);
            } else if (/[A-Z]/.test(char)) {
                const img = document.createElement('img');
                img.src = `./assets/images/small/${char}${Math.floor(Math.random() * 3) + 1}.webp`;
                img.alt = char;
                this.imageArea.appendChild(img);
            }
        });

        this.imageArea.scrollTop = this.imageArea.scrollHeight;
    }
}

customElements.define('type-tester', TypeTester);