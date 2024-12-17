class TypeTester extends HTMLElement {
    constructor() {
        super();
        
        this.innerHTML = `
            <div class="type-tester">
                <div class="content-container">
                    <div class="text-mode empty" contenteditable></div>
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
                flex: 10;
                padding: 0.25rem;
                font-size: 1rem;
                background:black;
                color:white;
                text-transform: uppercase;
                overflow-y: auto;
                position:relative;
            }
            .type-tester .image-mode {
                flex:11;
                padding: 0.25rem;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                gap: 0.25rem;
                align-content:flex-start;
                background: linear-gradient(
                    to right,
                    black,
                    var(--color1)
                );
            }
            .type-tester .image-mode img {
                height:1.5rem;
                width: auto;
            }
            .type-tester .letter-space {
                width: 0.5em;
                display: inline-block;
            }
            .type-tester .empty::before {
                content: "Type here...";
                text-transform: lowercase;
                font-family: 'IBM Plex Mono';
                position:absolute;
                width:max-content;
                color:#333;
            }
            @media screen and (max-width: 800px) {
                .type-tester .content-container {
                    height:80dvh;
                    flex-direction:column;
                }
                .type-tester .text-mode {
                    }
                .type-tester .image-mode {
                    background: linear-gradient(to top, var(--color1), black);
                    }
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
            if(this.textArea.textContent == '') {
                this.textArea.classList.add('empty')
            } else {
                this.textArea.classList.remove('empty')
            }
            this.updateImageDisplay(e.target.textContent);
        });
    }

    preloadImages() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        for(let i = 1; i > 4; i++) {
            letters.forEach(letter => {
                const img = new Image();
                img.src = `/assets/images/small/${letter}${i}.webp`;
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
                img.src = `/assets/images/small/${char}${Math.floor(Math.random() * 3) + 1}.webp`;
                img.alt = char;
                this.imageArea.appendChild(img);
            }
        });

        this.imageArea.scrollTop = this.imageArea.scrollHeight;
    }
}

customElements.define('type-tester', TypeTester);