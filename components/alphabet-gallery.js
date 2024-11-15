class AlphabetGallery extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        this.imagesPerLetter = 3;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        // Display ALL view by default
        this.displayImages('ALL');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .controls {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 20px;
                    border-left: 1px solid white;
                    border-right: 1px solid white;
                    width:fit-content;
                    padding:0 0.25rem;
                }
                button {
                    padding: 0.25rem;
                    border: none;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    border-radius: 4px;
                }
                button:hover {
                    background: white;
                    color:black;
                }
                .gallery {
                    display:flex;
                    justify-content:center;
                    flex-wrap: wrap;
                    gap: 0.25rem;
                    padding: 0.25rem;
                }
                .image-container {
                    flex: 1;
                }
                .all-gallery {
                    flex-basis: 10%;
                    cursor:pointer;
                    flex-grow:0;
                }
                .all-gallery:hover {
                    scale:1.1;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: none;
                    cursor: pointer;
                }
                img.loaded {
                    display: block;
                }
                .letter {
                    padding: 1rem;
                    flex: 1;
                    display: grid;
                    place-content: center;
                    font-size: 6rem;
                }
            </style>
            <div class="controls">
                <button data-letter="ALL">ALL</button>
                ${this.letters.map(letter => 
                    `<button data-letter="${letter}">${letter}</button>`
                ).join('')}
            </div>
            <div class="gallery"></div>
        `;
    }

    setupEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const letter = button.dataset.letter;
                this.displayImages(letter);
            });
        });
    }

    getRandomImageNumber() {
        return Math.floor(Math.random() * this.imagesPerLetter) + 1;
    }

    createImageElement(src, alt, letter = null) {
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            container.textContent = 'Image not found';
        });

        // Add click handler if letter is provided (ALL view)
        if (letter) {
            img.addEventListener('click', () => {
                this.displayImages(letter);
                // Update button visual state if needed
                const button = this.shadowRoot.querySelector(`button[data-letter="${letter}"]`);
                if (button) {
                    button.click();
                }
            });
        }

        img.src = src;
        img.alt = alt;
        container.appendChild(img);
        return container;
    }

    displayImages(letterFilter) {
        const gallery = this.shadowRoot.querySelector('.gallery');
        gallery.innerHTML = '';

        if (letterFilter === 'ALL') {
            this.letters.forEach(letter => {
                const imageNumber = this.getRandomImageNumber();
                const container = this.createImageElement(
                    `./assets/images/small/${letter}${imageNumber}.webp`,
                    `${letter}${imageNumber}`,
                    letter  // Pass the letter for click handling
                );
                container.classList.add('all-gallery');
                gallery.appendChild(container);
            });
        } else {
            for (let i = 1; i <= this.imagesPerLetter; i++) {
                const container = this.createImageElement(
                    `./assets/images/big/${letterFilter}${i}.webp`,
                    `${letterFilter}${i}`
                );
                gallery.appendChild(container);
            }
            const letterDisplay = document.createElement('div');
            letterDisplay.classList.add('letter')
            letterDisplay.textContent = letterFilter;
            gallery.appendChild(letterDisplay);
        }
    }
}

customElements.define('alphabet-gallery', AlphabetGallery);